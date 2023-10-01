// Libraries
import classNames from 'classnames';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Utils
import { isLoggedIn } from '@Utils/isLoggedIn';

// Redux
import { addToDoItem, addToDoItemLocal } from '@ToDo/redux/toDoSlice/toDoSlice';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './ToDoInput.module.css';

const ToDoInput: FC<ChildrenNever> = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation('toDo');
  const { register, getValues, handleSubmit, formState, reset, setFocus } = useForm();

  function handleAddToDo() {
    if (isLoggedIn()) {
      dispatch(addToDoItem(getValues('addToDo')));
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
