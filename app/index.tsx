import { YStack, Button, H1, Text, useTheme, Image } from 'tamagui';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <YStack f={1} ai="center" jc="center" p="$4" space="$4" bg="$background">
      <Image
        source={require('../assets/images/baila-logo.png')}
        width={200}
        height={200}
        resizeMode="contain"
      />
      <H1 col="$color" size="$10">Welcome</H1>
      <Text col="$color" fontSize="$6" ta="center" mb="$4">
        Sign in to your account or create a new one
      </Text>
      <Button
        size="$5"
        onPress={() => router.push('/(auth)/login')}
        w="100%"
        bg="$accent1"
        color="white"
      >
        Sign In
      </Button>
      <Button
        size="$5"
        onPress={() => router.push('/(auth)/signup')}
        w="100%"
        bg="transparent"
        color="$accent1"
      >
        Sign Up
      </Button>
    </YStack>
  );
} 