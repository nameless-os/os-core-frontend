import store from 'src/redux/store';
import { changeLastUserMessage, incrementNewMessageCount } from '@Chat/redux/chatUsersSlice/chatUsersSlice';
import { addMessage, incrementNumberOfRender, readMessages } from '@Chat/redux/chatSlice/chatSlice';
import { changeLastRoomMessage, incrementRoomNewMessagesCount } from '@Chat/redux/chatRoomsSlice/chatRooms';
import { Message } from '@Interfaces/message.interface';

function processNewMessage(newMessage: Message): void {
  const { activeChat } = store.getState().chat;

  if (
    newMessage.toUserId === activeChat ||
    (newMessage.owner.id === activeChat && newMessage.toUserId !== null) ||
    newMessage.toRoomId === activeChat
  ) {
    store.dispatch(addMessage(newMessage));
    if (newMessage.toUserId !== null) {
      store.dispatch(changeLastUserMessage({ message: newMessage }));
    }
    if (newMessage.toRoomId !== null) {
      store.dispatch(changeLastRoomMessage({ message: newMessage }));
    }
    if (newMessage.owner.username !== store.getState().user.currentUser.username) {
      store.dispatch(readMessages());
    }
  } else if (newMessage.toRoomId) {
    const roomIndex = store.getState().chatRooms.rooms.findIndex((room) => room.id === newMessage.toRoomId);
    store.dispatch(incrementRoomNewMessagesCount(roomIndex));
  } else {
    const userIndex = store.getState().chatUsers.users.findIndex((user) => user.id === newMessage.owner.id);
    store.dispatch(incrementNewMessageCount({ userIndex }));
  }

  store.dispatch(addMessage(newMessage));

  store.dispatch(incrementNumberOfRender());
}

export { processNewMessage };
