import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { router } from 'expo-router';
import { ProfileTabIcon } from '../../components/ProfileTabIcon';

export default function TabLayout() {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Use static light theme to avoid all hook issues
  const isDarkMode = false;
  
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
      console.log('Appearance changed to:', colorScheme);
    });

    return () => subscription?.remove();
  }, []);
  
  // Check system dark mode using React Native's Appearance API
  const isSystemDarkMode = systemColorScheme === 'dark';
  console.log('=== THEME DEBUG ===');
  console.log('useColorScheme hook:', colorScheme);
  console.log('Appearance.getColorScheme():', Appearance.getColorScheme());
  console.log('State systemColorScheme:', systemColorScheme);
  console.log('Is system dark mode:', isSystemDarkMode);
  console.log('Theme background color:', theme.background.val);
  console.log('==================');

  const handleCreatePress = useCallback(() => {
    console.log('Create button pressed!');
    
    // Start the 3D rotation animation
    if (!isSpinning) {
      setIsSpinning(true);
      rotationAnim.setValue(0);
      
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
      });
    }
    
    // Use requestAnimationFrame to avoid useInsertionEffect warning
    requestAnimationFrame(() => {
      router.push('/create');
    });
  }, [isSpinning, rotationAnim]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#333333' : '#E0E0E0',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: isDarkMode ? '#666666' : '#999999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Dance Floor',
            tabBarIcon: ({ color, size }) => (
              <Image 
                source={require('../../assets/images/icons/floor.png')} 
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: 'My Stage',
            tabBarLabel: 'My Stage',
            href: '/(tabs)/(profile)',
            tabBarIcon: ({ color, size }) => (
              <Image 
                source={require('../../assets/images/icons/single.png')} 
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
      </Tabs>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreatePress}
        activeOpacity={0.8}
      >
        <Animated.Image 
          source={require('../../assets/images/ball.png')} 
          style={[
            styles.fabImage,
            {
              transform: [
                {
                  rotateY: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                {
                  rotateX: rotationAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '180deg', '360deg'],
                  }),
                },
                {
                  scale: rotationAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.8, 1],
                  }),
                },
              ],
            },
          ]}
        />
        <FontAwesome name="plus" size={24} color="white" style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 25,
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fabImage: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  fabIcon: {
    zIndex: 10,
  },
}); 