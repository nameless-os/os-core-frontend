// Libraries
import React, { FC, SyntheticEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';

// Types
import { RootState } from '@Types/rootState.type';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Redux
import { addRoom, closeAddRoomForm } from '@Chat/redux/chatRoomsSlice/chatRooms';

// Components
import { Button } from '@Components/Button/Button';
import { AddRoomUserSelectItem } from './components/AddRoomUserSelectItem/AddRoomUserSelectItem';

// Styles
import styles from './addRoomForm.module.css';

const AddRoomForm: FC<ChildrenNever> = React.memo(() => {
  const users = useSelector((state: RootState) => state.chatUsers.users);

  const dispatch = useDispatch();
  const { t } = useTranslation('chat');

  const roomNameRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    dispatch(addRoom({ name: roomNameRef.current!.value, image: imageInputRef.current!.value }));
  }

  function handleCancel() {
    dispatch(closeAddRoomForm());
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="roomNameInput" className={styles.label}>
        <span className={styles.labelText}>{`${t('roomName')}:`}</span>
        <input type="text" id="roomNameInput" className={styles.input} ref={roomNameRef} />
      </label>
      <label htmlFor="roomImageInput" className={`${styles.label} ${styles.imageInput}`}>
        <span className={styles.labelText}>{`${t('imageLink')}:`}</span>
        <input type="text" id="roomImageInput" className={styles.input} ref={imageInputRef} />
      </label>
      <div className={styles.users}>
        <Scrollbars autoHeight autoHeightMax={300}>
          {users.map((user) => (
            <AddRoomUserSelectItem username={user.username} id={user.id} />
          ))}
        </Scrollbars>
      </div>
      <div className={styles.buttonsContainer}>
        <Button className={styles.submitButton} onClick={handleCancel}>{t('cancel')}</Button>
        <Button type="submit" className={styles.submitButton}>{t('createRoom')}</Button>
      </div>
    </form>
  );
});

export { AddRoomForm };
