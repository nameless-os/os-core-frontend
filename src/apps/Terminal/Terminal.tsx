import React, { FC, useEffect, useRef, useState } from 'react';

import {
  addTerminalHistory, getTerminalDataById,
  incrementAutocompleteNumber,
  resetAutocompleteNumber,
  TerminalMessage,
} from '@Terminal/redux/terminalSlice/terminalSlice';
import { App, CommonAppProps } from '@webos-project/common';
import { processTerminalInput } from '@Terminal/logic/processTerminalInput';
import { getAvailableAutocomplete } from '@Terminal/logic/autocomplete/getAvailableAutocomplete';
import { Window } from '@Components/Window/Window';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './terminal.module.css';

export const Terminal: FC<CommonAppProps> = React.memo(({ appId }) => {
  const terminalData = useTypedSelector((state) => getTerminalDataById(state, appId));
  const terminalHistory = terminalData!.terminalHistory;
  const inputHistory = terminalData!.terminalInputHistory;

  const [text, setText] = useState('');
  const [inputHistoryNumber, setInputHistoryNumber] = useState(inputHistory.length);

  const listRef = useRef<HTMLDivElement>(null);

  const dispatch = useTypedDispatch();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
    dispatch(resetAutocompleteNumber(appId));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const updatedInputHistoryNumber = inputHistoryNumber > 0 ? inputHistoryNumber - 1 : inputHistoryNumber;
      setInputHistoryNumber(updatedInputHistoryNumber);
      setText(inputHistory[updatedInputHistoryNumber] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const updatedInputHistoryNumber =
        inputHistoryNumber < inputHistory.length - 1 ? inputHistoryNumber + 1 : inputHistoryNumber;
      setInputHistoryNumber(updatedInputHistoryNumber);
      setText(inputHistory[updatedInputHistoryNumber] || '');
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const textArr = text.split(' ');
      textArr[textArr.length - 1] = getAvailableAutocomplete(text, appId);
      setText(textArr.join(' '));
      dispatch(incrementAutocompleteNumber(appId));
    } else {
      setInputHistoryNumber(inputHistory.length);
    }
  }

  function handleSubmit(event: React.SyntheticEvent): void {
    event.preventDefault();
    const textToReadable = text.trim().toLowerCase();
    if (!textToReadable) return;
    setText(textToReadable);
    dispatch(addTerminalHistory({ message: `root:~$ ${text}`, appId }));
    processTerminalInput(text, appId);
    setText('');
    dispatch(resetAutocompleteNumber(appId));
  }

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current!.scrollTop = listRef.current!.scrollHeight;
  }, [terminalHistory]);

  return (
    <>
      <Window type={App.Terminal} appId={appId}>
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
                ) : (
                  terminalMessage.message
                )}
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
