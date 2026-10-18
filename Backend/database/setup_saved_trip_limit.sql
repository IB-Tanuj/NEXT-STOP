-- Enforce the maximum number of Saved Trips per owner at the database boundary.
-- Run after setup_saved_trips.sql. The trigger covers both the Today save RPC
-- and the legacy direct saved-trip endpoint, including concurrent inserts.
begin;

create or replace function public.enforce_saved_trip_owner_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if new.user_id is null then
        return new;
    end if;

    if tg_op = 'INSERT' then
        -- Serialize inserts for one owner so two simultaneous saves cannot
        -- both observe 19 rows and create a 21st trip.
        perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

        if (select count(*) from public.saved_trips where user_id = new.user_id) >= 20 then
            raise exception using
                errcode = 'P0001',
                message = 'SAVED_TRIP_LIMIT_EXCEEDED',
                detail = 'An owner may have at most 20 saved trips.';
        end if;
    elsif new.user_id is distinct from old.user_id then
        perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

        if (select count(*) from public.saved_trips where user_id = new.user_id) >= 20 then
            raise exception using
                errcode = 'P0001',
                message = 'SAVED_TRIP_LIMIT_EXCEEDED',
                detail = 'An owner may have at most 20 saved trips.';
        end if;
    end if;

    return new;
end;
$$;

drop trigger if exists saved_trips_owner_limit_trigger on public.saved_trips;
create trigger saved_trips_owner_limit_trigger
    before insert or update of user_id on public.saved_trips
    for each row execute function public.enforce_saved_trip_owner_limit();

revoke all on function public.enforce_saved_trip_owner_limit() from public;
grant execute on function public.enforce_saved_trip_owner_limit() to service_role;

commit;
