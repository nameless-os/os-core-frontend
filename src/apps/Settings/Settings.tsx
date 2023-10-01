// Libraries
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Redux
import { setBackgroundImage, setTheme } from '@Features/theme/redux/themeSlice';
import { setLanguage } from '@Features/i18n/redux/languageSlice';

// Types
import { RootState } from '@Types/rootState.type';

// Enums
import { App } from '@Enums/app.enum';
import { BackgroundImage } from '@Features/theme/types/backgroundImage';
import { Language } from '@Features/i18n/types/language';
import { Theme } from '@Features/theme/types/theme';

// Interface
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Assets
import imgSource from '@Icons/settings.svg';

// Components
import { Window } from '@Components/Window/Window';
import { Icon } from '@Components/Icon/Icon';
import { SettingsOption } from '@Settings/components/SettingsOption/SettingsOption';
import { Button } from '@Components/Button/Button';

// Styles
import styles from './settings.module.css';

export const Settings: FC<ChildrenNever> = React.memo(() => {
  const backgroundImage = useSelector((state: RootState) => state.theme.backgroundImage);
  const backgroundImages = useSelector((state: RootState) => state.theme.backgroundImages);
  const language = useSelector((state: RootState) => state.language.language);
  const languages = useSelector((state: RootState) => state.language.languages);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themes = useSelector((state: RootState) => state.theme.themes);

  const dispatch = useDispatch();
  const { t } = useTranslation('settings');

  function handleChangeBackground(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedBackgroundImage = event.target.selectedOptions[0].value as BackgroundImage;
    if (Object.values(BackgroundImage).includes(selectedBackgroundImage)) {
      dispatch(setBackgroundImage(selectedBackgroundImage));
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
      <Icon imgSource={imgSource} type={App.Settings} />
      <Window type={App.Settings}>
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
              <select id="localeSelect" className={styles.select} onChange={handleChangeLanguage} defaultValue={language}>
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
            <Button
              className={styles.resetBtn}
              onClick={resetSettings}
            >
              {t('reset')}
            </Button>
          </div>
        </form>
      </Window>
    </>
  );
});
