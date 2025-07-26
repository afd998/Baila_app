import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Tables } from '../../types/supabase';

type Profile = Tables<'profiles'>;

export const useProfileById = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}; 