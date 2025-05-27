import { fetchWeatherApi } from 'openmeteo';
import { getCurrentLocation } from '../../utils/locationUtils';




export async function getWeatherMetrics() {
const location = await getCurrentLocation() || { lat: '0', long: '0' };

const params = {
  "latitude": parseFloat(location.lat),
  "longitude": parseFloat(location.long),
  "daily": "uv_index_max",
  "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "rain", "is_day"],
  "timezone": "America/Sao_Paulo",
  "forecast_days": 1
};
const url = "https://api.open-meteo.com/v1/forecast";

// Remove top-level await; get location inside the function
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;
  const daily = response.daily()!;

  // Extrai os dados atuais
  const temperature = current.variables(0)!.value();
  const humidity = current.variables(1)!.value();
  const apparentTemperature = current.variables(2)!.value();
  const rain = current.variables(3)!.value();
  const uvIndex = daily.variables(0)!.valuesArray()![0]; // UV diário

  const metrics: WeatherMetric[] = [
    {
      id: '1',
      title: 'Temperatura',
      value: Math.round(temperature),
      unit: '°C',
      description: `Sensação térmica de ${Math.round(apparentTemperature)}°C`,
      type: 'temperature',
    },
    {
      id: '2',
      title: 'Umidade',
      value: Math.round(humidity),
      unit: '%',
      description: humidity < 40 ? 'Baixa umidade' : humidity < 70 ? 'Umidade moderada' : 'Alta umidade',
      type: 'humidity',
    },
    {
      id: '3',
      title: 'Chuva',
      value: Math.round(rain),
      unit: 'mm',
      description: rain > 5 ? 'Chuva forte' : rain > 0 ? 'Chuva leve' : 'Sem chuva',
      type: 'rain',
    },
    {
      id: '4',
      title: 'Índice UV',
      value: Math.round(uvIndex),
      unit: '',
      description: uvIndex >= 8 ? 'Exposição muito alta' : uvIndex >= 6 ? 'Alta exposição' : uvIndex >= 3 ? 'Exposição moderada' : 'Baixa exposição',
      type: 'uv',
    },
  ];
  return metrics;
}

export interface WeatherMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  description: string;
  type: 'temperature' | 'humidity' | 'rain' | 'uv';
}