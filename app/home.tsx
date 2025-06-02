import { YStack, Button, H1, Text, Theme } from 'tamagui';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    router.replace('/');
  }

  return (
    <Theme name="dark">
      <YStack f={1} ai="center" jc="center" p="$4" space="$4" backgroundColor="$background">
        <H1 color="$color" size="$10">Welcome to Home</H1>
        <Text color="$color" fontSize="$6" verticalAlign="center" mb="$4" >
          You are signed in
        </Text>
        <Button
          size="$5"
          theme="active"
          onPress={handleSignOut}
          w="100%"
        >
          Sign Out
        </Button>
      </YStack>
    </Theme>
  );
} 