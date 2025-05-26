import React, { use } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/lib/theme';
import { Bell, Search, Calendar, CheckCheck, TrendingUp, Heart, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useFormContext } from '../../contexts/FormContext';
import { useEffect } from 'react';
import { StockSearchModal } from '../../components/ui/StockSearchModal';
import { useState } from 'react';

import WeatherCard from '../../components/WeatherCard';
import { weatherMetrics } from '../../components/data/weatherData';



export default function HomeScreen() {
  const navigation = useNavigation();
  const {recuperarDados} = useFormContext();
  useEffect(() => {
    if (recuperarDados) recuperarDados()
  }, []);

  const [isSearchButtonExpand, setisSearchButtonExpand] = useState(false);

  const toogleSearchButtonExpand = () => {
    setisSearchButtonExpand(!isSearchButtonExpand);
  }

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  

  const { formState } = useFormContext();
  

  const { user } = useAuth();
  
  // Get first part of email as username
  const username = user?.user_metadata.first_name || 'User';

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, isSearchButtonExpand && { display: "none", }]}   >Good morning,</Text>
            <Text style={[styles.username, isSearchButtonExpand && { display: "none", }]} >{username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}</Text>
          </View>
          <View style={styles.headerIcons}>
          <TouchableOpacity
              style={[
              styles.iconButtonSearch,
              isSearchButtonExpand && { flex: 1, alignItems: 'flex-end', paddingRight: theme.spacing.sm, marginLeft: theme.spacing.sm },
            ]}
            onPress={() => toogleSearchButtonExpand()}
            
          >
            <Search size={24} color={theme.colors.neutrals[800]} />
          </TouchableOpacity>
            <StockSearchModal
              visible={isSearchModalVisible}
              searchText={searchText}
              onChangeSearchText={setSearchText}
              onClose={() => setIsSearchModalVisible(false)}
            />


            <TouchableOpacity style={styles.iconButton}
            // @ts-ignore
             onPress={() => navigation.navigate('Notifications')}
            >
              <Bell size={24} color={theme.colors.neutrals[800]} />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.cardsContainer}>
          {weatherMetrics.map((metric, index) => (
            <Animated.View 
              key={metric.id} 
              entering={FadeInDown.delay(index * 200).springify()}
              style={styles.cardWrapper}
            >
              <WeatherCard data={metric} />
            </Animated.View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
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
    backgroundColor: 'rgba(0,0,0,0.4)',
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