import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCheck, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Button } from '@Components/Button/Button';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

import styles from './toDoItem.module.css';
import useToDoStore from '@ToDo/stores/toDo.store';

interface Props extends ChildrenNever {
  id: string;
}

function isLoggedIn() {
  return false;
}

// eslint-disable-next-line react/display-name
const ToDoItem: FC<Props> = React.memo(({ id }: Props) => {
  const toDoItem = useToDoStore(
    (state) => state.toDoList[state.toDoList.findIndex((el) => el.id === id)],
  );
  const changeActiveToDoPage = useToDoStore((state) => state.changeActiveToDoPage);
  const deleteToDoItem = useToDoStore((state) => state.deleteToDoItem);
  const deleteToDoItemLocal = useToDoStore((state) => state.deleteToDoItemLocal);
  const updateToDoItem = useToDoStore((state) => state.updateToDoItem);
  const updateToDoItemLocal = useToDoStore((state) => state.updateToDoItemLocal);

  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);

  const { t } = useTranslation('toDo');

  function handleChangeActiveToDoPage() {
    changeActiveToDoPage(id);
  }

  function toggleIsDescriptionCollapsed() {
    setIsDescriptionCollapsed((prev) => !prev);
  }

  function handleDeleteItem() {
    if (isLoggedIn()) {
      deleteToDoItem(id);
    } else {
      deleteToDoItemLocal(id);
    }
  }

  function handleToggleToDoItem() {
    if (isLoggedIn()) {
      updateToDoItem({
        ...toDoItem,
        isComplete: !toDoItem.isComplete,
      });
    } else {
      updateToDoItemLocal({
        ...toDoItem,
        isComplete: !toDoItem.isComplete,
      });
    }
  }

  return (
    <li className={styles.toDoItem} data-cy="todo-item">
      <motion.div className={styles.text} initial={{ y: 50, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }}>
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
          {isDescriptionCollapsed ? <FontAwesomeIcon icon={faAngleDown}/> : <FontAwesomeIcon icon={faAngleUp}/>}
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
        {toDoItem.isComplete ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faCheck}/>}
      </Button>
      <Button
        className={`${styles.button} ${styles.deleteButton}`}
        onClick={handleDeleteItem}
        aria-label={`${t('deleteItemWithText')} ${toDoItem.heading}`}
      >
        <FontAwesomeIcon icon={faTrashAlt}/>
      </Button>
    </li>
  );
});

export { ToDoItem };
