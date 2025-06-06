import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/lib/theme';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '@/app/(app)/index';
import NotificationsScreen from '@/app/(app)/notifications';
import SettingsScreen from '@/app/(app)/settings';
import ProfileScreen from '@/app/(app)/profile';
import guidelinesScreen from '@/app/(app)/guidelines';
import MapScreen from '@/app/(app)/map';

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  if (!session) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutrals[400],
        tabBarStyle: {
          height: 50 + insets.bottom,
          backgroundColor: theme.colors.neutrals[100],
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Map') iconName = 'map';
          if (route.name === 'Notifications') iconName = 'bell';
          if (route.name === 'Settings') iconName = 'settings';
          if (route.name === 'Profile') iconName = 'user';
          if (route.name === 'guidelines') iconName = 'book';
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="guidelines" component={guidelinesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
