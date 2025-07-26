import React from 'react';
import { Avatar } from 'tamagui';
import { useUserProfile } from '../lib/hooks/useUserProfile';

interface ProfileTabIconProps {
  color: string;
  size: number;
}

export function ProfileTabIcon({ color, size }: ProfileTabIconProps) {
  const { data: userProfile } = useUserProfile();

  return (
    <Avatar circular size={size}>
      <Avatar.Image
        source={{
          uri: userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || 'User')}&background=random`,
        }}
      />
      <Avatar.Fallback backgroundColor="$gray5" />
    </Avatar>
  );
} 