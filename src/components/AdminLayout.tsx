import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-lg font-bold gradient-text">Admin Dashboard</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/admin"
                    className="text-primary-300 hover:text-primary-200 hover:bg-dark-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-primary-300 hover:text-primary-200 hover:bg-dark-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Usuários
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="text-primary-300 hover:text-primary-200 hover:bg-dark-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}