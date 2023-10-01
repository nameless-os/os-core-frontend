// Libraries
import React, { FC } from 'react';
import { useSelector } from 'react-redux';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { CurrentChatUserData } from './components/CurrentChatUserData/CurrentChatUserData';
import { CurrentChatRoomData } from './components/CurrentChatRoomData/CurrentChatRoomData';

// Styles
import styles from './currentChatData.module.css';

const CurrentChatData: FC<ChildrenNever> = React.memo(() => {
  const users = useSelector((state: RootState) => state.chatUsers.users);
  const rooms = useSelector((state: RootState) => state.chatRooms.rooms);
  const activeChat = useSelector((state: RootState) => state.chat.activeChat);
  const activeType = useSelector((state: RootState) => state.chat.activeType);

  if (activeChat === -1) {
    return <div className={styles.empty} />;
  }

  if (activeType === 'User') {
    return <CurrentChatUserData user={users[users.findIndex((user) => user.id === activeChat)]} />;
  }

  if (activeType === 'Room') {
    return <CurrentChatRoomData room={rooms[rooms.findIndex((room) => room.id === activeChat)]} />;
  }

  return null;
});

export { CurrentChatData };
