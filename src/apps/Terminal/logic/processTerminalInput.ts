// Redux
import { addTerminalHistory, clearTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';

// I18n
import i18n from '@Features/i18n';

// Logic
import { getCalcResult } from '@Calculator/logic/getCalculatorResult';
import { terminalProcessOpenCommand } from './open/terminalProcessOpenCommand';
import { terminalProcessChangeCommand } from './change/terminalProcessChangeCommand';

function processTerminalInput(input: string) {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case 'open': {
      terminalProcessOpenCommand(input.split(' ').slice(1).join(' '));
      break;
    }
    case 'clear': {
      dispatch(clearTerminalHistory());
      break;
    }
    case 'help': {
      dispatch(addTerminalHistory(`${i18n.t('terminal:availableCommands')}: open, clear, change`));
      break;
    }
    case 'change': {
      terminalProcessChangeCommand(input.split(' ').slice(1).join(' '));
      break;
    }
    case 'ps': {
      dispatch(addTerminalHistory('id name'));
      const { currentAppsList } = store.getState().apps;
      for (let i = 0; i < currentAppsList.length; i++) {
        dispatch(addTerminalHistory(`${i < 10 ? `0${i}` : i} ${currentAppsList[i]}`));
      }
      break;
    }
    case 'calculator': {
      const expression = input.split(' ');
      if (expression.length < 2) {
        dispatch(addTerminalHistory('You must enter expression'));
        break;
      }
      const result = getCalcResult(expression.slice(1).join(' '));
      dispatch(addTerminalHistory(result));
      break;
    }
    default: {
      dispatch(addTerminalHistory(`${i18n.t('terminal:unknownCommand')}`));
      dispatch(addTerminalHistory(`${i18n.t('terminal:typeHelp')}`));
    }
  }
}

export { processTerminalInput };
