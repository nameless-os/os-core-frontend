// Libraries
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import React, { FC, useEffect } from 'react';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { MessageAlertItem } from '@Components/MessageAlertItem/MessageAlertItem';

// Styles
import 'react-toastify/dist/ReactToastify.css';

export const MessageAlert: FC<ChildrenNever> = () => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const username = useSelector((state: RootState) => state.user.currentUser.username);
  const numberOfRender = useSelector((state: RootState) => state.chat.numberOfRender);
  const isChatOpen = useSelector((state: RootState) => state.apps.appsState[App.Chat].isOpen);
  const isChatCollapsed = useSelector((state: RootState) => state.apps.appsState[App.Chat].isCollapsed);

  useEffect(() => {
    const message = messages[messages.length - 1];
    if (message?.text && username !== message.owner.username && numberOfRender > 1 && (!isChatOpen || isChatCollapsed)) {
      toast.dark(<MessageAlertItem message={message} />, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        toastId: message.id,
      });
    }
  }, [numberOfRender]);

  return (
    <ToastContainer />
  );
};
