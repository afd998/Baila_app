import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { TablesInsert } from '../../types/supabase';

type FollowData = TablesInsert<'follows'>;

export const useFollow = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async (data: FollowData) => {
      const { error } = await supabase
        .from('follows')
        .insert(data);
      
      if (error) throw error;
      return data;
    },
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['isFollowing', data.following_id] });
      
      // Optimistically update the isFollowing query
      queryClient.setQueryData(['isFollowing', data.following_id], true);
    },
    onError: (_, variables) => {
      // Revert the optimistic update on error
      queryClient.setQueryData(['isFollowing', variables.following_id], false);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Invalidate the isFollowing query for the specific profile
      queryClient.invalidateQueries({ queryKey: ['isFollowing', data.following_id] });
      // Invalidate follower counts
      queryClient.invalidateQueries({ queryKey: ['followerCount', data.following_id] });
      queryClient.invalidateQueries({ queryKey: ['followingCount', data.follower_id] });
      // Invalidate following/followers lists
      queryClient.invalidateQueries({ queryKey: ['following', data.follower_id] });
      queryClient.invalidateQueries({ queryKey: ['followers', data.following_id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async ({ follower_id, following_id }: { follower_id: string; following_id: string }) => {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', follower_id)
        .eq('following_id', following_id);
      
      if (error) throw error;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['isFollowing', variables.following_id] });
      
      // Optimistically update the isFollowing query
      queryClient.setQueryData(['isFollowing', variables.following_id], false);
    },
    onError: (_, variables) => {
      // Revert the optimistic update on error
      queryClient.setQueryData(['isFollowing', variables.following_id], true);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Invalidate the isFollowing query for the specific profile
      queryClient.invalidateQueries({ queryKey: ['isFollowing', variables.following_id] });
      // Invalidate follower counts
      queryClient.invalidateQueries({ queryKey: ['followerCount', variables.following_id] });
      queryClient.invalidateQueries({ queryKey: ['followingCount', variables.follower_id] });
      // Invalidate following/followers lists
      queryClient.invalidateQueries({ queryKey: ['following', variables.follower_id] });
      queryClient.invalidateQueries({ queryKey: ['followers', variables.following_id] });
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
  };
}; 