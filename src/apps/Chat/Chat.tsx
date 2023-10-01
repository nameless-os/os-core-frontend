// Libraries
import React, { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';

// Assets
import imgSource from 'src/assets/images/icons/chat.svg';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Icon } from '@Components/Icon/Icon';
import { Window } from '@Components/Window/Window';
import { ChatSelection } from '@Chat/components/ChatSelection/ChatSelection';
import { AuthAppRedirect } from '@Components/AuthAppRedirect/AuthAppRedirect';
import { ChatMainContent } from '@Chat/components/ChatMainContent/ChatMainContent';

// Styles
import styles from './chat.module.css';

export const Chat: FC<ChildrenNever> = React.memo(() => {
  const username = useSelector((state: RootState) => state.user.currentUser.username);

  let mainComponent: ReactNode;

  if (username === '') {
    mainComponent = <AuthAppRedirect />;
  } else {
    mainComponent = (
      <div className={styles.wrapper}>
        <ChatSelection />
        <ChatMainContent />
      </div>
    );
  }

  return (
    <>
      <Icon imgSource={imgSource} type={App.Chat} />
      <Window type={App.Chat}>
        {mainComponent}
      </Window>
    </>
  );
});
