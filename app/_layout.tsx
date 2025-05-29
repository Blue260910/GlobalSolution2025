import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { FormProvider } from '@/contexts/FormContext';
import { ReactNode } from 'react';


SplashScreen.preventAutoHideAsync();


function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useFrameworkReady();

  
  useEffect(() => {
    async function prepare() {
      try {
        
        await new Promise(resolve => setTimeout(resolve, 500)); 
      } catch (e) {
        console.warn(e);
      } finally {
        
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  
  useEffect(() => {
    if (appIsReady && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, isLoading]);

  
  if (!appIsReady || isLoading) {
    return null;
  }

  
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FormProvider>
          <RootLayoutNav />
          {children}
        </FormProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}