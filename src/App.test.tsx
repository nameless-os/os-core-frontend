// Libraries
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';
import configureStore from 'redux-mock-store';
import React from 'react';
import { Provider } from 'react-redux';

// Enums
import { Theme } from '@Features/theme/types/theme';

// Pages
import * as Login from '@Pages/Login/Login';
import * as Registration from '@Pages/Registration/Registration';
import * as Main from '@Pages/Main/Main';

// Components
import * as TopBar from '@Components/TopBar/TopBar';
import * as BottomPanel from '@Components/BottomPanel/BottomPanel';
import App from './App';

describe('App', () => {
  const middlewares: Middleware<{}, any, Dispatch<AnyAction>>[] | undefined = [];
  const mockStore = configureStore(middlewares);
  const initialState = {
    theme: {
      theme: Theme.Dark,
    },
  };
  const mockStoreWithState = mockStore(initialState);

  beforeEach(() => {
    jest.spyOn(Login, 'Login').mockReturnValue(<div data-testid="LoginForm" />);
    jest.spyOn(Registration, 'Registration').mockReturnValue(<div data-testid="RegistrationForm" />);
    jest.spyOn(TopBar, 'TopBar').mockReturnValue(<div data-testid="TopBar" />);
    jest.spyOn(Main, 'Main').mockReturnValue(<div data-testid="Main" />);
    jest.spyOn(BottomPanel, 'BottomPanel').mockReturnValue(<div data-testid="BottomPanel" />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('routing should work correctly', () => {
    it('login route should work correctly', () => {
      window.history.pushState({}, 'Test page', '/login');
      render(
        <Provider store={mockStoreWithState}>
          <App />
        </Provider>, { wrapper: MemoryRouter },
      );

      const loginForm = screen.queryByTestId('LoginForm');
      const registrationForm = screen.queryByTestId('RegistrationForm');
      const topBar = screen.queryByTestId('TopBar');
      const main = screen.queryByTestId('Main');
      const bottomPanel = screen.queryByTestId('BottomPanel');

      expect(loginForm).toBeInTheDocument();
      expect(registrationForm).not.toBeInTheDocument();
      expect(topBar).not.toBeInTheDocument();
      expect(main).not.toBeInTheDocument();
      expect(bottomPanel).not.toBeInTheDocument();
    });

    it('registration route should work correctly', () => {
      window.history.pushState({}, 'Test page', '/registration');
      render(
        <Provider store={mockStoreWithState}>
          <App />
        </Provider>, { wrapper: MemoryRouter },
      );

      const loginForm = screen.queryByTestId('LoginForm');
      const registrationForm = screen.queryByTestId('RegistrationForm');
      const topBar = screen.queryByTestId('TopBar');
      const main = screen.queryByTestId('Main');
      const bottomPanel = screen.queryByTestId('BottomPanel');

      expect(loginForm).not.toBeInTheDocument();
      expect(registrationForm).toBeInTheDocument();
      expect(topBar).not.toBeInTheDocument();
      expect(main).not.toBeInTheDocument();
      expect(bottomPanel).not.toBeInTheDocument();
    });

    it('empty route should work correctly', () => {
      window.history.pushState({}, 'Test page', '/');
      render(
        <Provider store={mockStoreWithState}>
          <App />
        </Provider>, { wrapper: MemoryRouter },
      );

      const loginForm = screen.queryByTestId('LoginForm');
      const registrationForm = screen.queryByTestId('RegistrationForm');
      const topBar = screen.queryByTestId('TopBar');
      const main = screen.queryByTestId('Main');
      const bottomPanel = screen.queryByTestId('BottomPanel');

      expect(loginForm).not.toBeInTheDocument();
      expect(registrationForm).not.toBeInTheDocument();
      expect(topBar).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(bottomPanel).toBeInTheDocument();
    });
  });
});
