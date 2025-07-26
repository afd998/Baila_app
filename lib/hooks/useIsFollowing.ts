import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useIsFollowing = (followingId: string) => {
  return useQuery({
    queryKey: ['isFollowing', followingId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return !!data;
    },
    enabled: !!followingId,
  });
}; 