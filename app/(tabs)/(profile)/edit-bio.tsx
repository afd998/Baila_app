import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import {
  YStack,
  XStack,
  Text,
  Button,
  Group,
  H1,
  TextArea,
  Spinner,
} from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { useUserProfile, useUpdateProfile, useInvalidateProfile } from '../../../lib/hooks/useUserProfile';
import { supabase } from '../../../lib/supabase';

interface EditBioFormData {
  bio: string;
}

export default function EditBioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const invalidateProfile = useInvalidateProfile();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<EditBioFormData>({
    defaultValues: {
      bio: profile?.bio || '',
    },
    mode: 'onChange',
  });

  const bioValue = watch('bio');

  const onSubmit = async (data: EditBioFormData) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      const { error } = await supabase
        .from('profiles')
        .update({ bio: data.bio.trim() || null })
        .eq('id', user.id);

      if (error) throw error;
      
      updateProfile({ bio: data.bio.trim() || null });
      invalidateProfile();
      
      router.back();
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
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
          <H1 color="$color" size="$8" textAlign='center' numberOfLines={1}>Edit Bio</H1>
        </Group>
        
        <Group w="25%">
          {/* Empty space for balance */}
        </Group>
      </XStack>

      {/* Form */}
      <YStack f={1} p="$4" gap="$6">
        {isLoading ? (
          <YStack f={1} ai="center" jc="center" space="$4">
            <Text color="$color" fontSize="$5">Loading profile...</Text>
          </YStack>
        ) : (
          <>
            {/* Instructions */}
            <YStack space="$3">
              <Text color="$color" fontSize="$5" fontWeight="600">
                Your Bio
              </Text>
              <Text color="$gray11" fontSize="$4" lineHeight="$5">
                Tell people about yourself. Share your interests, what you do, or anything else you'd like others to know.
              </Text>
            </YStack>
            
            {/* Bio Input */}
            <Controller
              name="bio"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: 'Bio must be less than 200 characters'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack space="$2" w="100%">
                  <TextArea
                    placeholder="Tell us a bit about yourself..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    minHeight={120}
                    textAlignVertical="top"
                    size="$4"
                    boc={errors.bio ? "$red10" : "$accent1"}
                    col="$color"
                    bg="$background"
                    w="100%"
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    autoFocus
                  />
                  <XStack justifyContent="space-between" alignItems="center">
                    {errors.bio && (
                      <Text color="$red10" fontSize="$3">
                        {errors.bio.message}
                      </Text>
                    )}
                    <Text color="$gray11" fontSize="$3" ml="auto">
                      {bioValue?.length || 0}/200
                    </Text>
                  </XStack>
                </YStack>
              )}
            />

            {/* Save Button */}
            <Button
              size="$5"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              w="100%"
              bg="$accent1"
              color="white"
            >
              {loading ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" color="white" />
                  <Text color="white" fontSize="$4">
                    Saving...
                  </Text>
                </XStack>
              ) : (
                'Save'
              )}
            </Button>
          </>
        )}
      </YStack>
    </YStack>
  );
} 