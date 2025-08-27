import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { TopWindowError } from '@Components/TopWindowError/TopWindowError';
import { Button } from '@Components/Button/Button';

import styles from './ToDoItemDetails.module.css';
import useToDoStore from '@ToDo/stores/toDo.store';

interface Props extends ChildrenNever {
  id: string;
}

function isLoggedIn() {
  return false;
}

const ToDoItemDetails: FC<Props> = ({ id }: Props) => {
  const toDoItem = useToDoStore(
    (state) => state.toDoList[state.toDoList.findIndex((el) => el.id === id)],
  );
  const isUpdateLoading = useToDoStore((state) => state.isUpdateLoading);
  const updateError = useToDoStore((state) => state.updateError);
  const closeToDoUpdateError = useToDoStore((state) => state.closeToDoUpdateError);
  const changeActiveToDoPage = useToDoStore((state) => state.changeActiveToDoPage);
  const updateToDoItem = useToDoStore((state) => state.updateToDoItem);
  const updateToDoItemLocal = useToDoStore((state) => state.updateToDoItemLocal);

  const [text, setText] = useState(toDoItem.heading);
  const [description, setDescription] = useState(toDoItem.description);
  const [isComplete, setIsComplete] = useState(toDoItem.isComplete);
  const [isEditable, setIsEditable] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation('toDo');

  useEffect(() => {
    if (!isEditable) {
      return;
    }
    nameRef.current?.focus();
  }, [isEditable]);

  useEffect(() => {
    closeToDoUpdateError();
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
    closeToDoUpdateError();
    changeActiveToDoPage('');
  }

  function handleCancel() {
    setIsEditable(false);
  }

  function handleSave() {
    if (isLoggedIn()) {
      updateToDoItem({
        id,
        description,
        heading: text,
        isComplete,
      });
    } else {
      updateToDoItemLocal({
        id,
        description,
        heading: text,
        isComplete,
      });
    }
    setIsEditable(false);
  }

  function closeUpdateError() {
    closeToDoUpdateError();
  }

  return (
    <>
      <TopWindowError handleClick={closeUpdateError} error={updateError}/>
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
