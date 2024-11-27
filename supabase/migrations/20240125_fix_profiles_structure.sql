-- First add the role column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Now update the admin user
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'joao.soares@artsana.com'
);

-- Insert if not exists
INSERT INTO profiles (id, name, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'joao.soares@artsana.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';