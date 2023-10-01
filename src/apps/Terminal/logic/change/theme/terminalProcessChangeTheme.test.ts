// Redux
import store from 'src/redux/store';

// Logic
import { terminalProcessChangeTheme } from './terminalProcessChangeTheme';

describe('change theme terminal module', () => {
  store.dispatch = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('dispatch change background then input equals one of background images', () => {
    store.getState().theme.backgroundImages.forEach((backgroundImage, index) => {
      terminalProcessChangeTheme(backgroundImage);
      expect(store.dispatch).toBeCalledTimes(2 * (index + 1));
      expect(store.dispatch).toHaveBeenNthCalledWith(2 * index + 1, {
        payload: 'Theme is change',
        type: 'terminal/addTerminalHistory',
      });
      expect(store.dispatch).toHaveBeenNthCalledWith(2 * (index + 1), {
        payload: { backgroundImage },
        type: 'theme/setBackgroundImage',
      });
    });
  });

  it('dispatch help string then input = help', () => {
    terminalProcessChangeTheme('help');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes theme',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available themes: planet, sea, tree, road, car, dynamic, dynamic2',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch help string then input = -h', () => {
    terminalProcessChangeTheme('-h');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'This command changes theme',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available themes: planet, sea, tree, road, car, dynamic, dynamic2',
      type: 'terminal/addTerminalHistory',
    });
  });

  it('dispatch syntax string then input empty', () => {
    terminalProcessChangeTheme('');
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
    terminalProcessChangeTheme('dasdasdas');
    expect(store.dispatch).toBeCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: 'Unknown theme',
      type: 'terminal/addTerminalHistory',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: 'Available themes: planet, sea, tree, road, car, dynamic, dynamic2',
      type: 'terminal/addTerminalHistory',
    });
  });
});

export {};
