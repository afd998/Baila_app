import React from 'react';
import { YStack, XStack, Text, Button, useTheme } from 'tamagui';
import { Modal, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface UnfollowModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profileName: string;
  isLoading?: boolean;
}

export const UnfollowModal: React.FC<UnfollowModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  profileName,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <YStack
          bg="$background"
          borderRadius="$4"
          p="$4"
          space="$4"
          maxWidth={300}
          width="100%"
        >
        {/* Header */}
        <YStack ai="center" space="$2">
          <FontAwesome 
            name="user-times" 
            size={40} 
            color={theme.red10.val} 
          />
          <Text color="$color" fontSize="$5" fontWeight="600" ta="center">
            Unfollow @{profileName}?
          </Text>
        </YStack>

        {/* Message */}
        <Text color="$gray11" fontSize="$4" ta="center" px="$2">
          Their posts will no longer appear in your feed.
        </Text>

        {/* Buttons */}
        <YStack space="$2">
          <Button
            size="$4"
            onPress={onConfirm}
            bg="$red10"
            color="white"
            disabled={isLoading}
          >
            <XStack space="$2" alignItems="center">
              <FontAwesome name="user-times" size={14} color="white" />
              <Text color="white" fontSize="$4">
                {isLoading ? 'Unfollowing...' : 'Unfollow'}
              </Text>
            </XStack>
          </Button>
          
          <Button
            size="$4"
            onPress={onClose}
            bg="transparent"
            color="$gray11"
            borderWidth={1}
            borderColor="$gray8"
            disabled={isLoading}
          >
            <Text color="$gray11" fontSize="$4">Cancel</Text>
          </Button>
        </YStack>
        </YStack>
      </View>
    </Modal>
  );
}; 