import React, { FC, ReactNode } from 'react';

import { useTypedSelector } from '@Hooks';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { AddRoomForm } from '@Chat/components/AddRoomForm/AddRoomForm';
import { CurrentChatData } from '@Chat/components/CurrentChatData/CurrentChatData';
import { MessagesList } from '@Chat/components/MessagesList/MessagesList';
import { ChatInput } from '@Chat/components/ChatInput/ChatInput';

import styles from './chatMainContent.module.css';

export const ChatMainContent: FC<ChildrenNever> = () => {
  const isAddRoomFormOpen = useTypedSelector((state) => state.chatRooms.isAddRoomFormOpen);

  let mainComponent: ReactNode = null;

  if (isAddRoomFormOpen) {
    mainComponent = <AddRoomForm />;
  } else {
    mainComponent = (
      <>
        <CurrentChatData />
        <MessagesList />
        <ChatInput />
      </>
    );
  }

  return <div className={styles.wrapper}>{mainComponent}</div>;
};
