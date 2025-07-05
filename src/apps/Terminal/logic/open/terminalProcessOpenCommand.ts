import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import { openApp } from 'src/redux/slices/appsSlice/apps.slice';
import store from 'src/redux/store';
import i18n from '@Features/i18n';
import { App } from '@webos-project/common';

const terminalProcessOpenCommand = (input: string, appId: string) => {
  const { dispatch } = store;

  const firstWord = input.split(' ')[0];
  const arr = firstWord.split('');
  if (arr[0]) {
    arr[0] = arr[0].toUpperCase();
  }
  const app = arr.join('');

  if (Object.values(App).includes(app as App)) {
    dispatch(addTerminalHistory({ message: `${i18n.t('terminal:appOpen')}`, appId }));
    dispatch(openApp({ type: app as App, appId }));
    return;
  }

  switch (firstWord) {
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:openHelpInfo')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableApps')}: calculator, toDo, settings, chat, simon`, appId }));
      break;
    }
    case '': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:wrongCommand')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:openExample')}`, appId }));
      break;
    }
    default: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:unknownApp')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableApps')}: calculator, toDo, settings, chat, simon`, appId }));
    }
  }
};

export { terminalProcessOpenCommand };
