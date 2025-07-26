import { useState } from 'react';
import { router } from 'expo-router';
import { Button, H1, Input, YStack, Text, useTheme, XStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { useAuthStore } from '../../lib/store';

export default function PasswordScreen() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { email } = useAuthStore();

  async function handleSignIn() {
    setLoading(true);
    try {
      // TODO: Implement password sign in
      router.replace('/');
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

      <H1 col="$color" size="$8">Enter your password</H1>
      <Text col="$color" fontSize="$6" ta="center" mb="$4">
        Log in with: {email}
      </Text>
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        size="$4"
        boc="$accent1"
        col="$color"
        bg="$background"
        w="100%"
      />
      <Text
        col="$accent1"
        fontSize="$3"
        alignSelf="flex-start"
        onPress={() => setModalOpen(true)}
      >
        Forgot your password?
      </Text>
      <Button
        size="$5"
        onPress={handleSignIn}
        disabled={!password || loading}
        w="100%"
        bg={password ? "$accent1" : "$gray5"}
        color="white"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <ForgotPasswordModal open={modalOpen} onOpenChange={setModalOpen} />
    </YStack>
  );
} 