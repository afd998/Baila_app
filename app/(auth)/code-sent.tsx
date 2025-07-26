import { useState } from 'react';
import { router } from 'expo-router';
import { Button, H1, YStack, Text, useTheme, XStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../lib/store';
import { OTPInput } from '../components/OTPInput';
import { supabase } from '../../lib/supabase';

export default function CodeSentScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { email } = useAuthStore();

  async function handleVerifyCode() {
    setLoading(true);
    try {
      console.log('Verifying OTP for email:', email, 'with code:', code);
      
      // First verify the OTP code
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email',
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw error;
      }

      console.log('OTP verified successfully, user is now authenticated');

      // Now that the user is authenticated, get their info
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current authenticated user:', user);
      
      if (userError) {
        console.error('User lookup error:', userError);
        throw userError;
      }

      if (!user) {
        throw new Error('No authenticated user found after OTP verification');
      }

      console.log('Checking profile for user:', user.email);

      // Check if user has completed onboarding by looking for a profile entry
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

      // Handle profile lookup result
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.log('📝 New user detected (no profile found) - redirecting to onboarding');
          router.replace('/onboarding');
          return;
        } else {
          // This is an actual unexpected error
          console.error('Unexpected profile lookup error:', profileError);
          throw profileError;
        }
      }

      // User has a profile, check if onboarding is complete
      if (profileData && profileData.full_name) {
        console.log('✅ Existing user detected (profile found) - redirecting to home');
        router.replace('/(tabs)/home');
      } else {
        console.log('📝 User has profile but incomplete - redirecting to onboarding');
        router.replace('/onboarding');
      }
    } catch (error: any) {
      console.error('Full error details:', error);
      
      // More specific error messages
      if (error.message && error.message.includes('Invalid OTP')) {
        alert('Invalid code. Please check the code and try again.');
      } else if (error.message && error.message.includes('expired')) {
        alert('Code has expired. Please request a new code.');
      } else if (error.message && error.message.includes('400')) {
        alert('Invalid request. Please try again.');
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      alert('New code sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$4" bg="$background">
      <XStack w="100%" jc="flex-start" position="absolute" top={insets.top + 16} left="$4">
        <Button
          size="$3"
          circular
          onPress={() => router.back()}
          bg="transparent"
          color="$accent1"
        >
          <FontAwesome name="arrow-left" size={20} color={theme.accent1.val} />
        </Button>
      </XStack>

      <H1 col="$color" size="$8">We sent you a code</H1>
      <Text col="$color" fontSize="$6" ta="center" mb="$4">
        Please enter the 6-digit code we sent to {email}
      </Text>
      <OTPInput value={code} onChange={setCode} />
      <Button
        size="$5"
        onPress={handleVerifyCode}
        disabled={code.length !== 6 || loading}
        w="100%"
        bg={code.length === 6 ? "$accent1" : "$gray5"}
        color="white"
      >
        {loading ? 'Verifying...' : 'Verify Code'}
      </Button>
      <Button
        size="$5"
        onPress={handleResendCode}
        disabled={loading}
        w="100%"
        bg="transparent"
        color="$accent1"
      >
        Get a new code
      </Button>
    </YStack>
  );
} 