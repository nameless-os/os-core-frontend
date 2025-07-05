import { createSlice } from '@reduxjs/toolkit';

import { SimonStatus } from '@Simon/enums/simonStatus.enum';
import { generatePattern, regeneratePattern, updatePattern } from 'src/apps/Simon/logic';
import { SimonDifficulty as Difficulty } from '@Simon/enums/simonDifficulty.enum';

import simonSuccessSound from 'src/assets/sounds/simon/simonSuccess.wav';
import simonLoseSound from 'src/assets/sounds/simon/simonLoseSound.wav';

interface InitialState {
  difficulty: Difficulty;
  simonStatus: SimonStatus;
  level: number;
  move: number;
  pattern: number[];
}

const initialState: InitialState = {
  difficulty: Difficulty.None,
  simonStatus: SimonStatus.Waiting,
  level: 1,
  move: 1,
  pattern: [],
};

const simonSlice = createSlice({
  name: 'simon',
  initialState,
  reducers: {
    changeDifficulty(state, { payload }: { payload: { difficulty: Difficulty } }) {
      state.difficulty = payload.difficulty;
      state.level = 1;
      state.move = 1;
      state.pattern = [];
      state.simonStatus = SimonStatus.Waiting;
    },
    updateStatus(state, { payload }: { payload: { status: SimonStatus } }) {
      state.simonStatus = payload.status;
    },
    startShowing(state) {
      if (state.level === 1) {
        if (state.difficulty === Difficulty.Easy || state.difficulty === Difficulty.Medium) {
          state.pattern = generatePattern(4);
        } else {
          state.pattern = generatePattern(9);
        }
      } else if (state.difficulty === Difficulty.Easy) {
        state.pattern = updatePattern(state.pattern, 4);
      } else if (state.difficulty === Difficulty.Medium) {
        state.pattern = regeneratePattern(3 + (state.level - 1), 4);
      } else if (state.difficulty === Difficulty.Hard) {
        state.pattern = updatePattern(state.pattern, 9);
      } else {
        state.pattern = regeneratePattern(3 + (state.level - 1), 9);
      }
    },
    simonClick(state, { payload }: { payload: { numberOfButton: number } }) {
      if (state.pattern[state.move - 1] !== payload.numberOfButton) {
        state.simonStatus = SimonStatus.Losed;
        new Audio(simonLoseSound).play();
      } else {
        state.move++;
        if (state.move === state.pattern.length + 1) {
          const audio = new Audio(simonSuccessSound);
          audio.play();
          state.move = 1;
          state.level++;
          state.simonStatus = SimonStatus.Showing;
        }
      }
    },
    restartGame(state) {
      state.level = 1;
      state.move = 1;
      state.pattern = [];
      state.simonStatus = SimonStatus.Showing;
    },
  },
});

export default simonSlice.reducer;
export const { changeDifficulty, updateStatus, startShowing, simonClick, restartGame } = simonSlice.actions;
