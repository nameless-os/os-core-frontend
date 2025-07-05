import React, { FC, SyntheticEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { addRoom, closeAddRoomForm } from '@Chat/redux/chatRoomsSlice/chatRooms';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import { AddRoomUserSelectItem } from './components/AddRoomUserSelectItem/AddRoomUserSelectItem';
import styles from './addRoomForm.module.css';

const AddRoomForm: FC<ChildrenNever> = React.memo(() => {
  const users = useTypedSelector((state) => state.chatUsers.users);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('chat');

  const roomNameRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    dispatch(addRoom({ name: roomNameRef.current!.value, image: imageInputRef.current!.value }) as any);
  }

  function handleCancel() {
    dispatch(closeAddRoomForm());
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="roomNameInput" className={styles.label}>
        <span className={styles.labelText}>{`${t('roomName')}:`}</span>
        <input type="text" id="roomNameInput" className={styles.input} ref={roomNameRef}/>
      </label>
      <label htmlFor="roomImageInput" className={`${styles.label} ${styles.imageInput}`}>
        <span className={styles.labelText}>{`${t('imageLink')}:`}</span>
        <input type="text" id="roomImageInput" className={styles.input} ref={imageInputRef}/>
      </label>
      <div className={styles.users}>
        {users.map((user) => (
          <AddRoomUserSelectItem username={user.username} id={user.id}/>
        ))}
      </div>
      <div className={styles.buttonsContainer}>
        <Button className={styles.submitButton} onClick={handleCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" className={styles.submitButton}>
          {t('createRoom')}
        </Button>
      </div>
    </form>
  );
});

export { AddRoomForm };
