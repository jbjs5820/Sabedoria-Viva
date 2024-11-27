-- Update profiles table with new fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'pt',
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": true}'::jsonb,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Create interests table for better organization
CREATE TABLE IF NOT EXISTS public.interests_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create skills table for better organization
CREATE TABLE IF NOT EXISTS public.skills_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default interests
INSERT INTO public.interests_categories (name, description) VALUES
('Leitura', 'Atividades relacionadas à leitura e literatura'),
('Jardinagem', 'Cultivo de plantas e jardinagem'),
('Culinária', 'Atividades relacionadas à cozinha e gastronomia'),
('Artesanato', 'Trabalhos manuais e artesanato'),
('Música', 'Atividades relacionadas à música'),
('Viagens', 'Experiências de viagem e turismo'),
('História', 'Interesse em história e patrimônio cultural'),
('Arte', 'Interesse em artes visuais e cultura'),
('Tecnologia', 'Interesse em tecnologia e inovação'),
('Fotografia', 'Interesse em fotografia'),
('Exercício', 'Atividades físicas e bem-estar'),
('Voluntariado', 'Atividades voluntárias e sociais')
ON CONFLICT (id) DO NOTHING;

-- Insert default skills
INSERT INTO public.skills_categories (name, description) VALUES
('Mentoria', 'Capacidade de orientar e aconselhar'),
('Ensino', 'Habilidade em compartilhar conhecimento'),
('Tecnologia', 'Conhecimentos em tecnologia'),
('Artesanato', 'Habilidades em trabalhos manuais'),
('Culinária', 'Conhecimentos em gastronomia'),
('Jardinagem', 'Habilidades em cultivo e jardinagem'),
('Idiomas', 'Conhecimento em diferentes línguas'),
('Música', 'Habilidades musicais'),
('Fotografia', 'Conhecimentos em fotografia'),
('Escrita', 'Habilidades de comunicação escrita')
ON CONFLICT (id) DO NOTHING;

-- Create user_interests junction table
CREATE TABLE IF NOT EXISTS public.user_interests (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_id uuid REFERENCES public.interests_categories(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, interest_id)
);

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS public.user_skills (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id uuid REFERENCES public.skills_categories(id) ON DELETE CASCADE,
    proficiency_level text DEFAULT 'intermediate',
    years_experience integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, skill_id)
);

-- Add RLS policies for new tables
ALTER TABLE public.interests_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for interests_categories
CREATE POLICY "Interests categories are viewable by everyone"
    ON interests_categories FOR SELECT
    USING ( true );

-- Create policies for skills_categories
CREATE POLICY "Skills categories are viewable by everyone"
    ON skills_categories FOR SELECT
    USING ( true );

-- Create policies for user_interests
CREATE POLICY "Users can view all user interests"
    ON user_interests FOR SELECT
    USING ( true );

CREATE POLICY "Users can manage their own interests"
    ON user_interests FOR ALL
    USING ( auth.uid() = user_id );

-- Create policies for user_skills
CREATE POLICY "Users can view all user skills"
    ON user_skills FOR SELECT
    USING ( true );

CREATE POLICY "Users can manage their own skills"
    ON user_skills FOR ALL
    USING ( auth.uid() = user_id );

-- Create function to update profile timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();