import React from 'react';
import { YStack, XStack, Text, Spinner, useTheme, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFollowing } from '../../../lib/hooks/useFollowing';
import { useUserProfile } from '../../../lib/hooks/useUserProfile';
import { SearchResult } from '../../../components/SearchResult';

export default function FollowingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: userProfile } = useUserProfile();
  const { data: following, isLoading, error } = useFollowing(userProfile?.id || '');

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
        <YStack w={40} ai="flex-start">
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
        </YStack>
        <YStack f={1} ai="center">
          <Text color="$color" fontSize="$6" fontWeight="bold" ta="center">
            Following
          </Text>
        </YStack>
        <YStack w={40} />
      </XStack>

      {/* Content */}
      <YStack f={1} p="$4">
        {isLoading ? (
          <YStack f={1} ai="center" jc="center">
            <Spinner size="large" />
            <Text color="$gray11" fontSize="$4" mt="$4">Loading following...</Text>
          </YStack>
        ) : error ? (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="exclamation-triangle" size={60} color={theme.red10.val} />
            <Text color="$red10" fontSize="$4" ta="center">
              Failed to load following
            </Text>
          </YStack>
        ) : following && following.length > 0 ? (
          <YStack space="$2">
            {following.map((followedProfile) => (
              <SearchResult
                key={followedProfile.id}
                profile={followedProfile}
                onPress={() => router.push(`/(tabs)/(profile)/${followedProfile.id}`)}
              />
            ))}
          </YStack>
        ) : (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="user-plus" size={60} color="$gray10" />
            <Text color="$gray11" fontSize="$4" ta="center">
              Not following anyone yet
            </Text>
            <Text color="$gray10" fontSize="$3" ta="center">
              When you follow people, they'll appear here
            </Text>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
} 