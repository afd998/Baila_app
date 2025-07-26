import React, { useState } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { YStack, XStack, Button, Text, Image, useTheme, ScrollView } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  fileName?: string;
}

interface DanceMediaUploadProps {
  mediaItems: MediaItem[];
  onMediaChange: (items: MediaItem[]) => void;
  maxItems?: number;
}

export function DanceMediaUpload({ 
  mediaItems = [], 
  onMediaChange,
  maxItems = 5 
}: DanceMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      try {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'We need camera and photo library permissions to add media to your dance session.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      } catch (error) {
        console.error('Permission request error:', error);
        Alert.alert('Error', 'Failed to request permissions. Please try again.');
        return false;
      }
    }
    return true;
  };

  const pickMedia = async () => {
    if (mediaItems.length >= maxItems) {
      Alert.alert('Limit Reached', `You can only add up to ${maxItems} media items.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'], // Modern syntax for photos and videos
        allowsEditing: false, // Disable editing when selecting multiple
        quality: 0.8,
        base64: false,
        allowsMultipleSelection: true,
        selectionLimit: maxItems - mediaItems.length,
        orderedSelection: true, // Show numbered badges for selection order
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newItems: MediaItem[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          fileName: asset.fileName || `media-${Date.now()}-${index}`,
        }));

        onMediaChange([...mediaItems, ...newItems]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media. Please try again.');
    }
  };

  const takePhoto = async () => {
    if (mediaItems.length >= maxItems) {
      Alert.alert('Limit Reached', `You can only add up to ${maxItems} media items.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true, // Keep editing for single camera capture
        quality: 0.8,
        base64: false,
        videoMaxDuration: 60, // Limit videos to 60 seconds
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newItem: MediaItem = {
          id: `${Date.now()}`,
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          fileName: asset.fileName || `media-${Date.now()}`,
        };

        onMediaChange([...mediaItems, newItem]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showMediaOptions = () => {
    Alert.alert(
      'Add Media',
      'Choose an option',
      [
        { text: 'Take Photo/Video', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickMedia },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeMedia = (id: string) => {
    const updatedItems = mediaItems.filter(item => item.id !== id);
    onMediaChange(updatedItems);
  };

  const renderMediaItem = (item: MediaItem, index: number) => (
    <YStack key={item.id} position="relative" margin="$2">
      <Image
        source={{ uri: item.uri }}
        width={100}
        height={100}
        borderRadius="$3"
        backgroundColor="$gray5"
      />
      
      {/* Video indicator */}
      {item.type === 'video' && (
        <YStack
          position="absolute"
          top="$2"
          left="$2"
          backgroundColor="rgba(0,0,0,0.7)"
          borderRadius="$2"
          padding="$1"
        >
          <FontAwesome name="play" size={12} color="white" />
        </YStack>
      )}

      {/* Remove button */}
      <TouchableOpacity
        onPress={() => removeMedia(item.id)}
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: theme.red10?.val || '#FF4444',
          borderRadius: 12,
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FontAwesome name="times" size={12} color="white" />
      </TouchableOpacity>
    </YStack>
  );

  return (
    <YStack space="$4">
      {/* Add Media Button */}
      <TouchableOpacity onPress={showMediaOptions}>
        <YStack 
          padding="$4" 
          borderWidth={2} 
          borderColor="$borderColor" 
          borderRadius="$4"
          borderStyle="dashed"
          alignItems="center"
          justifyContent="center"
          minHeight={120}
          backgroundColor="$gray2"
        >
          <FontAwesome 
            name="plus" 
            size={24} 
            color={theme.accent1?.val || '#007AFF'} 
          />
          <Text color="$accent1" fontSize="$4" fontWeight="500" marginTop="$2">
            Add Photos or Videos
          </Text>
          <Text color="$gray11" fontSize="$3" textAlign="center" marginTop="$1">
            Tap to add media from camera or library
          </Text>
        </YStack>
      </TouchableOpacity>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
        <YStack space="$3">
          <Text color="$color" fontSize="$4" fontWeight="500">
            Added Media ({mediaItems.length}/{maxItems})
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack padding="$2">
              {mediaItems.map((item, index) => renderMediaItem(item, index))}
            </XStack>
          </ScrollView>
        </YStack>
      )}

      {/* Helper Text */}
      <Text color="$gray11" fontSize="$3" textAlign="center">
        You can add up to {maxItems} photos or videos to showcase your dance session
      </Text>
    </YStack>
  );
}