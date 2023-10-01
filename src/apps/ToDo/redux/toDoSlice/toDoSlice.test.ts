import { configureStore } from '@reduxjs/toolkit';
import toDoSlice, { addToDoItem, deleteToDoItem, getToDoItems, updateToDoItem } from './toDoSlice';
import {
  addToDoItemLocal,
  changeActiveToDoPage,
  closeToDoAddError,
  closeToDoUpdateError,
  deleteToDoItemLocal, updateToDoItemLocal,
} from './toDoSlice';
import axios from 'axios';
jest.mock('axios');

const defaultState = {
  activeToDoPage: '',
  toDoList: [],
  isToDoListLoading: false,
  toDoListError: '',
  isUpdateLoading: false,
  isAddLoading: false,
  isDeleteLoading: false,
  deleteError: '',
  updateError: '',
  addError: '',
};

const defaultToDoList = [
  {
    id: '1',
    heading: 'test',
    isComplete: false,
    description: '',
  }, {
    id: '2',
    heading: 'test2',
    isComplete: true,
    description: '',
  },
];

describe('toDoSlice', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
  });

  it('changeActiveToDoPage should change activeToDoPage', () => {
    const newState = toDoSlice({
      ...defaultState,
      activeToDoPage: '2',
    }, changeActiveToDoPage('1'));
    expect(newState).toEqual({
      ...defaultState,
      activeToDoPage: '1',
    });
  });

  it('closeToDoUpdateError should set updateError to empty string', () => {
    const newState = toDoSlice({
      ...defaultState,
      updateError: 'Error',
    }, closeToDoUpdateError());
    expect(newState).toEqual(defaultState);
  });

  it('closeToDoAddError should set addError to empty string', () => {
    const newState = toDoSlice({
      ...defaultState,
      addError: 'Error',
    }, closeToDoAddError());
    expect(newState).toEqual(defaultState);
  });

  it('addToDoItemLocal should add item to ToDoList and add it to localstorage', () => {
    const newState = toDoSlice(defaultState, addToDoItemLocal('Test heading'));
    const newStateWithId = {
      ...newState, toDoList: [{
        ...newState.toDoList[0],
        id: 'testId',
      }],
    };
    expect(localStorage.setItem).toBeCalledTimes(1);
    expect(newState.toDoList).toHaveLength(1);
    expect(newStateWithId).toEqual({
      ...defaultState, toDoList: [
        {
          heading: 'Test heading',
          id: 'testId',
          description: '',
          isComplete: false,
        },
      ],
    });
  });

  it('updateToDoItemLocal should update item in ToDoList and set it to localstorage', () => {
    const newState = toDoSlice({
      ...defaultState,
      toDoList: [defaultToDoList[0]],
    }, updateToDoItemLocal({
      id: '1',
      heading: 'updatedTest',
      isComplete: true,
      description: 'testU',
    }));
    expect(localStorage.setItem).toBeCalledTimes(1);
    expect(newState).toEqual({
      ...defaultState,
      toDoList: [
        {
          id: '1',
          heading: 'updatedTest',
          isComplete: true,
          description: 'testU',
        },
      ],
    });
  });

  it('deleteToDoItemLocal should delete item from ToDoList and delete it from localstorage', () => {
    const newState = toDoSlice({
      ...defaultState,
      toDoList: [...defaultToDoList],
    }, deleteToDoItemLocal('1'));
    expect(localStorage.setItem).toBeCalledTimes(1);
    expect(newState).toEqual({
      ...defaultState,
      toDoList: [defaultToDoList[1]],
    });
  });

  it('getToDoItems should fetch toDoList', () => {
    const mockStore = configureStore({
      reducer: {
        toDo: toDoSlice,
      },
    });

    mockStore.dispatch(getToDoItems());
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith('http://localhost:3001/toDo/items', {
      'timeout': 30000,
      'withCredentials': true,
    });
  });

  it('getToDoItems should set isToDoListLoading to true on pending', () => {
    const newState = toDoSlice(defaultState, { type: getToDoItems.pending });
    expect(newState).toEqual({ ...defaultState, isToDoListLoading: true });
  });

  it('getToDoItems should set isToDoListLoading to false, toDoListError to empty string and toDoList to' +
    ' response data on fulfilled', () => {
    const newState = toDoSlice({ ...defaultState,
      isToDoListLoading: true,
      toDoListError: 'Error',
    }, { type: getToDoItems.fulfilled, payload: defaultToDoList });
    expect(newState).toEqual({ ...defaultState, toDoList: defaultToDoList });
  });

  it('getToDoItems should set isToDoListLoading to false, toDoListError to error and does not change toDoList' +
    ' on reject', () => {
    const newState = toDoSlice({ ...defaultState,
      isToDoListLoading: true,
    }, { type: getToDoItems.rejected });
    expect(newState).toEqual({ ...defaultState, toDoListError: 'Error' });
  });

  it('deleteToDoItem should fetch delete to do item', () => {
    const mockStore = configureStore({
      reducer: {
        toDo: toDoSlice,
      },
    });

    mockStore.dispatch(deleteToDoItem('1'));
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete).toBeCalledWith('http://localhost:3001/toDo/items?id=1', {
      'timeout': 30000,
      'withCredentials': true,
    });
  });

  it('deleteToDoItem should set isDeleteLoading to true on pending', () => {
    const newState = toDoSlice(defaultState, { type: deleteToDoItem.pending });
    expect(newState).toEqual({ ...defaultState, isDeleteLoading: true });
  });

  it('deleteToDoItem should set isDeleteLoading to false, deleteError to empty string and toDoList to' +
    ' toDoList without element with selected id', () => {
    const newState = toDoSlice({ ...defaultState,
      isDeleteLoading: true,
      deleteError: 'Error',
      toDoList: defaultToDoList,
    }, { type: deleteToDoItem.fulfilled, payload: { id: 1 } });
    expect(newState).toEqual({ ...defaultState, toDoList: [defaultToDoList[1]] });
  });

  it('deleteToDoItem should set isDeleteLoading to false, deleteError to error and does not change toDoList' +
    ' on reject', () => {
    const newState = toDoSlice({ ...defaultState,
      isDeleteLoading: true,
      toDoList: defaultToDoList,
    }, { type: deleteToDoItem.rejected, payload: { id: 1 } });
    expect(newState).toEqual({ ...defaultState, toDoList: defaultToDoList, deleteError: 'Error' });
  });

  it('addToDoItem should fetch add to do item', () => {
    const mockStore = configureStore({
      reducer: {
        toDo: toDoSlice,
      },
    });

    mockStore.dispatch(addToDoItem('test 3'));
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith('http://localhost:3001/toDo/items', {
      heading: 'test 3',
    }, {
      'timeout': 30000,
      'withCredentials': true,
    });
  });

  it('addToDoItem should set isAddLoading to true on pending', () => {
    const newState = toDoSlice(defaultState, { type: addToDoItem.pending });
    expect(newState).toEqual({ ...defaultState, isAddLoading: true });
  });

  it('addToDoItem should set isAddLoading to false, addError to empty string and toDoList to' +
    ' toDoList with new item', () => {
    const newState = toDoSlice({ ...defaultState,
      isAddLoading: true,
      addError: 'Error',
      toDoList: defaultToDoList,
    }, { type: addToDoItem.fulfilled, payload: { toDoItem: {
      id: 3,
      heading: 'test 3',
      description: '',
      isComplete: false,
    } } });
    expect(newState).toEqual({ ...defaultState, toDoList: [...defaultToDoList, {
      id: '3',
      heading: 'test 3',
      description: '',
      isComplete: false,
    }] });
  });

  it('addToDoItem should set isAddLoading to false, addError to error and does not change toDoList' +
    ' on reject', () => {
    const newState = toDoSlice({ ...defaultState,
      isAddLoading: true,
      toDoList: defaultToDoList,
    }, { type: addToDoItem.rejected, payload: { id: 1 } });
    expect(newState).toEqual({ ...defaultState, toDoList: defaultToDoList, addError: 'Error' });
  });

  it('updateToDoItem should fetch add to do item', () => {
    const mockStore = configureStore({
      reducer: {
        toDo: toDoSlice,
      },
    });

    mockStore.dispatch(updateToDoItem({
      id: '2',
      isComplete: true,
      description: 'new description',
      heading: 'new heading',
    }));
    expect(axios.put).toBeCalledTimes(1);
    expect(axios.put).toBeCalledWith('http://localhost:3001/toDo/items', {
      id: 2,
      isComplete: true,
      description: 'new description',
      heading: 'new heading',
    }, {
      'timeout': 30000,
      'withCredentials': true,
    });
  });

  it('updateToDoItem should set isUpdateLoading to true on pending', () => {
    const newState = toDoSlice(defaultState, { type: updateToDoItem.pending });
    expect(newState).toEqual({ ...defaultState, isUpdateLoading: true });
  });

  it('updateToDoItem should set isUpdateLoading to false, updateError to empty string and toDoList to' +
    ' toDoList with updated item', () => {
    const newState = toDoSlice({ ...defaultState,
      isUpdateLoading: true,
      updateError: 'Error',
      toDoList: defaultToDoList,
    }, { type: updateToDoItem.fulfilled, payload: { toDoItem: {
      id: '2',
      heading: 'new heading',
      description: 'new description',
      isComplete: true,
    } } });
    expect(newState).toEqual({ ...defaultState, toDoList: [defaultToDoList[0], {
      id: '2',
      heading: 'new heading',
      description: 'new description',
      isComplete: true,
    }] });
  });

  it('updateToDoItem should set isUpdateLoading to false, updateError to error and does not change toDoList' +
    ' on reject', () => {
    const newState = toDoSlice({ ...defaultState,
      isUpdateLoading: true,
      toDoList: defaultToDoList,
    }, { type: updateToDoItem.rejected });
    expect(newState).toEqual({ ...defaultState, toDoList: defaultToDoList, updateError: 'Error' });
  });
});
