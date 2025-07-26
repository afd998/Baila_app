import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { Tables } from '../../types/supabase';

type Profile = Tables<'profiles'>;

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<Profile | null> => {
      console.log('useUserProfile: Fetching profile data...');
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('No authenticated user found');
      }

      // Fetch the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // No profile found
          console.log('useUserProfile: No profile found');
          return null;
        }
        throw profileError;
      }

      console.log('useUserProfile: Profile data fetched:', profile);
      return profile;
    },
    staleTime: 0, // Consider data stale immediately
    gcTime: 1 * 60 * 1000, // Keep in cache for 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Hook to invalidate profile cache
export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  
  return () => {
    // Remove the cache completely
    queryClient.removeQueries({ queryKey: ['userProfile'] });
    // Force an immediate refetch
    queryClient.refetchQueries({ queryKey: ['userProfile'] });
  };
}

// Hook to update profile cache directly
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return (updatedProfile: Partial<Profile>) => {
    queryClient.setQueryData(['userProfile'], (oldData: Profile | null) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updatedProfile };
    });
  };
} 