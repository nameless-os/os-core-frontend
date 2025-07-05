import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import store from 'src/redux/store';
import { BaseFetchResult } from '@Interfaces/baseFetchResult';
import { Room } from '@Chat/interfaces/room';
import { Message } from '@Interfaces/message.interface';

const fetchRooms = createAsyncThunk('users/fetchRooms', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/room/rooms`, {
    timeout: 30000,
    withCredentials: true,
  });
  return response.data;
});

const addRoom = createAsyncThunk('users/addRoom', async (payload: { name: string; image: string }) => {
  await axios.post(
    `${process.env.REACT_APP_API_URL}/room/rooms`,
    {
      usersIds: store.getState().chatRooms.newRoomUsers,
      name: payload.name,
      image: payload.image,
    },
    {
      timeout: 30000,
      withCredentials: true,
    },
  );
});

interface InitialState extends BaseFetchResult {
  newRoomUsers: number[];
  isAddRoomFormOpen: boolean;
  rooms: Room[];
}

const initialState: InitialState = {
  isLoading: false,
  hasError: false,
  newRoomUsers: [],
  isAddRoomFormOpen: false,
  rooms: [],
};

const chatRoomsSlice = createSlice({
  name: 'chatRooms',
  initialState,
  reducers: {
    openAddRoomForm(state) {
      state.isAddRoomFormOpen = true;
    },
    closeAddRoomForm(state) {
      state.isAddRoomFormOpen = false;
    },
    addUserToNewRoom(state, { payload }: { payload: number }) {
      state.newRoomUsers.push(payload);
    },
    removeUserFromNewRoom(state, { payload }: { payload: number }) {
      state.newRoomUsers.splice(state.newRoomUsers.indexOf(payload), 1);
    },
    incrementRoomNewMessagesCount(state, { payload }: { payload: number }) {
      state.rooms[payload].numberOfNewMessages++;
    },
    changeNewMessageRoomCountToZero(state, { payload }: { payload: { userId: number } }) {
      const roomIndex = state.rooms.findIndex((room) => room.id === payload.userId);
      if (roomIndex === -1) return;
      state.rooms[roomIndex].numberOfNewMessages = 0;
    },
    changeLastRoomMessage(state, { payload }: { payload: { message: Message } }) {
      const roomIndex = state.rooms.findIndex((room) => room.id === payload.message.toRoomId);
      state.rooms[roomIndex].lastMessage = payload.message;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.fulfilled, (state, { payload }: { payload: Room[] }) => {
      state.rooms = payload;
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(fetchRooms.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchRooms.rejected, (state) => {
      state.hasError = true;
      state.isLoading = false;
    });
    builder.addCase(addRoom.fulfilled, (state) => {
      state.newRoomUsers = [];
      state.isAddRoomFormOpen = false;
    });
    builder.addCase(addRoom.rejected, (state) => {
      state.newRoomUsers = [];
      state.isAddRoomFormOpen = false;
    });
  },
});

export default chatRoomsSlice.reducer;

export const {
  closeAddRoomForm,
  openAddRoomForm,
  addUserToNewRoom,
  removeUserFromNewRoom,
  incrementRoomNewMessagesCount,
  changeNewMessageRoomCountToZero,
  changeLastRoomMessage,
} = chatRoomsSlice.actions;

export { fetchRooms, addRoom };
