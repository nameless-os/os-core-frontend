import { FC } from 'react';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { User } from '@Interfaces/user.interface';
import { getReadableLastVisitDate } from '@Apps/Chat/logic/dateProcess';
import { Avatar } from '@Components/Avatar/Avatar';
import { useTypedSelector } from '@Hooks';

import styles from './currentChatUserData.module.css';

interface Props extends ChildrenNever {
  user: User;
}

const CurrentChatUserData: FC<Props> = ({ user }: Props) => {
  const language = useTypedSelector((state) => state.settings.language);

  return (
    <div className={styles.container}>
      <div />
      <div>
        <div>{user.username}</div>
        <div>{getReadableLastVisitDate(user.lastVisit, language)}</div>
      </div>
      <Avatar name={user.username} width={40} height={40} />
    </div>
  );
};

export { CurrentChatUserData };
