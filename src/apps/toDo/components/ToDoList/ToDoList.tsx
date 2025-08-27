import React, { FC, useEffect, useRef } from 'react';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Error } from '@Components/Error/Error';
import { Loading } from '@Components/Loading/Loading';
import { ToDoItem } from '@ToDo/components/ToDoItem/ToDoItem';

import styles from './toDoList.module.css';
import useToDoStore from '@ToDo/stores/toDo.store';

// eslint-disable-next-line react/display-name
const ToDoList: FC<ChildrenNever> = React.memo(() => {
  const toDoList = useToDoStore((state) => state.toDoList);
  const isLoading = useToDoStore((state) => state.isToDoListLoading);
  const error = useToDoStore((state) => state.toDoListError);
  const getToDoItems = useToDoStore((state) => state.getToDoItems);

  const listRef = useRef<HTMLUListElement>(null);

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
        <Error refetch={getToDoItems}/>
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
