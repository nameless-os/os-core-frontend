// Libraries
import { createSlice } from '@reduxjs/toolkit';

// Enums
import { Difficulty } from '@Enums/difficulty.enum';

// Constants
import { BOMB_NUMBER } from '@Minesweeper/constants/bombNumber';
import {
  EASY_MINES_COUNT,
  EASY_SIZE,
  EXTREME_MINES_COUNT,
  EXTREME_SIZE,
  HARD_MINES_COUNT,
  HARD_SIZE,
  NORMAL_MINES_COUNT,
  NORMAL_SIZE,
} from '@Minesweeper/constants/sizesAndMines';

const pattern: number[][] = [];
const visibilityList: boolean[][] = [];

const minesweeperSlice = createSlice({
  name: 'minesweeper',
  initialState: {
    pattern,
    visibilityList,
    size: 0,
    bombCount: 0,
    isLose: false,
    isWin: false,
    numberOfFlags: 0,
    availableFlags: 0,
    isFlagAvailable: true,
    displayCount: 0,
    difficulty: Difficulty.None,
  },
  reducers: {
    generateMinesweeperPattern(state) {
      state.isFlagAvailable = true;
      state.numberOfFlags = 0;
      state.availableFlags = state.bombCount;
      state.isLose = false;
      state.isWin = false;
      state.displayCount = 0;

      const newPattern = Array(state.size).fill([]).map(() => Array(state.size).fill(0));

      const newVisibilityList = Array(state.size).fill(Array(state.size).fill(false));

      state.visibilityList = newVisibilityList;

      for (let i = 0; i < state.bombCount; i++) {
        let randomIndex = Math.round(Math.random() * (state.size * state.size - 1));
        while (newPattern[Math.trunc(randomIndex / state.size)][randomIndex % state.size]) {
          randomIndex = Math.round(Math.random() * (state.size * state.size - 1));
        }
        newPattern[Math.trunc(randomIndex / state.size)][randomIndex % state.size] = BOMB_NUMBER;
      }

      state.pattern = newPattern;
    },
    calculateMinesweeper(state) {
      state.pattern = state.pattern.map((arr, arrIndex) => (
        arr.map((el, elIndex) => {
          if (el === BOMB_NUMBER) {
            return el;
          }

          let count = 0;

          for (let i = arrIndex - 1; i <= arrIndex + 1; i++) {
            for (let j = elIndex - 1; j <= elIndex + 1; j++) {
              if (state.pattern[i] && state.pattern[i][j] && state.pattern[i][j] === BOMB_NUMBER) {
                count++;
              }
            }
          }

          return count;
        })
      ));
    },
    setVisible(state, { payload }: { payload: { arrIndex: number, index: number } }) {
      const { arrIndex, index } = payload;

      if (state.pattern[arrIndex][index] === BOMB_NUMBER) {
        state.isLose = true;
        for (let i = 0; i < state.size; i++) {
          for (let j = 0; j < state.size; j++) {
            state.visibilityList[i][j] = true;
          }
        }
        return;
      }

      state.visibilityList[arrIndex][index] = true;
      state.displayCount++;

      if (state.displayCount === state.size * state.size - state.bombCount) {
        state.isWin = true;
        for (let i = 0; i < state.size; i++) {
          for (let j = 0; j < state.size; j++) {
            state.visibilityList[i][j] = true;
          }
        }
        return;
      }

      if (state.pattern[arrIndex][index] !== 0) {
        return;
      }

      for (let i = arrIndex - 1; i <= arrIndex + 1; i++) {
        for (let j = index - 1; j <= index + 1; j++) {
          if (i >= 0 && i < state.size && j >= 0 && j < state.size
            && !state.visibilityList[i][j] && state.pattern[i][j] === 0) {
            minesweeperSlice.caseReducers.setVisible(state, { payload: { arrIndex: i, index: j } });
          }
        }
      }

      for (let i1 = arrIndex - 1; i1 <= arrIndex + 1; i1++) {
        for (let j1 = index - 1; j1 <= index + 1; j1++) {
          if (!(i1 >= 0 && i1 < state.size && j1 >= 0 && j1 < state.size && state.pattern[i1][j1] !== BOMB_NUMBER)) {
            continue;
          }
          if (state.visibilityList[i1][j1] === true) {
            continue;
          }
          state.displayCount++;
          if (state.displayCount === state.size * state.size - state.bombCount) {
            state.isWin = true;
            for (let i = 0; i < state.size; i++) {
              for (let j = 0; j < state.size; j++) {
                state.visibilityList[i][j] = true;
              }
            }
            return;
          }
          state.visibilityList[i1][j1] = true;
        }
      }
    },
    setSettings(state, { payload }: { payload: { size: number, bombCount: number } }) {
      state.bombCount = payload.bombCount;
      state.availableFlags = payload.bombCount;
      state.size = payload.size;
    },
    addFlag(state) {
      state.numberOfFlags++;
      state.availableFlags--;

      if (state.availableFlags === 0) {
        state.isFlagAvailable = false;
      }
    },
    removeFlag(state) {
      state.numberOfFlags--;
      state.availableFlags++;
      state.isFlagAvailable = true;
    },
    setMinesweeperDifficulty(state, { payload }: { payload: { difficulty: Difficulty } }) {
      if (payload.difficulty === Difficulty.Easy) {
        minesweeperSlice.caseReducers.setSettings(state, { payload: { size: EASY_SIZE, bombCount: EASY_MINES_COUNT } });
      }

      if (payload.difficulty === Difficulty.Normal) {
        minesweeperSlice.caseReducers.setSettings(state, {
          payload: {
            size: NORMAL_SIZE,
            bombCount: NORMAL_MINES_COUNT,
          },
        });
      }

      if (payload.difficulty === Difficulty.Hard) {
        minesweeperSlice.caseReducers.setSettings(state, {
          payload: {
            size: HARD_SIZE,
            bombCount: HARD_MINES_COUNT,
          },
        });
      }

      if (payload.difficulty === Difficulty.Extreme) {
        minesweeperSlice.caseReducers.setSettings(state, {
          payload: {
            size: EXTREME_SIZE,
            bombCount: EXTREME_MINES_COUNT,
          },
        });
      }

      state.difficulty = payload.difficulty;
    },
  },
});

export default minesweeperSlice.reducer;

export const {
  generateMinesweeperPattern,
  calculateMinesweeper,
  setVisible,
  setSettings,
  addFlag,
  removeFlag,
  setMinesweeperDifficulty,
} = minesweeperSlice.actions;
