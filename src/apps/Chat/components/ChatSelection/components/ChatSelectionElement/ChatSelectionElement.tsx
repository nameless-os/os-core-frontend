// Libraries
import { FC } from 'react';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Message } from '@Interfaces/message.interface';

// Components
import { Avatar } from '@Components/Avatar/Avatar';

// Styles
import styles from './chatSelectionElement.module.css';

interface Props extends ChildrenNever {
  name: string;
  lastVisitDate: string;
  countOfNewMessages: number;
  lastMessage?: Message;
  avatarLink: string;
  userId: number;
  changeChat: (chatId: number) => void;
}

const ChatSelectionElement: FC<Props> = (
  { name, lastMessage, countOfNewMessages, lastVisitDate, avatarLink, userId, changeChat }: Props,
) => (
  <div
    className={styles.wrapper}
    onClick={() => changeChat(userId)}
    role="button"
    tabIndex={0}
  >
    <div className={styles.newMessage}>
      <div className={styles.nameAndMsg}>
        <div>
          <span>{lastMessage?.owner?.username || ''}</span>
        </div>
        <div>
          <span className={styles.msgText}>{lastMessage?.text || ''}</span>
        </div>
      </div>
      <div className={styles.avatar}>
        <Avatar link={avatarLink} name={name} />
      </div>
    </div>
    <>
      <div className={styles.nameAndMsg}>
        <div>
          <span>{lastVisitDate}</span>
        </div>
        <div>
          <span>{name}</span>
        </div>
      </div>
      <div className={styles.avatar}>
        <Avatar link={avatarLink} name={name} />
        {countOfNewMessages > 0 && (<span className={styles.count}>{`+${countOfNewMessages}`}</span>)}
      </div>
    </>
  </div>
);

export { ChatSelectionElement };
