import { FC, useCallback } from 'react';

import { changeActiveChat, changeNewMessageCount, fetchMessages, readMessages } from '@Chat/redux/chatSlice/chatSlice';
import { closeAddRoomForm } from '@Chat/redux/chatRoomsSlice/chatRooms';
import { changeNewMessageCountToZero, fetchUsers } from '@Chat/redux/chatUsersSlice/chatUsersSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { User } from '@Interfaces/user.interface';
import { getReadableLastVisitDate } from '@Chat/logic/dateProcess';
import { Loading } from '@Components/Loading/Loading';
import { Error } from '@Components/Error/Error';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import { ChatSelectionElement } from '../ChatSelectionElement/ChatSelectionElement';

interface Props extends ChildrenNever {
  users: User[];
}

const UserSelectionItems: FC<Props> = ({ users }: Props) => {
  const language = useTypedSelector((state) => state.settings.language);
  const isLoading = useTypedSelector((state) => state.chatUsers.isLoading);
  const hasError = useTypedSelector((state) => state.chatUsers.hasError);

  const dispatch = useTypedDispatch();

  const changeChat = useCallback((chatId: number) => {
    dispatch(closeAddRoomForm());
    dispatch(changeActiveChat({ id: chatId, type: 'User' }));
    dispatch(fetchMessages(chatId));
    dispatch(readMessages());
    dispatch(changeNewMessageCount({ id: chatId, activeType: 'User' }));
    dispatch(changeNewMessageCountToZero({ userId: chatId }));
  }, []);

  const refetchUsers = useCallback(() => {
    dispatch(fetchUsers() as any);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <Error refetch={refetchUsers} />;
  }

  return (
    <>
      {users.map((user: User) => (
        <ChatSelectionElement
          name={user.username}
          lastVisitDate={user.online ? 'Online' : getReadableLastVisitDate(user.lastVisit, language)}
          avatarLink=""
          countOfNewMessages={user.numberOfNewMessages}
          lastMessage={user.lastMessage}
          userId={user.id}
          key={user.id}
          changeChat={changeChat}
        />
      ))}
    </>
  );
};

export { UserSelectionItems };
