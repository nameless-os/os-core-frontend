import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Background, IconPosition, SettingsSavePlace, Theme, WindowStyle } from '../enums';
import { Nullable } from '@webos-project/common';
import { Language } from '@Features/i18n/types/language';
import i18n from '@Features/i18n';

interface SettingsSliceInitialState {
  background: Background;
  backgroundUrl: Nullable<string>;
  theme: Theme;
  language: Language;
  iconPosition: IconPosition;
  windowStyle: WindowStyle;
  settingsSavePlace: SettingsSavePlace;
}

const initialState: SettingsSliceInitialState = {
  background: Background.Planet,
  backgroundUrl: null,
  theme: Theme.Dark,
  language: Language.English,
  iconPosition: IconPosition.Absolute,
  windowStyle: WindowStyle.Default,
  settingsSavePlace: SettingsSavePlace.Local,
};

export const backgroundImages = Object.values(Background);
export const languages = Object.values(Language);
export const themes = Object.values(Theme);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setBackground(state, { payload }: PayloadAction<Background>) {
      state.background = payload;
    },
    setBackgroundUrl(state, { payload }: PayloadAction<Nullable<string>>) {
      state.backgroundUrl = payload;
    },
    setTheme(state, { payload }: PayloadAction<Theme>) {
      state.theme = payload;
    },
    setLanguage(state, { payload }: PayloadAction<Language>) {
      state.language = payload;
      i18n.changeLanguage(payload);
    },
    setIconPosition(state, { payload }: PayloadAction<IconPosition>) {
      state.iconPosition = payload;
    },
    setWindowStyle(state, { payload }: PayloadAction<WindowStyle>) {
      state.windowStyle = payload;
    },
    setSettingsSavePlace(state, { payload }: PayloadAction<SettingsSavePlace>) {
      state.settingsSavePlace = payload;
    },
  },
});

export default themeSlice.reducer;
export const {
  setTheme,
  setIconPosition,
  setLanguage,
  setSettingsSavePlace,
  setWindowStyle,
  setBackgroundUrl,
  setBackground,
} = themeSlice.actions;
