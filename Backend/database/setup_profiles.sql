-- ============================================
-- 1. Create Profiles Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    unique_id TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    username TEXT UNIQUE,
    bio TEXT,
    gender TEXT,
    dob DATE,
    tags TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{
      "notifications": {
        "friend_requests": true,
        "trip_reminders": true
      },
      "permissions": {
        "location": false,
        "camera": false
      }
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles"
    ON public.profiles FOR SELECT
    USING (true); -- Anyone can view profiles (needed for adding friends later)

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Trigger Function for Auto-Profile Generation
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  new_unique_id TEXT;
  is_unique BOOLEAN := FALSE;
BEGIN
  -- Generate an 8-character uppercase alphanumeric unique ID
  WHILE NOT is_unique LOOP
    -- Generates something like 'A4B9F1XC'
    new_unique_id := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if it exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE unique_id = new_unique_id) THEN
      is_unique := TRUE;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, unique_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    new_unique_id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- 3. Backfill Existing Users
-- ============================================
DO $$
DECLARE
  user_record RECORD;
  new_unique_id TEXT;
  is_unique BOOLEAN;
BEGIN
  FOR user_record IN SELECT id, raw_user_meta_data FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles) LOOP
    is_unique := FALSE;
    
    -- Generate an 8-character uppercase alphanumeric unique ID
    WHILE NOT is_unique LOOP
      new_unique_id := upper(substring(md5(random()::text) from 1 for 8));
      
      IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE unique_id = new_unique_id) THEN
        is_unique := TRUE;
      END IF;
    END LOOP;

    INSERT INTO public.profiles (id, unique_id, full_name, avatar_url)
    VALUES (
      user_record.id,
      new_unique_id,
      user_record.raw_user_meta_data->>'full_name',
      user_record.raw_user_meta_data->>'avatar_url'
    );
  END LOOP;
END;
$$;
