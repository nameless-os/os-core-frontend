import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Background } from '@Features/settings/enums';
import { closeApp, openApp } from '../../../../redux/slices/appsSlice/apps.slice';
import { App } from '@webos-project/common';

export interface TerminalMessage {
  message: string;
  id: string;
}

const commands = {
  firstLevelCommands: ['open', 'change', 'help', 'clear', 'ps', 'calculator'],
  openCommands: ['calculator', 'chat', 'settings', 'simon', 'terminal', 'toDo', 'minesweeper', 'help'],
  changeCommands: ['language', 'theme'],
  changeLanguageCommands: ['ru', 'en'],
  changeBackgroundImageCommands: Object.values(Background).map((el) => el.toLowerCase()),
};

interface TerminalData {
  terminalHistory: TerminalMessage[];
  terminalInputHistory: string[];
  availableAutocomplete: string[];
  commands: typeof commands;
  autocompleteNumber: number;
  appId: string;
}

interface InitialStateInterface {
  terminalsData: TerminalData[];
}

const initialState: InitialStateInterface = {
  terminalsData: [],
};

interface AddTerminalHistoryProps {
  appId: string;
  message: string;
}

interface SetAvailableAutocompleteProps {
  appId: string;
  autocomplete: string[];
}

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addTerminalHistory(state, { payload }: PayloadAction<AddTerminalHistoryProps>) {
      const { message, appId } = payload;
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].terminalHistory.push({
        message,
        id: uuidv4(),
      });
      if (message.split(' ')[0] === 'root:~$') {
        state.terminalsData[terminalIndex].terminalInputHistory.push(
          message
            .split(' ')
            .splice(1, message.length - 1)
            .join(' '),
        );
      }
    },
    clearTerminalHistory(state, { payload: appId }: PayloadAction<string>) {
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].terminalHistory = [];
    },
    clearTerminalInputHistory(state, { payload: appId }: PayloadAction<string>) {
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].terminalInputHistory = [];
    },
    resetAutocompleteNumber(state, { payload: appId }: PayloadAction<string>) {
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].autocompleteNumber = 0;
    },
    incrementAutocompleteNumber(state, { payload: appId }: PayloadAction<string>) {
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].autocompleteNumber++;
    },
    setAvailableAutocomplete(state, { payload }: PayloadAction<SetAvailableAutocompleteProps>) {
      const { autocomplete, appId } = payload;
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === appId);
      state.terminalsData[terminalIndex].availableAutocomplete = autocomplete;
    },
  },
  selectors: {
    getTerminalDataById: (state, appId: string) => state.terminalsData.find((el) => el.appId === appId),
  },
  extraReducers: (builder) => {
    builder.addCase(openApp, (state, action) => {
      if (action.payload.type !== App.Terminal) {
        return;
      }
      state.terminalsData.push({
        terminalHistory: [],
        terminalInputHistory: [],
        autocompleteNumber: 0,
        availableAutocomplete: [],
        commands,
        appId: action.payload.appId,
      });
    });
    builder.addCase(closeApp, (state, action) => {
      const terminalIndex = state.terminalsData.findIndex((terminalData) => terminalData.appId === action.payload);
      if (terminalIndex === -1) {
        return;
      }
      state.terminalsData.splice(terminalIndex, 1);
    });
  },
});

export default terminalSlice.reducer;
export const {
  addTerminalHistory,
  clearTerminalHistory,
  clearTerminalInputHistory,
  setAvailableAutocomplete,
  incrementAutocompleteNumber,
  resetAutocompleteNumber,
} = terminalSlice.actions;
export const { getTerminalDataById } = terminalSlice.selectors;
