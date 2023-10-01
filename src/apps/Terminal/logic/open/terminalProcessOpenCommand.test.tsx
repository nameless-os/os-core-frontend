// Redux
import store from 'src/redux/store';

// Enums
import { App } from '@Enums/app.enum';

// Logic
import { terminalProcessOpenCommand } from './terminalProcessOpenCommand';

describe('open terminal module', () => {
  store.dispatch = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should dispatch open settings when input = settings', () => {
    terminalProcessOpenCommand('settings');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'App is open',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { type: App.Settings },
      type: 'apps/openApp',
    });
  });

  it('should dispatch open settings when input = calculator', () => {
    terminalProcessOpenCommand('calculator');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'App is open',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { type: App.Calculator },
      type: 'apps/openApp',
    });
  });

  it('should dispatch open settings when input = toDo', () => {
    terminalProcessOpenCommand('toDo');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'App is open',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { type: App.ToDo },
      type: 'apps/openApp',
    });
  });

  it('should dispatch open settings when input = chat', () => {
    terminalProcessOpenCommand('chat');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'App is open',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { type: App.Chat },
      type: 'apps/openApp',
    });
  });

  it('should dispatch open settings when input = simon', () => {
    terminalProcessOpenCommand('simon');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'App is open',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: { type: App.Simon },
      type: 'apps/openApp',
    });
  });

  it('should dispatch help string when input = help', () => {
    terminalProcessOpenCommand('help');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command opens app',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available apps: calculator, toDo, settings, chat, simon',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch help string when input = -h', () => {
    terminalProcessOpenCommand('-h');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command opens app',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available apps: calculator, toDo, settings, chat, simon',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch syntax help when input empty', () => {
    terminalProcessOpenCommand('');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Wrong command, please try again',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Syntax: open "name of app"',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch unknown string when input uncorrect', () => {
    terminalProcessOpenCommand('dsadasda');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown app',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available apps: calculator, toDo, settings, chat, simon',
      type: 'terminal/addTerminalHistory',
    });
  });
});

export {};
