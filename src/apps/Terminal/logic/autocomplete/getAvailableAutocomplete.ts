import store from 'src/redux/store';
import { setAvailableAutocomplete } from '@Terminal/redux/terminalSlice/terminalSlice';
import { TerminalCommand } from '@Terminal/enums/terminalCommand.enum';

function setCommandsWithCurrentLevel(commands: string[], text: string, appId: string): void {
  const textArr = text.split(' ');
  const isAlreadyCommand = text[text.length - 1] === ' ' || commands.includes(textArr[textArr.length - 1]);

  if (isAlreadyCommand) {
    store.dispatch(setAvailableAutocomplete({ autocomplete: commands, appId }));
    return;
  }

  const availableCommands = commands.filter((command) => command.startsWith(textArr[textArr.length - 1]));
  store.dispatch(setAvailableAutocomplete({ autocomplete: availableCommands, appId }));
}

function getAvailableAutocomplete(text: string, appId: string) {
  const terminalData = store.getState().terminal.terminalsData.find((el) => el.appId === appId)!;
  const { autocompleteNumber } = terminalData;

  if (autocompleteNumber) {
    const { availableAutocomplete } = terminalData;

    if (!availableAutocomplete) {
      return text.split(' ')[text.split(' ').length - 1];
    }

    return availableAutocomplete[autocompleteNumber % availableAutocomplete.length];
  }

  const currentLevel = text.split('').filter((el) => el === ' ')?.length || 0;
  const textArr = text.split(' ');
  let currentLevelCommands: string[] = [];

  if (currentLevel === 0) {
    currentLevelCommands = terminalData.commands.firstLevelCommands;
  }

  if (currentLevel === 1) {
    if (textArr[0] === TerminalCommand.Change) {
      currentLevelCommands = terminalData.commands.changeCommands;
    } else if (textArr[0] === TerminalCommand.Open) {
      currentLevelCommands = terminalData.commands.openCommands;
    } else {
      currentLevelCommands = [];
    }
  }

  if (currentLevel === 2 && textArr[0] === TerminalCommand.Change) {
    if (textArr[1] === 'language') {
      currentLevelCommands = terminalData.commands.changeLanguageCommands;
    } else if (textArr[1] === 'theme') {
      currentLevelCommands = terminalData.commands.changeBackgroundImageCommands;
    } else {
      currentLevelCommands = [];
    }
  }

  setCommandsWithCurrentLevel(currentLevelCommands, text, appId);

  const { availableAutocomplete } = terminalData;

  if (availableAutocomplete.length < 1) {
    return text.split(' ')[text.split(' ').length - 1];
  }

  return availableAutocomplete[autocompleteNumber % availableAutocomplete.length];
}

export { getAvailableAutocomplete };
