import { FC, useState } from 'react';

import { addUserToNewRoom, removeUserFromNewRoom } from '@Chat/redux/chatRoomsSlice/chatRooms';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch } from '@Hooks';

import styles from './addRoomUserSelectItem.module.css';

interface Props extends ChildrenNever {
  username: string;
  id: number;
}

const AddRoomUserSelectItem: FC<Props> = ({ username, id }: Props) => {
  const [isIncluded, setIsIncluded] = useState(false);

  const dispatch = useTypedDispatch();

  function toggleUserIncluded() {
    if (isIncluded) {
      dispatch(removeUserFromNewRoom(id));
    } else {
      dispatch(addUserToNewRoom(id));
    }
    setIsIncluded((prev) => !prev);
  }

  return (
    <div className={`${styles.userSelectItem} ${isIncluded ? styles.selectedItem : ''}`}>
      <p>{username}</p>
      <Button onClick={toggleUserIncluded} className={styles.userSelectButton}>
        {isIncluded ? '-' : '+'}
      </Button>
    </div>
  );
};

export { AddRoomUserSelectItem };
