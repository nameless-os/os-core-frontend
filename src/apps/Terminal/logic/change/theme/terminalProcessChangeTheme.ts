// Redux
import store from 'src/redux/store';
import { addTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';

// Features
import { setBackgroundImage } from '@Features/theme/redux/themeSlice';
import i18n from '@Features/i18n';

// Types
import { BackgroundImage } from '@Features/theme/types/backgroundImage';

// Utils
import { capitalizeFirstLetter } from '@Utils/capitalizeFirstLetter';

const terminalProcessChangeTheme = (input: string) => {
  const { dispatch } = store;

  const newBackgroundImage = capitalizeFirstLetter(input.trim());

  if (store.getState().theme.backgroundImages.includes(newBackgroundImage as BackgroundImage)) {
    dispatch(addTerminalHistory(`${i18n.t('terminal:themeChange')}`));
    dispatch(setBackgroundImage(newBackgroundImage as BackgroundImage));
    return;
  }

  switch (input.trim()) {
    case 'help':
    case '-h': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeThemeHelpInfo')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableThemes')}: planet, sea, tree, road, car, dynamic, dynamic2`));
      break;
    }
    case '': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:wrongCommand')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:changeExample')}`));
      break;
    }
    default: {
      dispatch(addTerminalHistory(`${i18n.t('terminal:unknownTheme')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableThemes')}: planet, sea, tree, road, car, dynamic, dynamic2`));
    }
  }
};

export { terminalProcessChangeTheme };
