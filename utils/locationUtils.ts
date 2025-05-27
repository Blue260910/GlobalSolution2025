import * as Location from 'expo-location';

// Get current location coordinates
export const getCurrentLocation = async (): Promise<{lat: string, long: string} | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({});
    return {
      lat: String(location.coords.latitude),
      long: String(location.coords.longitude)
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Function to get a human-readable address from coordinates
export const getAddressFromCoordinates = async (
  latitude: string, 
  longitude: string
): Promise<string> => {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinates');
    }
    
    const location = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng
    });
    
    if (location && location.length > 0) {
      const { street, name, city, region, postalCode, country } = location[0];
      return [
        street || name,
        city,
        region,
        postalCode,
        country
      ].filter(Boolean).join(', ');
    }
    
    return 'Endereço desconhecido';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Endereço indisponível';
  }
};

// Get a CEP (Brazilian postal code) from coordinates
export const getCEPFromCoordinates = async (
  latitude: string, 
  longitude: string
): Promise<string> => {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinates');
    }
    
    const location = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng
    });
    
    if (location && location.length > 0 && location[0].postalCode) {
      return location[0].postalCode.replace(/\D/g, '');
    }
    
    return '';
  } catch (error) {
    console.error('Error getting CEP:', error);
    return '';
  }
};