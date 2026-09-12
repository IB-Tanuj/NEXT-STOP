CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id)
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own friendships (either requester or addressee)
CREATE POLICY "Users can view their own friendships" ON public.friendships
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Policy: Users can insert friendships where they are the requester
CREATE POLICY "Users can insert friendships" ON public.friendships
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Policy: Users can update their own friendships (e.g. accepting/rejecting)
CREATE POLICY "Users can update their own friendships" ON public.friendships
    FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Policy: Users can delete their own friendships
CREATE POLICY "Users can delete their own friendships" ON public.friendships
    FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Create a function to automatically update updated_at on change
CREATE OR REPLACE FUNCTION update_friendship_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_friendships_modtime
BEFORE UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION update_friendship_updated_at_column();
