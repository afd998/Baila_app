import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Tables } from '../../types/supabase';

type Profile = Tables<'profiles'>;

export const useFollowing = (profileId: string) => {
  return useQuery({
    queryKey: ['following', profileId],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey (
            id,
            full_name,
            handle,
            avatar_url,
            bio,
            private
          )
        `)
        .eq('follower_id', profileId);

      if (error) throw error;
      
      // Extract the profile data from the join
      return data?.map(item => item.profiles as Profile) || [];
    },
    enabled: !!profileId,
  });
}; 