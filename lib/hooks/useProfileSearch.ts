import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Tables } from '../../types/supabase';

type Profile = Tables<'profiles'>;

export const useProfileSearch = (query: string) => {
  return useQuery({
    queryKey: ['profileSearch', query],
    queryFn: async (): Promise<Profile[]> => {
      if (query.length < 2) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, handle, avatar_url, bio, created_at, is_dummy')
        .or(`full_name.ilike.%${query}%,handle.ilike.%${query}%`)
        .order('full_name')
        .limit(20);
      
      if (error) {
        console.error('Search error:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: query.length >= 2, // Only search if 2+ characters
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}; 