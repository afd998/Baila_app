import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../supabaseClient';

export default function HomeScreen() {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-xl font-bold text-white mb-4">Welcome to Home Screen</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
