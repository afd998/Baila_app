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
import { Filter } from 'bad-words';

interface EditHandleFormData {
  handle: string;
}

export default function EditHandleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const invalidateProfile = useInvalidateProfile();
  const [loading, setLoading] = useState(false);
  const [handleAvailability, setHandleAvailability] = useState<'checking' | 'available' | 'taken' | null>(null);
  const filter = new Filter();

  // Reserved handles that should be blocked
  const reservedHandles = ['admin', 'support', 'help', 'info', 'contact', 'about', 'terms', 'privacy'];

  const checkHandleAvailability = async (handle: string) => {
    if (!handle || handle.length < 2) {
      setHandleAvailability(null);
      return;
    }

    setHandleAvailability('checking');

    try {
      // Check if handle is reserved
      if (reservedHandles.includes(handle.toLowerCase())) {
        setHandleAvailability('taken');
        return;
      }

      // Check if handle contains bad words
      if (filter.isProfane(handle)) {
        setHandleAvailability('taken');
        return;
      }

      // Check database availability (only if handle changed from current)
      if (handle !== profile?.handle) {
        const { data, error } = await supabase
          .from('profiles')
          .select('handle')
          .eq('handle', handle.toLowerCase())
          .single();

        if (error && error.code === 'PGRST116') {
          // Handle is available
          setHandleAvailability('available');
        } else if (data) {
          // Handle is taken
          setHandleAvailability('taken');
        } else {
          setHandleAvailability('available');
        }
      } else {
        // Same as current handle
        setHandleAvailability('available');
      }
    } catch (error) {
      console.error('Error checking handle availability:', error);
      setHandleAvailability('taken');
    }
  };

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<EditHandleFormData>({
    defaultValues: {
      handle: profile?.handle || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: EditHandleFormData) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      const { error } = await supabase
        .from('profiles')
        .update({ handle: data.handle.trim().toLowerCase() })
        .eq('id', user.id);

      if (error) throw error;
      
      updateProfile({ handle: data.handle.trim().toLowerCase() });
      invalidateProfile();
      
      router.back();
    } catch (error) {
      console.error('Error updating handle:', error);
      alert('Failed to update handle');
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
          <H1 color="$color" size="$8" textAlign='center' numberOfLines={1}>Edit Handle</H1>
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
                Your Handle
              </Text>
              <Text color="$gray11" fontSize="$4" lineHeight="$5">
                Choose a unique handle that represents you. This will be your @username and can't be changed later.
              </Text>
            </YStack>
            
            {/* Handle Input */}
            <Controller
              name="handle"
              control={control}
              rules={{
                required: 'Please enter a handle',
                minLength: {
                  value: 2,
                  message: 'Handle must be at least 2 characters'
                },
                maxLength: {
                  value: 30,
                  message: 'Handle must be less than 30 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Handle can only contain letters, numbers, and underscores'
                },
                validate: (value) => {
                  if (handleAvailability === 'taken') {
                    return 'This handle is not available';
                  }
                  return true;
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack space="$2" w="100%">
                  <Input
                    placeholder="your_handle"
                    value={value}
                    onChangeText={(text) => {
                      const normalizedText = text.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      onChange(normalizedText);
                      // Debounce the availability check
                      setTimeout(() => checkHandleAvailability(normalizedText), 500);
                    }}
                    onBlur={onBlur}
                    size="$5"
                    boc={
                      errors.handle ? "$red10" : 
                      handleAvailability === 'available' ? "$green10" :
                      handleAvailability === 'taken' ? "$red10" : "$accent1"
                    }
                    col="$color"
                    bg="$background"
                    w="100%"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                  <XStack space="$2" alignItems="center">
                    {errors.handle && (
                      <Text color="$red10" fontSize="$3">
                        {errors.handle.message}
                      </Text>
                    )}
                    {handleAvailability === 'checking' && (
                      <XStack space="$2" alignItems="center">
                        <Spinner size="small" color="$gray11" />
                        <Text color="$gray11" fontSize="$3">Checking...</Text>
                      </XStack>
                    )}
                    {handleAvailability === 'available' && !errors.handle && (
                      <XStack space="$2" alignItems="center">
                        <FontAwesome name="check-circle" size={14} color="#4CAF50" />
                        <Text color="$green10" fontSize="$3">Available</Text>
                      </XStack>
                    )}
                    {handleAvailability === 'taken' && !errors.handle && (
                      <XStack space="$2" alignItems="center">
                        <FontAwesome name="times-circle" size={14} color="#F44336" />
                        <Text color="$red10" fontSize="$3">Not available</Text>
                      </XStack>
                    )}
                  </XStack>
                </YStack>
              )}
            />

            {/* Save Button */}
            <Button
              size="$5"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading || handleAvailability !== 'available'}
              w="100%"
              bg={isValid && handleAvailability === 'available' ? "$accent1" : "$gray5"}
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