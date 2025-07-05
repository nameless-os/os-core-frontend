import React, { ChangeEvent, FC, useState } from 'react';
import axios from 'axios';
import { App, CommonAppProps } from '@webos-project/common';
import { Window } from '@Components/Window/Window';
import { Button } from '@Components/Button/Button';
import { InDevelopment } from '@Components/InDevelopment/inDevelopment';
import { AvailableTranslateLanguages } from './constants/availableTranslateLanguages';
import styles from './translate.module.css';

const Translate: FC<CommonAppProps> = React.memo(({ appId }) => {
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
      <Window type={App.Translate} appId={appId}>
        <InDevelopment />
      </Window>
    </>
  );

  return (
    <>
      <Window type={App.Translate} appId={appId}>
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
