import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Window } from '@Components/Window/Window';
import { SettingsOption } from '@Settings/components/SettingsOption/SettingsOption';
import { Button } from '@Components/Button/Button';
import { Theme, Background } from '@Features/settings/enums';
import {
  backgroundImages,
  languages,
  setBackground,
  setLanguage,
  setTheme,
  themes,
} from '@Features/settings/redux/settings.slice';
import { Language } from '@Features/i18n/types/language';
import { CommonAppProps, App } from '@webos-project/common';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './settings.module.css';

export const Settings: FC<CommonAppProps> = React.memo(({ appId }) => {
  const backgroundImage = useTypedSelector((state) => state.settings.background);
  const language = useTypedSelector((state) => state.settings.language);
  const theme = useTypedSelector((state) => state.settings.theme);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('settings');

  function handleChangeBackground(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedBackgroundImage = event.target.selectedOptions[0].value as Background;
    if (Object.values(Background).includes(selectedBackgroundImage)) {
      dispatch(setBackground(selectedBackgroundImage));
    }
  }

  function handleChangeLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLanguage = event.target.selectedOptions[0].value as Language;
    if (Object.values(Language).includes(selectedLanguage)) {
      dispatch(setLanguage(selectedLanguage));
    }
  }

  function handleChangeTheme(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedTheme = event.target.selectedOptions[0].value as Theme;
    if (Object.values(Theme).includes(selectedTheme)) {
      dispatch(setTheme(selectedTheme));
    }
  }

  function resetSettings() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
      <Window type={App.Settings} appId={appId}>
        <form className={styles.form}>
          <div>
            <label htmlFor="themeSelect" className={styles.label}>
              {t('wallpaper')}
              <select
                id="themeSelect"
                className={styles.select}
                onChange={handleChangeBackground}
                defaultValue={backgroundImage}
              >
                {backgroundImages.map((el) => (
                  <SettingsOption value={el} category="backgrounds" key={el} />
                ))}
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="localeSelect" className={styles.label}>
              {t('language')}
              <select
                id="localeSelect"
                className={styles.select}
                onChange={handleChangeLanguage}
                defaultValue={language}
              >
                {languages.map((el) => (
                  <SettingsOption value={el} category="languages" key={el} />
                ))}
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="themeSelect" className={styles.label}>
              {t('theme')}
              <select id="themeSelect" className={styles.select} onChange={handleChangeTheme} defaultValue={theme}>
                {themes.map((el) => (
                  <SettingsOption value={el} category="themes" key={el} />
                ))}
              </select>
            </label>
          </div>
          <div className={styles.resetContainer}>
            <Button className={styles.resetBtn} onClick={resetSettings}>
              {t('reset')}
            </Button>
          </div>
        </form>
      </Window>
    </>
  );
});
