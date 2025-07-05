import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBomb,
  faCalculator,
  faClipboardList,
  faCogs,
  faCommentDots,
  faSignOutAlt,
  faTerminal,
  faThLarge,
  faUser,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';

import { logout } from '@Features/user/redux/userSlice';
import { App } from '@webos-project/common';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { BottomTab } from '@Components/BottomTab/BottomTab';
import { Button } from '@Components/Button/Button';

import styles from './bottomPanel.module.css';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

export const BottomPanel: FC<ChildrenNever> = () => {
  const username = useTypedSelector((state) => state.user.currentUser.username);
  const loading = useTypedSelector((state) => state.user.isUserLoading);

  const dispatch = useTypedDispatch();
  const navigate = useNavigate();

  function handleLogout(): void {
    dispatch(logout() as any);
  }

  function handleLogin(): void {
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <BottomTab type={App.Terminal} icon={faTerminal} />
      <BottomTab type={App.Settings} icon={faCogs} />
      <BottomTab type={App.Calculator} icon={faCalculator} />
      <BottomTab type={App.ToDo} icon={faClipboardList} />
      <BottomTab type={App.Chat} icon={faCommentDots} />
      <BottomTab type={App.Simon} icon={faThLarge} />
      <BottomTab type={App.Minesweeper} icon={faBomb} />
      <BottomTab type={App.Translate} icon={faLanguage} />
      {!loading &&
        (username !== '' ? (
          <Button onClick={handleLogout} className={styles.logBtn} aria-label="logout">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Button>
        ) : (
          <Button onClick={handleLogin} className={styles.logBtn} aria-label="login">
            <FontAwesomeIcon icon={faUser} />
          </Button>
        ))}
    </div>
  );
};
