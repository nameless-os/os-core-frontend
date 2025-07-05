import { processNewMessage } from '@Chat/logic/processNewMessage';
import { changeNewMessageCount, readMessages } from '@Chat/redux/chatSlice/chatSlice';
import { io, Socket } from 'socket.io-client';
import store from '../../redux/store';

let socket: Socket;

function initSocket() {
  socket = io(process.env.REACT_APP_API_URL as string, {
    withCredentials: true,
  });

  socket.on('chatUpdate', (payload) => {
    processNewMessage(payload);
    if (
      (payload.toUserId !== null &&
        payload.owner.id === store.getState().chat.activeChat &&
        store.getState().chat.activeType) ||
      (payload.toRoomId !== null &&
        payload.owner.id === store.getState().chat.activeChat &&
        store.getState().chat.activeType)
    ) {
      store.dispatch(readMessages());
    }
  });

  socket.on('readMessages', (payload) => {
    if (payload.roomId) {
      store.dispatch(changeNewMessageCount({ id: payload.id, activeType: payload.activeType, roomId: payload.roomId }));
    } else {
      store.dispatch(changeNewMessageCount({ id: payload.id, activeType: payload.activeType }));
    }
  });
}

export { socket, initSocket };
