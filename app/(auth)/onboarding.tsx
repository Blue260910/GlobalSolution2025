import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useFonts, Sora_400Regular, Sora_500Medium, Sora_700Bold } from '@expo-google-fonts/sora';
import AppLoading from 'expo-app-loading';
import { router } from 'expo-router';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { theme } from '@/lib/theme';
import Animated from 'react-native-reanimated';
import { LogBox } from 'react-native';



export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_700Bold,
  });

  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  ]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/ImageOnboarding.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <SafeAreaWrapper
        style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }}
      >
        <View style={{ flex: 1, width: '100%' }}>
          <View
            style={{
              flex: 0.50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          ></View>
          <View
            style={{
              flex: 0.50,
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: theme.spacing.xl,
            }}
            
            
          >
            <View style={styles.logoContainer}>
              <Text style={[styles.logoText, { fontFamily: 'Sora_700Bold' }]}>Fique por dentro de possíveis áreas de risco</Text>
              <Text style={[styles.logoSubText, { fontFamily: 'Sora_400Regular' }]}>Seja bem-vindo ao Alertaê, um sistema de monitoramento e prevenção de enchentes, com foco em garantir segurança mesmo durante quedas de energia.</Text>
            </View>
            <TouchableOpacity
              style={styles.pillButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.pillButtonText}>Começar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaWrapper>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.sm,
  },
  logoText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.white,
    textAlign: 'center',
  },
  logoSubText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.sm,
    color: "#A2A2A2",
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
  },
  footerLink: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[500],
  },
  forgotPassword: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[500],
  },
  pillButton: {
    backgroundColor: '#238CA4',
    borderRadius: 8,
    height: 55,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  pillButtonText: {
    color: '#fff',
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
