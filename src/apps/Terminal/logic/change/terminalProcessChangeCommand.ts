// Redux
import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';

// I18n
import i18n from '@Features/i18n';

// Logic
import { terminalProcessChangeLanguage } from './language/terminalProcessChangeLanguage';
import { terminalProcessChangeTheme } from './theme/terminalProcessChangeTheme';

const terminalProcessChangeCommand = (input: string) => {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case 'theme':
    case '-t': {
      terminalProcessChangeTheme(input.split(' ').slice(1).join(' '));
      break;
    }
    case 'language':
    case '-l': {
      terminalProcessChangeLanguage(input.split(' ').slice(1).join(' '));
      break;
    }
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeHelpInfo')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableCategories')}: locale (-l), theme (-t)`));
      break;
    }
    case '': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:wrongCommand')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeExample')}`));
      break;
    }
    default: {
      dispatch(addTerminalHistory(`${i18n.t('terminal:unknownCategory')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableCategories')}: locale (-l), theme (-t)`));
    }
  }
};

export { terminalProcessChangeCommand };
