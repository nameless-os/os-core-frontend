// Libraries
import { FC } from 'react';
import { useSelector } from 'react-redux';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { User } from '@Interfaces/user.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Logic
import { getReadableLastVisitDate } from '@Apps/Chat/logic/dateProcess';

// Components
import { Avatar } from '@Components/Avatar/Avatar';

// Styles
import styles from './currentChatUserData.module.css';

interface Props extends ChildrenNever {
  user: User;
}

const CurrentChatUserData: FC<Props> = ({ user }: Props) => {
  const language = useSelector((state: RootState) => state.language.language);

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
