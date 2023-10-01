// Libraries
import { Middleware } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Utils
import * as isLoggedIn from 'src/utils/isLoggedIn';

// Components
import { ToDoInput } from 'src/apps/ToDo/components/ToDoInput/ToDoInput';

jest.mock('socket.io-client');
jest.mock('react-i18next', () => jest.requireActual('../../../../../__mocks__/react-i18next'));
jest.mock('src/apps/toDo/redux/toDoSlice/toDoSlice', () => ({
  addToDoItem: (payload: unknown) => ({
    type: 'toDo/addToDoItem',
    payload,
  }),
  addToDoItemLocal: (payload: unknown) => ({
    type: 'toDo/addToDoItemLocal',
    payload,
  }),
}));

describe('ToDoInput', () => {
  const middlewares: Middleware[] | undefined = [];
  const mockStore = configureStore(middlewares);
  const initialState = {};
  const mockStoreWithState = mockStore(initialState);
  const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');

  it('should render correct', () => {
    render(
      <Provider store={mockStoreWithState}>
        <ToDoInput />
      </Provider>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('form', { name: 'toDoItemCreateForm' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'headingOfNewToDoItem' })).toBeInTheDocument();
  });

  it('should change input value on input', async () => {
    await act(() => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoInput/>
        </Provider>,
      );
    });

    const input: HTMLInputElement = screen.getByRole('textbox', { name: 'headingOfNewToDoItem' });
    userEvent.type(input, 'Dark');

    expect(input.value).toEqual('Dark');
  });

  it('should dispatch addToDoItem and set input to empty string on submit if isLoggedIn return true', async () => {
    await act(() => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoInput />
        </Provider>,
      );
    });
    jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(true);

    const input: HTMLInputElement = screen.getByRole('textbox', { name: 'headingOfNewToDoItem' });
    const button = screen.getByRole('button');

    userEvent.type(input, 'Dark');
    userEvent.click(button);

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(input.value).toEqual('');
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: 'Dark',
      type: 'toDo/addToDoItem',
    });
  });

  it('should dispatch addToDoItemLocal and set input to empty string on submit if isLoggedIn return false', async () => {
    await act(() => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoInput />
        </Provider>,
      );
    });
    jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

    const input: HTMLInputElement = screen.getByRole('textbox', { name: 'headingOfNewToDoItem' });
    const button = screen.getByRole('button');

    userEvent.type(input, 'Dark');
    userEvent.click(button);

    await waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(0));
    expect(input.value).toEqual('');
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: 'Dark',
      type: 'toDo/addToDoItemLocal',
    });
  });
});
