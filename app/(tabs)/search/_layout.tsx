import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="[id]/followers" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="[id]/following" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
} 