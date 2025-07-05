import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import Picker from 'emoji-picker-react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSmile } from '@fortawesome/free-solid-svg-icons';

import {
  addMessageInputValue,
  changeMessageInputValue,
  clearMessageInputValue,
  sendMessage,
} from '@Chat/redux/chatSlice/chatSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './chatInput.module.css';

const ChatInput: FC<ChildrenNever> = () => {
  const text = useTypedSelector((state) => state.chat.text);
  const activeChat = useTypedSelector((state) => state.chat.activeChat);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('chat');

  const pickerRef = useRef<HTMLDivElement>(null);

  const [isSmileOpen, setIsSmileOpen] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(changeMessageInputValue(event.target.value));
  }

  function handleSmileClick(): void {
    setIsSmileOpen(!isSmileOpen);
  }

  function handleEmoji(event: React.MouseEvent, emojiObject: any): void {
    dispatch(addMessageInputValue(emojiObject.emoji));
  }

  function handleSubmit(event?: React.SyntheticEvent): void {
    if (event) event.preventDefault();
    const textToReadable = text.trim();
    if (!textToReadable) {
      dispatch(clearMessageInputValue());
      return;
    }
    dispatch(sendMessage(textToReadable) as any);
    dispatch(clearMessageInputValue());
  }

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (!pickerRef.current) {
        return;
      }

      const clientRect = pickerRef.current?.getBoundingClientRect();

      if (
        event.clientX > clientRect.left &&
        event.clientX < clientRect.right &&
        event.clientY < clientRect.bottom &&
        event.clientY > clientRect.top
      ) {
        return;
      }

      if (isSmileOpen) {
        setIsSmileOpen(false);
      }
    },
    [isSmileOpen],
  );

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, [handleDocumentClick, isSmileOpen]);

  function handleKeyDown(event: React.KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  if (activeChat === -1) {
    return null;
  }

  return (
    <form className={styles.wrapper}>
      <textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={`${t('printYourMessage')}...`}
        autoFocus
      />
      <FontAwesomeIcon icon={faSmile} className={`${styles.smileBtn} ${styles.btn}`} onClick={handleSmileClick} />
      <FontAwesomeIcon icon={faPaperPlane} className={`${styles.sendBtn} ${styles.btn}`} onClick={handleSubmit} />
      {isSmileOpen && (
        <div className={styles.smilePicker} ref={pickerRef}>
          <Picker onEmojiClick={handleEmoji as any} />
        </div>
      )}
    </form>
  );
};

export { ChatInput };
