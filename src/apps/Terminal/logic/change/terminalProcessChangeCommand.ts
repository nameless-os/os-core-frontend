import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';
import i18n from '@Features/i18n';
import { terminalProcessChangeLanguage } from './language/terminalProcessChangeLanguage';
import { terminalProcessChangeTheme } from './theme/terminalProcessChangeTheme';

const terminalProcessChangeCommand = (input: string, appId: string) => {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case 'theme':
    case '-t': {
      terminalProcessChangeTheme(input.split(' ').slice(1).join(' '), appId);
      break;
    }
    case 'language':
    case '-l': {
      terminalProcessChangeLanguage(input.split(' ').slice(1).join(' '), appId);
      break;
    }
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeHelpInfo')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableCategories')}: locale (-l), theme (-t)`, appId }));
      break;
    }
    case '': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:wrongCommand')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeExample')}`, appId }));
      break;
    }
    default: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:unknownCategory')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableCategories')}: locale (-l), theme (-t)`, appId }));
    }
  }
};

export { terminalProcessChangeCommand };
