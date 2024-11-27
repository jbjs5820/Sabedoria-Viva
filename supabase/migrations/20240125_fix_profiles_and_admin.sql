-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Update or insert admin user
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