// Redux
import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';

// Features
import i18n from '@Features/i18n';
import { setLanguage } from '@Features/i18n/redux/languageSlice';

// Types
import { Language } from '@Features/i18n/types/language';

const terminalProcessChangeLanguage = (input: string) => {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case 'ru': {
      dispatch(setLanguage(Language.Russian));
      dispatch(addTerminalHistory(`${i18n.t('terminal:languageChange')}`));
      break;
    }
    case 'en': {
      dispatch(setLanguage(Language.English));
      dispatch(addTerminalHistory(`${i18n.t('terminal:languageChange')}`));
      break;
    }
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeLanguageHelpInfo')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableLanguages')}`));
      break;
    }
    case '': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:wrongCommand')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeExample')}`));
      break;
    }
    default: {
      dispatch(addTerminalHistory(`${i18n.t('terminal:unknownLanguage')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableLanguages')}`));
    }
  }
};

export { terminalProcessChangeLanguage };
