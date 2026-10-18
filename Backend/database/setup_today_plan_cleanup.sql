-- Automatically remove old, unsaved Today plans while preserving Saved Trips.
-- Run after setup_today_trip_plans.sql and setup_saved_trips.sql.
-- Unsaved plans receive a seven-day grace period before cleanup.
begin;

create index if not exists today_trip_plans_unsaved_cleanup_idx
    on public.today_trip_plans(window_start, updated_at, id)
    where saved_trip_id is null;

create index if not exists saved_trips_today_plan_id_idx
    on public.saved_trips((trip_data->>'todayPlanId'))
    where trip_data ? 'todayPlanId';

create or replace function public.cleanup_unsaved_today_trip_plans()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    candidate record;
    deleted_plan_id uuid;
    deleted_count integer := 0;
begin
    for candidate in
        select p.id
        from public.today_trip_plans p
        where p.saved_trip_id is null
          and p.window_start < public.trip_planning_window_start() - interval '1 day'
          and p.updated_at < now() - interval '7 days'
          and p.summary_status <> 'generating'
          and p.itinerary_status <> 'generating'
          and not exists (
              select 1
              from public.saved_trips s
              where s.trip_data->>'todayPlanId' = p.id::text
          )
        order by p.updated_at asc, p.id asc
        limit 500
        for update of p skip locked
    loop
        -- This foreign key intentionally is not cascading because the slots
        -- table also contains legacy quota rows unrelated to Today plans.
        delete from public.trip_generation_slots
        where today_plan_id = candidate.id;

        -- Re-check the ownership/link conditions before removing the plan.
        delete from public.today_trip_plans p
        where p.id = candidate.id
          and p.saved_trip_id is null
          and p.window_start < public.trip_planning_window_start() - interval '1 day'
          and p.updated_at < now() - interval '7 days'
          and p.summary_status <> 'generating'
          and p.itinerary_status <> 'generating'
          and not exists (
              select 1
              from public.saved_trips s
              where s.trip_data->>'todayPlanId' = p.id::text
          )
        returning p.id into deleted_plan_id;

        if found then
            deleted_count := deleted_count + 1;
        end if;
    end loop;

    return deleted_count;
end;
$$;

revoke all on function public.cleanup_unsaved_today_trip_plans() from public;
grant execute on function public.cleanup_unsaved_today_trip_plans() to service_role;

commit;

-- Supabase provides pg_cron for database-local scheduled work. The job is
-- installed only once so this file can be safely rerun after deployments.
create extension if not exists pg_cron;

do $$
begin
    if not exists (
        select 1 from cron.job
        where jobname = 'cleanup-unsaved-today-trip-plans'
    ) then
        perform cron.schedule(
            'cleanup-unsaved-today-trip-plans',
            '30 1 * * *',
            'select public.cleanup_unsaved_today_trip_plans();'
        );
    end if;
end;
$$;
