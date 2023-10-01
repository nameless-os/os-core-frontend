// Libraries
import { FC } from 'react';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Message } from '@Interfaces/message.interface';

// Styles
import styles from './messageAlertItem.module.css';

interface Props extends ChildrenNever {
  message: Message;
}

export const MessageAlertItem: FC<Props> = ({ message }: Props) => (
  <div>
    <div className={styles.username}>
      <p>{message.owner.username || 'anonymous'}</p>
    </div>
    <p>{message.text}</p>
  </div>
);
