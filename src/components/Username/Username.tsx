import { FC } from 'react';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { useTypedSelector } from '@Hooks';

import styles from './username.module.css';

const Username: FC<ChildrenNever> = () => {
  const username = useTypedSelector((state) => state.user.currentUser.username);
  const loading = useTypedSelector((state) => state.user.isUserLoading);

  return <div className={styles.username}>{loading ? <p>Loading...</p> : <p>{username || 'Anonymous'}</p>}</div>;
};

export { Username };
