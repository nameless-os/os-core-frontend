import { BullsAndCowsDifficulty, BullsAndCowsGameStatus } from '../../enums';
import { AppId } from '@webos-project/common';

interface BullsAndCowsAppState {
  gameStatus: BullsAndCowsGameStatus;
  difficulty: BullsAndCowsDifficulty;
  currentLevel: number;
  availableHints: number;
  lives: number;
  isReverse: boolean;
  isUniquePattern: boolean;
  pattern: number[];
  countOfButtons: number;
}

interface BullsAndCowsSliceState {
  apps: { [keys: string]: BullsAndCowsAppState };
  highscores: { [keys: string]: number };
}

interface StartBullsAndCowsGameProps {
  appId: AppId;
  difficulty: BullsAndCowsDifficulty;
  isReverse: boolean;
  isUniquePattern: boolean;
}

interface ChangeBullsAndCowsGameStatusProps {
  appId: AppId;
  gameStatus: BullsAndCowsGameStatus;
}

export type { BullsAndCowsAppState, BullsAndCowsSliceState, ChangeBullsAndCowsGameStatusProps, StartBullsAndCowsGameProps };
