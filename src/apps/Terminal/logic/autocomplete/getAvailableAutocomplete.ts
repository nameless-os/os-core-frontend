// Redux
import store from 'src/redux/store';
import { setAvailableAutocomplete } from '@Terminal/redux/terminalSlice/terminalSlice';

function setCommandsWithCurrentLevel(commands: string[], text: string): void {
  const textArr = text.split(' ');
  const isAlreadyCommand = text[text.length - 1] === ' ' || commands.includes(textArr[textArr.length - 1]);

  if (isAlreadyCommand) {
    store.dispatch(setAvailableAutocomplete(commands));
    return;
  }

  const availableCommands = commands.filter((command) => command.startsWith(textArr[textArr.length - 1]));
  store.dispatch(setAvailableAutocomplete(availableCommands));
}

function getAvailableAutocomplete(text: string) {
  const { autocompleteNumber } = store.getState().terminal;

  if (autocompleteNumber) {
    const { availableAutocomplete } = store.getState().terminal;

    if (!availableAutocomplete) {
      return text.split(' ')[text.split(' ').length - 1];
    }

    return availableAutocomplete[autocompleteNumber % availableAutocomplete.length];
  }

  const currentLevel = text.split('').filter((el) => el === ' ')?.length || 0;
  const textArr = text.split(' ');
  let currentLevelCommands: string[] = [];

  if (currentLevel === 0) {
    currentLevelCommands = store.getState().terminal.commands.firstLevelCommands;
  }

  if (currentLevel === 1) {
    if (textArr[0] === 'change') {
      currentLevelCommands = store.getState().terminal.commands.changeCommands;
    } else if (textArr[0] === 'open') {
      currentLevelCommands = store.getState().terminal.commands.openCommands;
    } else {
      currentLevelCommands = [];
    }
  }

  if (currentLevel === 2 && textArr[0] === 'change') {
    if (textArr[1] === 'language') {
      currentLevelCommands = store.getState().terminal.commands.changeLanguageCommands;
    } else if (textArr[1] === 'theme') {
      currentLevelCommands = store.getState().terminal.commands.changeBackgroundImageCommands;
    } else {
      currentLevelCommands = [];
    }
  }

  setCommandsWithCurrentLevel(currentLevelCommands, text);

  const { availableAutocomplete } = store.getState().terminal;

  if (availableAutocomplete.length < 1) {
    return text.split(' ')[text.split(' ').length - 1];
  }

  return availableAutocomplete[autocompleteNumber % availableAutocomplete.length];
}

export { getAvailableAutocomplete };
