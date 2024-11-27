import React from 'react';
import { motion } from 'framer-motion';

interface GroupCardProps {
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  category: string;
  privacy: 'public' | 'private';
  onJoin: () => void;
}

export default function GroupCard({
  name,
  description,
  memberCount,
  imageUrl,
  category,
  privacy,
  onJoin
}: GroupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={imageUrl || '/default-group.jpg'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
            {privacy === 'public' ? '🌍 Público' : '🔒 Privado'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
        
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-500">
            {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{category}</span>
        </div>

        <p className="text-gray-600 text-lg mb-6">{description}</p>

        <button
          onClick={onJoin}
          className="w-full py-3 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Participar do Grupo
        </button>
      </div>
    </motion.div>
  );
}