// Enums
import { App } from '@Enums/app.enum';

// Redux
import appsSlice, {
  setIconPosition,
  setWindowPosition,
  closeApp,
  openApp,
  setWindowActive,
  toggleCollapseApp,
} from './appsSlice';

describe('appsSlice', () => {
  const defaultState = {
    appsState: {
      [App.Calculator]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '28rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Settings]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '23rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Chat]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '18rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Simon]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '13rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Terminal]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '8rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.ToDo]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '3rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Minesweeper]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '33rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
      [App.Translate]: {
        isOpen: false,
        isCollapsed: false,
        iconPosition: {
          top: '38rem',
          left: '1rem',
        },
        windowPosition: {
          top: '15rem',
          left: '8rem',
        },
      },
    },
    currentAppsList: [],
  };

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
  });

  describe('setWindowActive', () => {
    it('should move the application to the first position in the list if it is not the first', () => {
      const resultState = appsSlice({
        ...defaultState,
        currentAppsList: [App.Terminal, App.Calculator, App.ToDo, App.Settings],
      }, setWindowActive(App.ToDo));

      expect(resultState).toEqual({
        ...defaultState,
        currentAppsList: [App.ToDo, App.Terminal, App.Calculator, App.Settings],
      });
    });

    it('should not change the order if the application is the first', () => {
      const resultState = appsSlice({
        ...defaultState,
        currentAppsList: [App.Calculator, App.ToDo, App.Terminal, App.Settings],
      }, setWindowActive(App.Calculator));

      expect(resultState).toEqual({
        ...defaultState,
        currentAppsList: [App.Calculator, App.ToDo, App.Terminal, App.Settings],
      });
    });
  });

  describe('openApp', () => {
    it('should set isOpen to true, isCollapsed to false and add the application to the first place in' +
      ' currentAppsList', () => {
      const resultState = appsSlice({
        appsState: {
          ...defaultState.appsState,
          [App.Simon]: {
            ...defaultState.appsState[App.Simon],
            isOpen: false,
            isCollapsed: true,
          },
        },
        currentAppsList: [App.Calculator, App.ToDo, App.Terminal, App.Settings],
      }, openApp(App.Simon));

      expect(resultState).toEqual({
        appsState: {
          ...defaultState.appsState,
          [App.Simon]: {
            ...defaultState.appsState[App.Simon],
            isOpen: true,
          },
        },
        currentAppsList: [App.Simon, App.Calculator, App.ToDo, App.Terminal, App.Settings],
      });
      expect(localStorage.setItem).toBeCalledTimes(0);
    });
  });

  describe('toggleCollapseApp', () => {
    it('should change isCollapsed to the opposite value if called once', () => {
      const resultStore = appsSlice({
        ...defaultState,
        currentAppsList: [App.Terminal],
      }, toggleCollapseApp(App.Terminal));

      expect(resultStore).toEqual({
        appsState: {
          ...defaultState.appsState,
          [App.Terminal]: {
            ...defaultState.appsState[App.Terminal],
            isCollapsed: true,
          },
        },
        currentAppsList: [App.Terminal],
      });
    });

    it('should not change isCollapsed if called twice', () => {
      const resultStoreAfterFirstCall = appsSlice({
        ...defaultState,
        currentAppsList: [App.Terminal],
      }, toggleCollapseApp(App.Terminal));

      const resultStore = appsSlice(resultStoreAfterFirstCall, toggleCollapseApp(App.Terminal));

      expect(resultStore).toEqual({
        ...defaultState,
        currentAppsList: [App.Terminal],
      });
    });
  });

  describe('closeApp', () => {
    it('should set isOpen to false, isCollapsed to false and delete the application from currentAppsList', () => {
      const resultState = appsSlice({
        appsState: {
          ...defaultState.appsState,
          [App.Simon]: {
            ...defaultState.appsState[App.Simon],
            isCollapsed: true,
            isOpen: true,
          },
        },
        currentAppsList: [App.Simon, App.Calculator],
      }, closeApp(App.Simon));

      expect(resultState).toEqual({
        ...defaultState,
        currentAppsList: [App.Calculator],
      });
    });
  });

  describe('setIconPosition', () => {
    it('should set iconPosition to new coordinates and set it to local storage', () => {
      const resultState = appsSlice(defaultState, setIconPosition({
        type: App.Calculator,
        coordinates: {
          top: '101rem',
          left: '404rem',
        },
      }));

      expect(resultState).toEqual({
        ...defaultState,
        appsState: {
          ...defaultState.appsState,
          [App.Calculator]: {
            ...defaultState.appsState[App.Calculator],
            iconPosition: {
              top: '101rem',
              left: '404rem',
            },
          },
        },
      });
      expect(localStorage.setItem).toBeCalledTimes(2);
    });
  });

  describe('setWindowPosition', () => {
    it('should set windowPosition to new coordinates', () => {
      const resultState = appsSlice(defaultState, setWindowPosition({
        type: App.Calculator,
        coordinates: {
          top: '101rem',
          left: '404rem',
        },
      }));

      expect(resultState).toEqual({
        ...defaultState,
        appsState: {
          ...defaultState.appsState,
          [App.Calculator]: {
            ...defaultState.appsState[App.Calculator],
            windowPosition: {
              top: '101rem',
              left: '404rem',
            },
          },
        },
      });
    });
  });
});
