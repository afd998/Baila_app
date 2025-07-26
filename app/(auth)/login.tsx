import { useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Button, H1, Input, YStack, Text, useTheme, XStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TermsAndPrivacy } from '../components/TermsAndPrivacy';
import SocialButtons from '../components/SocialButtons';
import { useAuthStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';

export default function Login() {
  const router = useRouter();
  const segments = useSegments();
  const { email, setEmail } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const version = Number(Platform.Version);
      if (!isNaN(version) && version >= 18.4) {
        console.warn('Warning: iOS 18.4+ simulator has known network issues. Please use iOS 18.3 or lower.');
      }
    }
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  async function handleContinue() {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    // Enhanced email validation
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Rate limiting: prevent multiple requests within 30 seconds
    const now = Date.now();
    if (now - lastRequestTime < 30000) {
      alert('Please wait 30 seconds before requesting another code');
      return;
    }

    setLoading(true);
    setLastRequestTime(now);
    
    try {
      console.log('Attempting authentication with email:', email);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(), // Normalize email
        options: {
          shouldCreateUser: true, // Works for both new and existing users
          emailRedirectTo: undefined, // Disable magic links
        },
      });

      if (error) {
        console.error('Authentication error:', error);
        
        // Handle specific error types
        if (error.message.includes('429') || error.message.includes('Too many requests')) {
          alert('Too many requests. Please wait a moment before trying again.');
          return;
        }
        
        if (error.message.includes('422') || error.message.includes('Unprocessable Entity')) {
          alert('Invalid email format or configuration issue. Please check your email address.');
          return;
        }
        
        throw error;
      }
      
      console.log('Successfully sent OTP');
      router.push('/code-sent');
    } catch (error: any) {
      console.error('Error:', error);
      
      // Handle specific error types
      if (error.message && error.message.includes('429')) {
        alert('Too many requests. Please wait a moment before trying again.');
      } else if (error.message && error.message.includes('422')) {
        alert('Invalid email format or configuration issue. Please check your email address.');
      } else if (Platform.OS === 'ios' && Number(Platform.Version) >= 18.4) {
        alert('This is a known issue with iOS 18.4+ simulator. Please use iOS 18.3 or lower.');
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$4" bg="$background">
      <XStack w="100%" jc="flex-end" position="absolute" top={insets.top + 16} right="$4">
        <Button
          size="$3"
          circular
          onPress={() => router.replace('/')}
          bg="transparent"
          color="$accent1"
        >
          <FontAwesome name="times" size={20} color={theme.accent1.val} />
        </Button>
      </XStack>

      <H1 col="$color" size="$10">Sign In</H1>
      <Text col="$color" fontSize="$6" ta="center" mb="$4">
        Enter your email to continue
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        size="$4"
        boc="$accent1"
        col="$color"
        bg="$background"
        w="100%"
      />
      <Button
        size="$5"
        onPress={handleContinue}
        disabled={!isValidEmail(email) || loading}
        w="100%"
        bg={isValidEmail(email) ? "$accent1" : "$gray5"}
        color="white"
      >
        {loading ? 'Sending...' : 'Continue'}
      </Button>

      <Text col="$color" fontSize="$4" ta="center" my="$2">
        Or continue with
      </Text>

      <SocialButtons />

      <TermsAndPrivacy />
    </YStack>
  );
} 