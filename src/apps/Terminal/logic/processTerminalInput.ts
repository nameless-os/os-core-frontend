import { addTerminalHistory, clearTerminalHistory } from '@Terminal/redux/terminalSlice/terminalSlice';
import store from 'src/redux/store';
import i18n from '@Features/i18n';
import { getCalcResult } from '@Calculator/logic/getCalculatorResult';
import { terminalProcessOpenCommand } from './open/terminalProcessOpenCommand';
import { terminalProcessChangeCommand } from './change/terminalProcessChangeCommand';
import { terminalProcessCloseCommand } from '@Terminal/logic/close/terminalProcessCloseCommand';
import { TerminalCommand } from '@Terminal/enums/terminalCommand.enum';

function processTerminalInput(input: string, appId: string) {
  const { dispatch } = store;

  switch (input.split(' ')[0]) {
    case TerminalCommand.Open: {
      terminalProcessOpenCommand(input.split(' ').slice(1).join(' '), appId);
      break;
    }
    case TerminalCommand.Close: {
      terminalProcessCloseCommand(input.split(' ').slice(1).join(' '), appId);
      break;
    }
    case TerminalCommand.Clear: {
      dispatch(clearTerminalHistory(appId));
      break;
    }
    case TerminalCommand.Help: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:availableCommands')}: open, clear, change`, appId }));
      break;
    }
    case TerminalCommand.Change: {
      terminalProcessChangeCommand(input.split(' ').slice(1).join(' '), appId );
      break;
    }
    case TerminalCommand.Ps: {
      dispatch(addTerminalHistory({ message: 'id name time', appId }));
      const currentAppsList = store.getState().apps.apps;
      for (let id in currentAppsList) {
        if (currentAppsList[id] === null) {
          continue;
        }
        const time = (new Date().getTime() - currentAppsList[id]!.openTime) / 60000;
        dispatch(addTerminalHistory({ message: `${id} ${currentAppsList[id]!.type} ${time.toFixed(0)}min`, appId }));
      }
      break;
    }
    case TerminalCommand.Calculator: {
      const expression = input.split(' ');
      if (expression.length < 2) {
        dispatch(addTerminalHistory({ message: 'You must enter expression', appId }));
        break;
      }
      const result = getCalcResult(expression.slice(1).join(' '));
      dispatch(addTerminalHistory({ message: result, appId }));
      break;
    }
    default: {
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:unknownCommand')}`, appId }));
      dispatch(addTerminalHistory({ message: `${i18n.t('terminal:typeHelp')}`, appId }));
    }
  }
}

export { processTerminalInput };
