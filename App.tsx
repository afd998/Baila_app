import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {        // Get the session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // Set up auth state change listener
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        // Add a small delay to show splash screen
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        {session ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
