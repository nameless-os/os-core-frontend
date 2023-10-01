// Libraries
import { Middleware } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Utils
import * as isLoggedIn from 'src/utils/isLoggedIn';

// Components
import { ToDoItemDetails } from 'src/apps/ToDo/components/ToDoItemDetails/ToDoItemDetails';

jest.mock('socket.io-client');
jest.mock('react-i18next', () => jest.requireActual('../../../../../__mocks__/react-i18next'));
jest.mock('src/components/TopWindowError/TopWindowError', () => ({
  TopWindowError: () => <div data-testid="TopWindowError" />,
}));
jest.mock('src/apps/toDo/redux/toDoSlice/toDoSlice', () => ({
  updateToDoItem: (payload: unknown) => ({
    type: 'updateToDoItem',
    payload,
  }),
  updateToDoItemLocal: (payload: unknown) => ({
    type: 'updateToDoItemLocal',
    payload,
  }),
  closeToDoUpdateError: () => ({
    type: 'closeToDoUpdateError',
  }),
  changeActiveToDoPage: (payload: unknown) => ({
    type: 'changeActiveToDoPage',
    payload,
  }),
}));

describe('ToDoItemDetails', () => {
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
      isUpdateLoading: false,
      updateError: '',
    },
  };
  const mockStoreWithState = mockStore(initialState);
  const mockDispatch = jest.spyOn(mockStoreWithState, 'dispatch');

  describe('should render correct', () => {
    it('should render correct if isEditable equals false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      expect(screen.getByTestId('TopWindowError')).toBeInTheDocument();
      expect(screen.getByText('back')).toBeInTheDocument();
      expect(screen.getByText('edit')).toBeInTheDocument();
      expect(screen.queryByText('save')).not.toBeInTheDocument();
      expect(screen.queryByText('cancel')).not.toBeInTheDocument();
      expect(screen.queryByText('change')).not.toBeInTheDocument();
      expect(screen.getByText('heading:')).toBeInTheDocument();
      expect(screen.getByText('description:')).toBeInTheDocument();
      expect(screen.getByText('status: inProcess')).toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].heading)).toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].description)).toBeInTheDocument();
    });

    it('should render correct if isEditable equals true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      screen.getByText('edit').click();

      expect(screen.getByTestId('TopWindowError')).toBeInTheDocument();
      expect(screen.getByText('save')).toBeInTheDocument();
      expect(screen.getByText('cancel')).toBeInTheDocument();
      expect(screen.queryByText('edit')).not.toBeInTheDocument();
      expect(screen.queryByText('back')).not.toBeInTheDocument();
      expect(screen.getByText('change')).toBeInTheDocument();
      expect(screen.getByText('heading:')).toBeInTheDocument();
      expect(screen.getByText('description:')).toBeInTheDocument();
      expect(screen.getByText('status: inProcess')).toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].heading)).toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].description)).toBeInTheDocument();
    });
  });

  describe('should handle user events', () => {
    it('should handle change input if isEditable false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const input = screen.getByDisplayValue(initialState.toDo.toDoList[0].heading);
      userEvent.type(input, 'Test...');

      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].heading)).toBeInTheDocument();
      expect(screen.queryByDisplayValue(initialState.toDo.toDoList[0].heading + 'Test...')).not.toBeInTheDocument();
    });

    it('should handle change input if isEditable true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const input = screen.getByDisplayValue(initialState.toDo.toDoList[0].heading);
      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      userEvent.type(input, 'Test...');

      expect(screen.queryByDisplayValue(initialState.toDo.toDoList[0].heading)).not.toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].heading + 'Test...')).toBeInTheDocument();
    });

    it('should handle change textarea if isEditable false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const textarea = screen.getByDisplayValue(initialState.toDo.toDoList[0].description);
      userEvent.type(textarea, 'Test...');

      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].description)).toBeInTheDocument();
      expect(screen.queryByDisplayValue(initialState.toDo.toDoList[0].description + 'Test...')).not.toBeInTheDocument();
    });

    it('should handle change textarea if isEditable true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const textarea = screen.getByDisplayValue(initialState.toDo.toDoList[0].description);
      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      userEvent.type(textarea, 'Test...');

      expect(screen.queryByDisplayValue(initialState.toDo.toDoList[0].description)).not.toBeInTheDocument();
      expect(screen.getByDisplayValue(initialState.toDo.toDoList[0].description + 'Test...')).toBeInTheDocument();
    });

    it('should change status on click change status button', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      const changeStatusButton = screen.getByText('change');
      userEvent.click(changeStatusButton);

      expect(screen.queryByText('status: inProcess')).not.toBeInTheDocument();
      expect(screen.getByText('status: completed')).toBeInTheDocument();
    });

    it('should change isEditable to false on click cancel', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      const cancelButton = screen.getByText('cancel');
      userEvent.click(cancelButton);

      expect(screen.queryByText('change')).not.toBeInTheDocument();
    });

    it('should dispatch updateToDoItem and set isEditable to false on click save button if isLoggedIn return true', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(true);

      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      const saveButton = screen.getByText('save');
      userEvent.click(saveButton);

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        'payload': {
          'description': 'test description',
          'heading': 'test',
          'id': '1',
          'isComplete': false,
        },
        'type': 'updateToDoItem',
      });
      expect(screen.queryByText('change')).not.toBeInTheDocument();
    });

    it('should dispatch updateToDoItemLocal and set isEditable to false on click save button if isLoggedIn return' +
      ' false', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );
      jest.spyOn(isLoggedIn, 'isLoggedIn').mockReturnValue(false);

      const editButton = screen.getByText('edit');
      userEvent.click(editButton);
      const saveButton = screen.getByText('save');
      userEvent.click(saveButton);

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        'payload': {
          'description': 'test description',
          'heading': 'test',
          'id': '1',
          'isComplete': false,
        },
        'type': 'updateToDoItemLocal',
      });
      expect(screen.queryByText('change')).not.toBeInTheDocument();
    });

    it('should dispatch actions on click back button', () => {
      render(
        <Provider store={mockStoreWithState}>
          <ToDoItemDetails id='1' />
        </Provider>,
      );

      const backButton = screen.getByText('back');
      userEvent.click(backButton);

      expect(mockDispatch).toBeCalledTimes(3);
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        'type': 'closeToDoUpdateError',
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        'payload': '',
        'type': 'changeActiveToDoPage',
      });
      expect(screen.queryByText('change')).not.toBeInTheDocument();
    });
  });

  it('should dispatch close update error on first mount component', () => {
    render(
      <Provider store={mockStoreWithState}>
        <ToDoItemDetails id='1' />
      </Provider>,
    );

    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      'type': 'closeToDoUpdateError',
    });
  });
});
