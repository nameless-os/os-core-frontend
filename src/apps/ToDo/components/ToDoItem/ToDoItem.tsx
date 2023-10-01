// Libraries
import { isLoggedIn } from '@Utils/isLoggedIn';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faTrashAlt, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// Redux
import {
  deleteToDoItem,
  changeActiveToDoPage,
  updateToDoItem,
  deleteToDoItemLocal, updateToDoItemLocal,
} from '@ToDo/redux/toDoSlice/toDoSlice';

// Types
import { RootState } from '@Types/rootState.type';

// Components
import { Button } from '@Components/Button/Button';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './toDoItem.module.css';

interface Props extends ChildrenNever {
  id: string;
}

const ToDoItem: FC<Props> = React.memo(({ id }: Props) => {
  const toDoItem = useSelector(
    (state: RootState) => state.toDo.toDoList[state.toDo.toDoList.findIndex((el) => el.id === id)],
  );

  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);

  const { t } = useTranslation('toDo');
  const dispatch = useDispatch();

  function handleChangeActiveToDoPage() {
    dispatch(changeActiveToDoPage(id));
  }

  function toggleIsDescriptionCollapsed() {
    setIsDescriptionCollapsed((prev) => !prev);
  }

  function handleDeleteItem() {
    if (isLoggedIn()) {
      dispatch(deleteToDoItem(id));
    } else {
      dispatch(deleteToDoItemLocal(id));
    }
  }

  function handleToggleToDoItem() {
    if (isLoggedIn()) {
      dispatch(updateToDoItem({
        ...toDoItem,
        isComplete: !toDoItem.isComplete,
      }));
    } else {
      dispatch(updateToDoItemLocal({
        ...toDoItem,
        isComplete: !toDoItem.isComplete,
      }));
    }
  }

  return (
    <li className={styles.toDoItem} data-cy="todo-item">
      <motion.div
        className={styles.text}
        initial={{ y: 50, opacity: 0.2 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Button
          onClick={handleChangeActiveToDoPage}
          className={classNames(styles.textButton, {
            [styles.completed]: toDoItem.isComplete,
          })}
          aria-label={t('goToToDoEditPage')}
        >
          {toDoItem.heading}
        </Button>
        <Button
          className={styles.collapseButton}
          onClick={toggleIsDescriptionCollapsed}
          aria-label={t('toggleCollapseDescription')}
        >
          {isDescriptionCollapsed ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
        </Button>
        <AnimatePresence initial={false}>
          {!isDescriptionCollapsed && (
            <motion.p
              className={styles.description}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              {toDoItem.description}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <Button
        className={classNames(styles.button, {
          [styles.checkButton]: !toDoItem.isComplete,
          [styles.uncheckButton]: toDoItem.isComplete,
        })}
        onClick={handleToggleToDoItem}
        aria-label={`${t('toggleItemWithText')} ${toDoItem.heading}`}
      >
        {toDoItem.isComplete ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faCheck} />}
      </Button>
      <Button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={handleDeleteItem}
        aria-label={`${t('deleteItemWithText')} ${toDoItem.heading}`}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
    </li>
  );
});

export { ToDoItem };
