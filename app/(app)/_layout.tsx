import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/lib/theme';
import { Feather } from '@expo/vector-icons';

// Importando suas telas
import HomeScreen from '@/app/(app)/index';
import NotificationsScreen from '@/app/(app)/notifications';
import SettingsScreen from '@/app/(app)/settings';
import ProfileScreen from '@/app/(app)/profile';
import guidelinesScreen from '@/app/(app)/guidelines';
import MapScreen from '@/app/(app)/map';

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutrals[400],
        tabBarStyle: {
          height: 50, // Altere aqui a altura
          backgroundColor: theme.colors.neutrals[100], // Exemplo de cor de fundo
          borderTopLeftRadius: 20, // Exemplo de borda arredondada
          borderTopRightRadius: 20,
          paddingBottom: 10, // Espaço extra para ícones
          paddingTop: 5, // Espaço extra para ícones
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Map') iconName = 'map';
          if (route.name === 'Notifications') iconName = 'bell';
          if (route.name === 'Settings') iconName = 'settings';
          if (route.name === 'Profile') iconName = 'user';
          if (route.name === 'guidelines') iconName = 'search';
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
