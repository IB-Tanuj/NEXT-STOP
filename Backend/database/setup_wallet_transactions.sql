-- Wallet transactions are a signed ledger:
--   positive amount = money added
--   negative amount = money removed
-- A wallet balance and its ledger are changed together by the RPCs below.

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID NOT NULL REFERENCES public.trip_wallets(id) ON DELETE CASCADE,
    contributor_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    funded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL DEFAULT 'funding'
        CHECK (transaction_type IN ('funding', 'withdrawal', 'owner_rejection')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT wallet_transactions_amount_check CHECK (
        amount <> 0
        AND amount NOT IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric)
    )
);

-- Existing installations need the new attribution columns and the old
-- amount > 0 constraint replaced before signed removal entries can work.
ALTER TABLE public.wallet_transactions
    ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS funded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS transaction_type TEXT NOT NULL DEFAULT 'funding';

ALTER TABLE public.wallet_transactions
    DROP CONSTRAINT IF EXISTS wallet_transactions_amount_check;

ALTER TABLE public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_amount_check CHECK (
        amount <> 0
        AND amount NOT IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric)
    );

ALTER TABLE public.wallet_transactions
    DROP CONSTRAINT IF EXISTS wallet_transactions_transaction_type_check;

ALTER TABLE public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_transaction_type_check
        CHECK (transaction_type IN ('funding', 'withdrawal', 'owner_rejection'));

-- Preserve attribution for transactions created after added_by was introduced.
UPDATE public.wallet_transactions
SET funded_by = added_by
WHERE funded_by IS NULL AND added_by IS NOT NULL;

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view their own wallet transactions"
    ON public.wallet_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM public.trip_wallets
            JOIN public.saved_trips ON saved_trips.id = trip_wallets.trip_id
            WHERE trip_wallets.id = wallet_transactions.wallet_id
              AND (
                  saved_trips.user_id = auth.uid()
                  OR auth.uid() = ANY(saved_trips.member_ids)
              )
        )
    );

-- Mutations are deliberately not exposed through table policies. The
-- security-definer functions below perform authorization, row locking, the
-- balance update, and ledger insert as one database transaction.
DROP POLICY IF EXISTS "Users can insert their own wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can update their own wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can delete their own wallet transactions" ON public.wallet_transactions;

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id
    ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_contributor
    ON public.wallet_transactions(contributor_name);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_contributor_id
    ON public.wallet_transactions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_funded_by
    ON public.wallet_transactions(funded_by);

-- Add funds to a wallet. p_amount is intentionally positive; the function
-- records the signed ledger amount after applying the wallet cap.
CREATE OR REPLACE FUNCTION public.apply_wallet_transaction(
    p_trip_id UUID,
    p_wallet_type TEXT,
    p_amount NUMERIC,
    p_actor_id UUID,
    p_contributor_name TEXT,
    p_contributor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    trip_record RECORD;
    wallet_record public.trip_wallets%ROWTYPE;
    transaction_record public.wallet_transactions%ROWTYPE;
    effective_amount NUMERIC;
    actor_is_owner BOOLEAN;
BEGIN
    IF p_actor_id IS NULL THEN
        RAISE EXCEPTION 'A signed-in user is required' USING ERRCODE = '42501';
    END IF;

    IF p_amount IS NULL
       OR p_amount <= 0
       OR p_amount IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric) THEN
        RAISE EXCEPTION 'Amount must be a finite number greater than zero' USING ERRCODE = '22023';
    END IF;

    IF p_wallet_type IS NULL
       OR p_wallet_type NOT IN ('stay', 'transport', 'food', 'buffer') THEN
        RAISE EXCEPTION 'Invalid wallet type' USING ERRCODE = '22023';
    END IF;

    IF NULLIF(BTRIM(p_contributor_name), '') IS NULL THEN
        RAISE EXCEPTION 'A contributor is required' USING ERRCODE = '22023';
    END IF;

    SELECT st.user_id, COALESCE(st.member_ids, '{}'::UUID[]) AS member_ids
    INTO trip_record
    FROM public.saved_trips AS st
    WHERE st.id = p_trip_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Trip not found' USING ERRCODE = 'P0002';
    END IF;

    actor_is_owner := trip_record.user_id = p_actor_id;
    IF NOT actor_is_owner AND NOT (p_actor_id = ANY(trip_record.member_ids)) THEN
        RAISE EXCEPTION 'You do not have access to this trip' USING ERRCODE = '42501';
    END IF;

    -- Members can only create entries for themselves. The owner may fund a
    -- member or an offline contributor (represented by a NULL contributor_id).
    IF actor_is_owner THEN
        IF p_contributor_id IS NOT NULL
           AND p_contributor_id <> trip_record.user_id
           AND NOT (p_contributor_id = ANY(trip_record.member_ids)) THEN
            RAISE EXCEPTION 'Contributor is not a member of this trip' USING ERRCODE = '42501';
        END IF;
    ELSIF p_contributor_id IS DISTINCT FROM p_actor_id THEN
        RAISE EXCEPTION 'Members can only fund themselves' USING ERRCODE = '42501';
    END IF;

    SELECT *
    INTO wallet_record
    FROM public.trip_wallets
    WHERE trip_id = p_trip_id AND wallet_type = p_wallet_type
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found' USING ERRCODE = 'P0002';
    END IF;

    effective_amount := LEAST(
        p_amount,
        GREATEST(0, COALESCE(wallet_record.target_amount, 0)
            - COALESCE(wallet_record.saved_amount, 0))
    );

    IF effective_amount <= 0 THEN
        RAISE EXCEPTION 'Wallet is already fully funded' USING ERRCODE = '22023';
    END IF;

    UPDATE public.trip_wallets
    SET saved_amount = COALESCE(saved_amount, 0) + effective_amount
    WHERE id = wallet_record.id
    RETURNING * INTO wallet_record;

    INSERT INTO public.wallet_transactions (
        wallet_id,
        contributor_name,
        amount,
        added_by,
        contributor_id,
        funded_by,
        transaction_type
    )
    VALUES (
        wallet_record.id,
        BTRIM(p_contributor_name),
        effective_amount,
        p_actor_id,
        p_contributor_id,
        p_actor_id,
        'funding'
    )
    RETURNING * INTO transaction_record;

    RETURN jsonb_build_object(
        'wallet', TO_JSONB(wallet_record),
        'transaction', TO_JSONB(transaction_record)
    );
END;
$$;

-- Remove a user's own contribution, or let the owner make an administrative
-- withdrawal. The member path is capped by that member's own ledger total.
CREATE OR REPLACE FUNCTION public.remove_wallet_transaction(
    p_trip_id UUID,
    p_wallet_type TEXT,
    p_amount NUMERIC,
    p_actor_id UUID,
    p_contributor_name TEXT,
    p_contributor_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    trip_record RECORD;
    wallet_record public.trip_wallets%ROWTYPE;
    transaction_record public.wallet_transactions%ROWTYPE;
    effective_amount NUMERIC;
    available_amount NUMERIC;
    actor_is_owner BOOLEAN;
BEGIN
    IF p_actor_id IS NULL THEN
        RAISE EXCEPTION 'A signed-in user is required' USING ERRCODE = '42501';
    END IF;

    IF p_amount IS NULL
       OR p_amount <= 0
       OR p_amount IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric) THEN
        RAISE EXCEPTION 'Amount must be a finite number greater than zero' USING ERRCODE = '22023';
    END IF;

    IF p_wallet_type IS NULL
       OR p_wallet_type NOT IN ('stay', 'transport', 'food', 'buffer') THEN
        RAISE EXCEPTION 'Invalid wallet type' USING ERRCODE = '22023';
    END IF;

    IF NULLIF(BTRIM(p_contributor_name), '') IS NULL THEN
        RAISE EXCEPTION 'A contributor is required' USING ERRCODE = '22023';
    END IF;

    SELECT st.user_id, COALESCE(st.member_ids, '{}'::UUID[]) AS member_ids
    INTO trip_record
    FROM public.saved_trips AS st
    WHERE st.id = p_trip_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Trip not found' USING ERRCODE = 'P0002';
    END IF;

    actor_is_owner := trip_record.user_id = p_actor_id;
    IF NOT actor_is_owner AND NOT (p_actor_id = ANY(trip_record.member_ids)) THEN
        RAISE EXCEPTION 'You do not have access to this trip' USING ERRCODE = '42501';
    END IF;

    IF actor_is_owner THEN
        IF p_contributor_id IS NOT NULL
           AND p_contributor_id <> trip_record.user_id
           AND NOT (p_contributor_id = ANY(trip_record.member_ids)) THEN
            RAISE EXCEPTION 'Contributor is not a member of this trip' USING ERRCODE = '42501';
        END IF;
    ELSIF p_contributor_id IS DISTINCT FROM p_actor_id THEN
        RAISE EXCEPTION 'Members can only remove their own funds' USING ERRCODE = '42501';
    END IF;

    SELECT *
    INTO wallet_record
    FROM public.trip_wallets
    WHERE trip_id = p_trip_id AND wallet_type = p_wallet_type
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found' USING ERRCODE = 'P0002';
    END IF;

    IF actor_is_owner THEN
        available_amount := COALESCE(wallet_record.saved_amount, 0);
    ELSE
        SELECT GREATEST(0, COALESCE(SUM(t.amount), 0))
        INTO available_amount
        FROM public.wallet_transactions AS t
        WHERE t.wallet_id = wallet_record.id
          AND (
              t.contributor_id = p_actor_id
              OR (t.contributor_id IS NULL AND t.contributor_name = BTRIM(p_contributor_name))
          )
          AND (
              t.funded_by = p_actor_id
              OR (t.funded_by IS NULL AND t.added_by = p_actor_id)
          );
    END IF;

    effective_amount := LEAST(
        p_amount,
        available_amount,
        GREATEST(0, COALESCE(wallet_record.saved_amount, 0))
    );

    IF effective_amount <= 0 THEN
        RAISE EXCEPTION 'There are no removable funds for this contributor' USING ERRCODE = '22023';
    END IF;

    UPDATE public.trip_wallets
    SET saved_amount = COALESCE(saved_amount, 0) - effective_amount
    WHERE id = wallet_record.id
    RETURNING * INTO wallet_record;

    INSERT INTO public.wallet_transactions (
        wallet_id,
        contributor_name,
        amount,
        added_by,
        contributor_id,
        funded_by,
        transaction_type
    )
    VALUES (
        wallet_record.id,
        BTRIM(p_contributor_name),
        -effective_amount,
        p_actor_id,
        p_contributor_id,
        p_actor_id,
        'withdrawal'
    )
    RETURNING * INTO transaction_record;

    RETURN jsonb_build_object(
        'wallet', TO_JSONB(wallet_record),
        'transaction', TO_JSONB(transaction_record)
    );
END;
$$;

-- A member may reject only owner-attributed entries assigned to that member.
-- The negative entry keeps the ledger append-only and carries funded_by=owner,
-- so the rejection offsets owner funds instead of becoming member funds.
CREATE OR REPLACE FUNCTION public.remove_owner_attributed_funds(
    p_trip_id UUID,
    p_actor_id UUID,
    p_contributor_name TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    trip_record RECORD;
    wallet_record public.trip_wallets%ROWTYPE;
    owner_funds NUMERIC;
    effective_amount NUMERIC;
    changed_wallets INTEGER := 0;
BEGIN
    IF p_actor_id IS NULL THEN
        RAISE EXCEPTION 'A signed-in user is required' USING ERRCODE = '42501';
    END IF;

    IF NULLIF(BTRIM(p_contributor_name), '') IS NULL THEN
        RAISE EXCEPTION 'A contributor is required' USING ERRCODE = '22023';
    END IF;

    SELECT st.user_id, COALESCE(st.member_ids, '{}'::UUID[]) AS member_ids
    INTO trip_record
    FROM public.saved_trips AS st
    WHERE st.id = p_trip_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Trip not found' USING ERRCODE = 'P0002';
    END IF;

    IF trip_record.user_id = p_actor_id THEN
        RAISE EXCEPTION 'The trip owner cannot reject owner funds' USING ERRCODE = '42501';
    END IF;

    IF NOT (p_actor_id = ANY(trip_record.member_ids)) THEN
        RAISE EXCEPTION 'Only trip members can reject owner funds' USING ERRCODE = '42501';
    END IF;

    -- This endpoint is intentionally tied to the authenticated member's own
    -- profile name for legacy rows that predate contributor_id.
    IF NOT EXISTS (
        SELECT 1
        FROM public.profiles AS p
        WHERE p.id = p_actor_id
          AND (
              LOWER(COALESCE(p.full_name, '')) = LOWER(BTRIM(p_contributor_name))
              OR LOWER(COALESCE(p.username, '')) = LOWER(BTRIM(p_contributor_name))
          )
    ) THEN
        RAISE EXCEPTION 'A member can only reject funds assigned to their own profile' USING ERRCODE = '42501';
    END IF;

    FOR wallet_record IN
        SELECT *
        FROM public.trip_wallets
        WHERE trip_id = p_trip_id
        ORDER BY id
        FOR UPDATE
    LOOP
        SELECT GREATEST(0, COALESCE(SUM(t.amount), 0))
        INTO owner_funds
        FROM public.wallet_transactions AS t
        WHERE t.wallet_id = wallet_record.id
          AND (
              t.contributor_id = p_actor_id
              OR (t.contributor_id IS NULL AND LOWER(t.contributor_name) = LOWER(BTRIM(p_contributor_name)))
          )
          AND (
              t.funded_by = trip_record.user_id
              OR (
                  t.funded_by IS NULL
                  AND (t.added_by IS NULL OR t.added_by = trip_record.user_id)
              )
          );

        effective_amount := LEAST(
            owner_funds,
            GREATEST(0, COALESCE(wallet_record.saved_amount, 0))
        );

        IF effective_amount > 0 THEN
            UPDATE public.trip_wallets
            SET saved_amount = COALESCE(saved_amount, 0) - effective_amount
            WHERE id = wallet_record.id;

            INSERT INTO public.wallet_transactions (
                wallet_id,
                contributor_name,
                amount,
                added_by,
                contributor_id,
                funded_by,
                transaction_type
            )
            VALUES (
                wallet_record.id,
                BTRIM(p_contributor_name),
                -effective_amount,
                p_actor_id,
                p_actor_id,
                trip_record.user_id,
                'owner_rejection'
            );

            changed_wallets := changed_wallets + 1;
        END IF;
    END LOOP;

    RETURN changed_wallets;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_wallet_transaction(UUID, TEXT, NUMERIC, UUID, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.remove_wallet_transaction(UUID, TEXT, NUMERIC, UUID, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.remove_owner_attributed_funds(UUID, UUID, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.apply_wallet_transaction(UUID, TEXT, NUMERIC, UUID, TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.remove_wallet_transaction(UUID, TEXT, NUMERIC, UUID, TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.remove_owner_attributed_funds(UUID, UUID, TEXT) TO service_role;
