-- Run in Supabase SQL Editor after setup_saved_trips.sql.
-- Daily planning window: 05:30 AM Asia/Kolkata (00:00 UTC) to the next 05:30 AM.
-- Old Today records are retained; only the current window is listed by the app.
begin;

alter table public.saved_trips add column if not exists member_ids uuid[] not null default '{}';

create table if not exists public.trip_generation_slots (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    claimed_at timestamptz not null default now()
);

create table if not exists public.today_trip_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    destination text not null,
    title text not null check (char_length(title) between 1 and 80),
    total_budget numeric not null default 0,
    trip_data jsonb not null,
    ai_data jsonb not null default '{}'::jsonb,
    window_start timestamptz not null,
    credited_at timestamptz,
    saved_trip_id uuid unique references public.saved_trips(id) on delete set null,
    summary_status text not null default 'pending' check (summary_status in ('pending', 'generating', 'ready', 'failed')),
    itinerary_status text not null default 'pending' check (itinerary_status in ('pending', 'generating', 'ready', 'failed')),
    summary_token uuid,
    itinerary_token uuid,
    summary_started_at timestamptz,
    itinerary_started_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.trip_generation_slots
    add column if not exists today_plan_id uuid references public.today_trip_plans(id);
create unique index if not exists trip_generation_slots_today_plan_idx
    on public.trip_generation_slots(today_plan_id) where today_plan_id is not null;
create index if not exists trip_generation_slots_user_claimed_at_idx
    on public.trip_generation_slots(user_id, claimed_at);
create index if not exists today_trip_plans_user_window_idx
    on public.today_trip_plans(user_id, window_start, created_at);

alter table public.today_trip_plans enable row level security;
alter table public.trip_generation_slots enable row level security;
revoke all on public.today_trip_plans, public.trip_generation_slots from anon, authenticated;
grant all on public.today_trip_plans, public.trip_generation_slots to service_role;
grant usage, select on sequence public.trip_generation_slots_id_seq to service_role;

-- SQL owns the clock. Changing a browser's timezone or date cannot reset credits.
create or replace function public.trip_planning_window_start()
returns timestamptz language sql stable
set search_path = public, pg_temp
as $$
    select (date_trunc('day', (now() at time zone 'Asia/Kolkata') - interval '5 hours 30 minutes')
        + interval '5 hours 30 minutes') at time zone 'Asia/Kolkata';
$$;

create or replace function public.get_today_trip_state(p_user_id uuid)
returns jsonb language sql security definer
set search_path = public, pg_temp
as $$
    select jsonb_build_object(
        'limit', 5,
        'remaining', greatest(0, 5 - (select count(*) from public.trip_generation_slots
            where user_id = p_user_id and claimed_at >= public.trip_planning_window_start())),
        'resetAt', public.trip_planning_window_start() + interval '1 day',
        'serverNow', now(),
        'plans', coalesce((select jsonb_agg(to_jsonb(p) - array['summary_token', 'itinerary_token'] order by p.created_at)
            from public.today_trip_plans p
            where p.user_id = p_user_id and p.window_start = public.trip_planning_window_start()), '[]'::jsonb)
    );
$$;

-- The client supplies a stable UUID for a single planning action. Replayed creates
-- cannot overwrite the original inputs or insert a second plan.
create or replace function public.create_today_trip_plan(
    p_user_id uuid, p_plan_id uuid, p_destination text, p_total_budget numeric, p_trip_data jsonb
)
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
    plan public.today_trip_plans;
    active_count integer;
begin
    if p_user_id is null or p_plan_id is null or nullif(trim(p_destination), '') is null then
        raise exception 'User, plan ID and destination are required';
    end if;
    -- Creating a Today card is the planning action that consumes a credit.
    -- The stable client id makes this safe to replay after a lost response.
    perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
    select * into plan from public.today_trip_plans where id = p_plan_id and user_id = p_user_id;
    if found then
        return to_jsonb(plan) - array['summary_token', 'itinerary_token'];
    end if;
    select count(*)::integer into active_count from public.trip_generation_slots
        where user_id = p_user_id and claimed_at >= public.trip_planning_window_start();
    if active_count >= 5 then
        raise exception 'TODAY_QUOTA_EXCEEDED';
    end if;

    insert into public.today_trip_plans (id, user_id, destination, title, total_budget, trip_data, window_start, credited_at)
    values (p_plan_id, p_user_id, trim(p_destination), left(trim(p_destination), 80), p_total_budget,
        p_trip_data - array['aiData', 'todayPlanId'], public.trip_planning_window_start(), now());
    insert into public.trip_generation_slots(user_id, today_plan_id) values (p_user_id, p_plan_id);
    select * into plan from public.today_trip_plans where id = p_plan_id and user_id = p_user_id;
    if not found then raise exception 'Plan not found'; end if;
    return to_jsonb(plan) - array['summary_token', 'itinerary_token'];
end;
$$;

-- One original credit includes BOTH AI sections. Missing/failed sections can be
-- recovered for free, even with 0 credits or after the daily reset. Inputs come
-- exclusively from the stored plan, never a client's claim that a request failed.
create or replace function public.begin_today_trip_generation(p_user_id uuid, p_plan_id uuid, p_kind text)
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
    plan public.today_trip_plans;
    active_count integer;
    generation_token uuid := gen_random_uuid();
    section_status text;
    section_started timestamptz;
    action text;
    charged boolean := false;
begin
    if p_kind not in ('summary', 'itinerary') then raise exception 'Invalid AI section'; end if;
    -- All claims for a user serialize, including requests on different instances.
    perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
    select * into plan from public.today_trip_plans where id = p_plan_id and user_id = p_user_id for update;
    if not found then raise exception 'Plan not found'; end if;

    select count(*)::integer into active_count from public.trip_generation_slots
        where user_id = p_user_id and claimed_at >= public.trip_planning_window_start();
    section_status := case when p_kind = 'summary' then plan.summary_status else plan.itinerary_status end;
    section_started := case when p_kind = 'summary' then plan.summary_started_at else plan.itinerary_started_at end;

    if section_status = 'ready' then
        action := 'cached';
    elsif section_status = 'generating' and section_started > now() - interval '3 minutes' then
        action := 'in_progress';
    else
        if plan.credited_at is null then
            if active_count >= 5 then
                return jsonb_build_object('action', 'quota_exceeded', 'remaining', 0,
                    'resetAt', public.trip_planning_window_start() + interval '1 day');
            end if;
            insert into public.trip_generation_slots(user_id, today_plan_id) values (p_user_id, p_plan_id);
            -- Older Saved Trips may be linked without a Today credit. A first
            -- generation from that legacy record claims one slot here.
            plan.credited_at := now();
            active_count := active_count + 1;
            charged := true;
            -- A draft saved yesterday but first generated today belongs to today.
            plan.window_start := public.trip_planning_window_start();
        end if;
        if p_kind = 'summary' then
            update public.today_trip_plans set summary_status = 'generating', summary_token = generation_token,
                summary_started_at = now(), credited_at = plan.credited_at, window_start = plan.window_start,
                updated_at = now() where id = p_plan_id returning * into plan;
        else
            update public.today_trip_plans set itinerary_status = 'generating', itinerary_token = generation_token,
                itinerary_started_at = now(), credited_at = plan.credited_at, window_start = plan.window_start,
                updated_at = now() where id = p_plan_id returning * into plan;
        end if;
        action := 'generate';
    end if;
    return jsonb_build_object('action', action, 'charged', charged, 'token', case when action = 'generate' then generation_token else null end,
        'remaining', greatest(0, 5 - active_count), 'resetAt', public.trip_planning_window_start() + interval '1 day',
        'plan', to_jsonb(plan) - array['summary_token', 'itinerary_token']);
end;
$$;

-- Token comparison prevents an expired worker from overwriting a later retry.
create or replace function public.finish_today_trip_generation(
    p_user_id uuid, p_plan_id uuid, p_kind text, p_token uuid, p_output jsonb
)
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
    plan public.today_trip_plans;
    current_token uuid;
    saved_trip jsonb;
begin
    if p_kind not in ('summary', 'itinerary') then raise exception 'Invalid AI section'; end if;
    select * into plan from public.today_trip_plans where id = p_plan_id and user_id = p_user_id for update;
    if not found then raise exception 'Plan not found'; end if;
    current_token := case when p_kind = 'summary' then plan.summary_token else plan.itinerary_token end;
    if current_token is distinct from p_token or p_token is null then
        raise exception 'Generation lease expired';
    end if;
    if p_output is not null then
        plan.ai_data := plan.ai_data || p_output;
    end if;
    if p_kind = 'summary' then
        update public.today_trip_plans set ai_data = plan.ai_data,
            summary_status = case when p_output is null then 'failed' else 'ready' end,
            summary_token = null, updated_at = now() where id = p_plan_id returning * into plan;
    else
        update public.today_trip_plans set ai_data = plan.ai_data,
            itinerary_status = case when p_output is null then 'failed' else 'ready' end,
            itinerary_token = null, updated_at = now() where id = p_plan_id returning * into plan;
    end if;
    if plan.saved_trip_id is not null then
        update public.saved_trips set trip_data = jsonb_set(trip_data, '{aiData}', plan.ai_data)
            where id = plan.saved_trip_id and user_id = p_user_id;
        select to_jsonb(s) into saved_trip from public.saved_trips s where s.id = plan.saved_trip_id;
    end if;
    return jsonb_build_object('plan', to_jsonb(plan) - array['summary_token', 'itinerary_token'], 'savedTrip', saved_trip);
end;
$$;

-- Atomic save + wallets + link. Double clicks never create duplicate saved trips.
create or replace function public.save_today_trip_plan(p_user_id uuid, p_plan_id uuid, p_member_ids uuid[] default '{}')
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
    plan public.today_trip_plans;
    saved public.saved_trips;
    payload jsonb;
    spots_total numeric;
    group_size integer;
begin
    select * into plan from public.today_trip_plans where id = p_plan_id and user_id = p_user_id for update;
    if not found then raise exception 'Plan not found'; end if;
    if plan.saved_trip_id is not null then
        select * into saved from public.saved_trips where id = plan.saved_trip_id and user_id = p_user_id;
    else
        payload := plan.trip_data || jsonb_build_object('aiData', plan.ai_data, 'todayPlanId', plan.id, 'title', plan.title);
        insert into public.saved_trips(user_id, destination, total_budget, trip_data, member_ids)
            values (p_user_id, plan.destination, plan.total_budget, payload, p_member_ids) returning * into saved;
        group_size := greatest(1, coalesce((payload #>> '{preferences,groupSize}')::integer, 1));
        select coalesce(sum(coalesce((s->>'cost')::numeric, (s->>'total')::numeric, 0)), 0)
            into spots_total from jsonb_array_elements(coalesce(payload->'spots', '[]'::jsonb)) s;
        insert into public.trip_wallets(trip_id, wallet_type, target_amount) values
            (saved.id, 'stay', coalesce((payload #>> '{hotel,price}')::numeric, 0)),
            (saved.id, 'transport', coalesce((payload #>> '{transport,price}')::numeric, 0)),
            (saved.id, 'food', spots_total * group_size),
            (saved.id, 'buffer', greatest(0, coalesce((payload->>'buffer')::numeric, 0)));
        update public.today_trip_plans set saved_trip_id = saved.id, updated_at = now()
            where id = p_plan_id returning * into plan;
    end if;
    return jsonb_build_object('plan', to_jsonb(plan) - array['summary_token', 'itinerary_token'], 'trip', to_jsonb(saved));
end;
$$;

-- Existing Saved Trips remain eligible for completing their original AI data.
    -- New Saved Trips are linked at save-time, so they keep their real credited state.
create or replace function public.link_saved_today_trip_plan(p_user_id uuid, p_saved_trip_id uuid)
returns jsonb language plpgsql security definer
set search_path = public, pg_temp
as $$
declare
    saved public.saved_trips;
    plan public.today_trip_plans;
    output jsonb;
begin
    select * into saved from public.saved_trips where id = p_saved_trip_id
        and (user_id = p_user_id or p_user_id = any(member_ids)) for update;
    if not found then raise exception 'Saved trip not found'; end if;
    select * into plan from public.today_trip_plans where saved_trip_id = saved.id;
    if not found then
        output := case when jsonb_typeof(saved.trip_data->'aiData') = 'object'
            then saved.trip_data->'aiData' else '{}'::jsonb end;
        insert into public.today_trip_plans(user_id, destination, title, total_budget, trip_data, ai_data,
            window_start, credited_at, saved_trip_id, summary_status, itinerary_status)
        values (saved.user_id, saved.destination, left(coalesce(nullif(saved.trip_data->>'title', ''), saved.destination), 80),
            coalesce(saved.total_budget, 0), saved.trip_data - array['aiData', 'todayPlanId'], output,
            public.trip_planning_window_start() - interval '1 day', null, saved.id,
            case when jsonb_typeof(output->'activities') = 'array'
                and jsonb_array_length(output->'activities') > 0
                and jsonb_typeof(output->'festivals') = 'array'
                and jsonb_array_length(output->'festivals') > 0
                and jsonb_typeof(output->'foodRecommendations') = 'array'
                and jsonb_array_length(output->'foodRecommendations') > 0
                and jsonb_typeof(output->'localEmergency') = 'array'
                and jsonb_array_length(output->'localEmergency') > 0 then 'ready' else 'pending' end,
            case when jsonb_typeof(output->'itinerary') = 'array'
                and jsonb_array_length(output->'itinerary') > 0 then 'ready' else 'pending' end)
        returning * into plan;
        update public.saved_trips set trip_data = trip_data || jsonb_build_object('todayPlanId', plan.id) where id = saved.id;
    end if;
    return to_jsonb(plan) - array['summary_token', 'itinerary_token'];
end;
$$;

revoke all on function public.trip_planning_window_start() from public;
revoke all on function public.get_today_trip_state(uuid) from public;
revoke all on function public.create_today_trip_plan(uuid, uuid, text, numeric, jsonb) from public;
revoke all on function public.begin_today_trip_generation(uuid, uuid, text) from public;
revoke all on function public.finish_today_trip_generation(uuid, uuid, text, uuid, jsonb) from public;
revoke all on function public.save_today_trip_plan(uuid, uuid, uuid[]) from public;
revoke all on function public.link_saved_today_trip_plan(uuid, uuid) from public;
grant execute on function public.trip_planning_window_start() to service_role;
grant execute on function public.get_today_trip_state(uuid) to service_role;
grant execute on function public.create_today_trip_plan(uuid, uuid, text, numeric, jsonb) to service_role;
grant execute on function public.begin_today_trip_generation(uuid, uuid, text) to service_role;
grant execute on function public.finish_today_trip_generation(uuid, uuid, text, uuid, jsonb) to service_role;
grant execute on function public.save_today_trip_plan(uuid, uuid, uuid[]) to service_role;
grant execute on function public.link_saved_today_trip_plan(uuid, uuid) to service_role;

commit;
