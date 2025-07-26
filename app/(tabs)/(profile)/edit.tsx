import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Group,
  H1,
  Input,
  TextArea,
  Spinner,
} from 'tamagui';
import { useUserProfile, useUpdateProfile, useInvalidateProfile } from '../../../lib/hooks/useUserProfile';
import { supabase } from '../../../lib/supabase';
import { ProfilePictureUpload } from '../../components/ProfilePictureUpload';
import { uploadProfilePicture } from '../../../lib/storage';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const invalidateProfile = useInvalidateProfile();
  const [loading, setLoading] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const handleImageSelected = (file: File | null, localUri?: string) => {
    setProfileImageUri(localUri || null);
  };

  const handleSaveProfilePicture = async () => {
    if (!profileImageUri || profileImageUri === profile?.avatar_url) return;
    
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      const avatarUrl = await uploadProfilePicture(user.id, profileImageUri);
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;
      
      updateProfile({ avatar_url: avatarUrl });
      invalidateProfile();
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack f={1} bg="$background">
      {/* Loading Overlay */}
      {loading && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.7)"
          justifyContent="center"
          alignItems="center"
          zIndex={1000}
        >
          <YStack
            backgroundColor="$background"
            padding="$6"
            borderRadius="$4"
            alignItems="center"
            space="$4"
            maxWidth={250}
          >
            <Spinner size="large" color="$accent1" />
            <Text color="$color" fontSize="$5" textAlign="center">
              Saving...
            </Text>
          </YStack>
        </YStack>
      )}

      {/* Header */}
      <XStack 
        w="100%" 
        ai="center" 
        p="$4" 
        pt={insets.top + 4}
        pb="$4"
        bg="$background"
        position="relative"
      >
        <Group w="25%">
          <Button
            size="$3"
            circular
            onPress={() => router.back()}
            bg="transparent"
            color="$accent1"
          >
            <FontAwesome name="arrow-left" size={18} color={theme.accent1.val} />
          </Button>
        </Group>
        
        <Group f={1} ai="center">
          <H1 color="$color" size="$8" textAlign='center' numberOfLines={1}>Edit Profile</H1>
        </Group>
        
        <Group w="25%">
          {/* Empty space for balance */}
        </Group>
      </XStack>

      {/* Profile Data */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <YStack p="$4" gap="$3">
          {isLoading ? (
            <YStack f={1} ai="center" jc="center" space="$4">
              <Text color="$color" fontSize="$5">Loading profile...</Text>
            </YStack>
          ) : (
            <>
              {/* Profile Picture Upload */}
              <YStack ai="center" space="$3">
                <Text color="$color" fontSize="$4" fontWeight="500">
                  Profile Picture
                </Text>
                <ProfilePictureUpload
                  onImageSelected={handleImageSelected}
                  size={100}
                  currentImageUrl={profileImageUri || profile?.avatar_url}
                />
                {profileImageUri && profileImageUri !== profile?.avatar_url && (
                  <Button
                    size="$3"
                    onPress={handleSaveProfilePicture}
                    bg="$accent1"
                    color="white"
                  >
                    Save Picture
                  </Button>
                )}
              </YStack>
              
              {/* Full Name Field */}
              <YStack>
                <Button
                  onPress={() => router.push('/(tabs)/(profile)/edit-name')}
                  bg="transparent"
                  p="$5"
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius="$4"
                  justifyContent="space-between"
                  alignItems="center"
                  minHeight={80}
                >
                  <YStack>
                    <Text color="$gray11" fontSize="$3" mb="$2">
                      Full Name
                    </Text>
                    <Text color="$color" fontSize="$5" fontWeight="500">
                      {profile?.full_name || 'Add your name'}
                    </Text>
                  </YStack>
                  <FontAwesome name="chevron-right" size={18} color="#8E8E93" />
                </Button>
              </YStack>

              {/* Handle Field */}
              <YStack>
                <Button
                  onPress={() => router.push('/(tabs)/(profile)/edit-handle')}
                  bg="transparent"
                  p="$5"
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius="$4"
                  justifyContent="space-between"
                  alignItems="center"
                  minHeight={80}
                >
                  <YStack>
                    <Text color="$gray11" fontSize="$3" mb="$2">
                      Handle
                    </Text>
                    <Text color="$color" fontSize="$5" fontWeight="500">
                      @{profile?.handle || 'Add your handle'}
                    </Text>
                  </YStack>
                  <FontAwesome name="chevron-right" size={18} color="#8E8E93" />
                </Button>
              </YStack>

              {/* Bio Field */}
              <YStack>
                <Button
                  onPress={() => router.push('/(tabs)/(profile)/edit-bio')}
                  bg="transparent"
                  p="$5"
                  borderWidth={1}
                  borderColor="$gray5"
                  borderRadius="$4"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  minHeight={100}
                >
                  <YStack f={1}>
                    <Text color="$gray11" fontSize="$3" mb="$2">
                      Bio
                    </Text>
                    <Text color="$color" fontSize="$5" numberOfLines={3}>
                      {profile?.bio || 'Add a bio to tell people about yourself'}
                    </Text>
                  </YStack>
                  <FontAwesome name="chevron-right" size={18} color="#8E8E93" />
                </Button>
              </YStack>
            </>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
} 