import React, { FC } from 'react';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { useTypedSelector } from '@Hooks';

import { CurrentChatUserData } from './components/CurrentChatUserData/CurrentChatUserData';
import { CurrentChatRoomData } from './components/CurrentChatRoomData/CurrentChatRoomData';
import styles from './currentChatData.module.css';

const CurrentChatData: FC<ChildrenNever> = React.memo(() => {
  const users = useTypedSelector((state) => state.chatUsers.users);
  const rooms = useTypedSelector((state) => state.chatRooms.rooms);
  const activeChat = useTypedSelector((state) => state.chat.activeChat);
  const activeType = useTypedSelector((state) => state.chat.activeType);

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
