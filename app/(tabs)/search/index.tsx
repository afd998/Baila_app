import { YStack, H1, Text, Input, XStack, useTheme, Group, ScrollView, Spinner, Button, Image } from 'tamagui';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedSearch } from '../../../lib/hooks/useDebouncedSearch';
import { useProfileSearch } from '../../../lib/hooks/useProfileSearch';
import { SearchResult } from '../../../components/SearchResult';
import { useRouter } from 'expo-router';
import { useUserProfile } from '../../../lib/hooks/useUserProfile';

export default function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: userProfile } = useUserProfile();
  
  const { searchQuery, debouncedQuery, handleSearchChange } = useDebouncedSearch();
  const { data: searchResults, isLoading, error } = useProfileSearch(debouncedQuery);

  const handleProfilePress = (profile: any) => {
    // If the profile is the current user, navigate to their profile tab
    if (userProfile && profile.id === userProfile.id) {
      router.push('/(tabs)/(profile)');
    } else {
      // Otherwise navigate to the profile page
      router.push(`/search/${profile.id}`);
    }
  };

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
            <FontAwesome name="times" size={18} color={theme.accent1.val} />
          </Button>
        </Group>
        
        <Group w="33%">
          <H1 color="$color" size="$8" textAlign='center'>Search</H1>
        </Group>
        
        <Group w="33%">
          {/* Empty space for balance */}
        </Group>
      </XStack>

      {/* Search Input */}
      <YStack p="$4" space="$4">
        <XStack space="$3" ai="center">
          <Input
            placeholder="Search dancers..."
            size="$4"
            boc="$accent1"
            col="$color"
            bg="$background"
            f={1}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <FontAwesome name="search" size={20} color={theme.accent1.val} />
        </XStack>
      </YStack>

      {/* Search Results */}
      <ScrollView f={1} p="$4">
        {searchQuery.length < 2 && (
          <YStack f={1} ai="center" jc="center" space="$4">
            <Text color="$gray11" fontSize="$6" ta="center">
              Search for dancers
            </Text>
            <Text color="$gray10" fontSize="$4" ta="center">
              Type to search by name or dancer tag
            </Text>
            <Image
              source={require('../../../assets/images/dancers.png')}
              style={{ width: 240, height: 240, marginTop: 20 }}
              resizeMode="contain"
            />
          </YStack>
        )}

        {searchQuery.length >= 2 && isLoading && (
          <YStack f={1} ai="center" jc="center" space="$4">
            <Spinner size="large" color="$accent1" />
            <Text color="$gray11" fontSize="$4" ta="center">
              Searching...
            </Text>
          </YStack>
        )}

        {searchQuery.length >= 2 && error && (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="exclamation-triangle" size={60} color={theme.red10.val} />
            <Text color="$red10" fontSize="$4" ta="center">
              Search failed. Please try again.
            </Text>
          </YStack>
        )}

        {searchQuery.length >= 2 && !isLoading && !error && searchResults && searchResults.length === 0 && (
          <YStack f={1} ai="center" jc="center" space="$4">
            <FontAwesome name="search" size={60} color={theme.color.val} />
            <Text color="$gray10" fontSize="$4" ta="center">
              No dancers found
            </Text>
            <Text color="$gray9" fontSize="$3" ta="center">
              Try a different search term
            </Text>
          </YStack>
        )}

        {searchResults && searchResults.length > 0 && (
          <YStack space="$2">
            {searchResults.map((profile) => (
              <SearchResult
                key={profile.id}
                profile={profile}
                onPress={() => handleProfilePress(profile)}
              />
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
} 