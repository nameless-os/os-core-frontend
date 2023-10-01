// Libraries
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import {
  addTerminalHistory,
  incrementAutocompleteNumber,
  resetAutocompleteNumber,
  TerminalMessage,
} from '@Terminal/redux/terminalSlice/terminalSlice';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Logic
import { processTerminalInput } from '@Terminal/logic/processTerminalInput';
import { getAvailableAutocomplete } from '@Terminal/logic/autocomplete/getAvailableAutocomplete';

// Assets
import imgSource from '@Icons/terminal.svg';

// Components
import { Window } from '@Components/Window/Window';
import { Icon } from '@Components/Icon/Icon';

// Styles
import styles from './terminal.module.css';

export const Terminal: FC<ChildrenNever> = React.memo(() => {
  const terminalHistory = useSelector((state: RootState) => state.terminal.terminalHistory);
  const inputHistory = useSelector((state: RootState) => state.terminal.terminalInputHistory);

  const [text, setText] = useState('');
  const [inputHistoryNumber, setInputHistoryNumber] = useState(inputHistory.length);

  const listRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
    dispatch(resetAutocompleteNumber());
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const updatedInputHistoryNumber = inputHistoryNumber > 0 ? inputHistoryNumber - 1 : inputHistoryNumber;
      setInputHistoryNumber(updatedInputHistoryNumber);
      setText(inputHistory[updatedInputHistoryNumber] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const updatedInputHistoryNumber = inputHistoryNumber < inputHistory.length - 1 ? inputHistoryNumber + 1 : inputHistoryNumber;
      setInputHistoryNumber(updatedInputHistoryNumber);
      setText(inputHistory[updatedInputHistoryNumber] || '');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const textArr = text.split(' ');
      textArr[textArr.length - 1] = getAvailableAutocomplete(text);
      setText(textArr.join(' '));
      dispatch(incrementAutocompleteNumber());
    } else {
      setInputHistoryNumber(inputHistory.length);
    }
  }

  function handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();
    const textToReadable = text.trim().toLowerCase();
    if (!textToReadable) return;
    setText(textToReadable);
    dispatch(addTerminalHistory(`root:~$ ${text}`));
    processTerminalInput(text);
    setText('');
    dispatch(resetAutocompleteNumber());
  }

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current!.scrollTop = listRef.current!.scrollHeight;
  }, [terminalHistory]);

  return (
    <>
      <Icon imgSource={imgSource} type={App.Terminal} />
      <Window type={App.Terminal}>
        <div className={styles.wrapper} ref={listRef}>
          <ul className={styles.terminalText} id="terminalHistory">
            {terminalHistory.map((terminalMessage: TerminalMessage) => (
              <li key={terminalMessage.id}>
                {terminalMessage.message.startsWith('root:~$ ') ? (
                  <>
                    <span className={styles.user}>root</span>
                    <span>:</span>
                    <span className={styles.tilda}>~</span>
                    <span>{'$ '}</span>
                    {terminalMessage.message.slice(8)}
                  </>
                ) : terminalMessage.message}
              </li>
            ))}
          </ul>
          <pre className={styles.pre}>
            <span className={styles.user}>root</span>
            <span>:</span>
            <span className={styles.tilda}>~</span>
            <span>{'$ '}</span>
            <form onSubmit={handleSubmit}>
              <input
                autoFocus
                type="text"
                className={styles.input}
                onChange={handleChange}
                value={text}
                onKeyDown={handleKeyDown}
              />
            </form>
          </pre>
        </div>
      </Window>
    </>
  );
});
