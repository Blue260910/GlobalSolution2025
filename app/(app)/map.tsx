import React, { use, createContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/lib/theme';
import { Bell, Search, Calendar, CheckCheck, TrendingUp, Heart, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import { StockSearchModal } from '../../components/ui/StockSearchModal';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';

import WeatherCard from '../../components/WeatherCard';
import { getWeatherMetrics } from '../../components/data/weatherData';
import { WeatherMetric } from '../../components/data/weatherData';
import MapView, { Marker, Circle } from 'react-native-maps';

import * as messageService from '../../services/messageService';
import { Message, MessageFormData } from '../../types/index';

import { getCurrentLocation } from '../../utils/locationUtils';
// Removido o await de nível superior



interface MessageContextProps {
  messages: Message[];
  loading: boolean;
  addMessage: (messageData: MessageFormData) => Promise<void>;
  toggleMessageStatus: (messageId: string) => void;
  refreshMessages: () => void;
  isUserMessage: (message: Message) => boolean;
  getUserName: (userId: string) => string;
  getHistoryMessages: (userId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);


export default function MapScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<{ lat: string; long: string }>({ lat: '0', long: '0' });

  useEffect(() => {
    (async () => {
      const loc = await getCurrentLocation();
      setLocation(loc || { lat: '0', long: '0' });
    })();
  }, []);

  const loadMessages = React.useCallback(async () => {
    setLoading(true);
    const activeMessages = await messageService.getActiveMessages();
    setMessages(activeMessages);
    setLoading(false);
  }, []);



  // Use useFocusEffect para garantir recarregamento ao focar na aba
  useFocusEffect(
    React.useCallback(() => {
      loadMessages();
    }, [loadMessages])
  );

  const [isSearchButtonExpand, setisSearchButtonExpand] = useState(false);

  const toogleSearchButtonExpand = () => {
    setisSearchButtonExpand(!isSearchButtonExpand);
  }

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');  

  const { user } = useAuth();
  // Get first part of email as username
  const username = user?.user_metadata.first_name || 'User';

  const [weatherMetrics, setWeatherMetrics] = useState<WeatherMetric[] | null>(null);

  useEffect(() => {
    getWeatherMetrics().then(setWeatherMetrics);
  }, []);

  // Coordenadas de exemplo (pode ajustar depois)
  const initialRegion = {
    latitude: location.lat ? Number(location.lat) : -23.550520,
    longitude: location.long ? Number(location.long) : -46.633308,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Função para calcular centro e raio
  function getCircleProps(messages: Message[]) {
    const coords = messages
      .filter(msg => msg.lat && msg.long)
      .map(msg => ({
        latitude: Number(msg.lat),
        longitude: Number(msg.long),
      }));

    if (coords.length === 0) return null;

    // Centro: média das coordenadas
    const center = {
      latitude: coords.reduce((sum, c) => sum + c.latitude, 0) / coords.length,
      longitude: coords.reduce((sum, c) => sum + c.longitude, 0) / coords.length,
    };

    // Raio: maior distância do centro até qualquer marker (em metros)
    const toRad = (v: number) => (v * Math.PI) / 180;
    const earthRadius = 6371000; // metros

    const maxDist = Math.max(
      ...coords.map(c => {
        const dLat = toRad(c.latitude - center.latitude);
        const dLon = toRad(c.longitude - center.longitude);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(center.latitude)) *
            Math.cos(toRad(c.latitude)) *
            Math.sin(dLon / 2) ** 2;
        const c2 = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c2;
      })
    );

    return { center, radius: maxDist + 100 }; // 100m extra para folga
  }

  const circleProps = getCircleProps(messages);

  if (Platform.OS === 'web') {
    return (
      <SafeAreaWrapper style={styles.container}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>Mapa não disponível na versão web.</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1454779132693-e5cd0a216ed3?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
            style={styles.bannerImage}
          />
          <Animated.View style={styles.bannerContent} entering={FadeInDown}>
            <Text style={styles.bannerTitle}>Bem vindo ao mapa </Text>
            <Text style={styles.bannerDescription}>Veja relatos de apagões e acompanhe as alertas de outros usuários em tempo real.</Text>
          </Animated.View>
        </View>
        
        {/* Cards de resumo */}
        <View style={{ flexDirection: 'row', gap: 16, marginHorizontal: 24, marginBottom: 16 }}>
          {/* Card 1: Total de mensagens ativas */}
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', ...theme.shadows.small }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary[500] }}>{messages.length}</Text>
            <Text style={{ color: theme.colors.neutrals[700], fontSize: 14, marginTop: 4, textAlign: 'center' }}>Alertas Ativos</Text>
          </View>
          {/* Card 2: Tempo total das reclamações */}
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', ...theme.shadows.small }}>
            {/* Tempo total das mensagens ativas */}
            {messages.length > 0 ? (() => {
              const parseCustomDate = (str: string) => {
                if (!str) return null;
                const [dia, mes, ano, hora, min, seg] = str.split('-');
                return new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg}`);
              };
              const oldest = messages.reduce((min, msg) => {
                const minDate = parseCustomDate(min.horarioDeEnvio);
                const msgDate = parseCustomDate(msg.horarioDeEnvio);
                if (!minDate || !msgDate) return min;
                return msgDate < minDate ? msg : min;
              }, messages[0]);
              const oldestTime = parseCustomDate(oldest.horarioDeEnvio);
              if (!oldestTime || isNaN(oldestTime.getTime())) {
                return (
                  <>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary[500] }}>0min</Text>
                    <Text style={{ color: theme.colors.neutrals[700], fontSize: 14, marginTop: 4 }}>
                      Tempo total de impacto	
                    </Text>
                  </>
                );
              }
              const now = new Date();
              const diffMs = now.getTime() - oldestTime.getTime();
              const diffMin = Math.floor(diffMs / 60000);
              const diffHour = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHour / 24);

              let tempoStr = '';
              if (diffDay > 0) tempoStr = `${diffDay} dia${diffDay > 1 ? 's' : ''}`;
              else if (diffHour > 0) tempoStr = `${diffHour}h ${diffMin % 60}min`;
              else tempoStr = `${diffMin}min`;

              return (
                <>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary[500] }}>
                    {tempoStr}
                  </Text>
                  <Text style={{ color: theme.colors.neutrals[700], fontSize: 14, marginTop: 4, textAlign: 'center' }}>
                    Tempo total de impacto
                  </Text>
                </>
              );
            })() : (
              <>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary[500] }}>0min</Text>
                <Text style={{ color: theme.colors.neutrals[700], fontSize: 14, marginTop: 4, textAlign: 'center' }}>
                  Tempo total de impacto
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={{ height: 350, borderRadius: 16, overflow: 'hidden', margin: 16 }}>
          {(location.lat !== '0' && location.long !== '0') ? (
            <MapView
              style={{ flex: 1 }}
              initialRegion={initialRegion}
              showsUserLocation={true}
            >
              {/* Marcadores dinâmicos para cada mensagem com avatar */}
              {messages.map((msg, idx) =>
                msg.lat && msg.long && msg.avatar ? (
                  <Marker
                    key={idx}
                    coordinate={{ latitude: Number(msg.lat), longitude: Number(msg.long) }}
                    style={{ zIndex: 1000 }}
                    title={msg['tituloEnvio']}
                    description={msg.descricao}
                    anchor={{ x: 0.5, y: 0.5 }}
                  >
                      <Image
                        source={{ uri: msg.avatar }}
                        style={{
                          width: 36,
                          height: 36,
                          borderColor: '#238CA4',
                          borderWidth: 3,
                          backgroundColor: '#fff',
                          borderRadius: 30, // deixa a imagem redonda
                        }}
                        resizeMode="cover"
                      />
                  </Marker>
                ) : null
              )}
              {circleProps && (
                <Circle
                  center={circleProps.center}
                  radius={circleProps.radius}
                  strokeColor="#238CA4"
                  fillColor="rgba(35,140,164,0.1)"
                  strokeWidth={2}
                />
              )}
            </MapView>
          ) : (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text>Carregando localização...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
    marginTop: theme.spacing.lg,
    
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerIcons: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  iconButtonSearch: {
    width: 40,
    height: 40, 
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
  },
  username: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutrals[900],
  },
  bannerContainer: {
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginVertical: theme.spacing.md,
    ...theme.shadows.medium,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    position: 'absolute',
  },
    actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 32,
  },
    actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  bannerContent: {
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 150,
    justifyContent: 'center',
  },
    cardsContainer: {
    padding: 16,
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  bannerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  bannerDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    opacity: 0.9,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutrals[900],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  dashboardCard: {
    width: '46%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  cardIcon: {
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[700],
  },
  activityList: {
    paddingHorizontal: theme.spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
  },
  activityTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
});