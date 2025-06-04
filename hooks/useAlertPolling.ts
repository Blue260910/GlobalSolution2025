import React from 'react';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { ToastAndroid, Platform } from 'react-native';


const LAST_ALERT_ID_KEY = 'lastAlertId';

// Isso faz a notificação aparecer como pop-up mesmo em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useAlertPolling(pollInterval: number = 3000) {
  const intervalRef = useRef<number | null>(null);

  console.log('useAlertPolling initialized with interval:', pollInterval);

  useEffect(() => {
    async function pollAlerts() {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.log('Erro ao buscar alerts:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestAlert = data[0];
        const lastAlertId = await AsyncStorage.getItem(LAST_ALERT_ID_KEY);
        if (latestAlert.id && lastAlertId !== String(latestAlert.id)) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: latestAlert.title || 'Alerta',
              body: latestAlert.message || '',
            },
            trigger: null,
          });
          await AsyncStorage.setItem(LAST_ALERT_ID_KEY, String(latestAlert.id));
        }
      }
    }

    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações negada');
      }
    }

    requestPermissions();
    pollAlerts(); // roda uma vez ao montar
    intervalRef.current = setInterval(pollAlerts, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pollInterval]);
}

export function useAlertPollingRealtime() {
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações negada');
      }
    }

    requestPermissions();

    const subscription = supabase
      .channel('public:alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        async (payload) => {
          const alertData = payload.new;
          // Exibe popup nativo (Toast no Android, Notification no iOS)
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              `Novo alerta: ${alertData.title || 'Alerta'}`,
              ToastAndroid.LONG,
              ToastAndroid.TOP
            );
          } else {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: alertData.title || 'Alerta',
                body: alertData.message || '',
              },
              trigger: null,
            });
          }
          // Notificação local (funciona em ambos)
          await Notifications.scheduleNotificationAsync({
            content: {
              title: alertData.title || 'Alerta',
              body: alertData.message || '',
            },
            trigger: null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  // ...existing code...

  // Só ativa o polling se notificações estiverem ligadas
  if (notifications) {
    useAlertPolling();
  }

  // ...existing code...
}
