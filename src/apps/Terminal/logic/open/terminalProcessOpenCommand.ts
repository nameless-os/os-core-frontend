// Redux
import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import { openApp } from 'src/redux/slices/appsSlice/appsSlice';
import store from 'src/redux/store';

// I18n
import i18n from '@Features/i18n';

// Types
import { App } from '@Enums/app.enum';

const terminalProcessOpenCommand = (input: string) => {
  const { dispatch } = store;

  const firstWord = input.split(' ')[0];
  const arr = firstWord.split('');
  if (arr[0]) {
    arr[0] = arr[0].toUpperCase();
  }
  const app = arr.join('');

  if (Object.values(App).includes(app as App)) {
    dispatch(addTerminalHistory(`${i18n.t('terminal:appOpen')}`));
    dispatch(openApp(app as App));
    return;
  }

  switch (firstWord) {
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:openHelpInfo')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableApps')}: calculator, toDo, settings, chat, simon`));
      break;
    }
    case '': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:wrongCommand')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:openExample')}`));
      break;
    }
    default: {
      dispatch(addTerminalHistory(`${i18n.t('terminal:unknownApp')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableApps')}: calculator, toDo, settings, chat, simon`));
    }
  }
};

export { terminalProcessOpenCommand };
