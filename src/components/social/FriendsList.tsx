import React from 'react';
import { List, useListState } from 'react-stately';
import { useList } from 'react-aria';
import { motion } from 'framer-motion';

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  onlineStatus: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface FriendsListProps {
  friends: Friend[];
  onFriendSelect: (friendId: string) => void;
}

export default function FriendsList({ friends, onFriendSelect }: FriendsListProps) {
  const list = useListState({
    items: friends,
    children: (friend) => (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => onFriendSelect(friend.id)}
      >
        <div className="relative">
          <img
            src={friend.avatarUrl || '/default-avatar.png'}
            alt={friend.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              friend.onlineStatus === 'online'
                ? 'bg-green-500'
                : friend.onlineStatus === 'away'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}
          />
        </div>
        
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{friend.name}</h3>
          <p className="text-sm text-gray-500">
            {friend.onlineStatus === 'online'
              ? 'Online'
              : friend.lastActive
              ? `Último acesso: ${friend.lastActive}`
              : 'Offline'}
          </p>
        </div>
      </motion.div>
    )
  });

  const { listProps } = useList({}, list);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Amigos</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Procurar amigos..."
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div {...listProps} className="space-y-2">
        {Array.from(list.collection).map((item) => (
          <div key={item.key}>{item.rendered}</div>
        ))}
      </div>
    </div>
  );
}