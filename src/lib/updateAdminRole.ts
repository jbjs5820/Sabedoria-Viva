import { supabase } from './supabaseClient';

export async function updateUserToAdmin(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { data: null, error };
  }
}