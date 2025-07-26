import { YStack, Button, H1, Text, XStack, useTheme, Group } from 'tamagui';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../lib/store';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { clearEmail } = useAuthStore();

  async function handleSignOut() {
    try {
      // Clear auth store
      clearEmail();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Force reload the app
      router.replace('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force navigation even if there's an error
      router.replace('/');
    }
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack 
        w="100%" 
        ai="center" 
        p="$4" 
        pt={insets.top + 16}
        pb="$4"
        bg="$background"
        position="relative"
      >
        <Group w="33%">
          {/* Empty space for balance */}
        </Group>
        
        <Group w="33%">
          <H1 color="$color" size="$6" textAlign='center' numberOfLines={1}>Dance Floor</H1>
        </Group>
        
        <Group w="33%">
          <XStack space="$2" ml="auto">
            <Button
              size="$3"
              circular
              onPress={() => router.push('/(tabs)/search')}
              bg="transparent"
              color="$accent1"
            >
              <FontAwesome name="search" size={18} color={theme.accent1.val} />
            </Button>
            <Button
              size="$3"
              circular
              onPress={() => router.push('/notifications')}
              bg="transparent"
              color="$accent1"
            >
              <FontAwesome name="bell" size={18} color={theme.accent1.val} />
            </Button>
          </XStack>
        </Group>
      </XStack>

      {/* Main Content */}
      <YStack f={1} ai="center" jc="center" p="$4" space="$4">
        <FontAwesome name="home" size={60} color={theme.accent1.val} />
        <H1 color="$color" size="$8">Welcome Home!</H1>
        <Text color="$color" fontSize="$6" ta="center" mb="$4">
          This is your home screen
        </Text>
      </YStack>
    </YStack>
  );
} 