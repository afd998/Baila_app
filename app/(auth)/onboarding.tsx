import { useState } from 'react';
import { router } from 'expo-router';
import { Button, H1, Input, YStack, Text, useTheme, XStack, TextArea } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useForm, Controller } from 'react-hook-form';
import { ProfilePictureUpload } from '../components/ProfilePictureUpload';
import { uploadProfilePicture } from '../../lib/storage';

interface OnboardingFormData {
  fullName: string;
  bio: string;
}

export default function OnboardingScreen() {
  const [loading, setLoading] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<OnboardingFormData>({
    defaultValues: {
      fullName: '',
      bio: '',
    },
    mode: 'onChange',
  });

  const handleImageSelected = (file: File | null, localUri?: string) => {
    setProfileImageUri(localUri || null);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setLoading(true);
    try {
      // Get the current user to get their ID and email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Get email directly from the authenticated user
      const userEmail = user.email;
      
      console.log('User email from Supabase:', userEmail);
      
      if (!userEmail) {
        throw new Error('No email found for user');
      }

      let avatarUrl = null;

      // Upload profile picture if selected
      if (profileImageUri) {
        console.log('Uploading profile picture...');
        avatarUrl = await uploadProfilePicture(user.id, profileImageUri);
        console.log('Profile picture uploaded:', avatarUrl);
      }

      // Create or update user profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id, // This should now be a UUID
          email: userEmail,
          full_name: data.fullName.trim(),
          bio: data.bio.trim() || null, // Store as null if empty
          avatar_url: avatarUrl,
        }, {
          onConflict: 'id' // Specify the conflict resolution column
        });

      if (error) throw error;
      
      console.log('Profile created successfully, redirecting to home');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$6" bg="$background">
      <H1 col="$color" size="$10">Welcome!</H1>
      <Text col="$color" fontSize="$6" ta="center" mb="$4">
        Let's get to know you better
      </Text>
      
      {/* Profile Picture Upload */}
      <ProfilePictureUpload
        onImageSelected={handleImageSelected}
        size={120}
      />
      
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
            <Text color="$color" fontSize="$3" fontWeight="500">
              Full Name *
            </Text>
            <Input
              placeholder="Your Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              size="$4"
              boc={errors.fullName ? "$red10" : "$accent1"}
              col="$color"
              bg="$background"
              w="100%"
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
            />
            {errors.fullName && (
              <Text color="$red10" fontSize="$3">
                {errors.fullName.message}
              </Text>
            )}
          </YStack>
        )}
      />

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
            <Text color="$color" fontSize="$3" fontWeight="500">
              Bio (Optional)
            </Text>
            <TextArea
              placeholder="Tell us a bit about yourself..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              minHeight={80}
              textAlignVertical="top"
              size="$4"
              boc={errors.bio ? "$red10" : "$accent1"}
              col="$color"
              bg="$background"
              w="100%"
              autoCapitalize="sentences"
              autoCorrect={true}
            />
            <XStack justifyContent="space-between" alignItems="center">
              {errors.bio && (
                <Text color="$red10" fontSize="$3">
                  {errors.bio.message}
                </Text>
              )}
              <Text color="$gray11" fontSize="$3" ml="auto">
                {value.length}/200
              </Text>
            </XStack>
          </YStack>
        )}
      />
      
      <Button
        size="$5"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || loading}
        w="100%"
        bg={isValid ? "$accent1" : "$gray5"}
        color="white"
      >
        {loading ? 'Saving...' : 'Complete Setup'}
      </Button>
    </YStack>
  );
} 