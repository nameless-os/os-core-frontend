// Libraries
import { Middleware } from '@reduxjs/toolkit';
import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

// Utils
import * as isLoggedIn from 'src/utils/isLoggedIn';

// Components
import { ToDo } from './ToDo';

jest.mock('socket.io-client');
jest.mock('react-i18next', () => jest.requireActual('../../../__mocks__/react-i18next'));
jest.mock('src/components/Icon/Icon', () => ({
  Icon: () => <div data-testid="Icon" />,
}));
jest.mock('src/components/Window/Window', () => ({
  Window: ({ children }: { children: React.ReactNode }) => <div data-testid="Window">{children}</div>,
}));
jest.mock('./components/ToDoItemDetails/ToDoItemDetails', () => ({
  ToDoItemDetails: () => <div data-testid="ToDoItemDetails" />,
}));
jest.mock('./components/ToDoInput/ToDoInput', () => ({
  ToDoInput: () => <div data-testid="ToDoInput" />,
}));
jest.mock('../../components/TopWindowError/TopWindowError', () => ({
  TopWindowError: () => <div data-testid="TopWindowError" />,
}));
jest.mock('./components/ToDoList/ToDoList', () => ({
  ToDoList: () => <div data-testid="ToDoList" />,
}));
jest.mock('./redux/toDoSlice/toDoSlice', () => ({
  getToDoItems: () => ({
    type: 'getToDoItems',
  }),
}));

describe('ToDo', () => {
  const middlewares: Middleware[] | undefined = [];
  const mockStore = configureStore(middlewares);

  describe('should render correct', () => {
    it('should render if activeToDoPage equals \'\' and isLoggedIn return false', () => {
      const initialState = {
        toDo: {
          activeToDoPage: '',
          addError: '',
          updateError: '',
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

      render(
        <Provider store={mockStoreWithState}>
          <ToDo />
        </Provider>,
      );

      expect(screen.getByTestId('Icon')).toBeInTheDocument();
      expect(screen.getByTestId('Window')).toBeInTheDocument();
      expect(screen.getByTestId('ToDoList')).toBeInTheDocument();
      expect(screen.queryByTestId('ToDoItemDetails')).not.toBeInTheDocument();
      expect(screen.getByTestId('TopWindowError')).toBeInTheDocument();
      expect(mockDispatch).toBeCalledTimes(0);
    });

    it('should render if activeToDoPage equals \'\' and isLoggedIn return true', () => {
      const initialState = {
        toDo: {
          activeToDoPage: '',
          addError: '',
          updateError: '',
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(true);

      render(
        <Provider store={mockStoreWithState}>
          <ToDo />
        </Provider>,
      );

      expect(screen.getByTestId('Icon')).toBeInTheDocument();
      expect(screen.getByTestId('Window')).toBeInTheDocument();
      expect(screen.getByTestId('ToDoList')).toBeInTheDocument();
      expect(screen.queryByTestId('ToDoItemDetails')).not.toBeInTheDocument();
      expect(screen.getByTestId('TopWindowError')).toBeInTheDocument();
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({
        'type': 'getToDoItems',
      });
    });

    it('should render if activeToDoPage not equals \'\'', () => {
      const initialState = {
        toDo: {
          activeToDoPage: '1',
          addError: '',
          updateError: '',
        },
      };
      const mockStoreWithState = mockStore(initialState);
      const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

      render(
        <Provider store={mockStoreWithState}>
          <ToDo />
        </Provider>,
      );

      expect(screen.getByTestId('Icon')).toBeInTheDocument();
      expect(screen.getByTestId('Window')).toBeInTheDocument();
      expect(screen.queryByTestId('ToDoList')).not.toBeInTheDocument();
      expect(screen.getByTestId('ToDoItemDetails')).toBeInTheDocument();
      expect(screen.queryByTestId('TopWindowError')).not.toBeInTheDocument();
      expect(mockDispatch).toBeCalledTimes(0);
    });
  });
});
