import React from 'react';
import { XStack, YStack, Text, Avatar, useTheme } from 'tamagui';
import { Tables } from '../types/supabase';

// Only show compact info in search results
// Avatar, name, handle

type Profile = Tables<'profiles'>;

interface SearchResultProps {
  profile: Profile;
  onPress?: () => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({ profile, onPress }) => {
  const theme = useTheme();
  
  // Debug: log avatar URL
  console.log('Profile avatar URL:', profile.id, profile.avatar_url);

  return (
    <XStack
      p="$3"
      ai="center"
      space="$3"
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      borderBottomWidth={1}
      borderBottomColor="$gray5"
    >
      <Avatar circular size="$4">
        <Avatar.Image
          source={{
            uri: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=random`,
          }}
          onError={(error) => {
            console.log('Avatar load error for profile:', profile.id, 'URL:', profile.avatar_url, 'Error:', error);
          }}
        />
        <Avatar.Fallback backgroundColor="$gray5" />
      </Avatar>
      <YStack f={1} space="$1">
        <Text fontWeight="bold" fontSize="$4" color="$color">
          {profile.full_name || 'Anonymous'}
        </Text>
        {profile.handle && (
          <Text fontSize="$3" color="$gray11">
            @{profile.handle}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}; 