import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function PostForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: postError } = await supabase
        .from('posts')
        .insert([{ content: content.trim(), author_id: user.id }]);

      if (postError) throw postError;

      setContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-900 rounded-lg p-6 shadow-lg border border-dark-800"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full rounded-lg bg-dark-800 border-dark-700 text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}