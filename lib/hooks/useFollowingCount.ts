import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useFollowingCount = (profileId: string) => {
  return useQuery({
    queryKey: ['followingCount', profileId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!profileId,
  });
}; 