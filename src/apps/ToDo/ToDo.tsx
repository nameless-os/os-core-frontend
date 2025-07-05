import React, { FC, useEffect } from 'react';

import { CommonAppProps, App } from '@webos-project/common';

import { closeToDoAddError, closeToDoUpdateError, getToDoItems } from '@ToDo/redux/toDoSlice/toDoSlice';
import { Window } from '@Components/Window/Window';
import { ToDoList } from '@ToDo/components/ToDoList/ToDoList';
import { ToDoInput } from '@ToDo/components/ToDoInput/ToDoInput';
import { ToDoItemDetails } from '@ToDo/components/ToDoItemDetails/ToDoItemDetails';
import { TopWindowError } from '@Components/TopWindowError/TopWindowError';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './toDo.module.css';

function isLoggedIn() {
  return false;
}

const ToDo: FC<CommonAppProps> = ({ appId }) => {
  const activeToDoPage = useTypedSelector((state) => state.toDo.activeToDoPage);
  const addError = useTypedSelector((state) => state.toDo.addError);
  const updateError = useTypedSelector((state) => state.toDo.updateError);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (!isLoggedIn()) {
      return;
    }
    dispatch(getToDoItems() as any);
  }, []);

  function closeErrors() {
    dispatch(closeToDoUpdateError());
    dispatch(closeToDoAddError());
  }

  return (
    <>
      <Window type={App.ToDo} appId={appId}>
        <div className={styles.container}>
          {activeToDoPage !== '' ? (
            <ToDoItemDetails id={activeToDoPage} />
          ) : (
            <>
              <TopWindowError handleClick={closeErrors} error={updateError || addError} />
              <ToDoList />
              <ToDoInput />
            </>
          )}
        </div>
      </Window>
    </>
  );
};

export { ToDo };
