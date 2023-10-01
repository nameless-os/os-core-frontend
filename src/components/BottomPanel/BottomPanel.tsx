// Libraries
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBomb, faCalculator,
  faClipboardList, faCogs,
  faCommentDots,
  faSignOutAlt, faTerminal,
  faThLarge,
  faUser, faLanguage,
} from '@fortawesome/free-solid-svg-icons';

// Features
import { logout } from '@Features/user/redux/userSlice';

// Enums
import { App } from '@Enums/app.enum';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Components
import { BottomTab } from '@Components/BottomTab/BottomTab';
import { Button } from '@Components/Button/Button';

// Styles
import styles from './bottomPanel.module.css';

export const BottomPanel: FC<ChildrenNever> = () => {
  const username = useSelector((state: RootState) => state.user.currentUser.username);
  const loading = useSelector((state: RootState) => state.user.isUserLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout(): void {
    dispatch(logout());
  }

  function handleLogin(): void {
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <BottomTab
        type={App.Terminal}
        icon={faTerminal}
      />
      <BottomTab
        type={App.Settings}
        icon={faCogs}
      />
      <BottomTab
        type={App.Calculator}
        icon={faCalculator}
      />
      <BottomTab
        type={App.ToDo}
        icon={faClipboardList}
      />
      <BottomTab
        type={App.Chat}
        icon={faCommentDots}
      />
      <BottomTab
        type={App.Simon}
        icon={faThLarge}
      />
      <BottomTab
        type={App.Minesweeper}
        icon={faBomb}
      />
      <BottomTab
        type={App.Translate}
        icon={faLanguage}
      />
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
