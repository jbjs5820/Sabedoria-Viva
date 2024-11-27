-- First, ensure we're working with a clean slate
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;

-- Create the likes table with proper constraints
CREATE TABLE public.likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT fk_post
        FOREIGN KEY(post_id) 
        REFERENCES public.posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_like
        UNIQUE(post_id, user_id)
);

-- Create the comments table with proper constraints
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT fk_post
        FOREIGN KEY(post_id) 
        REFERENCES public.posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_likes_post_user ON public.likes(post_id, user_id);
CREATE INDEX idx_likes_user ON public.likes(user_id);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);

-- Enable Row Level Security
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Likes are viewable by everyone" 
    ON public.likes FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own likes" 
    ON public.likes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
    ON public.likes FOR DELETE 
    USING (auth.uid() = user_id);

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" 
    ON public.comments FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
    ON public.comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id);