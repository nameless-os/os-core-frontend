import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { ToDoItem } from '@ToDo/interfaces/toDo.interface';

interface ToDoState {
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

  changeActiveToDoPage: (page: string) => void;
  closeToDoUpdateError: () => void;
  closeToDoAddError: () => void;

  addToDoItemLocal: (heading: string) => void;
  deleteToDoItemLocal: (id: string) => void;
  updateToDoItemLocal: (item: ToDoItem) => void;

  addToDoItem: (heading: string) => Promise<void>;
  deleteToDoItem: (id: string) => Promise<void>;
  getToDoItems: () => Promise<void>;
  updateToDoItem: (item: ToDoItem) => Promise<void>;
}

const useToDoStore = create<ToDoState>()((set, get) => ({
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

  changeActiveToDoPage: (page: string) => {
    set({ activeToDoPage: page });
  },

  closeToDoUpdateError: () => {
    set({ updateError: '' });
  },

  closeToDoAddError: () => {
    set({ addError: '' });
  },

  addToDoItemLocal: (heading: string) => {
    const newItem: ToDoItem = {
      id: uuidv4(),
      heading,
      isComplete: false,
      description: '',
    };

    set((state) => {
      const updatedList = [...state.toDoList, newItem];
      localStorage.setItem('toDoList', JSON.stringify(updatedList));
      return { toDoList: updatedList };
    });
  },

  deleteToDoItemLocal: (id: string) => {
    set((state) => {
      const updatedList = state.toDoList.filter((item) => item.id !== id);
      localStorage.setItem('toDoList', JSON.stringify(updatedList));
      return { toDoList: updatedList };
    });
  },

  updateToDoItemLocal: (updatedItem: ToDoItem) => {
    set((state) => {
      const updatedList = state.toDoList.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      localStorage.setItem('toDoList', JSON.stringify(updatedList));
      return { toDoList: updatedList };
    });
  },

  addToDoItem: async (heading: string) => {
    set({ isAddLoading: true, addError: '' });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/toDo/items`,
        { heading },
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (res.data.isSuccess) {
        set((state) => ({
          isAddLoading: false,
          addError: '',
          toDoList: [
            ...state.toDoList,
            { ...res.data.toDoItem, id: res.data.toDoItem.id.toString() }
          ]
        }));
      } else {
        set({ isAddLoading: false, addError: 'Error' });
      }
    } catch (error) {
      set({ isAddLoading: false, addError: 'Error' });
    }
  },

  deleteToDoItem: async (id: string) => {
    set({ isDeleteLoading: true, deleteError: '' });

    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/toDo/items?id=${id}`,
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (res.data.isSuccess) {
        set((state) => ({
          isDeleteLoading: false,
          deleteError: '',
          toDoList: state.toDoList.filter((item) => item.id !== res.data.id.toString())
        }));
      } else {
        set({ isDeleteLoading: false, deleteError: 'Error' });
      }
    } catch (error) {
      set({ isDeleteLoading: false, deleteError: 'Error' });
    }
  },

  getToDoItems: async () => {
    set({ isToDoListLoading: true, toDoListError: '' });

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/toDo/items`,
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      const sortedItems = res.data.sort((prev: ToDoItem, current: ToDoItem) => +prev.id - +current.id);

      set({
        isToDoListLoading: false,
        toDoListError: '',
        toDoList: sortedItems
      });
    } catch (error) {
      set({ isToDoListLoading: false, toDoListError: 'Error' });
    }
  },

  updateToDoItem: async (item: ToDoItem) => {
    set({ isUpdateLoading: true, updateError: '' });

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/toDo/items`,
        { ...item, id: +item.id },
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (res.data.isSuccess) {
        set((state) => ({
          isUpdateLoading: false,
          updateError: '',
          toDoList: state.toDoList.map((todoItem) =>
            todoItem.id === res.data.toDoItem.id ? res.data.toDoItem : todoItem
          )
        }));
      } else {
        set({ isUpdateLoading: false, updateError: 'Error' });
      }
    } catch (error) {
      set({ isUpdateLoading: false, updateError: 'Error' });
    }
  },
}));

export default useToDoStore;