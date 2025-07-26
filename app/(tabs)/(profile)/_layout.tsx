import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="followers"
        options={{
          title: 'Followers',
        }}
      />
      <Stack.Screen
        name="following"
        options={{
          title: 'Following',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  );
} 