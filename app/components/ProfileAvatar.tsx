import React from 'react';
import { Avatar, useTheme } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  size?: number;
  fallbackIcon?: string;
}

export function ProfileAvatar({ 
  avatarUrl, 
  size = 80, 
  fallbackIcon = "user-circle" 
}: ProfileAvatarProps) {
  const theme = useTheme();
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  
  // Debug: log the avatar URL
  console.log('ProfileAvatar - avatarUrl:', avatarUrl);

  // Use the avatar URL directly if it's a full URL (like DiceBear), otherwise construct Supabase URL
  const fullAvatarUrl = avatarUrl && avatarUrl.startsWith('http') 
    ? avatarUrl 
    : avatarUrl 
      ? `${supabaseUrl}/storage/v1/object/public/avatars/${avatarUrl}`
      : null;

  return (
    <Avatar circular size={size}>
      <Avatar.Image
        source={{
          uri: fullAvatarUrl || `https://ui-avatars.com/api/?name=User&background=random`,
        }}
        onError={(error) => {
          console.log('Avatar load error for URL:', fullAvatarUrl, 'Error:', error);
        }}
      />
      <Avatar.Fallback backgroundColor="$gray5">
        <FontAwesome 
          name={fallbackIcon as any} 
          size={size * 0.4} 
          color="$gray11"
        />
      </Avatar.Fallback>
    </Avatar>
  );
} 