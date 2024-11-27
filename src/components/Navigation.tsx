import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Navigation() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      alert('Erro ao fazer logout!');
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-screen">
      <motion.div 
        initial={{ width: isOpen ? 250 : 80 }}
        animate={{ width: isOpen ? 250 : 80 }}
        className="bg-dark-900 text-white h-screen fixed left-0 top-0 z-50 border-r border-dark-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <motion.span
              initial={{ opacity: isOpen ? 1 : 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="text-xl font-bold gradient-text"
            >
              Sabedoria Viva
            </motion.span>
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary-400 hover:text-primary-300">
              {isOpen ? '←' : '→'}
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem to="/home" icon="🏠" text="Início" isOpen={isOpen} />
            <NavItem to="/profile" icon="👤" text="Perfil" isOpen={isOpen} />
            <NavItem to="/feed" icon="📱" text="Feed" isOpen={isOpen} />
            {isAdmin && (
              <NavItem to="/admin" icon="⚙️" text="Admin" isOpen={isOpen} />
            )}
          </nav>

          <div className="absolute bottom-8 left-0 right-0 px-4">
            <div className="flex flex-col gap-2">
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-dark-800 text-white rounded p-2 border border-dark-700 focus:border-primary-500 focus:ring-primary-500"
                value={i18n.language}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded hover:bg-dark-800 transition-colors flex items-center gap-2 text-primary-300 hover:text-primary-200"
              >
                <span>🚪</span>
                {isOpen && <span>Sair</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-24'} transition-all duration-300`}>
        {/* Main content */}
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: string;
  text: string;
  isOpen: boolean;
}

function NavItem({ to, icon, text, isOpen }: NavItemProps) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 rounded transition-colors hover:bg-dark-800 text-primary-300 hover:text-primary-200"
    >
      <span className="mr-3">{icon}</span>
      {isOpen && <span>{text}</span>}
    </Link>
  );
}