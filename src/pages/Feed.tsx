import React from 'react';
import Navigation from '../components/Navigation';
import PostForm from '../components/feed/PostForm';
import PostList from '../components/feed/PostList';
import { motion } from 'framer-motion';

export default function Feed() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <PostForm />
          <PostList />
        </motion.div>
      </div>
    </div>
  );
}