import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button, H1, Input, YStack } from 'tamagui';
import { AuthError } from '@supabase/supabase-js';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      alert('Check your email for the confirmation link!');
      router.replace('/');
    } catch (error) {
      console.error('Error signing up:', error);
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
      <H1>Sign Up</H1>
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
        onPress={handleSignUp}
        disabled={loading}
        w="100%"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
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