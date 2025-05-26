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
import SummaryScreen from '@/app/(app)/summary';

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
          if (route.name === 'Notifications') iconName = 'bell';
          if (route.name === 'Settings') iconName = 'settings';
          if (route.name === 'Profile') iconName = 'user';
          if (route.name === 'Summary') iconName = 'search';
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Summary" component={SummaryScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
