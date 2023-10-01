// Libraries
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv } from 'uuid';

// Types
import { BackgroundImage } from 'src/features/theme/types/backgroundImage';

export interface TerminalMessage {
  message: string;
  id: string;
}

const commands = {
  firstLevelCommands: ['open', 'change', 'help', 'clear', 'ps', 'calculator'],
  openCommands: ['calculator', 'chat', 'settings', 'simon', 'terminal', 'toDo', 'minesweeper', 'help'],
  changeCommands: ['language', 'theme'],
  changeLanguageCommands: ['ru', 'en'],
  changeBackgroundImageCommands: Object.values(BackgroundImage).map((el) => el.toLowerCase()),
};

interface InitialStateInterface {
  terminalHistory: TerminalMessage[],
  terminalInputHistory: string[],
  availableAutocomplete: string[],
  commands: typeof commands,
  autocompleteNumber: number,
}

const initialState: InitialStateInterface = {
  terminalHistory: [],
  terminalInputHistory: [],
  autocompleteNumber: 0,
  availableAutocomplete: [],
  commands,
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addTerminalHistory(state, { payload }) {
      state.terminalHistory.push({
        message: payload,
        id: uuidv(),
      });
      if (payload.split(' ')[0] === 'root:~$') {
        state.terminalInputHistory.push(
          payload
            .split(' ')
            .splice(1, payload.length - 1)
            .join(' '),
        );
      }
    },
    clearTerminalHistory(state) {
      state.terminalHistory = [];
    },
    clearTerminalInputHistory(state) {
      state.terminalInputHistory = [];
    },
    resetAutocompleteNumber(state) {
      state.autocompleteNumber = 0;
    },
    incrementAutocompleteNumber(state) {
      state.autocompleteNumber++;
    },
    setAvailableAutocomplete(state, { payload }: { payload: string[] }) {
      state.availableAutocomplete = payload;
    },
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
