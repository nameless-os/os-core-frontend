import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { ToDoItem } from '@ToDo/interfaces/toDo.interface';

interface InitialState {
  toDoList: ToDoItem[];
  activeToDoPage: string;
  isToDoListLoading: boolean;
  toDoListError: string;
  isUpdateLoading: boolean;
  updateError: string;
  isDeleteLoading: boolean;
  deleteError: string;
  isAddLoading: boolean;
  addError: string;
}

const initialState: InitialState = {
  toDoList: (localStorage.getItem('toDoList') && JSON.parse(localStorage.getItem('toDoList')!)) || [],
  activeToDoPage: '',
  isToDoListLoading: false,
  toDoListError: '',
  isUpdateLoading: false,
  updateError: '',
  isDeleteLoading: false,
  deleteError: '',
  isAddLoading: false,
  addError: '',
};

const addToDoItem = createAsyncThunk('toDo/addToDoItem', async (payload: string, thunkApi) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/toDo/items`,
    {
      heading: payload,
    },
    {
      withCredentials: true,
      timeout: 30000,
    },
  );

  if (res.data.isSuccess) {
    return res.data;
  }

  return thunkApi.rejectWithValue({});
});

const deleteToDoItem = createAsyncThunk('toDo/deleteToDoItem', async (payload: string, thunkApi) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_URL}/toDo/items?id=${payload}`, {
    withCredentials: true,
    timeout: 30000,
  });

  if (res.data.isSuccess) {
    return res.data;
  }

  return thunkApi.rejectWithValue({});
});

const getToDoItems = createAsyncThunk('toDo/getToDoItems', async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/toDo/items`, {
    withCredentials: true,
    timeout: 30000,
  });
  return res.data;
});

const updateToDoItem = createAsyncThunk('toDo/updateToDoItem', async (payload: ToDoItem, thunkApi) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/toDo/items`,
    {
      ...payload,
      ...{ id: +payload.id },
    },
    {
      withCredentials: true,
      timeout: 30000,
    },
  );

  if (res.data.isSuccess) {
    return res.data;
  }

  return thunkApi.rejectWithValue({});
});

const toDoSlice = createSlice({
  name: 'toDo',
  initialState,
  reducers: {
    changeActiveToDoPage(state, { payload }: { payload: string }) {
      state.activeToDoPage = payload;
    },
    closeToDoUpdateError(state) {
      state.updateError = '';
    },
    closeToDoAddError(state) {
      state.addError = '';
    },
    addToDoItemLocal(state, { payload }: { payload: string }) {
      state.toDoList.push({
        id: uuidv4(),
        heading: payload,
        isComplete: false,
        description: '',
      });
      localStorage.setItem('toDoList', JSON.stringify(state.toDoList));
    },
    deleteToDoItemLocal(state, { payload }: { payload: string }) {
      state.toDoList.splice(
        state.toDoList.findIndex((el) => el.id === payload),
        1,
      );
      localStorage.setItem('toDoList', JSON.stringify(state.toDoList));
    },
    updateToDoItemLocal(state, { payload }: { payload: ToDoItem }) {
      const index = state.toDoList.findIndex((el) => el.id === payload.id);
      state.toDoList[index].isComplete = payload.isComplete;
      state.toDoList[index].heading = payload.heading;
      state.toDoList[index].description = payload.description;
      localStorage.setItem('toDoList', JSON.stringify(state.toDoList));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToDoItem.pending, (state) => {
      state.isAddLoading = true;
    });
    builder.addCase(addToDoItem.fulfilled, (state, action) => {
      state.isAddLoading = false;
      state.addError = '';
      state.toDoList.push({ ...action.payload.toDoItem, ...{ id: action.payload.toDoItem.id.toString() } });
    });
    builder.addCase(addToDoItem.rejected, (state) => {
      state.isAddLoading = false;
      state.addError = 'Error';
    });
    builder.addCase(deleteToDoItem.pending, (state) => {
      state.isDeleteLoading = true;
    });
    builder.addCase(deleteToDoItem.fulfilled, (state, action) => {
      state.isDeleteLoading = false;
      state.deleteError = '';
      state.toDoList.splice(
        state.toDoList.findIndex((el) => el.id === action.payload.id.toString()),
        1,
      );
    });
    builder.addCase(deleteToDoItem.rejected, (state) => {
      state.isDeleteLoading = false;
      state.deleteError = 'Error';
    });
    builder.addCase(getToDoItems.pending, (state) => {
      state.isToDoListLoading = true;
    });
    builder.addCase(getToDoItems.fulfilled, (state, action) => {
      state.isToDoListLoading = false;
      state.toDoListError = '';
      state.toDoList = action.payload.sort((prev: ToDoItem, current: ToDoItem) => +prev.id - +current.id);
    });
    builder.addCase(getToDoItems.rejected, (state) => {
      state.isToDoListLoading = false;
      state.toDoListError = 'Error';
    });
    builder.addCase(updateToDoItem.pending, (state) => {
      state.isUpdateLoading = true;
    });
    builder.addCase(updateToDoItem.fulfilled, (state, action) => {
      state.isUpdateLoading = false;
      state.updateError = '';
      const index = state.toDoList.findIndex((el) => el.id === action.payload.toDoItem.id);
      state.toDoList[index] = action.payload.toDoItem;
    });
    builder.addCase(updateToDoItem.rejected, (state) => {
      state.isUpdateLoading = false;
      state.updateError = 'Error';
    });
  },
});

export default toDoSlice.reducer;
export const {
  changeActiveToDoPage,
  addToDoItemLocal,
  deleteToDoItemLocal,
  updateToDoItemLocal,
  closeToDoUpdateError,
  closeToDoAddError,
} = toDoSlice.actions;
export { addToDoItem, deleteToDoItem, getToDoItems, updateToDoItem };
