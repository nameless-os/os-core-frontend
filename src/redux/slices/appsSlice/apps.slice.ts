import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { App, AppId, AppState, Nullable, Position } from '@webos-project/common';

export interface AppCommon {
  type: App;
  state: AppState;
  windowPosition: Position;
  openTime: number;
  id: AppId;
}

const appsInitialState: {
  apps: { [ key: AppId ]: Nullable<AppCommon> };
  currentApps: AppId[];
} = {
  apps: {},
  currentApps: [],
};

interface SetWindowPositionProps {
  appId: string;
  newPosition: Position;
}

interface OpenAppProps {
  appId: string;
  type: App;
}

const appsSlice = createSlice({
  name: 'apps',
  initialState: appsInitialState,
  reducers: {
    setWindowActive(state, { payload: appId }: PayloadAction<string>) {
      const appIndex = state.currentApps.findIndex((el) => el === appId);
      if (appIndex === 0) {
        return;
      }
      const app = state.currentApps[appIndex];
      state.currentApps.splice(appIndex, 1);
      state.currentApps.unshift(app);
    },
    openApp(state, { payload }: PayloadAction<OpenAppProps>) {
      const { appId, type } = payload;
      state.apps[appId] = {
        type,
        state: AppState.Opened,
        windowPosition: {
          top: '6rem',
          left: '10rem',
        },
        openTime: new Date().getTime(),
        id: appId,
      };
      state.currentApps.unshift(appId);
    },
    toggleCollapseApp(state, { payload: appId }: PayloadAction<string>) {
      if (!state.apps[appId]) {
        return;
      }
      state.apps[appId]!.state =
        state.apps[appId]!.state === AppState.Opened ? AppState.Collapsed : AppState.Opened;
    },
    closeApp(state, { payload: appId }: PayloadAction<string>) {
      state.apps[appId] = null;
      const appIndex = state.currentApps.findIndex((el) => el === appId);
      state.currentApps.splice(appIndex, 1);
    },
    setWindowPosition(state, { payload }: PayloadAction<SetWindowPositionProps>) {
      state.apps[payload.appId]!.windowPosition = payload.newPosition;
    },
  },
  selectors: {
    getAppById: (state, appId: string) => state.apps[appId],
  },
});

export default appsSlice.reducer;
export const { setWindowActive, toggleCollapseApp, openApp, closeApp, setWindowPosition } = appsSlice.actions;
export const { getAppById } = appsSlice.selectors;
