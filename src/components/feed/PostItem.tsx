import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '../../lib/types/social';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

interface PostItemProps {
  post: Post;
  onUpdate: () => void;
}

export default function PostItem({ post, onUpdate }: PostItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReaction = async (type: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .eq('reaction_type', type)
        .single();

      if (existingReaction) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
      } else {
        await supabase
          .from('reactions')
          .insert([{
            post_id: post.id,
            user_id: user.id,
            reaction_type: type
          }]);
      }

      onUpdate();
    } catch (error) {
      console.error('Error handling reaction:', error);
      alert('Failed to update reaction');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          author_id: user.id,
          content: comment.trim()
        }]);

      if (error) throw error;

      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-900 rounded-lg p-6 space-y-4 border border-dark-800"
    >
      <div className="flex items-start gap-4">
        {post.author?.avatar_url && (
          <img
            src={post.author.avatar_url}
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h3 className="font-semibold text-white">{post.author?.name}</h3>
          <p className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </p>
        </div>
      </div>

      <div 
        className="text-white prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.media_url && post.media_url.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.media_url.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleReaction('like')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-500"
        >
          <span>❤️</span>
          <span>{post.reactions_count?.like || 0}</span>
        </button>
        <button
          onClick={() => handleReaction('wisdom')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-500"
        >
          <span>🧠</span>
          <span>{post.reactions_count?.wisdom || 0}</span>
        </button>
        <button
          onClick={() => handleReaction('helpful')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-500"
        >
          <span>🤝</span>
          <span>{post.reactions_count?.helpful || 0}</span>
        </button>
        <button
          onClick={() => handleReaction('inspiring')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary-500"
        >
          <span>✨</span>
          <span>{post.reactions_count?.inspiring || 0}</span>
        </button>
      </div>

      <div className="pt-4 border-t border-dark-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-dark-800 border-dark-700 text-white rounded-lg focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            onClick={handleComment}
            disabled={isSubmitting || !comment.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}