import classNames from 'classnames';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { addToDoItem, addToDoItemLocal } from '@ToDo/redux/toDoSlice/toDoSlice';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch } from '@Hooks';

import styles from './ToDoInput.module.css';

function isLoggedIn() {
  return false;
}

const ToDoInput: FC<ChildrenNever> = React.memo(() => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation('toDo');
  const { register, getValues, handleSubmit, formState, reset, setFocus } = useForm();

  function handleAddToDo() {
    if (isLoggedIn()) {
      dispatch(addToDoItem(getValues('addToDo')) as any);
      return reset();
    }
    dispatch(addToDoItemLocal(getValues('addToDo')));
    return reset();
  }

  return (
    <div className={styles.addContainer}>
      <form onSubmit={handleSubmit(handleAddToDo)} className={styles.form} aria-label={t('toDoItemCreateForm')}>
        <input
          type="text"
          className={classNames(styles.input, {
            [styles.inputError]: formState.errors?.addToDo,
          })}
          autoFocus
          required
          {...register('addToDo', {
            required: true,
          })}
          aria-label={t('headingOfNewToDoItem')}
        />
        <Button
          className={styles.addItemButton}
          aria-label={t('addToDoItem')}
          type="submit"
          onClick={() => setFocus('addToDo')}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </form>
    </div>
  );
});

export { ToDoInput };
