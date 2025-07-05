import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import {
  changeActiveToDoPage,
  closeToDoUpdateError,
  updateToDoItem,
  updateToDoItemLocal,
} from '@ToDo/redux/toDoSlice/toDoSlice';
import { TopWindowError } from '@Components/TopWindowError/TopWindowError';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './ToDoItemDetails.module.css';

interface Props extends ChildrenNever {
  id: string;
}

function isLoggedIn() {
  return false;
}

const ToDoItemDetails: FC<Props> = ({ id }: Props) => {
  const toDoItem = useTypedSelector(
    (state) => state.toDo.toDoList[state.toDo.toDoList.findIndex((el) => el.id === id)],
  );
  const isUpdateLoading = useTypedSelector((state) => state.toDo.isUpdateLoading);
  const updateError = useTypedSelector((state) => state.toDo.updateError);

  const [text, setText] = useState(toDoItem.heading);
  const [description, setDescription] = useState(toDoItem.description);
  const [isComplete, setIsComplete] = useState(toDoItem.isComplete);
  const [isEditable, setIsEditable] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('toDo');

  // Add useEffect because focus in setIsEditableToTrue don't work on first click
  useEffect(() => {
    if (!isEditable) {
      return;
    }
    nameRef.current?.focus();
  }, [isEditable]);

  // Close error if to do list trigger it
  useEffect(() => {
    dispatch(closeToDoUpdateError());
  }, []);

  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  function handleChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value);
  }

  function handleChangeIsComplete() {
    setIsComplete((prev) => !prev);
  }

  function setIsEditableToTrue() {
    setIsEditable(true);
  }

  function handleBack() {
    dispatch(closeToDoUpdateError());
    dispatch(changeActiveToDoPage(''));
  }

  function handleCancel() {
    setIsEditable(false);
  }

  function handleSave() {
    if (isLoggedIn()) {
      dispatch(
        updateToDoItem({
          id,
          description,
          heading: text,
          isComplete,
        }) as any,
      );
    } else {
      dispatch(
        updateToDoItemLocal({
          id,
          description,
          heading: text,
          isComplete,
        }),
      );
    }
    setIsEditable(false);
  }

  function closeUpdateError() {
    dispatch(closeToDoUpdateError());
  }

  return (
    <>
      <TopWindowError handleClick={closeUpdateError} error={updateError} />
      <form className={styles.form}>
        <label htmlFor="toDoDetailsHeadingInput" className={styles.label}>
          <span>{`${t('heading')}:`}</span>
          <input
            type="text"
            id="toDoDetailsHeadingInput"
            className={styles.input}
            value={text}
            onChange={handleChangeName}
            disabled={!isEditable}
            ref={nameRef}
            aria-label={t('heading')}
          />
        </label>
        <label htmlFor="toDoDetailsDescriptionInput" className={classNames(styles.label, styles.textareaLabel)}>
          <span>{`${t('description')}:`}</span>
          <textarea
            id="toDoDetailsDescriptionInput"
            className={styles.textarea}
            value={description}
            onChange={handleChangeDescription}
            disabled={!isEditable}
            aria-label={t('description')}
          />
        </label>
        <label htmlFor="toDoDetailsStatus" className={styles.status}>
          <span>{`${t('status')}: ${isComplete ? t('completed') : t('inProcess')}`}</span>
          {isEditable && (
            <Button className={styles.changeStatusBtn} onClick={handleChangeIsComplete} aria-label={t('changeStatus')}>
              {t('change')}
            </Button>
          )}
        </label>
        <div className={styles.buttons}>
          {!isEditable ? (
            <Button onClick={handleBack} className={styles.bottomBtn} aria-label={t('back')}>
              {t('back')}
            </Button>
          ) : (
            <Button onClick={handleCancel} className={styles.bottomBtn} aria-label={t('cancel')}>
              {t('cancel')}
            </Button>
          )}
          {!isEditable ? (
            <Button onClick={setIsEditableToTrue} className={styles.bottomBtn} aria-label={t('edit')}>
              {t('edit')}
            </Button>
          ) : (
            <Button className={styles.bottomBtn} onClick={handleSave} disabled={isUpdateLoading} aria-label={t('save')}>
              {t('save')}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export { ToDoItemDetails };
