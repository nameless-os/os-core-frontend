// Redux
import store from 'src/redux/store';

// Logic
import * as terminalProcessOpenCommand from './open/terminalProcessOpenCommand';
import * as terminalProcessChangeCommand from './change/terminalProcessChangeCommand';
import { processTerminalInput } from './processTerminalInput';

describe('main terminal module', () => {
  store.dispatch = jest.fn();
  const terminalProcessOpenCommandMock = jest.spyOn(terminalProcessOpenCommand, 'terminalProcessOpenCommand');
  const terminalProcessChangeCommandMock = jest.spyOn(terminalProcessChangeCommand, 'terminalProcessChangeCommand');

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should dispatch unknown command if input empty', () => {
    processTerminalInput('');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown command',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Type "help" to view available commands',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should dispatch unknown command if input uncorrect', () => {
    processTerminalInput('dasdas');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown command',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Type "help" to view available commands',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should clear terminal history when input = clear', () => {
    processTerminalInput('clear');
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: undefined,
      type: 'terminal/clearTerminalHistory',
    });
  });

  it('should dispatch help string when input = help', () => {
    processTerminalInput('help');
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Available commands: open, clear, change',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('should calls terminalProcessOpenCommand when input = open', () => {
    processTerminalInput('open');
    expect(store.dispatch).toBeCalledTimes(0);
    expect(terminalProcessOpenCommandMock).toBeCalledTimes(1);
    expect(terminalProcessOpenCommandMock).toHaveBeenNthCalledWith(1, '');
  });

  it('should calls terminalProcessOpenCommand with correct args when input = open calculator', () => {
    processTerminalInput('open calculator');
    expect(store.dispatch).toBeCalledTimes(0);
    expect(terminalProcessOpenCommandMock).toBeCalledTimes(1);
    expect(terminalProcessOpenCommandMock).toHaveBeenNthCalledWith(1, 'calculator');
  });

  it('should calls terminalProcessChangeCommand when input = change', () => {
    processTerminalInput('change');
    expect(store.dispatch).toBeCalledTimes(0);
    expect(terminalProcessChangeCommandMock).toBeCalledTimes(1);
    expect(terminalProcessChangeCommandMock).toHaveBeenNthCalledWith(1, '');
  });
});

export {};
