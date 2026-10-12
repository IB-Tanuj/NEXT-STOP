-- Create table for storing saved trips
CREATE TABLE IF NOT EXISTS public.saved_trips (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    total_budget NUMERIC,
    trip_data JSONB NOT NULL,
    member_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keep this migration safe for databases created with an older version of
-- this script (member_ids was originally added by setup_today_trip_plans.sql).
ALTER TABLE public.saved_trips
    ADD COLUMN IF NOT EXISTS member_ids UUID[] NOT NULL DEFAULT '{}';

-- Enable RLS for saved_trips
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own trips" ON public.saved_trips;
CREATE POLICY "Users can view their own trips"
    ON public.saved_trips FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = ANY(member_ids));

DROP POLICY IF EXISTS "Users can insert their own trips" ON public.saved_trips;
CREATE POLICY "Users can insert their own trips"
    ON public.saved_trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own trips" ON public.saved_trips;
CREATE POLICY "Users can update their own trips"
    ON public.saved_trips FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own trips" ON public.saved_trips;
CREATE POLICY "Users can delete their own trips"
    ON public.saved_trips FOR DELETE
    USING (auth.uid() = user_id);

-- Create table for storing wallet savings for each trip
CREATE TABLE IF NOT EXISTS public.trip_wallets (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.saved_trips(id) ON DELETE CASCADE,
    wallet_type TEXT NOT NULL CHECK (wallet_type IN ('stay', 'transport', 'food', 'buffer')),
    target_amount NUMERIC DEFAULT 0,
    saved_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(trip_id, wallet_type)
);

ALTER TABLE public.trip_wallets
    DROP CONSTRAINT IF EXISTS trip_wallets_target_amount_check,
    DROP CONSTRAINT IF EXISTS trip_wallets_saved_amount_check;

ALTER TABLE public.trip_wallets
    ADD CONSTRAINT trip_wallets_target_amount_check
        CHECK (target_amount >= 0 AND target_amount NOT IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric)),
    ADD CONSTRAINT trip_wallets_saved_amount_check
        CHECK (saved_amount >= 0 AND saved_amount NOT IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric));

-- Enable RLS for trip_wallets
ALTER TABLE public.trip_wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wallets" ON public.trip_wallets;
CREATE POLICY "Users can view their own wallets"
    ON public.trip_wallets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND (saved_trips.user_id = auth.uid() OR auth.uid() = ANY(saved_trips.member_ids))
        )
    );

DROP POLICY IF EXISTS "Users can insert their own wallets" ON public.trip_wallets;
CREATE POLICY "Users can insert their own wallets"
    ON public.trip_wallets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND saved_trips.user_id = auth.uid()
        )
    );

-- Wallet balances must only be changed by the atomic RPCs in
-- setup_wallet_transactions.sql.  In particular, do not expose a direct
-- UPDATE policy that would allow a balance and its ledger to diverge.
DROP POLICY IF EXISTS "Users can update their own wallets" ON public.trip_wallets;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_saved_trips_user_id ON public.saved_trips(user_id);
