import { YStack, H1, Text, XStack, useTheme, Group, Button, ScrollView, Separator, Sheet } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../lib/store';
import { useUserProfile, useUpdateProfile } from '../lib/hooks/useUserProfile';

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { clearEmail } = useAuthStore();
  const { data: userProfile } = useUserProfile();
  const updateProfile = useUpdateProfile();

  async function handleSignOut() {
    try {
      clearEmail();
      await supabase.auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      router.replace('/');
    }
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack 
        w="100%" 
        ai="center" 
        p="$4" 
        pt={insets.top + 16}
        pb="$4"
        bg="$background"
        position="relative"
      >
        <Group w="33%">
          <Button
            size="$3"
            circular
            onPress={() => router.back()}
            bg="transparent"
            color="$accent1"
          >
            <FontAwesome name="arrow-left" size={18} color={theme.accent1.val} />
          </Button>
        </Group>
        
        <Group w="33%">
          <H1 color="$color" size="$8" textAlign='center'>Settings</H1>
        </Group>
        
        <Group w="33%">
          {/* Empty space for balance */}
        </Group>
      </XStack>

      {/* Scrollable Main Content */}
      <ScrollView 
        f={1} 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <YStack p="$4" space="$6">
          {/* Account Section */}
          <YStack space="$4">
            <H1 color="$color" size="$6">Account</H1>
            
            <YStack space="$2">
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => console.log('Edit Profile')}
              >
                <XStack space="$3" alignItems="center">
                  <FontAwesome name="user" size={16} color={theme.color.val} />
                  <Text color="$color" fontSize="$4">Edit Profile</Text>
                </XStack>
              </Button>
              
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => setShowPrivacyModal(true)}
              >
                <XStack space="$3" alignItems="center" justifyContent="space-between" w="100%">
                  <XStack space="$3" alignItems="center">
                    <FontAwesome name="shield" size={16} color={theme.color.val} />
                    <Text color="$color" fontSize="$4">Account Privacy</Text>
                  </XStack>
                  <Text color="$gray11" fontSize="$4">
                    {userProfile?.private ? 'Private' : 'Public'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>

          <Separator />

          {/* Preferences Section */}
          <YStack space="$4">
            <H1 color="$color" size="$6">Preferences</H1>
            
            <YStack space="$2">
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <XStack space="$3" alignItems="center" justifyContent="space-between" w="100%">
                  <XStack space="$3" alignItems="center">
                    <FontAwesome name="bell" size={16} color={theme.color.val} />
                    <Text color="$color" fontSize="$4">Push Notifications</Text>
                  </XStack>
                  <FontAwesome 
                    name={notificationsEnabled ? "toggle-on" : "toggle-off"} 
                    size={20} 
                    color={notificationsEnabled ? theme.accent1.val : "#8E8E93"} 
                  />
                </XStack>
              </Button>
              
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              >
                <XStack space="$3" alignItems="center" justifyContent="space-between" w="100%">
                  <XStack space="$3" alignItems="center">
                    <FontAwesome name="moon-o" size={16} color={theme.color.val} />
                    <Text color="$color" fontSize="$4">Dark Mode</Text>
                  </XStack>
                  <FontAwesome 
                    name={darkModeEnabled ? "toggle-on" : "toggle-off"} 
                    size={20} 
                    color={darkModeEnabled ? theme.accent1.val : "#8E8E93"} 
                  />
                </XStack>
              </Button>
              
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => console.log('Language Settings')}
              >
                <XStack space="$3" alignItems="center">
                  <FontAwesome name="globe" size={16} color={theme.color.val} />
                  <Text color="$color" fontSize="$4">Language</Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>

          <Separator />

          {/* Support Section */}
          <YStack space="$4">
            <H1 color="$color" size="$6">Support</H1>
            
            <YStack space="$2">
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => console.log('Help Center')}
              >
                <XStack space="$3" alignItems="center">
                  <FontAwesome name="question-circle" size={16} color={theme.color.val} />
                  <Text color="$color" fontSize="$4">Help Center</Text>
                </XStack>
              </Button>
              
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => console.log('Contact Support')}
              >
                <XStack space="$3" alignItems="center">
                  <FontAwesome name="envelope" size={16} color={theme.color.val} />
                  <Text color="$color" fontSize="$4">Contact Support</Text>
                </XStack>
              </Button>
              
              <Button
                size="$4"
                bg="transparent"
                color="$color"
                justifyContent="flex-start"
                onPress={() => console.log('About')}
              >
                <XStack space="$3" alignItems="center">
                  <FontAwesome name="info-circle" size={16} color={theme.color.val} />
                  <Text color="$color" fontSize="$4">About</Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>

          <Separator />

          {/* Sign Out Section */}
          <YStack space="$4">
            <Button
              size="$5"
              bg="$red10"
              color="white"
              onPress={handleSignOut}
              w="100%"
            >
              <XStack space="$3" alignItems="center" justifyContent="center">
                <FontAwesome name="sign-out" size={16} color="white" />
                <Text color="white" fontSize="$5" fontWeight="600">
                  Sign Out
                </Text>
              </XStack>
            </Button>
          </YStack>

          <Separator />

          {/* App Info */}
          <YStack space="$2" ai="center">
            <Text color="$gray11" fontSize="$3">App Version 1.0.0</Text>
            <Text color="$gray11" fontSize="$3">© 2024 Your App Name</Text>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Privacy Settings Modal */}
      <Sheet
        modal
        animation="medium"
        open={showPrivacyModal}
        onOpenChange={setShowPrivacyModal}
        snapPoints={[100]}
        position={0}
        dismissOnSnapToBottom={false}
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.ScrollView>
            <YStack p="$4" pt={insets.top + 16} space="$4">
              {/* Header */}
              <XStack ai="center" jc="space-between">
                <H1 color="$color" size="$6">Account Privacy</H1>
                <Button
                  size="$3"
                  circular
                  onPress={() => setShowPrivacyModal(false)}
                  bg="transparent"
                  color="$color"
                >
                  <FontAwesome name="times" size={18} color={theme.color.val} />
                </Button>
              </XStack>

              {/* Explanation */}
              <YStack space="$3">
                <Text color="$gray11" fontSize="$4" lineHeight="$5">
                  Control who can see your profile and content.
                </Text>
                
                <YStack space="$2" p="$3" bg="$gray2" borderRadius="$3">
                  <XStack space="$2" ai="center">
                    <FontAwesome name="globe" size={16} color={theme.accent1.val} />
                    <Text color="$color" fontSize="$4" fontWeight="600">Public</Text>
                  </XStack>
                  <Text color="$gray11" fontSize="$3" pl="$5">
                    Anyone can view your profile, posts, and follow you
                  </Text>
                </YStack>

                <YStack space="$2" p="$3" bg="$gray2" borderRadius="$3">
                  <XStack space="$2" ai="center">
                    <FontAwesome name="lock" size={16} color={theme.accent1.val} />
                    <Text color="$color" fontSize="$4" fontWeight="600">Private</Text>
                  </XStack>
                  <Text color="$gray11" fontSize="$3" pl="$5">
                    Only approved followers can see your content
                  </Text>
                </YStack>
              </YStack>

              {/* Privacy Toggle */}
              <YStack space="$3">
                <Text color="$color" fontSize="$4" fontWeight="600">
                  Current Setting: {userProfile?.private ? 'Private' : 'Public'}
                </Text>
                <Button
                  size="$5"
                  bg="$accent1"
                  color="white"
                  onPress={async () => {
                    try {
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) return;

                      const newPrivacySetting = !userProfile?.private;
                      
                      const { error } = await supabase
                        .from('profiles')
                        .update({ private: newPrivacySetting })
                        .eq('id', user.id);

                      if (error) {
                        console.error('Error updating privacy setting:', error);
                      } else {
                        // Update the local cache
                        updateProfile({ private: newPrivacySetting });
                      }
                    } catch (error) {
                      console.error('Error updating privacy:', error);
                    }
                  }}
                >
                  <XStack space="$2" ai="center">
                    <FontAwesome 
                      name={userProfile?.private ? "globe" : "lock"} 
                      size={16} 
                      color="white" 
                    />
                    <Text color="white" fontSize="$4" fontWeight="600">
                      {userProfile?.private ? 'Make Public' : 'Make Private'}
                    </Text>
                  </XStack>
                </Button>
              </YStack>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
} 