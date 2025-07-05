import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddAppIcon, AppIconState, IconSliceInitialState } from '@Features/icons/redux/types/icon.slice.types';
import { IconType } from '@Features/icons/enums/iconType.enum';

const iconSliceInitialState: IconSliceInitialState = {
  icons: [],
};

const iconSlice = createSlice({
  name: 'icon',
  initialState: iconSliceInitialState,
  reducers: {
    addAppIcon(state, { payload }: PayloadAction<AddAppIcon>) {
      const icon: AppIconState = {
        position: {
          top: `${4 * (1 + state.icons.length)}rem`,
          left: '2rem',
        },
        type: IconType.App,
        additionalState: {
          app: payload.app,
        },
        image: payload.image,
      };
      state.icons.push(icon);
    },
  },
});

export default iconSlice.reducer;
export const { addAppIcon } = iconSlice.actions;
