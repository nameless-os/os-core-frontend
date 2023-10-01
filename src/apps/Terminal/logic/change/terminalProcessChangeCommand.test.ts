// Redux
import store from 'src/redux/store';

// Logic
import * as terminalProcessChangeTheme from './theme/terminalProcessChangeTheme';
import * as terminalProcessChangeLanguage from './language/terminalProcessChangeLanguage';
import { terminalProcessChangeCommand } from './terminalProcessChangeCommand';

describe('should change terminal module', () => {
  store.dispatch = jest.fn();
  const mockTerminalProcessChangeTheme = jest.spyOn(terminalProcessChangeTheme, 'terminalProcessChangeTheme');
  const mockTerminalProcessChangeLocale = jest.spyOn(terminalProcessChangeLanguage, 'terminalProcessChangeLanguage');

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should calls terminalProcessChangeTheme then input = theme', () => {
    terminalProcessChangeCommand('theme');
    expect(mockTerminalProcessChangeTheme).toBeCalledTimes(1);
    expect(mockTerminalProcessChangeTheme).toHaveBeenNthCalledWith(1, '');
  });

  it('should calls terminalProcessChangeTheme then input = -t', () => {
    terminalProcessChangeCommand('-t');
    expect(mockTerminalProcessChangeTheme).toBeCalledTimes(1);
    expect(mockTerminalProcessChangeTheme).toHaveBeenNthCalledWith(1, '');
  });

  it('should calls terminalProcessChangeTheme with correct args then input = theme sea', () => {
    terminalProcessChangeCommand('theme sea');
    expect(mockTerminalProcessChangeTheme).toBeCalledTimes(1);
    expect(mockTerminalProcessChangeTheme).toHaveBeenNthCalledWith(1, 'sea');
  });

  it('should calls terminalProcessChangeLocale then input = locale', () => {
    terminalProcessChangeCommand('language');
    expect(mockTerminalProcessChangeLocale).toBeCalledTimes(1);
    expect(mockTerminalProcessChangeLocale).toHaveBeenNthCalledWith(1, '');
  });

  it('should calls terminalProcessChangeLocale then input = -l', () => {
    terminalProcessChangeCommand('-l');
    expect(mockTerminalProcessChangeLocale).toBeCalledTimes(1);
    expect(mockTerminalProcessChangeLocale).toHaveBeenNthCalledWith(1, '');
  });

  it('should dispatch help string then input = help', () => {
    terminalProcessChangeCommand('help');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes value of selected category',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available categories: locale (-l), theme (-t)',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch help string then input = -h', () => {
    terminalProcessChangeCommand('-h');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes value of selected category',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available categories: locale (-l), theme (-t)',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch syntax string then input empty', () => {
    terminalProcessChangeCommand('');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Wrong command, please try again',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Syntax: change "category to change" "new value"',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch unknown string then input uncorrect', () => {
    terminalProcessChangeCommand('dasdasdas');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown category',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available categories: locale (-l), theme (-t)',
      type: 'terminal/addTerminalHistory',
    });
  });
});

export {};
