// Libraries
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { getToDoItems } from '@ToDo/redux/toDoSlice/toDoSlice';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Components
import { Error } from '@Components/Error/Error';
import { Loading } from '@Components/Loading/Loading';
import { ToDoItem } from '@ToDo/components/ToDoItem/ToDoItem';
import { Scrollbar } from '@Components/Scrollbar/Scrollbar';

// Styles
import styles from './toDoList.module.css';

const ToDoList: FC<ChildrenNever> = React.memo(() => {
  const toDoList = useSelector((state: RootState) => state.toDo.toDoList);
  const isLoading = useSelector((state: RootState) => state.toDo.isToDoListLoading);
  const error = useSelector((state: RootState) => state.toDo.toDoListError);

  const listRef = useRef<HTMLUListElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [toDoList.length]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  if (error !== '') {
    return (
      <div className={styles.container}>
        <Error refetch={() => dispatch(getToDoItems())} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Scrollbar>
        <ul className={styles.toDoItemsContainer} ref={listRef}>
          {toDoList.map((toDoItem) => (
            <ToDoItem key={toDoItem.id} id={toDoItem.id} />
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
});

export { ToDoList };
