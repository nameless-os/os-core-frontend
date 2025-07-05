import React, { FC, ReactNode } from 'react';

import { App, CommonAppProps } from '@webos-project/common';
import { useTypedSelector } from '@Hooks';
import { Window } from '@Components/Window/Window';
import { ChatSelection } from '@Chat/components/ChatSelection/ChatSelection';
import { AuthAppRedirect } from '@Components/AuthAppRedirect/AuthAppRedirect';
import { ChatMainContent } from '@Chat/components/ChatMainContent/ChatMainContent';

import styles from './chat.module.css';

const ChatComponent: FC<CommonAppProps> = ({ appId }) => {
  const username = useTypedSelector((state) => state.user.currentUser.username);

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
      <Window type={App.Chat} appId={appId}>
        {mainComponent}
      </Window>
    </>
  );
}

const Chat = React.memo(ChatComponent);

export { Chat };
