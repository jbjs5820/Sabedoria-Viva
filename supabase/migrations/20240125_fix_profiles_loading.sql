-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at);

-- Ensure the profiles table has the correct structure
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Update any null values in required fields
UPDATE profiles 
SET 
  interests = '{}' WHERE interests IS NULL,
  skills = '{}' WHERE skills IS NULL,
  professional_experience = '{}' WHERE professional_experience IS NULL,
  education = '{}' WHERE education IS NULL,
  certifications = '{}' WHERE certifications IS NULL;