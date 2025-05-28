import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../supabaseClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert('Check your email for the confirmation link!');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Text className="text-2xl font-bold text-white mb-8">Welcome</Text>
      
      <TextInput
        className="w-full bg-gray-800 text-white p-4 rounded-lg mb-4"
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        className="w-full bg-gray-800 text-white p-4 rounded-lg mb-8"
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        className="w-full bg-blue-500 p-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-bold">
          {loading ? 'Loading...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleSignUp}
        disabled={loading}
        className="w-full bg-gray-500 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">
          {loading ? 'Loading...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
