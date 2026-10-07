-- Five rolling trip plans per authenticated user.
-- Run this migration in the Supabase SQL editor before deploying the backend.

create table if not exists public.trip_generation_slots (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    claimed_at timestamptz not null default now()
);

create index if not exists trip_generation_slots_user_claimed_at_idx
    on public.trip_generation_slots (user_id, claimed_at);

alter table public.trip_generation_slots enable row level security;

-- The service-role backend is the only caller. No browser role gets direct
-- access to the slot table or the function.
revoke all on table public.trip_generation_slots from anon, authenticated;

create or replace function public.claim_trip_generation_slot(
    p_user_id uuid
)
returns table (
    allowed boolean,
    remaining integer,
    reset_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    active_count integer;
    oldest_claim timestamptz;
begin
    if p_user_id is null then
        raise exception 'A user id is required';
    end if;

    -- Serialize claims for this user. This prevents two tabs from both
    -- observing four active slots and inserting a fifth slot simultaneously.
    perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

    delete from public.trip_generation_slots
    where user_id = p_user_id
      and claimed_at <= now() - interval '24 hours';

    select count(*)::integer, min(claimed_at)
      into active_count, oldest_claim
      from public.trip_generation_slots
     where user_id = p_user_id
       and claimed_at > now() - interval '24 hours';

    if active_count >= 5 then
        return query
        select false, 0, oldest_claim + interval '24 hours';
        return;
    end if;

    insert into public.trip_generation_slots (user_id, claimed_at)
    values (p_user_id, now());

    active_count := active_count + 1;
    select min(claimed_at)
      into oldest_claim
      from public.trip_generation_slots
     where user_id = p_user_id
       and claimed_at > now() - interval '24 hours';

    return query
    select true, 5 - active_count, oldest_claim + interval '24 hours';
end;
$$;

revoke all on function public.claim_trip_generation_slot(uuid) from public;
grant execute on function public.claim_trip_generation_slot(uuid) to service_role;
