import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';
import i18n from '@Features/i18n';
import { Language } from '@Features/i18n/types/language';
import { setLanguage } from '@Features/settings/redux/settings.slice';

const terminalProcessChangeLanguage = (input: string, appId: string) => {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case 'ru': {
      dispatch(setLanguage(Language.Russian));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:languageChange')}`, appId }));
      break;
    }
    case 'en': {
      dispatch(setLanguage(Language.English));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:languageChange')}`, appId }));
      break;
    }
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeLanguageHelpInfo')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableLanguages')}`, appId }));
      break;
    }
    case '': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:wrongCommand')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeExample')}`, appId }));
      break;
    }
    default: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:unknownLanguage')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableLanguages')}`, appId }));
    }
  }
};

export { terminalProcessChangeLanguage };
