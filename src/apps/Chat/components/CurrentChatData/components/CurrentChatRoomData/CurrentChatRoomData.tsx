// Libraries
import { FC } from 'react';
import { useSelector } from 'react-redux';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Room } from '@Chat/interfaces/room';

// Types
import { RootState } from '@Types/rootState.type';

// Logic
import { getReadableLastVisitDate } from '@Apps/Chat/logic/dateProcess';

// Components
import { Avatar } from '@Components/Avatar/Avatar';

// Styles
import styles from './currentChatRoomData.module.css';

interface Props extends ChildrenNever {
  room: Room;
}

const CurrentChatRoomData: FC<Props> = ({ room }: Props) => {
  const language = useSelector((state: RootState) => state.language.language);

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
