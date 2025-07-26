import { YStack, H1, Text, XStack, useTheme, Group } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
          <H1 color="$color" size="$8" textAlign='center'>Notifications</H1>
        </Group>
        
        <Group w="33%">
          {/* Empty space for balance */}
        </Group>
      </XStack>

      {/* Notifications List */}
      <YStack f={1} p="$4" space="$3">
        {/* Sample notifications */}
        <YStack p="$4" bg="$background" borderRadius="$4" borderWidth={1} borderColor="$accent1">
          <Text color="$color" fontSize="$5" fontWeight="bold">New Message</Text>
          <Text color="$gray11" fontSize="$4">You have a new message from John</Text>
          <Text color="$gray10" fontSize="$3" mt="$2">2 minutes ago</Text>
        </YStack>

        <YStack p="$4" bg="$background" borderRadius="$4" borderWidth={1} borderColor="$accent1">
          <Text color="$color" fontSize="$5" fontWeight="bold">Event Reminder</Text>
          <Text color="$gray11" fontSize="$4">Your meeting starts in 30 minutes</Text>
          <Text color="$gray10" fontSize="$3" mt="$2">15 minutes ago</Text>
        </YStack>

        <YStack p="$4" bg="$background" borderRadius="$4" borderWidth={1} borderColor="$accent1">
          <Text color="$color" fontSize="$5" fontWeight="bold">System Update</Text>
          <Text color="$gray11" fontSize="$4">App has been updated to version 2.1</Text>
          <Text color="$gray10" fontSize="$3" mt="$2">1 hour ago</Text>
        </YStack>
      </YStack>
    </YStack>
  );
} 