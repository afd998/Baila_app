import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';

// Keep splash screen visible while we fetch resources
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Get the session
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

  useEffect(() => {
    if (!isReady) return;

    // If we have a session and we're on the welcome page, go to home
    if (session && segments[0] === undefined) {
      router.replace('/home');
    }
  }, [session, segments, isReady]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme!}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
} 