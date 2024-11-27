-- Drop existing profiles table if it exists
drop table if exists public.profiles cascade;

-- Create profiles table with required columns
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    age integer,
    location text,
    bio text,
    interests text[] default '{}',
    skills text[] default '{}',
    professional_experience text[] default '{}',
    linkedin_url text,
    education text[] default '{}',
    certifications text[] default '{}',
    role text default 'user',
    last_seen timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, role)
    values (new.id, 'user');
    return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Set admin role for specific user
insert into public.profiles (id, name, role)
select id, email, 'admin'
from auth.users
where email = 'joao.soares@artsana.com'
on conflict (id) do update
set role = 'admin';