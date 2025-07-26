import React from 'react';
import { Button, Dialog, H2, Text, YStack, XStack } from 'tamagui';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'tamagui';

export function ForgotPasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const theme = useTheme();

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space
          mx="$4"
          w="90%"
        >
          <XStack w="100%" jc="flex-end" position="absolute" top="$2" right="$2">
            <Button
              size="$3"
              circular
              onPress={() => onOpenChange(false)}
              bg="transparent"
              color="$accent1"
            >
              <FontAwesome name="times" size={20} color={theme.accent1.val} />
            </Button>
          </XStack>

          <Dialog.Title>Faster logins with one time code</Dialog.Title>
          <Dialog.Description>
            Get a one-time code sent to your email for quick and secure access.
          </Dialog.Description>
          <YStack space="$4" mt="$4">
            <Button
              size="$5"
              onPress={() => {
                onOpenChange(false);
                router.push('/code-sent');
              }}
              bg="$accent1"
              color="white"
            >
              Get one time code
            </Button>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
} 