// Types
import { Language } from 'src/features/i18n/types/language';

// Redux
import store from 'src/redux/store';

// Logic
import { terminalProcessChangeLanguage } from './terminalProcessChangeLanguage';

describe('change language terminal module', () => {
  store.dispatch = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('dispatch change language then input = ru', () => {
    terminalProcessChangeLanguage('ru');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: { language: Language.Russian },
      type: 'language/setLanguage',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Language is change',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch change language then input = br', () => {
    terminalProcessChangeLanguage('en');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: { language: Language.English },
      type: 'language/setLanguage',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Language is change',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch help string then input = help', () => {
    terminalProcessChangeLanguage('help');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes language',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available languages: ru(Russian), en(English)',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch help string then input = -h', () => {
    terminalProcessChangeLanguage('-h');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes language',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available languages: ru(Russian), en(English)',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch syntax string then input empty', () => {
    terminalProcessChangeLanguage('');
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

  it('dispatch unknown string then input uncorrect', () => {
    terminalProcessChangeLanguage('dasdasdas');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown language',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available languages: ru(Russian), en(English)',
      type: 'terminal/addTerminalHistory',
    });
  });
});

export {};
