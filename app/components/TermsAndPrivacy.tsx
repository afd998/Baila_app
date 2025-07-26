import React from 'react';
import { Text, YStack } from 'tamagui';
import { Linking } from 'react-native';

export function TermsAndPrivacy() {
  return (
    <Text col="$color" ta="center" mt="$4" fontSize="$2">
      By continuing you are agreeing to our{' '}
      <Text
        col="$accent1"
        textDecorationLine="underline"
        onPress={() => Linking.openURL('https://bailaapp.com/terms')}
      >
        Terms of Service
      </Text>
      {' '}and{' '}
      <Text
        col="$accent1"
        textDecorationLine="underline"
        onPress={() => Linking.openURL('https://bailaapp.com/privacy')}
      >
        Privacy Policy
      </Text>
    </Text>
  );
}

export default TermsAndPrivacy; 