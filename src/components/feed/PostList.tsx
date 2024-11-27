import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import PostItem from './PostItem';
import { motion } from 'framer-motion';
import { Post } from '../../lib/types/social';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
    const subscription = subscribeToNewPosts();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          created_at,
          updated_at,
          author:author_id (
            id,
            email,
            raw_user_meta_data->name as name,
            raw_user_meta_data->avatar_url as avatar_url
          ),
          reactions (
            id,
            reaction_type,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithReactions = data?.map(post => ({
        ...post,
        reactions_count: post.reactions?.reduce((acc, reaction) => {
          acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      })) || [];

      setPosts(postsWithReactions);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewPosts = () => {
    return supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        () => {
          fetchPosts();
        }
      )
      .subscribe();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No posts yet. Be the first to share something!
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </motion.div>
  );
}