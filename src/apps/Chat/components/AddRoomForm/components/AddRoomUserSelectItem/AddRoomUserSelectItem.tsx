// Libraries
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

// Redux
import { addUserToNewRoom, removeUserFromNewRoom } from '@Chat/redux/chatRoomsSlice/chatRooms';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './addRoomUserSelectItem.module.css';

interface Props extends ChildrenNever {
  username: string;
  id: number;
}

const AddRoomUserSelectItem: FC<Props> = ({ username, id }: Props) => {
  const [isIncluded, setIsIncluded] = useState(false);

  const dispatch = useDispatch();

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
      <Button
        onClick={toggleUserIncluded}
        className={styles.userSelectButton}
      >
        {isIncluded ? '-' : '+'}
      </Button>
    </div>
  );
};

export { AddRoomUserSelectItem };
