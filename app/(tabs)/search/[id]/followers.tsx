import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProfileById } from '../../../../lib/hooks/useProfileById';
import { YStack, Spinner, Text, XStack, useTheme, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useFollowers } from '../../../../lib/hooks/useFollowers';
import { SearchResult } from '../../../../components/SearchResult';

export default function FollowersPage() {
  const { id } = useLocalSearchParams();
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfileById(id as string);
  const { data: followers, isLoading: isLoadingFollowers, error: followersError } = useFollowers(id as string);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (isLoadingProfile) return <Spinner />;
  if (profileError || !profile) return <Text>Error loading profile</Text>;

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
          onPress={() => router.back()}
          bg="transparent"
          color="$color"
          pressStyle={{ opacity: 0.7, backgroundColor: 'transparent' }}
          borderWidth={0}
          outlineColor="transparent"
        >
          <FontAwesome name="chevron-left" size={20} color={theme.color.val} />
        </Button>
        
        <Text color="$color" fontSize="$6" fontWeight="bold" f={1} ta="center">
          Followers
        </Text>
      </XStack>

      {/* Content */}
      <YStack f={1} p="$4">
        {isLoadingFollowers ? (
          <YStack f={1} ai="center" jc="center">
            <Spinner size="large" />
            <Text color="$gray11" fontSize="$4" mt="$4">Loading followers...</Text>
          </YStack>
        ) : followersError ? (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="exclamation-triangle" size={60} color={theme.red10.val} />
            <Text color="$red10" fontSize="$4" ta="center">
              Failed to load followers
            </Text>
          </YStack>
        ) : followers && followers.length > 0 ? (
          <YStack space="$2">
            {followers.map((follower) => (
              <SearchResult
                key={follower.id}
                profile={follower}
                onPress={() => router.push(`/search/${follower.id}`)}
              />
            ))}
          </YStack>
        ) : (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="users" size={60} color={theme.gray10.val} />
            <Text color="$gray11" fontSize="$4" ta="center">
              No followers yet
            </Text>
            <Text color="$gray10" fontSize="$3" ta="center">
              When people follow @{profile.handle}, they'll appear here
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
} 