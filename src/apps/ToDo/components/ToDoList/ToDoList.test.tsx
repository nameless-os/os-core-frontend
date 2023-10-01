// Libraries
import { Middleware } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Components
import { ToDoList } from 'src/apps/ToDo/components/ToDoList/ToDoList';

jest.mock('socket.io-client');
jest.mock('react-i18next', () => jest.requireActual('../../../../../__mocks__/react-i18next'));
jest.mock('src/components/Scrollbar/Scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div data-testid="Scrollbar">{children}</div>,
}));
jest.mock('src/components/Loading/Loading', () => ({
  Loading: () => <div data-testid="Loading" />,
}));
jest.mock('src/components/Error/Error', () => ({
  Error: () => <div data-testid="Error" />,
}));
jest.mock('../ToDoItem/ToDoItem', () => ({
  ToDoItem: () => <div data-testid="ToDoItem" />,
}));

describe('ToDoList', () => {
  const middlewares: Middleware[] | undefined = [];
  const mockStore = configureStore(middlewares);

  describe('should render correct', () => {
    it('should render correct if isLoading is true', () => {
      const initialState = {
        toDo: {
          isToDoListLoading: true,
          toDoListError: '',
          toDoList: [{
            id: '1',
            heading: 'test',
            isComplete: false,
            description: '',
          }, {
            id: '2',
            heading: 'test2',
            isComplete: true,
            description: '',
          }],
        },
      };
      const mockStoreWithState = mockStore(initialState);

      render(
        <Provider store={mockStoreWithState}>
          <ToDoList />
        </Provider>,
      );

      expect(screen.getByTestId('Loading')).toBeInTheDocument();
      expect(screen.queryByTestId('Error')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('ToDoItem')).toHaveLength(0);
    });

    it('should render correct if component has error', () => {
      const initialState = {
        toDo: {
          isToDoListLoading: false,
          toDoListError: 'Error',
          toDoList: [{
            id: '1',
            heading: 'test',
            isComplete: false,
            description: '',
          }, {
            id: '2',
            heading: 'test2',
            isComplete: true,
            description: '',
          }],
        },
      };
      const mockStoreWithState = mockStore(initialState);

      render(
        <Provider store={mockStoreWithState}>
          <ToDoList />
        </Provider>,
      );

      expect(screen.getByTestId('Error')).toBeInTheDocument();
      expect(screen.queryByTestId('Loading')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('ToDoItem')).toHaveLength(0);
    });

    it('should render correct if component has not error and isLoading equals false', () => {
      const initialState = {
        toDo: {
          isToDoListLoading: false,
          toDoListError: '',
          toDoList: [{
            id: '1',
            heading: 'test',
            isComplete: false,
            description: '',
          }, {
            id: '2',
            heading: 'test2',
            isComplete: true,
            description: '',
          }],
        },
      };
      const mockStoreWithState = mockStore(initialState);

      render(
        <Provider store={mockStoreWithState}>
          <ToDoList />
        </Provider>,
      );

      expect(screen.queryByTestId('Error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('Loading')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('ToDoItem')).toHaveLength(2);
    });
  });
});
