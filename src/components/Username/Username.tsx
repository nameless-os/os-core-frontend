// Libraries
import { FC } from 'react';
import { useSelector } from 'react-redux';

// Types
import { RootState } from '@Types/rootState.type';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './username.module.css';

const Username: FC<ChildrenNever> = () => {
  const username = useSelector((state: RootState) => state.user.currentUser.username);
  const loading = useSelector((state: RootState) => state.user.isUserLoading);

  return <div className={styles.username}>{loading ? <p>Loading...</p> : <p>{username || 'Anonymous'}</p>}</div>;
};

export { Username };
