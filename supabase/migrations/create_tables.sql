-- Create profiles table (extends auth.users)
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

-- Create posts table for user content
create table public.posts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create policies for posts
create policy "Public posts are viewable by everyone"
    on posts for select
    using ( true );

create policy "Users can insert their own posts"
    on posts for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own posts"
    on posts for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own posts"
    on posts for delete
    using ( auth.uid() = user_id );

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, name, role)
    values (new.id, new.raw_user_meta_data->>'name', 'user');
    return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();