import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '@Features/i18n/translations/en/translation.json';
import calculatorTranslationEn from '@Calculator/translations/en/calculatorTranslation.json';
import chatTranslationEn from '@Chat/translations/en/chatTranslation.json';
import settingsTranslationEn from '@Settings/translations/en/settingsTranslation.json';
import simonTranslationEn from '@Simon/translations/en/simonTranslation.json';
import toDoTranslationEn from '@ToDo/translations/en/toDoTranslation.json';
import terminalTranslationEn from '@Terminal/translations/en/terminalTranslation.json';
import authRedirectTranslationEn from '@Components/AuthAppRedirect/translations/en/authAppRedirectTranslation.json';
import welcomeTranslationEn from '@Components/Welcome/translations/en/welcomeTranslation.json';

import translationRU from '@Features/i18n/translations/ru/translation.json';
import calculatorTranslationRu from '@Calculator/translations/ru/calculatorTranslation.json';
import chatTranslationRu from '@Chat/translations/ru/chatTranslation.json';
import settingsTranslationRu from '@Settings/translations/ru/settingsTranslation.json';
import simonTranslationRu from '@Simon/translations/ru/simonTranslation.json';
import toDoTranslationRu from '@ToDo/translations/ru/toDoTranslation.json';
import terminalTranslationRu from '@Terminal/translations/ru/terminalTranslation.json';
import authRedirectTranslationRu from '@Components/AuthAppRedirect/translations/ru/authAppRedirectTranslation.json';
import welcomeTranslationRu from '@Components/Welcome/translations/ru/welcomeTranslation.json';

import { Language } from '@Features/i18n/types/language';

i18n.use(initReactI18next).init({
  fallbackLng: Language.English,
  debug: false,
  detection: {
    order: ['localStorage', 'cookie'],
    cache: ['localStorage', 'cookie'],
  },
  interpolation: {
    escapeValue: false,
  },
  resources: {
    [Language.English]: {
      translation: translationEN,
      calculator: calculatorTranslationEn,
      chat: chatTranslationEn,
      settings: settingsTranslationEn,
      simon: simonTranslationEn,
      toDo: toDoTranslationEn,
      terminal: terminalTranslationEn,
      authRedirect: authRedirectTranslationEn,
      welcome: welcomeTranslationEn,
    },
    [Language.Russian]: {
      translation: translationRU,
      calculator: calculatorTranslationRu,
      chat: chatTranslationRu,
      settings: settingsTranslationRu,
      simon: simonTranslationRu,
      toDo: toDoTranslationRu,
      terminal: terminalTranslationRu,
      authRedirect: authRedirectTranslationRu,
      welcome: welcomeTranslationRu,
    },
  },
});

export default i18n;
