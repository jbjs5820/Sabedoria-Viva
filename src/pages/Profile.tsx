import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  name: string;
  age: number | null;
  location: string;
  bio: string;
  interests: string[];
  skills: string[];
  professional_experience: string[];
  linkedin_url: string;
  education: string[];
  certifications: string[];
}

const initialProfile: Profile = {
  id: '',
  name: '',
  age: null,
  location: '',
  bio: '',
  interests: [],
  skills: [],
  professional_experience: [],
  linkedin_url: '',
  education: [],
  certifications: []
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Usuário não autenticado' });
        return;
      }

      // Get profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const newProfile = {
            id: user.id,
            ...initialProfile
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          setProfile(createdProfile || initialProfile);
        } else {
          throw error;
        }
      } else {
        // Profile exists, set it
        setProfile({
          ...initialProfile,
          ...data,
          interests: data.interests || [],
          skills: data.skills || [],
          professional_experience: data.professional_experience || [],
          education: data.education || [],
          certifications: data.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Usuário não autenticado' });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
      // Refresh profile data
      await getProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navigation />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navigation />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto py-8 px-4"
      >
        <div className="bg-dark-900 shadow rounded-lg p-6 space-y-8 border border-dark-800">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Meu Perfil</h2>
            {message.text && (
              <div className={`p-4 rounded-md mb-4 ${
                message.type === 'success' 
                  ? 'bg-green-900/50 border border-green-500/50 text-green-200' 
                  : 'bg-red-900/50 border border-red-500/50 text-red-200'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200">Nome</label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Idade</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-200">Localização</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-primary-500 focus:ring-primary-500"
                placeholder="Cidade, País"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-200">Perfil LinkedIn</label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-primary-500 focus:ring-primary-500"
                placeholder="https://www.linkedin.com/in/seu-perfil"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-200">Sobre Mim</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-primary-500 focus:ring-primary-500"
                placeholder="Conte-nos um pouco sobre você..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={updateProfile}
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}