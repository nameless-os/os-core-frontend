import { v4 as uuidv4 } from 'uuid';

import {
  setWindowActive,
  closeApp,
  openApp,
  toggleCollapseApp,
} from 'src/redux/slices/appsSlice/apps.slice';
import { App, AppState } from '@webos-project/common';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

const useApp = (type: App, appId?: string) => {
  const currentAppsList = useTypedSelector((state) => state.apps.currentApps);
  const isCollapsed = useTypedSelector((state) => state.apps.apps[appId!]?.state === AppState.Collapsed);
  const appIndex = currentAppsList.findIndex((el) => el === appId);

  const dispatch = useTypedDispatch();

  function handleToggleCollapse(event?: any) {
    if (event.shiftKey) {
      const newAppId = uuidv4();
      dispatch(openApp({ appId: newAppId, type }));
      return;
    }
    if (isCollapsed) {
      dispatch(toggleCollapseApp(currentAppsList[appIndex]));
      dispatch(setWindowActive(currentAppsList[appIndex]));
      return;
    }

    if (appIndex !== 0) {
      dispatch(setWindowActive(currentAppsList[appIndex]));
      return;
    }

    dispatch(toggleCollapseApp(currentAppsList[appIndex]));
    if (currentAppsList.length > 1) {
      dispatch(setWindowActive(currentAppsList[1]));
    }
  }

  function handleOpen() {
    const newAppId = uuidv4();
    dispatch(openApp({ appId: newAppId, type }));

    if (isCollapsed) {
      dispatch(toggleCollapseApp(currentAppsList[appIndex]));
      dispatch(setWindowActive(currentAppsList[appIndex]));
    }
  }

  function handleClose() {
    dispatch(closeApp(currentAppsList[appIndex]));
  }

  return {
    handleClose,
    handleOpen,
    handleToggleCollapse,
    appIndex,
  };
};

export { useApp };
