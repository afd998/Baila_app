import React from 'react';
import { YStack, XStack, Text, Button, useTheme } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { ProfileAvatar } from '../app/components/ProfileAvatar';
import { Tables } from '../types/supabase';
import { useRouter } from 'expo-router';
import { useFollow } from '../lib/hooks/useFollow';
import { useIsFollowing } from '../lib/hooks/useIsFollowing';
import { useFollowerCount } from '../lib/hooks/useFollowerCount';
import { useFollowingCount } from '../lib/hooks/useFollowingCount';
import { supabase } from '../lib/supabase';
import { UnfollowModal } from './UnfollowModal';
import { useState } from 'react';

type Profile = Tables<'profiles'>;

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onEditPress?: () => void;
  onFollowPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = false,
  onEditPress,
  onFollowPress,
  onFollowersPress,
  onFollowingPress,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { follow, unfollow, isFollowing, isUnfollowing } = useFollow();
  const { data: isFollowingProfile, isLoading: isLoadingFollowStatus } = useIsFollowing(profile.id);
  const { data: followerCount = 0, isLoading: isLoadingFollowers } = useFollowerCount(profile.id);
  const { data: followingCount = 0, isLoading: isLoadingFollowing } = useFollowingCount(profile.id);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  const handleFollowersPress = () => {
    if (onFollowersPress) {
      onFollowersPress();
      return;
    }

    // If profile is private and we're not following them, do nothing
    if (profile.private && !isFollowingProfile && !isOwnProfile) {
      return;
    }

    if (isOwnProfile) {
      router.push('/(tabs)/(profile)/followers');
    } else {
      // Navigate to other user's followers
      router.push(`/search/${profile.id}/followers`);
    }
  };

  const handleFollowingPress = () => {
    if (onFollowingPress) {
      onFollowingPress();
      return;
    }

    // If profile is private and we're not following them, do nothing
    if (profile.private && !isFollowingProfile && !isOwnProfile) {
      return;
    }

    if (isOwnProfile) {
      router.push('/(tabs)/(profile)/following');
    } else {
      // Navigate to other user's following
      router.push(`/search/${profile.id}/following`);
    }
  };

  const handleEditPress = () => {
    if (onEditPress) {
      onEditPress();
    } else if (isOwnProfile) {
      router.push('/(tabs)/(profile)/edit');
    }
  };

  const handleFollowPress = async () => {
    if (onFollowPress) {
      onFollowPress();
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      if (isFollowingProfile) {
        // Show unfollow confirmation modal
        setShowUnfollowModal(true);
      } else {
        // Follow immediately
        follow({ follower_id: user.id, following_id: profile.id });
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
    }
  };

  const handleUnfollowConfirm = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      // Unfollow
      unfollow({ follower_id: user.id, following_id: profile.id });
      setShowUnfollowModal(false);
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  return (
    <YStack space="$4" pb="$4">
      <XStack space="$4" alignItems="flex-start">
        {/* Left side - Profile Photo */}
        <ProfileAvatar 
          avatarUrl={profile?.avatar_url || null} 
          size={80}
        />

        {/* Right side - Name and Bio */}
        <YStack f={1} space="$2" pt="$2">
          <Text color="$color" fontSize="$6" fontWeight="normal">
            {profile?.full_name || 'No Name Set'}
          </Text>
          
          {profile?.bio && (
            <Text color="$gray10" fontSize="$4" mt="$2">
              {profile.bio}
            </Text>
          )}

          {/* Following/Follower Counts */}
          <XStack space="$6" mt="$3">
            <Button
              onPress={handleFollowingPress}
              bg="transparent"
              p="$0"
            >
              <XStack space="$1" alignItems="center">
                <Text color="$color" fontSize="$5" fontWeight="600">
                  {followingCount}
                </Text>
                <Text color="$gray11" fontSize="$4">
                  following
                </Text>
              </XStack>
            </Button>
            
            <Button
              onPress={handleFollowersPress}
              bg="transparent"
              p="$0"
            >
              <XStack space="$1" alignItems="center">
                <Text color="$color" fontSize="$5" fontWeight="600">
                  {followerCount}
                </Text>
                <Text color="$gray11" fontSize="$4">
                  followers
                </Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </XStack>

      {/* Action Button */}
      {isOwnProfile ? (
        <Button
          size="$3"
          onPress={handleEditPress}
          bg="transparent"
          color="$accent1"
          borderWidth={1}
          borderColor="$accent1"
          alignSelf="flex-start"
        >
          <XStack space="$2" alignItems="center">
            <FontAwesome name="edit" size={14} color={theme.accent1.val} />
            <Text color="$accent1" fontSize="$3">Edit Profile</Text>
          </XStack>
        </Button>
      ) : (
        <Button
          size="$3"
          onPress={handleFollowPress}
          bg={isFollowingProfile ? "transparent" : "$accent1"}
          color={isFollowingProfile ? "$accent1" : "white"}
          borderWidth={isFollowingProfile ? 1 : 0}
          borderColor={isFollowingProfile ? "$accent1" : "transparent"}
          alignSelf="flex-start"
          disabled={isFollowing || isUnfollowing || isLoadingFollowStatus}
        >
          <XStack space="$2" alignItems="center">
            <FontAwesome 
              name={isFollowingProfile ? "check" : "user-plus"} 
              size={14} 
              color={isFollowingProfile ? theme.accent1.val : "white"} 
            />
            <Text 
              color={isFollowingProfile ? "$accent1" : "white"} 
              fontSize="$3"
            >
              {isFollowingProfile ? "Following" : "Follow"}
            </Text>
          </XStack>
        </Button>
      )}

      {/* Unfollow Confirmation Modal */}
      <UnfollowModal
        isVisible={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={handleUnfollowConfirm}
        profileName={profile.handle || profile.full_name || 'User'}
        isLoading={isUnfollowing}
      />
    </YStack>
  );
}; 