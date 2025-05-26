export interface WeatherMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  description: string;
  type: 'temperature' | 'humidity' | 'rain' | 'uv';
}

export const weatherMetrics: WeatherMetric[] = [
  {
    id: '1',
    title: 'Temperature',
    value: 24,
    unit: '°C',
    description: 'Feels like 26°C',
    type: 'temperature'
  },
  {
    id: '2',
    title: 'Humidity',
    value: 65,
    unit: '%',
    description: 'Moderate humidity',
    type: 'humidity'
  },
  {
    id: '3',
    title: 'Rain',
    value: 30,
    unit: '%',
    description: 'Light rain possible',
    type: 'rain'
  },
  {
    id: '4',
    title: 'UV Index',
    value: 6,
    unit: '',
    description: 'High exposure',
    type: 'uv'
  }
];