-- Update the user role to admin for the specified email
UPDATE profiles
SET role = 'admin'
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'joao.soares@artsana.com'
);