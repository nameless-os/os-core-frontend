import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BullsAndCowsAppState,
  BullsAndCowsSliceState,
  ChangeBullsAndCowsGameStatusProps, StartBullsAndCowsGameProps,
} from '@Apps/BullsAndCows/redux/types/bullsAndCows.slice.type';
import { BullsAndCowsDifficulty, BullsAndCowsGameStatus } from '@Apps/BullsAndCows/enums';
import { closeApp, openApp } from '../../../redux/slices/appsSlice/apps.slice';
import { App } from '@webos-project/common';

const appInitialState: BullsAndCowsAppState = {
  availableHints: 0,
  countOfButtons: 0,
  currentLevel: 0,
  difficulty: BullsAndCowsDifficulty.Easy,
  gameStatus: BullsAndCowsGameStatus.Menu,
  isReverse: false,
  isUniquePattern: false,
  lives: 0,
  pattern: [],
};

const sliceInitialState: BullsAndCowsSliceState = {
  apps: {},
  highscores: {
    [BullsAndCowsDifficulty.Easy]: 0,
    [BullsAndCowsDifficulty.Medium]: 0,
    [BullsAndCowsDifficulty.Hard]: 0,
  },
};

const bullsAndCowsSlice = createSlice({
  name: 'bullsAndCows',
  initialState: sliceInitialState,
  reducers: {
    startBullsAndCowsGame(state, { payload }: PayloadAction<StartBullsAndCowsGameProps>) {
      const { appId, isUniquePattern, isReverse, difficulty } = payload;

      state.apps[appId].difficulty = difficulty;
      state.apps[appId].isUniquePattern = isUniquePattern;
      state.apps[appId].isReverse = isReverse;
    },
    changeBullsAndCowsGameStatus(state, { payload }: PayloadAction<ChangeBullsAndCowsGameStatusProps>) {
      state.apps[payload.appId].gameStatus = payload.gameStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(openApp, (state, action) => {
      if (action.payload.type !== App.BullsAndCows) {
        return;
      }
      state.apps[action.payload.appId] = appInitialState;
    });
    builder.addCase(closeApp, (state, action) => {
      delete state.apps[action.payload];
    });
  },
});

export default bullsAndCowsSlice.reducer;
