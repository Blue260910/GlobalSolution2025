import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Parse the timestamp format: "26-05-2025-23-36-65"
export const parseTimestamp = (timestamp: string): Date => {
  const [day, month, year, hours, minutes, seconds] = timestamp.split('-').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

// Format timestamp to a readable string
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseTimestamp(timestamp);
    
    // Check if the date is today
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }

    // Check if the date is yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Ontem às ${format(date, 'HH:mm')}`;
    }

    // For other dates
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp; // Return the original string if parsing fails
  }
};

// Generate current timestamp in the format "26-05-2025-23-36-65"
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
};