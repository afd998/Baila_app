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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Keep splash screen visible while we fetch resources
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Check if user has completed onboarding
  const checkUserProfile = async (user: any) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found - user needs onboarding
        setHasProfile(false);
        return false;
      } else if (error) {
        // Unexpected error
        console.error('Profile check error:', error);
        setHasProfile(false);
        return false;
      }

      // Check if profile is complete (has full_name)
      const isComplete = Boolean(profileData && profileData.full_name);
      setHasProfile(isComplete);
      return isComplete;
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
      return false;
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Get the session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // If user is authenticated, check their profile
        if (session?.user) {
          await checkUserProfile(session.user);
        }

        // Set up auth state change listener
        supabase.auth.onAuthStateChange(async (_event, session) => {
          setSession(session);
          if (session?.user) {
            await checkUserProfile(session.user);
          } else {
            setHasProfile(null);
          }
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

    // Handle navigation based on auth and profile status
    if (session) {
      if (hasProfile === true) {
        // User is authenticated and has completed onboarding
        if (segments[0] === undefined || segments[0] === '(auth)') {
          router.replace('/(tabs)');
        }
      } else if (hasProfile === false) {
        // User is authenticated but needs onboarding
        const isOnOnboardingPage = segments.includes('onboarding');
        if (!isOnOnboardingPage) {
          router.replace('/onboarding');
        }
      }
      // If hasProfile is null, we're still checking
    } else {
      // No session - user needs to authenticate
      if (segments[0] !== '(auth)') {
        router.replace('/login');
      }
    }
  }, [session, hasProfile, segments, isReady]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config} defaultTheme={colorScheme || 'light'}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Slot />
        </GestureHandlerRootView>
      </TamaguiProvider>
    </QueryClientProvider>
  );
} 