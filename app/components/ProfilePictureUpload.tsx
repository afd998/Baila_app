import React, { useState } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { YStack, XStack, Button, Text, Image, useTheme, Circle } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  onImageSelected: (file: File | null, localUri?: string) => void;
  size?: number;
}

export function ProfilePictureUpload({ 
  currentImageUrl, 
  onImageSelected, 
  size = 120 
}: ProfilePictureUploadProps) {
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      try {
        // Request camera permissions
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera and photo library permissions to make this work! Please enable them in Settings.',
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

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setLocalImageUri(asset.uri);
        onImageSelected(null, asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setLocalImageUri(asset.uri);
        onImageSelected(null, asset.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeImage = () => {
    setLocalImageUri(null);
    onImageSelected(null);
  };

  const displayImageUri = localImageUri || currentImageUrl;

  // Add cache busting for the display image
  const imageUrlWithCacheBust = displayImageUri 
    ? `${displayImageUri}${displayImageUri.includes('?') ? '&' : '?'}v=${Date.now()}`
    : displayImageUri;

  return (
    <YStack space="$3" alignItems="center">
      <YStack position="relative">
        {displayImageUri ? (
          <Image
            source={{ uri: imageUrlWithCacheBust || '' }}
            width={size}
            height={size}
            borderRadius={size / 2}
            borderWidth={3}
            borderColor="$accent1"
          />
        ) : (
          <Circle
            size={size}
            backgroundColor="$gray5"
            borderWidth={3}
            borderColor="$accent1"
            justifyContent="center"
            alignItems="center"
          >
            <FontAwesome name="user" size={size * 0.4} color="#8E8E93" />
          </Circle>
        )}
        
        {/* Upload overlay button */}
        <Button
          position="absolute"
          bottom={0}
          right={0}
          size="$3"
          circular
          bg="$accent1"
          color="white"
          onPress={showImageOptions}
          pressStyle={{ scale: 0.9 }}
        >
          <FontAwesome name="camera" size={14} color="white" />
        </Button>
      </YStack>

      <XStack space="$2">
        <Button
          size="$3"
          bg="transparent"
          color="$accent1"
          onPress={showImageOptions}
        >
          <XStack space="$2" alignItems="center">
            <FontAwesome name="upload" size={14} color={theme.accent1.val} />
            <Text color="$accent1" fontSize="$3">
              {displayImageUri ? 'Change Photo' : 'Add Photo'}
            </Text>
          </XStack>
        </Button>

        {displayImageUri && (
          <Button
            size="$3"
            bg="transparent"
            color="$red10"
            onPress={removeImage}
          >
            <XStack space="$2" alignItems="center">
              <FontAwesome name="trash" size={14} color={theme.red10.val} />
              <Text color="$red10" fontSize="$3">
                Remove
              </Text>
            </XStack>
          </Button>
        )}
      </XStack>
    </YStack>
  );
}

export default ProfilePictureUpload; 