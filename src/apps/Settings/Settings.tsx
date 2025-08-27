import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsOption } from '@Settings/components/SettingsOption/SettingsOption';
import { Button } from '@Components/Button/Button';
import { Background, Theme } from '@Features/settings/enums';
import { Language } from '@Features/i18n/types/language';

const backgroundImages = Object.values(Background);
const themes = Object.values(Theme);
const languages = Object.values(Language);

import styles from './settings.module.css';
import { useBackground, useLanguage, useSettingsStore, useTheme } from '@Settings/stores/settings.store';
import { AppInstanceId } from '@nameless-os/sdk';

const Settings: FC<{ appId: AppInstanceId }> = React.memo(() => {
  const backgroundImage = useBackground();
  const language = useLanguage();
  const theme = useTheme();
  const { setTheme, setBackground, setLanguage } = useSettingsStore();

  const { t } = useTranslation('settings');

  function handleChangeBackground(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedBackgroundImage = event.target.selectedOptions[0].value as Background;
    if (Object.values(Background).includes(selectedBackgroundImage)) {
      setBackground(selectedBackgroundImage);
    }
  }

  function handleChangeLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLanguage = event.target.selectedOptions[0].value as Language;
    if (Object.values(Language).includes(selectedLanguage)) {
      setLanguage(selectedLanguage);
    }
  }

  function handleChangeTheme(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedTheme = event.target.selectedOptions[0].value as Theme;
    if (Object.values(Theme).includes(selectedTheme)) {
      setTheme(selectedTheme);
    }
  }

  function resetSettings() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <>
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
                <SettingsOption value={el} category="backgrounds" key={el}/>
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
                <SettingsOption value={el} category="languages" key={el}/>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="themeSelect" className={styles.label}>
            {t('theme')}
            <select id="themeSelect" className={styles.select} onChange={handleChangeTheme} defaultValue={theme}>
              {themes.map((el) => (
                <SettingsOption value={el} category="themes" key={el}/>
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
    </>
  );
});

Settings.displayName = 'Settings';

export { Settings };
