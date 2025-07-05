import { FC, useCallback } from 'react';

import { changeActiveChat, changeNewMessageCount, fetchMessages, readMessages } from '@Chat/redux/chatSlice/chatSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Room } from '@Apps/Chat/interfaces/room';
import { getReadableLastVisitDate } from '@Chat/logic/dateProcess';
import { Loading } from '@Components/Loading/Loading';
import { Error } from '@Components/Error/Error';
import { Button } from '@Components/Button/Button';
import {
  changeNewMessageRoomCountToZero,
  closeAddRoomForm,
  fetchRooms,
  openAddRoomForm,
} from '@Chat/redux/chatRoomsSlice/chatRooms';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import { ChatSelectionElement } from '../ChatSelectionElement/ChatSelectionElement';
import styles from './roomSelectionItems.module.css';

interface Props extends ChildrenNever {
  rooms: Room[];
}

const RoomSelectionItems: FC<Props> = ({ rooms }: Props) => {
  const language = useTypedSelector((state) => state.settings.language);
  const isLoading = useTypedSelector((state) => state.chatRooms.isLoading);
  const hasError = useTypedSelector((state) => state.chatRooms.hasError);

  const dispatch = useTypedDispatch();

  function changeChat(chatId: number) {
    dispatch(closeAddRoomForm());
    dispatch(changeActiveChat({ id: chatId, type: 'Room' }));
    dispatch(fetchMessages(chatId) as any);
    dispatch(readMessages() as any);
    dispatch(changeNewMessageCount({ id: chatId, activeType: 'Room' }));
    dispatch(changeNewMessageRoomCountToZero({ userId: chatId }));
  }

  const refetchRooms = useCallback(() => {
    dispatch(fetchRooms() as any);
  }, []);

  const handleOpenAddRoom = useCallback(() => {
    dispatch(openAddRoomForm());
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return <Error refetch={refetchRooms} />;
  }

  return (
    <>
      {rooms.map((room) => (
        <ChatSelectionElement
          name={room.name}
          lastVisitDate={getReadableLastVisitDate(room.lastMessage?.createdAt || room.createdAt, language)}
          avatarLink={room.image}
          countOfNewMessages={room.numberOfNewMessages}
          lastMessage={room.lastMessage}
          userId={room.id}
          key={room.name}
          changeChat={changeChat}
        />
      ))}
      <Button className={styles.addButton} onClick={handleOpenAddRoom}>
        +
      </Button>
    </>
  );
};

export { RoomSelectionItems };
