import { YStack, H1, Text, XStack, useTheme, Group, Button, Spinner } from 'tamagui';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserProfile } from '../../../lib/hooks/useUserProfile';
import { ProfileHeader } from '../../../components/ProfileHeader';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, error, refetch } = useUserProfile();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      console.log('Profile screen focused, invalidating cache and refetching data...');
      // Invalidate the cache and refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.refetchQueries({ queryKey: ['userProfile'] });
    }, [queryClient])
  );

  // Debug logging
  console.log('Profile index screen - Current profile data:', {
    fullName: profile?.full_name,
    bio: profile?.bio,
    avatarUrl: profile?.avatar_url,
    isLoading,
    error: error?.message
  });

  if (isLoading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Spinner size="large" />
        <Text color="$color" mt="$4">Loading profile...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" bg="$background">
        <FontAwesome name="exclamation-triangle" size={60} color={theme.red10.val} />
        <H1 color="$color" size="$8" mt="$4">Error Loading Profile</H1>
        <Text color="$gray11" fontSize="$5" ta="center" mt="$2">
          {error.message}
        </Text>
        <Button
          size="$4"
          onPress={() => router.push('/settings')}
          mt="$4"
          bg="$accent1"
          color="white"
        >
          Go to Settings
        </Button>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack 
        w="100%" 
        ai="center" 
        p="$4" 
        pt={insets.top + 16}
        pb="$4"
        bg="$background"
        position="relative"
      >
        <XStack f={1} ai="center" space="$2">
          {profile?.private && (
            <FontAwesome name="lock" size={16} color={theme.color.val} />
          )}
          <Text color="$color" fontSize="$8" fontWeight="bold">
            @{profile?.handle || 'Profile'}
          </Text>
        </XStack>
        
        <Button
          size="$3"
          circular
          onPress={() => router.push('/settings')}
          bg="transparent"
          color="$accent1"
        >
          <FontAwesome name="cog" size={18} color={theme.accent1.val} />
        </Button>
      </XStack>

      {/* Main Content */}
      <YStack f={1} p="$4" space="$4">
        {/* Profile Header */}
        {profile && (
          <ProfileHeader 
            profile={profile}
            isOwnProfile={true}
          />
        )}
      </YStack>
    </YStack>
  );
} 