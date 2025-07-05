import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@Features/user/redux/userSlice';
import chatSlice from '@Chat/redux/chatSlice/chatSlice';
import chatRoomsSlice from '@Chat/redux/chatRoomsSlice/chatRooms';
import chatUsersSlice from '@Chat/redux/chatUsersSlice/chatUsersSlice';
import simonSlice from '@Simon/redux/simonSlice/simonSlice';
import toDoSlice from '@ToDo/redux/toDoSlice/toDoSlice';
import terminalSlice from '@Terminal/redux/terminalSlice/terminalSlice';
import settingsSlice from '@Features/settings/redux/settings.slice';
import calculatorSlice from '@Calculator/redux/calculatorSlice/calculatorSlice';
import iconSlice from '@Features/icons/redux/icon.slice';
import appsSlice from './slices/appsSlice/apps.slice';
// eslint-disable-next-line import/no-extraneous-dependencies
import { minesweeperSliceReducer } from '@webos-project/minesweeper';

const store = configureStore({
  reducer: {
    terminal: terminalSlice,
    apps: appsSlice,
    calculator: calculatorSlice,
    toDo: toDoSlice,
    user: userSlice,
    chat: chatSlice,
    minesweeper: minesweeperSliceReducer,
    chatRooms: chatRoomsSlice,
    chatUsers: chatUsersSlice,
    simon: simonSlice,
    settings: settingsSlice,
    icon: iconSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
