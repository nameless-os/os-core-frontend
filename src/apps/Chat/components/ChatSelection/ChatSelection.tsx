import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchUsers } from '@Chat/redux/chatUsersSlice/chatUsersSlice';
import { fetchRooms } from '@Chat/redux/chatRoomsSlice/chatRooms';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import { SelectionCategory } from './components/SelectionCategory/SelectionCategory';
import styles from './chatSelection.module.css';

const ChatSelection: FC<ChildrenNever> = React.memo(() => {
  const users = useTypedSelector((state) => state.chatUsers.users);
  const rooms = useTypedSelector((state) => state.chatRooms.rooms);

  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRooms());
  }, [dispatch]);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.wrapperWithBtn}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.wrapper}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { width: '15rem', opacity: '100%' },
              collapsed: { width: '0px', opacity: 0 },
            }}
            transition={{ duration: 1 }}
          >
            <SelectionCategory items={rooms} itemsType="Room" categoryName="Rooms"/>
            <SelectionCategory items={users} itemsType="User" categoryName="Users"/>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        className={classNames(styles.toggleVisibilityBtn, {
          [styles.closeBtn]: !isOpen,
        })}
        onClick={handleClick}
      >
        {isOpen ? <FontAwesomeIcon icon={faAngleLeft}/> : <FontAwesomeIcon icon={faAngleRight}/>}
      </Button>
    </div>
  );
});

export { ChatSelection };
