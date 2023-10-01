// Libraries
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { fetchMessages } from '@Chat/redux/chatSlice/chatSlice';

// Interfaces
import { Message } from '@Interfaces/message.interface';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Components
import { Loading } from '@Components/Loading/Loading';
import { Error } from '@Components/Error/Error';
import { MessageItem } from '@Chat/components/MessageItem/MessageItem';

// Styles
import Scrollbars from 'react-custom-scrollbars';
import styles from './messagesList.module.css';

export const MessagesList: FC<ChildrenNever> = React.memo(() => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isLoading = useSelector((state: RootState) => state.chat.isLoading);
  const hasError = useSelector((state: RootState) => state.chat.hasError);

  const listRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    listRef.current!.scrollTop = listRef.current!.scrollHeight;
  }, [messages]);

  function refetch(): void {
    dispatch(fetchMessages());
  }

  if (isLoading && !messages.length) {
    return (
      <div className={styles.wrapper} ref={listRef}>
        <Loading />
      </div>
    );
  }

  if (hasError && !messages.length) {
    return (
      <div className={styles.wrapper} ref={listRef}>
        <Error refetch={refetch} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={listRef}>
      <Scrollbars
        renderView={(({ style, ...props }) => {
          const viewStyle = {
            paddingRight: 20,
          };
          return (
            <div style={{ ...style, ...viewStyle }} {...props} />
          );
        })}
        autoHide={false}
      >
        <ul className={styles.messagesList}>
          {messages.length > 0 && messages.map((message: Message) => (
            <MessageItem message={message} key={message.id} />
          ))}
        </ul>
      </Scrollbars>
    </div>
  );
});
