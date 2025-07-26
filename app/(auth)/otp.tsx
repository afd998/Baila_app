import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button, H1, YStack, Text, useTheme, XStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPScreen() {
  const theme = useTheme();
  const { email } = useLocalSearchParams();

  async function handleSendOTP() {
    try {
      // TODO: Implement OTP sending
      router.push('/code-sent');
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <YStack f={1} ai="center" p="$4" space="$4" bg="$background">
        <XStack w="100%" jc="flex-start" mb="$4">
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

        <H1 col="$color" size="$10">Verify Email</H1>
        <Text col="$color" fontSize="$6" ta="center" mb="$4">
          We'll send you a verification code
        </Text>

        <Button
          size="$5"
          onPress={handleSendOTP}
          w="100%"
          bg="$accent1"
          color="white"
        >
          Send Verification Code
        </Button>

        <Button
          size="$5"
          onPress={() => router.push('/(auth)/password')}
          w="100%"
          bg="transparent"
          color="$accent1"
        >
          Use Password Instead
        </Button>
      </YStack>
    </SafeAreaView>
  );
} 