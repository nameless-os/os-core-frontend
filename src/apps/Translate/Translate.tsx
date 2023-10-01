// Libraries
import React, { ChangeEvent, FC, useState } from 'react';
import axios from 'axios';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Icons
import imgSource from '@Icons/translate.svg';

// Enums
import { App } from '@Enums/app.enum';

// Components
import { Icon } from '@Components/Icon/Icon';
import { Window } from '@Components/Window/Window';
import { Button } from '@Components/Button/Button';
import { InDevelopment } from '@Components/InDevelopment/inDevelopment';

// Constants
import { AvailableTranslateLanguages } from './constants/availableTranslateLanguages';

// Styles
import styles from './translate.module.css';

const Translate: FC<ChildrenNever> = React.memo(() => {
  const [reqLanguage, setReqLanguage] = useState(AvailableTranslateLanguages.EN);
  const [reqText, setReqText] = useState('');
  const [resLanguage, setResLanguage] = useState(AvailableTranslateLanguages.EN);
  const [resText, setResText] = useState('');

  function handleChangeReqText(event: ChangeEvent<HTMLTextAreaElement>) {
    setReqText(event.target.value);
  }

  async function handleSubmit() {
    const res = await axios.post('https://api.deepl.com/v2/translate', {
      auth_key: '',
      text: reqText,
      source_lang: reqLanguage,
      target_lang: resLanguage,
    });
    setResText(res.data);
  }

  function handleChangeReqLanguage(event: ChangeEvent<HTMLSelectElement>) {
    setReqLanguage(event.target.value as AvailableTranslateLanguages);
  }
  function handleChangeResLanguage(event: ChangeEvent<HTMLSelectElement>) {
    setResLanguage(event.target.value as AvailableTranslateLanguages);
  }

  return (
    <>
      <Icon imgSource={imgSource} type={App.Translate} />
      <Window type={App.Translate}>
        <InDevelopment />
      </Window>
    </>
  );

  return (
    <>
      <Icon imgSource={imgSource} type={App.Translate} />
      <Window type={App.Translate}>
        <div className={styles.container}>
          <div className={styles.reqContainer}>
            <label htmlFor="reqTranslateLanguage">
              Язык запроса:
              <select id="reqTranslateLanguage" onChange={handleChangeReqLanguage}>
                {Object.keys(AvailableTranslateLanguages).map((language: string) => (
                  <option value={language} key={language}>
                    {/* @ts-ignore */}
                    {AvailableTranslateLanguages[language]}
                  </option>
                ))}
              </select>
            </label>
            <textarea onChange={handleChangeReqText} value={reqText} />
          </div>
          <div className={styles.resContainer}>
            <label htmlFor="reqTranslateLanguage">
              Язык ответа:
              <select id="resTranslateLanguage" onChange={handleChangeResLanguage}>
                {Object.keys(AvailableTranslateLanguages).map((language) => (
                  <option value={language} key={language}>
                    {/* @ts-ignore */}
                    {AvailableTranslateLanguages[language]}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.response}>
              <p>{resText}</p>
            </div>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <Button onClick={handleSubmit}>Перевести</Button>
        </div>
      </Window>
    </>
  );
});

export { Translate };
