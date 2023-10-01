// Libraries
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
import { BackgroundImage } from '../types/backgroundImage';
import { Theme } from '../types/theme';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    backgroundImage: localStorage.getItem('BackgroundImage') as BackgroundImage || BackgroundImage.Planet,
    backgroundImages: Object.values(BackgroundImage),
    theme: localStorage.getItem('Theme') || Theme.Dark,
    themes: Object.values(Theme),
  },
  reducers: {
    setBackgroundImage(state, { payload }: PayloadAction<BackgroundImage>) {
      state.backgroundImage = payload;
      localStorage.setItem('BackgroundImage', payload);
    },
    setTheme(state, { payload } : PayloadAction<Theme>) {
      state.theme = payload;
      localStorage.setItem('Theme', payload.toString());
    },
  },
});

export default themeSlice.reducer;
export const { setBackgroundImage, setTheme } = themeSlice.actions;
