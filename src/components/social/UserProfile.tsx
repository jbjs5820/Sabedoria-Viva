import React from 'react';
import { motion } from 'framer-motion';
import { useTooltip, TooltipTrigger } from 'react-aria';

interface UserProfileProps {
  name: string;
  location: string;
  interests: string[];
  bio: string;
  avatarUrl?: string;
  onlineStatus?: 'online' | 'offline' | 'away';
}

export default function UserProfile({
  name,
  location,
  interests,
  bio,
  avatarUrl,
  onlineStatus = 'offline'
}: UserProfileProps) {
  const { tooltipProps, triggerProps } = useTooltip({
    delay: 0,
    offset: 8
  });

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={avatarUrl || '/default-avatar.png'}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
          />
          <div
            {...triggerProps}
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusColors[onlineStatus]} border-2 border-white`}
          >
            <div {...tooltipProps} className="tooltip">
              {onlineStatus.charAt(0).toUpperCase() + onlineStatus.slice(1)}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-lg text-gray-600 mb-2">{location}</p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sobre</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{bio}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg text-lg hover:bg-primary-700 transition-colors">
          Adicionar Amigo
        </button>
        <button className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg text-lg hover:bg-primary-50 transition-colors">
          Enviar Mensagem
        </button>
      </div>
    </motion.div>
  );
}