import { YStack, Button, H1, Text, Theme, XStack, useTheme, Group } from 'tamagui';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Theme name="dark">
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
            <Button
              size="$3"
              circular
              onPress={() => router.back()}
              bg="transparent"
              color="$accent1"
            >
              <FontAwesome name="arrow-left" size={20} color={theme.accent1.val} />
            </Button>
          </Group>
          
          <Group w="33%">
            <Text 
              color="$color" 
              fontSize="$5" 
              textAlign='center'
              bg="$background"
              fontWeight="bold"
            >
              Notifications
            </Text>
          </Group>
          
          <Group w="33%">
            <XStack space="$2" ml="auto">
              <Button
                size="$3"
                circular
                onPress={() => router.push('/settings')}
                bg="transparent"
                color="$accent1"
              >
                <FontAwesome name="cog" size={18} color={theme.accent1.val} />
              </Button>
            </XStack>
          </Group>
        </XStack>

        {/* Main Content */}
        <YStack f={1} p="$4" space="$4">
          <Text color="$color" fontSize="$6" mb="$4">
            Your notifications will appear here
          </Text>
          
          {/* Sample notifications */}
          <YStack space="$3">
            <XStack p="$3" bg="$gray8" borderRadius="$3" space="$3" ai="center">
              <FontAwesome name="info-circle" size={16} color={theme.accent1.val} />
              <YStack f={1}>
                <Text color="$color" fontSize="$4" fontWeight="bold">Welcome!</Text>
                <Text color="$gray11" fontSize="$3">Thanks for joining our app</Text>
              </YStack>
            </XStack>
            
            <XStack p="$3" bg="$gray8" borderRadius="$3" space="$3" ai="center">
              <FontAwesome name="bell" size={16} color={theme.accent1.val} />
              <YStack f={1}>
                <Text color="$color" fontSize="$4" fontWeight="bold">New Feature</Text>
                <Text color="$gray11" fontSize="$3">Check out our latest updates</Text>
              </YStack>
            </XStack>
            
            <XStack p="$3" bg="$gray8" borderRadius="$3" space="$3" ai="center">
              <FontAwesome name="star" size={16} color={theme.accent1.val} />
              <YStack f={1}>
                <Text color="$color" fontSize="$4" fontWeight="bold">Rate Us</Text>
                <Text color="$gray11" fontSize="$3">We'd love to hear your feedback</Text>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </YStack>
    </Theme>
  );
} 