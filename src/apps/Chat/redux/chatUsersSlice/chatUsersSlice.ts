// Libraries
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// interfaces
import { BaseFetchResult } from '@Interfaces/baseFetchResult';
import { User } from '@Interfaces/user.interface';
import { Message } from '@Interfaces/message.interface';

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/users`, {
    timeout: 30000,
    withCredentials: true,
  });
  return response.data;
});

interface InitialState extends BaseFetchResult {
  users: User[],
}

const initialState: InitialState = {
  users: [],
  isLoading: false,
  hasError: false,
};

const chatUsersSlice = createSlice({
  name: 'chatUsers',
  initialState,
  reducers: {
    changeNewMessageCountToZero(state, { payload }: { payload: { userId: number } }) {
      const userIndex = state.users.findIndex((user) => user.id === payload.userId);
      if (userIndex === -1) return;
      state.users[userIndex].numberOfNewMessages = 0;
    },
    incrementNewMessageCount(state, { payload }: { payload: { userIndex: number } }) {
      if (!(state.users && state.users[payload.userIndex])) return;
      state.users[payload.userIndex].numberOfNewMessages++;
    },
    changeLastUserMessage(state, { payload }: { payload: { message: Message } }) {
      const userIndex = state.users.findIndex((user) => user.id === payload.message.toUserId);
      state.users[userIndex].lastMessage = payload.message;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, { payload }: { payload: User[] }) => {
      state.users = payload.sort((a, b) => b.numberOfNewMessages - 1);
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.hasError = true;
      state.isLoading = false;
    });
  },
});

export default chatUsersSlice.reducer;

export const {
  changeNewMessageCountToZero,
  incrementNewMessageCount,
  changeLastUserMessage,
} = chatUsersSlice.actions;

export { fetchUsers };
