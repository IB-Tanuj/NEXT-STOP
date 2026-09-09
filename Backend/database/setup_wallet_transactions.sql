-- Create table for storing wallet transactions and tracking contributors
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES public.trip_wallets(id) ON DELETE CASCADE,
    contributor_name TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view transactions if they own the parent trip
CREATE POLICY "Users can view their own wallet transactions"
    ON public.wallet_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_wallets
            JOIN public.saved_trips ON saved_trips.id = trip_wallets.trip_id
            WHERE trip_wallets.id = wallet_transactions.wallet_id
            AND saved_trips.user_id = auth.uid()
        )
    );

-- Users can insert transactions if they own the parent trip
CREATE POLICY "Users can insert their own wallet transactions"
    ON public.wallet_transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trip_wallets
            JOIN public.saved_trips ON saved_trips.id = trip_wallets.trip_id
            WHERE trip_wallets.id = wallet_transactions.wallet_id
            AND saved_trips.user_id = auth.uid()
        )
    );
