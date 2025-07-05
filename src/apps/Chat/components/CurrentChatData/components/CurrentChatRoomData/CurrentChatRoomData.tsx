import { FC } from 'react';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Room } from '@Chat/interfaces/room';
import { useTypedSelector } from '@Hooks';
import { getReadableLastVisitDate } from '@Apps/Chat/logic/dateProcess';
import { Avatar } from '@Components/Avatar/Avatar';

import styles from './currentChatRoomData.module.css';

interface Props extends ChildrenNever {
  room: Room;
}

const CurrentChatRoomData: FC<Props> = ({ room }: Props) => {
  const language = useTypedSelector((state) => state.settings.language);

  return (
    <div className={styles.container}>
      <div />
      <div>
        <div>{room.name}</div>
        <div>{getReadableLastVisitDate(room.lastMessage?.createdAt || room.createdAt, language)}</div>
      </div>
      <Avatar name={room.name} width={40} height={40} link={room.image} />
    </div>
  );
};

export { CurrentChatRoomData };
