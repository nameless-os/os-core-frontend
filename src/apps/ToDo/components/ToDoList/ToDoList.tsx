import React, { FC, useEffect, useRef } from 'react';

import { getToDoItems } from '@ToDo/redux/toDoSlice/toDoSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Error } from '@Components/Error/Error';
import { Loading } from '@Components/Loading/Loading';
import { ToDoItem } from '@ToDo/components/ToDoItem/ToDoItem';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './toDoList.module.css';

const ToDoList: FC<ChildrenNever> = React.memo(() => {
  const toDoList = useTypedSelector((state) => state.toDo.toDoList);
  const isLoading = useTypedSelector((state) => state.toDo.isToDoListLoading);
  const error = useTypedSelector((state) => state.toDo.toDoListError);

  const listRef = useRef<HTMLUListElement>(null);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [toDoList.length]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loading/>
      </div>
    );
  }

  if (error !== '') {
    return (
      <div className={styles.container}>
        <Error refetch={() => dispatch(getToDoItems() as any)}/>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.toDoItemsContainer} ref={listRef}>
        {toDoList.map((toDoItem) => (
          <ToDoItem key={toDoItem.id} id={toDoItem.id}/>
        ))}
      </ul>
    </div>
  );
});

export { ToDoList };
