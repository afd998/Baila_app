import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProfileById } from '../lib/hooks/useProfileById';
import { useUserProfile } from '../lib/hooks/useUserProfile';
import { ProfileHeader } from './ProfileHeader';
import { YStack, Spinner, Text, XStack, useTheme, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';

interface ProfilePageProps {
  // Optional callback for custom back navigation
  onBackPress?: () => void;
}

export function ProfilePage({ onBackPress }: ProfilePageProps) {
  const { id } = useLocalSearchParams();
  const { data: profile, isLoading, error } = useProfileById(id as string);
  const { data: userProfile } = useUserProfile();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Check if the profile being viewed is the current user's profile
  useEffect(() => {
    if (userProfile && profile && userProfile.id === profile.id) {
      // Redirect to the user's own profile tab
      router.replace('/(tabs)/(profile)');
    }
  }, [userProfile, profile, router]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  if (isLoading) return <Spinner />;
  if (error || !profile) return <Text>Error loading profile</Text>;

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
        <Button
          size="$3"
          circular
          onPress={handleBackPress}
          bg="transparent"
          color="$color"
          pressStyle={{ opacity: 0.7, backgroundColor: 'transparent' }}
          borderWidth={0}
          outlineColor="transparent"
        >
          <FontAwesome name="chevron-left" size={20} color={theme.color.val} />
        </Button>
        
        <Text color="$color" fontSize="$8" fontWeight="bold" f={1}>
          @{profile?.handle || 'Profile'}
        </Text>
      </XStack>

      {/* Profile Content */}
      <YStack f={1} p="$4" space="$4">
        <ProfileHeader profile={profile} isOwnProfile={false} />
        
        {/* Divider */}
        <YStack 
          height={1} 
          backgroundColor="$gray8" 
          marginVertical="$4"
          marginHorizontal="$4"
        />
        
        {/* Private Account Message */}
        {profile.private && (
          <YStack 
            f={1} 
            ai="center" 
            jc="center" 
            space="$4" 
            p="$4"
          >
            <FontAwesome 
              name="lock" 
              size={60} 
              color="$gray10"
            />
            <Text color="$color" fontSize="$6" fontWeight="600" ta="center">
              This Account is Private
            </Text>
            <Text color="$gray11" fontSize="$4" ta="center" px="$4">
              Follow @{profile.handle} to see their posts and stories
            </Text>
          </YStack>
        )}
        
        {/* TODO: Add public content here when account is not private */}
        {!profile.private && (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome 
              name="image" 
              size={60} 
              color="$gray10"
            />
            <Text color="$gray11" fontSize="$4" ta="center">
              No posts yet
            </Text>
            <Text color="$gray10" fontSize="$3" ta="center">
              When @{profile.handle} shares photos and videos, they'll appear here
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
} 