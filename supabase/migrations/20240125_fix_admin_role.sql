-- First ensure the role column exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Update the admin user's role
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'joao.soares@artsana.com'
);

-- Create or replace the function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;