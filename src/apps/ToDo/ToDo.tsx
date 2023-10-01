// Libraries
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Enums
import { App } from '@Enums/app.enum';

// Redux
import { closeToDoAddError, closeToDoUpdateError, getToDoItems } from '@ToDo/redux/toDoSlice/toDoSlice';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Utils
import { isLoggedIn } from '@Utils/isLoggedIn';

// Assets
import imgSource from '@Icons/toDo.svg';

// Components
import { Window } from '@Components/Window/Window';
import { Icon } from '@Components/Icon/Icon';
import { ToDoList } from '@ToDo/components/ToDoList/ToDoList';
import { ToDoInput } from '@ToDo/components/ToDoInput/ToDoInput';
import { ToDoItemDetails } from '@ToDo/components/ToDoItemDetails/ToDoItemDetails';
import { TopWindowError } from '@Components/TopWindowError/TopWindowError';

// Styles
import styles from './toDo.module.css';

const ToDo: FC<ChildrenNever> = () => {
  const activeToDoPage = useSelector((state: RootState) => state.toDo.activeToDoPage);
  const addError = useSelector((state: RootState) => state.toDo.addError);
  const updateError = useSelector((state: RootState) => state.toDo.updateError);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn()) {
      return;
    }
    dispatch(getToDoItems());
  }, []);

  function closeErrors() {
    dispatch(closeToDoUpdateError());
    dispatch(closeToDoAddError());
  }

  return (
    <>
      <Icon imgSource={imgSource} type={App.ToDo} />
      <Window type={App.ToDo}>
        <div className={styles.container}>
          {activeToDoPage !== '' ? <ToDoItemDetails id={activeToDoPage} /> : (
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
