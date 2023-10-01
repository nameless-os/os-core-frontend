// Libraries
import { Middleware } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';

// Utils
import * as isLoggedIn from 'src/utils/isLoggedIn';

// Components
import { ToDoItem } from 'src/apps/ToDo/components/ToDoItem/ToDoItem';

jest.mock('socket.io-client');
jest.mock('react-i18next', () => jest.requireActual('../../../../../__mocks__/react-i18next'));
jest.mock('src/apps/toDo/redux/toDoSlice/toDoSlice', () => ({
  deleteToDoItemLocal: (payload: unknown) => ({
    type: 'deleteToDoItemLocal',
    payload,
  }),
  deleteToDoItem: (payload: unknown) => ({
    type: 'deleteToDoItem',
    payload,
  }),
  updateToDoItemLocal: (payload: unknown) => ({
    type: 'updateToDoItemLocal',
    payload,
  }),
  updateToDoItem: (payload: unknown) => ({
    type: 'updateToDoItem',
    payload,
  }),
  changeActiveToDoPage: (payload: unknown) => ({
    type: 'changeActiveToDoPage',
    payload,
  }),
}));

describe('to do item component', () => {
  const middlewares: Middleware[] | undefined = [];
  const mockStore = configureStore(middlewares);
  const initialState = {
    toDo: {
      toDoList: [{
        id: '1',
        heading: 'test',
        isComplete: false,
        description: 'test description',
      }, {
        id: '2',
        heading: 'test2',
        isComplete: true,
        description: '',
      }],
    },
  };
  const mockStoreWithState = mockStore(initialState);
  const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');

  it('should render correct', () => {
    render(
      <Provider store={mockStoreWithState}>
        <ToDoItem id='1' />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByText(initialState.toDo.toDoList[0].heading)).toBeInTheDocument();
    expect(screen.queryByText(initialState.toDo.toDoList[0].description)).not.toBeInTheDocument();
  });

  describe('should handle user events', () => {
    it('should dispatch deleteToDoItemLocal on click delete button if isLoggedIn return false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItem id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

      const deleteButton = screen.getByRole('button', { name: 'deleteItemWithText test' });
      userEvent.click(deleteButton);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'deleteToDoItemLocal',
        payload: '1',
      });
    });

    it('should dispatch deleteToDoItem on click delete button if isLoggedIn return true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItem id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(true);

      const deleteButton = screen.getByRole('button', { name: 'deleteItemWithText test' });
      userEvent.click(deleteButton);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'deleteToDoItem',
        payload: '1',
      });
    });

    it('should dispatch updateToDoItemLocal on click toggle button if isLoggedIn return false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItem id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

      const toggleButton = screen.getByRole('button', { name: 'toggleItemWithText test' });
      userEvent.click(toggleButton);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'updateToDoItemLocal',
        payload: {
          'description': 'test description',
          'heading': 'test',
          'id': '1',
          'isComplete': true,
        },
      });
    });

    it('should dispatch updateToDoItem on click toggle button if isLoggedIn return true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItem id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(true);

      const toggleButton = screen.getByRole('button', { name: 'toggleItemWithText test' });
      userEvent.click(toggleButton);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'updateToDoItem',
        payload: {
          'description': 'test description',
          'heading': 'test',
          'id': '1',
          'isComplete': true,
        },
      });
    });

    it('should dispatch changeActiveToDoPage on click item', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItem id='1' />
        </Provider>,
      );

      const itemButton = screen.getByRole('button', { name: 'goToToDoEditPage' });
      userEvent.click(itemButton);

      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'changeActiveToDoPage',
        payload: '1',
      });
    });
  });
});

export {};
