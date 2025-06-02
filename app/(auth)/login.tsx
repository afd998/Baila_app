import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button, H1, Input, YStack, useTheme } from 'tamagui';
import { AuthError } from '@supabase/supabase-js';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  async function handleSignIn() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.replace('/');
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof AuthError) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$4">
      <H1>Sign In</H1>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        onPress={handleSignIn}
        disabled={loading}
        w="100%"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Button
        onPress={() => router.replace('/')}
        w="100%"
        variant="outlined"
      >
        Back to Welcome
      </Button>
    </YStack>
  );
} 