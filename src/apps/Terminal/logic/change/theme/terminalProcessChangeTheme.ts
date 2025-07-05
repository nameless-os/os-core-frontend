import { capitalizeFirstLetter } from '@webos-project/common';

import store from 'src/redux/store';
import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import i18n from '@Features/i18n';
import { Background } from '@Features/settings/enums';
import { setBackground } from '@Features/settings/redux/settings.slice';

const terminalProcessChangeTheme = (input: string, appId: string) => {
  const { dispatch } = store;

  const newBackgroundImage = capitalizeFirstLetter(input.trim());

  if (store.getState().settings.background.includes(newBackgroundImage as Background)) {
    dispatch(addTerminalHistory({ message: `${i18n.t('terminal:themeChange')}`, appId }));
    dispatch(setBackground(newBackgroundImage as Background));
    return;
  }

  switch (input.trim()) {
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeThemeHelpInfo')}`, appId }));
      dispatch(
        addTerminalHistory({ message: `${i18n.t('terminal:availableThemes')}: planet, sea, tree, road, car, dynamic, dynamic2`, appId }),
      );
      break;
    }
    case '': {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:wrongCommand')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:changeExample')}`, appId }));
      break;
    }
    default: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:unknownTheme')}`, appId }));
      dispatch(
        addTerminalHistory({ message: `${i18n.t('terminal:availableThemes')}: planet, sea, tree, road, car, dynamic, dynamic2`, appId }),
      );
    }
  }
};

export { terminalProcessChangeTheme };
