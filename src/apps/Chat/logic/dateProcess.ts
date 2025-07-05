import { Language } from '@Features/i18n/types/language';

const getReadableSeconds = (seconds: number): string => {
  if (Math.floor(seconds / 10) === 1) return 'секунд';
  if (seconds % 10 === 1) return 'секунду';
  if (seconds % 10 === 2 || seconds % 10 === 3 || seconds % 10 === 4) return 'секунды';
  return 'секунд';
};

const getReadableMinutes = (minutes: number): string => {
  if (Math.floor(minutes / 10) === 1) return 'минут';
  if (minutes % 10 === 1) return 'минуту';
  if (minutes % 10 === 2 || minutes % 10 === 3 || minutes % 10 === 4) return 'минуты';
  return 'минут';
};

const getReadableHours = (hours: number): string => {
  if (Math.floor(hours / 10) === 1) return 'часов';
  if (hours % 10 === 1) return 'час';
  if (hours % 10 === 2 || hours % 10 === 3 || hours % 10 === 4) return 'часа';
  return 'часов';
};

const getReadableLastVisitDate = (lastVisit: Date, language: Language): string => {
  const seconds = Math.floor(-(+new Date(lastVisit) - +new Date()) / 1000);

  if (seconds < 60) {
    if (language === Language.Russian) {
      return `${seconds} ${getReadableSeconds(seconds)} назад`;
    }
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    if (language === Language.Russian) {
      return `${minutes} ${getReadableMinutes(minutes)} назад`;
    }
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    if (language === Language.Russian) {
      return `${hours} ${getReadableHours(hours)} назад`;
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const locale = language === Language.Russian ? 'ru-RU' : 'en-GB';

  return new Date(lastVisit).toLocaleString(locale, {
    month: 'numeric',
    day: 'numeric',
  });
};

export { getReadableLastVisitDate };
