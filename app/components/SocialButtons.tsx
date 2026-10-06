import React from 'react';
import { Button, XStack, Text, Separator, useTheme, YStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';

// Must be listed under Supabase Auth > URL Configuration > Redirect URLs
// (e.g. supabasernapp://**).
const redirectTo = makeRedirectUri({ scheme: 'supabasernapp', path: 'callback' });

export default function SocialButtons() {
  const theme = useTheme();

  // Google sign-in goes through Supabase's OAuth flow, so Supabase issues the
  // session tokens. Google's own tokens can't be used as a Supabase session.
  async function handleGoogleSignIn() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== 'success') return;

      const { params, errorCode } = QueryParams.getQueryParams(result.url);
      if (errorCode) throw new Error(errorCode);

      const { access_token, refresh_token } = params;
      if (!access_token || !refresh_token) return;

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (sessionError) throw sessionError;
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Error signing in with Google');
    }
  }

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Sign in with Supabase using the Apple credential
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Apple sign in error:', error);
      alert('Error signing in with Apple');
    }
  }

  return (
    <YStack space="$2" ai="center" jc="center" w="100%">
      <XStack ai="center" space="$4" w="100%" my="$2">
        <Separator flex={1} />
        <Text col="$color" fontSize="$4">or</Text>
        <Separator flex={1} />
      </XStack>

      <Button
        size="$5"
        w="100%"
        variant="outlined"
        bg="$black"
        boc="$white"
        color="$white"
        icon={<FontAwesome name="google" size={20} color={theme.color.val} />}
        onPress={handleGoogleSignIn}
      >
        Continue with Google
      </Button>

      <Button
        size="$5"
        w="100%"
        variant="outlined"
        bg="$black"
        boc="$white"
        color="$white"
        icon={<FontAwesome name="facebook" size={20} color={theme.color.val} />}
        disabled
      >
        Continue with Facebook
      </Button>

      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: '100%', height: 50 }}
          onPress={handleAppleSignIn}
        />
      )}
    </YStack>
  );
} 