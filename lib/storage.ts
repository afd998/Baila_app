import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

export const uploadProfilePicture = async (
  userId: string,
  imageUri: string
): Promise<string | null> => {
  try {
    // Convert image to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file extension from URI
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;
    const filePath = fileName; // No subfolder, store directly in avatars bucket

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const deleteProfilePicture = async (userId: string): Promise<void> => {
  try {
    // List all files for this user and delete them
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list('', {
        search: `profile-${userId}-`,
      });

    if (listError) {
      console.error('List error:', listError);
      throw listError;
    }

    if (files && files.length > 0) {
      const fileNames = files.map(file => file.name);
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(fileNames);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }
    }
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
}; 