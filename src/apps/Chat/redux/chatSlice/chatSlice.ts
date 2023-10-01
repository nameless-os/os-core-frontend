// Libraries
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import store from 'src/redux/store';

// Interfaces
import { Message } from '@Interfaces/message.interface';

// Features
import { socket } from '@Features/websocket/websocket';

const fetchMessages = createAsyncThunk('users/fetchMessages', async (from?: number) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/chat/messages?from=${from}&type=${store.getState().chat.activeType}`, {
    timeout: 30000,
    withCredentials: true,
  });
  return response.data;
});

const readMessages = createAsyncThunk('users/readMessages', () => {
  socket.emit('readMessages', {
    id: store.getState().chat.activeChat,
    activeType: store.getState().chat.activeType,
  });
});

const sendMessage = createAsyncThunk('users/readMessages', (payload: string) => {
  const { activeChat, activeType } = store.getState().chat;
  if (activeType === 'User') {
    socket.emit('chatMsg', { text: payload, toUserId: activeChat });
  } else {
    socket.emit('chatMsg', { text: payload, toRoomId: activeChat });
  }
});

interface InitialState {
  messages: Message[],
  numberOfRender: number,
  text: string,
  isLoading: boolean,
  hasError: boolean,
  activeChat: number,
  activeType: string,
}

const initialState: InitialState = {
  messages: [],
  numberOfRender: 0,
  text: '',
  isLoading: false,
  hasError: false,
  activeChat: -1,
  activeType: 'User',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, { payload }: { payload: Message[] }) {
      state.messages = payload;
      state.numberOfRender++;
    },
    incrementNumberOfRender(state) {
      state.numberOfRender++;
    },
    addMessage(state, { payload }: { payload: Message }) {
      state.messages.push(payload);
    },
    addMessageInputValue(state, { payload }: { payload: string }) {
      state.text += payload;
    },
    changeMessageInputValue(state, { payload }: { payload: string }) {
      state.text = payload;
    },
    clearMessageInputValue(state) {
      state.text = '';
    },
    changeActiveChat(state, { payload }: { payload: { id: number, type: string } }) {
      state.activeChat = payload.id;
      state.activeType = payload.type;
    },
    changeNewMessageCount(state, { payload }: { payload: { id: number, activeType: string, roomId?: number } }) {
      if (((payload.id === state.activeChat && payload.activeType === 'User') || (payload.roomId === state.activeChat && payload.activeType === 'Room')) && payload.activeType === state.activeType) {
        state.messages.forEach((message, i) => {
          if (message.listOfReaders.includes(payload.id) || message.owner.id === payload.id) return;

          state.messages[i].listOfReaders.push(payload.id);
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, { payload }: { payload: Message[] }) => {
      state.messages = payload;
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(fetchMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMessages.rejected, (state) => {
      state.hasError = true;
    });
  },
});

export default chatSlice.reducer;

export const {
  setMessages,
  changeMessageInputValue,
  clearMessageInputValue,
  addMessageInputValue,
  changeActiveChat,
  changeNewMessageCount,
  addMessage,
  incrementNumberOfRender,
} = chatSlice.actions;

export { fetchMessages, readMessages, sendMessage };
