-- Add preferences JSONB column to profiles table to store notification and permission settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "notifications": {
    "friend_requests": true,
    "trip_reminders": true
  },
  "permissions": {
    "location": false,
    "camera": false
  }
}'::jsonb;
