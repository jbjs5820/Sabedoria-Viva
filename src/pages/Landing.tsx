import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

interface Post {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    name: string;
  };
}

export default function Landing() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">Sabedoria Viva</div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-white hover:text-purple-400">Login</Link>
              <Link to="/register" className="bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-700">
                Registrar
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Hero Content */}
        <div className="relative min-h-screen flex items-center">
          {/* Background Pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 overflow-hidden"
          >
            <svg className="absolute right-0 top-0 h-full w-1/2 text-purple-600/20" viewBox="0 0 500 500">
              <path
                d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250"
                fill="none"
                stroke="currentColor"
                strokeWidth="80"
                className="animate-[spin_20s_linear_infinite]"
              />
            </svg>
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-7xl font-bold mb-6">
                  Welcome.
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Conectando gerações, compartilhando experiências e construindo uma comunidade mais sábia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
                  >
                    Comece Agora
                  </Link>
                  <Link
                    to="/about"
                    className="border border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl filter blur-3xl"></div>
                  <div className="relative bg-gradient-to-r from-purple-900 to-purple-800 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4">Últimas Publicações</h2>
                    {loading ? (
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-purple-700/50 rounded"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {posts.slice(0, 3).map((post) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-purple-800/50 p-4 rounded-lg"
                          >
                            <p className="text-sm text-purple-300">{post.profiles?.name}</p>
                            <p className="text-white line-clamp-2">{post.content}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}