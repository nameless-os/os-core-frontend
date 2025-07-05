import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';
import i18n from '@Features/i18n';
import { closeApp } from '../../../../redux/slices/appsSlice/apps.slice';

const terminalProcessCloseCommand = (input: string, appId: string) => {
  const { dispatch } = store;

  const index = input.split(' ')[0];
  const id = store.getState().apps.apps[+index]?.id;
  if (id) {
    dispatch(closeApp(id));
    return;
  }

  switch (index) {
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:openHelpInfo')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableApps')}: id`, appId }));
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

export { terminalProcessCloseCommand };
