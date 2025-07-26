import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { YStack, Text, Spinner } from 'tamagui';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    };
    handleAuthCallback();
  }, []);

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$4">
      <Spinner size="large" />
      <Text>Completing sign in...</Text>
    </YStack>
  );
} 