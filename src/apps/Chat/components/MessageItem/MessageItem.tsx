import { motion } from 'framer-motion';
import React, { FC, useCallback } from 'react';
import classNames from 'classnames';

import { addMessageInputValue } from '@Chat/redux/chatSlice/chatSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Message } from '@Interfaces/message.interface';
import { Avatar } from '@Components/Avatar/Avatar';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './messageItem.module.css';

interface Props extends ChildrenNever {
  message: Message;
}

const MessageItem: FC<Props> = React.memo(({ message }: Props) => {
  const username = useTypedSelector((state) => state.user.currentUser.username);
  const dispatch = useTypedDispatch();

  const handleClickUsername = useCallback(() => {
    dispatch(addMessageInputValue(`@${message.owner.username}, `));
  }, []);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.myMsg]: username === message.owner.username,
      })}
    >
      <motion.li
        className={classNames(styles.msgContainer, {
          [styles.myMsg]: username === message.owner.username,
        })}
        initial={{ y: 50, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Avatar link={message.owner.photo} name={message.owner.username} />
        <div className={styles.msgMain}>
          <div
            className={classNames(styles.msgContent, {
              [styles.toYou]: message.text.includes(`@${username}`) || message.text.toLowerCase().includes('@all'),
            })}
          >
            {message.text.slice(0, 4) === 'http' ? (
              <a href={message.text} target="_blank" rel="noreferrer">
                <img src={message.text} alt={message.text} />
              </a>
            ) : (
              <span>{message.text}</span>
            )}
          </div>
          <div
            className={classNames(styles.usernameAndDate, {
              [styles.myMsg]: username === message.owner.username,
            })}
          >
            <div className={styles.username}>
              <Button onClick={handleClickUsername}>{message.owner.username}</Button>
            </div>
            <div className={styles.date}>{new Date(message.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div
          className={
            (message.owner.username === username && message.listOfReaders.length > 0) ||
            message.owner.username !== username
              ? styles.readedMessage
              : styles.notReadedMessage
          }
        >
          🔵
        </div>
      </motion.li>
    </div>
  );
});

export { MessageItem };
