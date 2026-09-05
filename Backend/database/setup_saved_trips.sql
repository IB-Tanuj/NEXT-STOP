-- Create table for storing saved trips
CREATE TABLE IF NOT EXISTS public.saved_trips (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    total_budget NUMERIC,
    trip_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for saved_trips
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only view their own trips
CREATE POLICY "Users can view their own trips"
    ON public.saved_trips FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy so users can insert their own trips
CREATE POLICY "Users can insert their own trips"
    ON public.saved_trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy so users can update their own trips
CREATE POLICY "Users can update their own trips"
    ON public.saved_trips FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy so users can delete their own trips
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

-- Enable RLS for trip_wallets
ALTER TABLE public.trip_wallets ENABLE ROW LEVEL SECURITY;

-- Users can view their own wallets
CREATE POLICY "Users can view their own wallets"
    ON public.trip_wallets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND saved_trips.user_id = auth.uid()
        )
    );

-- Users can insert their own wallets
CREATE POLICY "Users can insert their own wallets"
    ON public.trip_wallets FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND saved_trips.user_id = auth.uid()
        )
    );

-- Users can update their own wallets
CREATE POLICY "Users can update their own wallets"
    ON public.trip_wallets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND saved_trips.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.saved_trips 
            WHERE saved_trips.id = trip_wallets.trip_id 
            AND saved_trips.user_id = auth.uid()
        )
    );
