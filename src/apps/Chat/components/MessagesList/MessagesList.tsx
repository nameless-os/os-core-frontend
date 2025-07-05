import React, { FC, useEffect, useRef } from 'react';

import { fetchMessages } from '@Chat/redux/chatSlice/chatSlice';
import { Message } from '@Interfaces/message.interface';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Loading } from '@Components/Loading/Loading';
import { Error } from '@Components/Error/Error';
import { MessageItem } from '@Chat/components/MessageItem/MessageItem';

import styles from './messagesList.module.css';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

export const MessagesList: FC<ChildrenNever> = React.memo(() => {
  const messages = useTypedSelector((state) => state.chat.messages);
  const isLoading = useTypedSelector((state) => state.chat.isLoading);
  const hasError = useTypedSelector((state) => state.chat.hasError);

  const listRef = useRef<HTMLDivElement>(null);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    listRef.current!.scrollTop = listRef.current!.scrollHeight;
  }, [messages]);

  function refetch(): void {
    dispatch(fetchMessages() as any);
  }

  if (isLoading && !messages.length) {
    return (
      <div className={styles.wrapper} ref={listRef}>
        <Loading/>
      </div>
    );
  }

  if (hasError && !messages.length) {
    return (
      <div className={styles.wrapper} ref={listRef}>
        <Error refetch={refetch}/>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={listRef}>
      <ul className={styles.messagesList}>
        {messages.length > 0 &&
          messages.map((message: Message) => <MessageItem message={message} key={message.id}/>)}
      </ul>
    </div>
  );
});
