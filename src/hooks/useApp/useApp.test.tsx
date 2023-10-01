// Libraries
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react-hooks';
import { ReactNode } from 'react';

// Enums
import { App } from '@Enums/app.enum';

// Hooks
import { useApp } from './useApp';

describe('useApp', () => {
  const middlewares: Middleware[] | undefined = [];
  const mockStore = configureStore(middlewares);

  describe('handleToggleCollapse', () => {
    it('should dispatch toggleCollapseApp and setWindowActive if it collapsed, open and the application index not' +
      ' equals 0', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Terminal, App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: true,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/toggleCollapseApp',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: App.Calculator,
        type: 'apps/setWindowActive',
      });
    });

    it('should dispatch setWindowActive if it is not collapsed, open and the application index' +
      ' not equals 0', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Terminal, App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: false,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/setWindowActive',
      });
    });

    it('should not dispatch anything if it not collapsed, not open and the application index not' +
      ' equals 0', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Terminal, App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: false,
              isCollapsed: false,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(0);
    });

    it('should dispatch toggleCollapseApp and setWindowActive if it collapsed, open and the' +
      ' application index equals 0', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator, App.Terminal],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: true,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/toggleCollapseApp',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: App.Calculator,
        type: 'apps/setWindowActive',
      });
    });

    it('should dispatch toggleCollapseApp and setWindowActive if it is not collapsed, open, the application index' +
      ' equals 0 and currentAppsList has another app', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator, App.Terminal],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: false,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/toggleCollapseApp',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: App.Terminal,
        type: 'apps/setWindowActive',
      });
    });

    it('should dispatch toggleCollapseApp and setWindowActive if it is not collapsed, open, the application index' +
      ' equals 0 and currentAppsList has not another app', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: false,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/toggleCollapseApp',
      });
    });

    it('should not dispatch anything if it not collapsed, not open and the application index' +
      ' equals 0', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator, App.Terminal],
          appsState: {
            [App.Calculator]: {
              isOpen: false,
              isCollapsed: false,
            },
          },
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleToggleCollapse();
      });

      expect(mockDispatch).toBeCalledTimes(0);
    });
  });

  describe('handleOpen', () => {
    it('should dispatch openApp if the application is not open', () => {
      const initialState = {
        apps: {
          currentAppsList: [],
          appsState: {
            [App.Calculator]: {
              isOpen: false,
              isCollapsed: false,
            },
          },
        },
      };

      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleOpen();
      });

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/openApp',
      });
    });

    it('should dispatch toggleCollapseApp and setWindowActive if the application open and collapsed', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: true,
            },
          },
        },
      };

      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleOpen();
      });

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/toggleCollapseApp',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        payload: App.Calculator,
        type: 'apps/setWindowActive',
      });
    });

    it('should not dispatch anything if the application is open and not collapsed', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: false,
            },
          },
        },
      };

      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleOpen();
      });

      expect(mockDispatch).toBeCalledTimes(0);
    });
  });

  describe('handleClose', () => {
    it('should dispatch closeApp if the application is open', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: true,
              isCollapsed: false,
            },
          },
        },
      };

      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleClose();
      });

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: App.Calculator,
        type: 'apps/closeApp',
      });
    });

    it('should not dispatch anything if the application is not open', () => {
      const initialState = {
        apps: {
          currentAppsList: [App.Calculator],
          appsState: {
            [App.Calculator]: {
              isOpen: false,
              isCollapsed: false,
            },
          },
        },
      };

      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={mockStoreWithState}>{children}</Provider>
      );
      const { result } = renderHook(() => useApp(App.Calculator), { wrapper });

      act(() => {
        result.current.handleClose();
      });

      expect(mockDispatch).toBeCalledTimes(0);
    });
  });
});
