import React from 'react';
import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
            <p className="text-gray-600">
              Explore a comunidade e conecte-se com pessoas incríveis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}