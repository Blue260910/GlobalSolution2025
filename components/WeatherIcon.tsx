import { View, StyleSheet } from 'react-native';
import { Droplets, Cloud, Sun } from 'lucide-react-native';
import LottieView from 'lottie-react-native';

interface WeatherIconProps {
  type: 'temperature' | 'humidity' | 'rain' | 'uv';
  size?: number;
}

export default function WeatherIcon({ type, size = 24 }: WeatherIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'temperature':
        return (
          <View
            style={{
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LottieView
              source={require('../assets/icons/Termometro.json')}
              autoPlay
              loop
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          </View>
        );
      case 'humidity':
        return (
          <View
            style={{
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LottieView
              source={require('../assets/icons/Cloud.json')}
              autoPlay
              loop
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          </View>
        );
      case 'rain':
        return (
          <View
            style={{
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LottieView
              source={require('../assets/icons/Rain.json')}
              autoPlay
              loop
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          </View>
        );
      case 'uv':
        return (
          <View
            style={{
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LottieView
              source={require('../assets/icons/Sun.json')}
              autoPlay
              loop
              style={{ width: size, height: size }}
              resizeMode="contain"
            />
          </View>
        );      default:
        return <Droplets size={size} color="#fff" />;
    }
  };

  return (
    <View style={styles.iconContainer}>
      {getIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});