import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import WeatherIcon from './WeatherIcon';

interface WeatherCardProps {
  data: WeatherMetric;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function WeatherCard({ data }: WeatherCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getGradientColors = (): [string, string] => {
    switch (data.type) {
      case 'temperature':
        return ['#FF6B6B', '#FF8787'];
      case 'humidity':
        return ['#4DABF7', '#74C0FC'];
      case 'rain':
        return ['#748FFC', '#91A7FF'];
      case 'uv':
        return ['#FCC419', '#FFD43B'];
      default:
        return ['#4DA6FF', '#2E86DE'];
    }
  };

  useEffect(() => {
    scale.value = withSpring(1.02, { damping: 12 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 12 });
    }, 300);
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <AnimatedLinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <View style={styles.valueContainer}>
            <WeatherIcon type={data.type} size={60} />
            <Text style={styles.value}>
              {data.value}
              <Text style={styles.unit}>{data.unit}</Text>
            </Text>
          </View>
          <Text style={styles.description}>{data.description}</Text>
        </View>
      </AnimatedLinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 170,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  valueContainer: {
    marginVertical: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',

  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export interface WeatherMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  description: string;
  type: 'temperature' | 'humidity' | 'rain' | 'uv';
}