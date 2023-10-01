// Libraries
import { useDispatch, useSelector } from 'react-redux';

// Redux
import {
  setWindowActive,
  closeApp,
  openApp,
  toggleCollapseApp,
} from 'src/redux/slices/appsSlice/appsSlice';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

const useApp = (type: App) => {
  const currentAppsList = useSelector((state: RootState) => state.apps.currentAppsList);
  const isCollapsed = useSelector((state: RootState) => state.apps.appsState[type].isCollapsed);
  const isOpen = useSelector((state: RootState) => state.apps.appsState[type].isOpen);

  const dispatch = useDispatch();

  const appIndex = currentAppsList.indexOf(type);

  function handleToggleCollapse() {
    if (!isOpen) {
      return;
    }

    if (isCollapsed) {
      dispatch(toggleCollapseApp(type));
      dispatch(setWindowActive(type));
      return;
    }

    if (appIndex !== 0) {
      dispatch(setWindowActive(type));
      return;
    }

    dispatch(toggleCollapseApp(type));
    if (currentAppsList.length > 1) {
      dispatch(setWindowActive(currentAppsList[1]));
    }
  }

  function handleOpen() {
    if (!isOpen) {
      dispatch(openApp(type));
    }

    if (isCollapsed) {
      dispatch(toggleCollapseApp(type));
      dispatch(setWindowActive(type));
    }
  }

  function handleClose() {
    if (isOpen) {
      dispatch(closeApp(type));
    }
  }

  return {
    handleClose,
    handleOpen,
    handleToggleCollapse,
    appIndex,
  };
};

export { useApp };
