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
  Input,
  Spinner,
} from 'tamagui';
import { useForm, Controller } from 'react-hook-form';
import { useUserProfile, useUpdateProfile, useInvalidateProfile } from '../../../lib/hooks/useUserProfile';
import { supabase } from '../../../lib/supabase';

interface EditNameFormData {
  fullName: string;
}

export default function EditNameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const invalidateProfile = useInvalidateProfile();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<EditNameFormData>({
    defaultValues: {
      fullName: profile?.full_name || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: EditNameFormData) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.fullName.trim() })
        .eq('id', user.id);

      if (error) throw error;
      
      updateProfile({ full_name: data.fullName.trim() });
      invalidateProfile();
      
      router.back();
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
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
          <H1 color="$color" size="$8" textAlign='center' numberOfLines={1}>Edit Name</H1>
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
                Your Name
              </Text>
              <Text color="$gray11" fontSize="$4" lineHeight="$5">
                This is how your name will appear to other users. Use your real name so friends can find you.
              </Text>
            </YStack>
            
            {/* Name Input */}
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: 'Please enter your name',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name must be less than 50 characters'
                },
                pattern: {
                  value: /^[a-zA-Z\s'-]+$/,
                  message: 'Please enter a valid name'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack space="$2" w="100%">
                  <Input
                    placeholder="Your Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    size="$5"
                    boc={errors.fullName ? "$red10" : "$accent1"}
                    col="$color"
                    bg="$background"
                    w="100%"
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoFocus
                  />
                  {errors.fullName && (
                    <Text color="$red10" fontSize="$3">
                      {errors.fullName.message}
                    </Text>
                  )}
                </YStack>
              )}
            />

            {/* Save Button */}
            <Button
              size="$5"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading}
              w="100%"
              bg={isValid ? "$accent1" : "$gray5"}
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