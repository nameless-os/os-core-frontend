import { toast, ToastContainer } from 'react-toastify';
import React, { FC, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { MessageAlertItem } from '@Components/MessageAlertItem/MessageAlertItem';
import { useTypedSelector } from '@Hooks';

export const MessageAlert: FC<ChildrenNever> = () => {
  const messages = useTypedSelector((state) => state.chat.messages);
  const username = useTypedSelector((state) => state.user.currentUser.username);
  const numberOfRender = useTypedSelector((state) => state.chat.numberOfRender);
  const isChatOpen = true;
  const isChatCollapsed = false;

  useEffect(() => {
    const message = messages[messages.length - 1];
    if (
      message?.text &&
      username !== message.owner.username &&
      numberOfRender > 1 &&
      (!isChatOpen || isChatCollapsed)
    ) {
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

  return <ToastContainer />;
};
