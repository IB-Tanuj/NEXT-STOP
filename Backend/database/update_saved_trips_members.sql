-- =======================================================================
-- Update saved_trips to support multiple members via Unique IDs
-- =======================================================================

-- 1. Add member_ids array column to saved_trips if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'saved_trips' AND column_name = 'member_ids') THEN
        ALTER TABLE public.saved_trips ADD COLUMN member_ids UUID[] DEFAULT '{}';
    END IF;
END
$$;

-- 2. Drop old restrictive policies
DROP POLICY IF EXISTS "Users can view their own trips" ON public.saved_trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.saved_trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON public.saved_trips;
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.trip_wallets;
DROP POLICY IF EXISTS "Users can update their own wallets" ON public.trip_wallets;

-- 3. Create new policies allowing access for owner OR members

-- saved_trips: Select
CREATE POLICY "Users can view trips they own or are a member of"
    ON public.saved_trips FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = ANY(member_ids));

-- saved_trips: Update (Members can update for collaborative editing)
CREATE POLICY "Users can update trips they own or are a member of"
    ON public.saved_trips FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = ANY(member_ids))
    WITH CHECK (auth.uid() = user_id OR auth.uid() = ANY(member_ids));

-- saved_trips: Delete (Only owner can delete)
CREATE POLICY "Only owner can delete trip"
    ON public.saved_trips FOR DELETE
    USING (auth.uid() = user_id);

-- trip_wallets: Select
CREATE POLICY "Users can view wallets for their trips"
    ON public.trip_wallets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND (saved_trips.user_id = auth.uid() OR auth.uid() = ANY(saved_trips.member_ids))
        )
    );

-- trip_wallets: Update (Members can add funds to the wallet)
CREATE POLICY "Users can update wallets for their trips"
    ON public.trip_wallets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND (saved_trips.user_id = auth.uid() OR auth.uid() = ANY(saved_trips.member_ids))
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND (saved_trips.user_id = auth.uid() OR auth.uid() = ANY(saved_trips.member_ids))
        )
    );
