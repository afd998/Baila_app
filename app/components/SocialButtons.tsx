import React from 'react';
import { Button, XStack, Text, Separator, useTheme, YStack } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

export default function SocialButtons() {
  const theme = useTheme();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      redirectUri: makeRedirectUri({
        path: '/(auth)/callback'
      }),
      scopes: ['profile', 'email'],
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    }
  );

  async function handleGoogleSignIn() {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { access_token, refresh_token } = result.params;
        
        if (access_token && refresh_token) {
          await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
        }
      }
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