// Redux
import store from 'src/redux/store';
import {
  addTerminalHistory,
  clearTerminalHistory,
  clearTerminalInputHistory,
} from './terminalSlice';

describe('terminal slice', () => {
  it('clear terminal history then calls clearTerminalHistory', () => {
    store.dispatch(addTerminalHistory('root:~$ first input message'));
    store.dispatch(addTerminalHistory('first output message'));
    store.dispatch(addTerminalHistory('second output message'));
    store.dispatch(clearTerminalHistory());
    expect(store.getState().terminal.terminalHistory).toHaveLength(0);
    store.dispatch(clearTerminalInputHistory());
  });

  it('clear terminal input history then calls clearTerminalInputHistory', () => {
    store.dispatch(addTerminalHistory('root:~$ first input message'));
    store.dispatch(addTerminalHistory('first output message'));
    store.dispatch(addTerminalHistory('second output message'));
    store.dispatch(clearTerminalInputHistory());
    expect(store.getState().terminal.terminalInputHistory).toHaveLength(0);
    store.dispatch(clearTerminalHistory());
  });

  it('add terminal history item then calls addTerminalHistory', () => {
    store.dispatch(addTerminalHistory('root:~$ first input message'));
    expect(store.getState().terminal.terminalHistory).toHaveLength(1);
    expect(store.getState().terminal.terminalHistory[0].message).toEqual('root:~$ first input message');
    store.dispatch(addTerminalHistory('first output message'));
    expect(store.getState().terminal.terminalHistory).toHaveLength(2);
    expect(store.getState().terminal.terminalHistory[1].message).toEqual('first output message');
    store.dispatch(addTerminalHistory('second output message'));
    expect(store.getState().terminal.terminalHistory).toHaveLength(3);
    expect(store.getState().terminal.terminalHistory[2].message).toEqual('second output message');
    store.dispatch(clearTerminalHistory());
    store.dispatch(clearTerminalInputHistory());
  });

  it('add inputHistory item then calls addTerminalHistory with input string', () => {
    store.dispatch(addTerminalHistory('root:~$ first input message'));
    expect(store.getState().terminal.terminalInputHistory).toHaveLength(1);
    expect(store.getState().terminal.terminalInputHistory[0]).toEqual('first input message');
    store.dispatch(addTerminalHistory('root:~$ second input message'));
    expect(store.getState().terminal.terminalInputHistory).toHaveLength(2);
    expect(store.getState().terminal.terminalInputHistory[1]).toEqual('second input message');
    store.dispatch(clearTerminalHistory());
    store.dispatch(clearTerminalInputHistory());
  });
});

export {};
