// Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Enums
import { App } from '@Enums/app.enum';

// Interface
import { Coordinates } from '@Interfaces/coordinates.interface';

interface TypeAndCoordinates {
  type: App;
  coordinates: Coordinates;
}

interface AppCommon {
  isOpen: boolean,
  isCollapsed: boolean,
  iconPosition: Coordinates,
  windowPosition: Coordinates,
}

const appsInitialState: {
  [App.Calculator]: AppCommon,
  [App.Settings]: AppCommon,
  [App.Terminal]: AppCommon,
  [App.Chat]: AppCommon,
  [App.ToDo]: AppCommon,
  [App.Simon]: AppCommon,
  [App.Minesweeper]: AppCommon,
  [App.Translate]: AppCommon,
} = {
  [App.Calculator]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Calculator]}IconTopCoordinate`) || '28rem',
      left: localStorage.getItem(`${[App.Calculator]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Settings]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Settings]}IconTopCoordinate`) || '23rem',
      left: localStorage.getItem(`${[App.Settings]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Chat]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Chat]}IconTopCoordinate`) || '18rem',
      left: localStorage.getItem(`${[App.Chat]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Simon]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Simon]}IconTopCoordinate`) || '13rem',
      left: localStorage.getItem(`${[App.Simon]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Terminal]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Terminal]}IconTopCoordinate`) || '8rem',
      left: localStorage.getItem(`${[App.Terminal]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.ToDo]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.ToDo]}IconTopCoordinate`) || '3rem',
      left: localStorage.getItem(`${[App.ToDo]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Minesweeper]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Minesweeper]}IconTopCoordinate`) || '33rem',
      left: localStorage.getItem(`${[App.Minesweeper]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
  [App.Translate]: {
    isOpen: false,
    isCollapsed: false,
    iconPosition: {
      top: localStorage.getItem(`${[App.Translate]}IconTopCoordinate`) || '38rem',
      left: localStorage.getItem(`${[App.Translate]}IconLeftCoordinate`) || '1rem',
    },
    windowPosition: {
      top: '15rem',
      left: '8rem',
    },
  },
};

const initialState: {
  currentAppsList: App[];
  appsState: typeof appsInitialState;
} = {
  currentAppsList: [],
  appsState: appsInitialState,
};

const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setWindowActive(state, { payload }: PayloadAction<App>) {
      const index = state.currentAppsList.indexOf(payload);
      if (index === 0) return;
      const firstPart: App[] = state.currentAppsList.slice(0, index);
      const secondPart: App[] = state.currentAppsList.slice(index + 1);
      state.currentAppsList = [payload, ...firstPart, ...secondPart];
    },
    openApp(state, { payload }: PayloadAction<App>) {
      state.appsState[payload].isOpen = true;
      state.appsState[payload].isCollapsed = false;
      state.currentAppsList.unshift(payload);
    },
    toggleCollapseApp(state, { payload }: PayloadAction<App>) {
      state.appsState[payload].isCollapsed = !state.appsState[payload].isCollapsed;
    },
    closeApp(state, { payload }: PayloadAction<App>) {
      state.appsState[payload].isOpen = false;
      state.appsState[payload].isCollapsed = false;
      state.currentAppsList.splice(state.currentAppsList.indexOf(payload), 1);
    },
    setIconPosition(state, { payload }: PayloadAction<TypeAndCoordinates>) {
      state.appsState[payload.type].iconPosition.top = payload.coordinates.top;
      state.appsState[payload.type].iconPosition.left = payload.coordinates.left;
      localStorage.setItem(`${[payload.type]}IconTopCoordinate`, payload.coordinates.top);
      localStorage.setItem(`${[payload.type]}IconLeftCoordinate`, payload.coordinates.left);
    },
    setWindowPosition(state, { payload }: PayloadAction<TypeAndCoordinates>) {
      state.appsState[payload.type].windowPosition.top = payload.coordinates.top;
      state.appsState[payload.type].windowPosition.left = payload.coordinates.left;
    },
  },
});

export default appsSlice.reducer;
export const {
  setWindowActive,
  toggleCollapseApp,
  openApp,
  closeApp,
  setIconPosition,
  setWindowPosition,
} = appsSlice.actions;
