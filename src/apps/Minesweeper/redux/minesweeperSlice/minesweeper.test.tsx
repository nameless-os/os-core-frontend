import { configureStore } from '@reduxjs/toolkit';

// Types
import { Difficulty } from '@Enums/difficulty.enum';

// Constants
import { EASY_MINES_COUNT, EASY_SIZE, EXTREME_MINES_COUNT,
  EXTREME_SIZE,
  HARD_MINES_COUNT, HARD_SIZE, NORMAL_MINES_COUNT, NORMAL_SIZE } from 'src/apps/Minesweeper/constants/sizesAndMines';

// Components
import minesweeperSlice, {
  addFlag, calculateMinesweeper,
  generateMinesweeperPattern,
  removeFlag,
  setMinesweeperDifficulty,
  setSettings, setVisible,
} from './minesweeperSlice';
import { BOMB_NUMBER } from '../../constants/bombNumber';

describe('minesweeper slice', () => {
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('setSettings should work correctly', () => {
    const testStore = configureStore({
      reducer: {
        minesweeper: minesweeperSlice,
      },
    });

    testStore.dispatch(setSettings({ size: 22, bombCount: 12 }));

    expect(testStore.getState().minesweeper.size).toEqual(22);
    expect(testStore.getState().minesweeper.bombCount).toEqual(12);
    expect(testStore.getState().minesweeper.availableFlags).toEqual(12);
  });

  describe('addFlag should work correctly', () => {
    it('addFlag should work correctly if availableFlags > 1', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setSettings({ size: 22, bombCount: 10 }));
      testStore.dispatch(addFlag());

      expect(testStore.getState().minesweeper.availableFlags).toEqual(9);
      expect(testStore.getState().minesweeper.numberOfFlags).toEqual(1);
      expect(testStore.getState().minesweeper.isFlagAvailable).toEqual(true);
    });

    it('addFlag should work correctly if availableFlags equals 1', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setSettings({ size: 22, bombCount: 1 }));
      testStore.dispatch(addFlag());

      expect(testStore.getState().minesweeper.availableFlags).toEqual(0);
      expect(testStore.getState().minesweeper.numberOfFlags).toEqual(1);
      expect(testStore.getState().minesweeper.isFlagAvailable).toEqual(false);
    });
  });

  it('removeFlag should work correctly', () => {
    const testStore = configureStore({
      reducer: {
        minesweeper: minesweeperSlice,
      },
    });

    testStore.dispatch(setSettings({ size: 22, bombCount: 12 }));
    testStore.dispatch(addFlag());
    testStore.dispatch(addFlag());
    testStore.dispatch(removeFlag());

    expect(testStore.getState().minesweeper.availableFlags).toEqual(11);
    expect(testStore.getState().minesweeper.numberOfFlags).toEqual(1);
  });

  describe('setMinesweeperDifficulty should work correctly', () => {
    it('setMinesweeperDifficulty should work correctly if difficulty is none', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.None }));

      expect(testStore.getState().minesweeper.difficulty).toEqual(Difficulty.None);
    });

    it('setMinesweeperDifficulty should work correctly if difficulty is easy', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.Easy }));

      expect(testStore.getState().minesweeper.difficulty).toEqual(Difficulty.Easy);
      expect(testStore.getState().minesweeper.bombCount).toEqual(EASY_MINES_COUNT);
      expect(testStore.getState().minesweeper.availableFlags).toEqual(EASY_MINES_COUNT);
      expect(testStore.getState().minesweeper.size).toEqual(EASY_SIZE);
    });

    it('setMinesweeperDifficulty should work correctly if difficulty normal', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.Normal }));

      expect(testStore.getState().minesweeper.difficulty).toEqual(Difficulty.Normal);
      expect(testStore.getState().minesweeper.bombCount).toEqual(NORMAL_MINES_COUNT);
      expect(testStore.getState().minesweeper.availableFlags).toEqual(NORMAL_MINES_COUNT);
      expect(testStore.getState().minesweeper.size).toEqual(NORMAL_SIZE);
    });

    it('setMinesweeperDifficulty should work correctly if difficulty hard', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.Hard }));

      expect(testStore.getState().minesweeper.difficulty).toEqual(Difficulty.Hard);
      expect(testStore.getState().minesweeper.bombCount).toEqual(HARD_MINES_COUNT);
      expect(testStore.getState().minesweeper.availableFlags).toEqual(HARD_MINES_COUNT);
      expect(testStore.getState().minesweeper.size).toEqual(HARD_SIZE);
    });

    it('setMinesweeperDifficulty should work correctly if difficulty extreme', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      testStore.dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.Extreme }));

      expect(testStore.getState().minesweeper.difficulty).toEqual(Difficulty.Extreme);
      expect(testStore.getState().minesweeper.bombCount).toEqual(EXTREME_MINES_COUNT);
      expect(testStore.getState().minesweeper.availableFlags).toEqual(EXTREME_MINES_COUNT);
      expect(testStore.getState().minesweeper.size).toEqual(EXTREME_SIZE);
    });
  });

  it('generateMinesweeperPattern should work correctly', () => {
    const testStore = configureStore({
      reducer: {
        minesweeper: minesweeperSlice,
      },
    });

    testStore.dispatch(setSettings({ size: 5, bombCount: 16 }));
    testStore.dispatch(generateMinesweeperPattern());

    let bombs = 0;

    for (let i = 0; i < 5; i++) {
      bombs += testStore.getState().minesweeper.pattern[i].filter((el) => el === BOMB_NUMBER).length;
    }

    expect(testStore.getState().minesweeper.isFlagAvailable).toEqual(true);
    expect(testStore.getState().minesweeper.numberOfFlags).toEqual(0);
    expect(testStore.getState().minesweeper.availableFlags).toEqual(16);
    expect(testStore.getState().minesweeper.isLose).toEqual(false);
    expect(testStore.getState().minesweeper.isWin).toEqual(false);
    expect(testStore.getState().minesweeper.displayCount).toEqual(0);
    expect(testStore.getState().minesweeper.visibilityList).toHaveLength(5);
    expect(testStore.getState().minesweeper.visibilityList).toEqual(Array(5).fill(Array(5).fill(false)));
    expect(bombs).toEqual(16);
  });

  it('calculateMinesweeper should work correctly', () => {
    const testStore = configureStore({
      reducer: {
        minesweeper: minesweeperSlice,
      },
    });

    // [1][1] Field
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.33);
    // [1][2] Field
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.4);
    // [2][2] Field
    jest.spyOn(Math, 'random').mockReturnValueOnce(0.67);
    // [3][3] Field
    jest.spyOn(Math, 'random').mockReturnValueOnce(1);

    testStore.dispatch(setSettings({ size: 4, bombCount: 4 }));
    testStore.dispatch(generateMinesweeperPattern());
    testStore.dispatch(calculateMinesweeper());

    expect(testStore.getState().minesweeper.pattern).toEqual([
      [1, 2, 2, 1],
      [1, BOMB_NUMBER, BOMB_NUMBER, 2],
      [1, 3, BOMB_NUMBER, 3],
      [0, 1, 2, BOMB_NUMBER],
    ]);
  });

  describe('setVisible should work correctly', () => {
    it('setVisible should work correctly if click on zero with zeros nearly', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 1, index: 1 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [true, true, true, false],
        [true, true, true, false],
        [true, true, true, false],
        [false, false, false, false],
      ]);
      expect(testStore.getState().minesweeper.displayCount).toEqual(9);
    });

    it('setVisible should work correctly if click on zero with no zeros nearly', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 3, index: 3 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [false, false, false, false],
        [false, false, false, false],
        [false, false, true, true],
        [false, false, true, true],
      ]);
      expect(testStore.getState().minesweeper.displayCount).toEqual(4);
    });

    it('setVisible should work correctly if click on non zero and not bomb', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 2, index: 2 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [false, false, false, false],
        [false, false, false, false],
        [false, false, true, false],
        [false, false, false, false],
      ]);
      expect(testStore.getState().minesweeper.displayCount).toEqual(1);
    });

    it('setVisible should work correctly if click on bomb', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 1, index: 3 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
      ]);
      expect(testStore.getState().minesweeper.isLose).toEqual(true);
    });

    it('setVisible should work correctly if we click all not bomb buttons and last click open > 1 nodes', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 0, index: 3 }));
      testStore.dispatch(setVisible({ arrIndex: 3, index: 3 }));
      testStore.dispatch(setVisible({ arrIndex: 3, index: 0 }));
      testStore.dispatch(setVisible({ arrIndex: 1, index: 1 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
      ]);
      expect(testStore.getState().minesweeper.isWin).toEqual(true);
    });

    it('setVisible should work correctly if we click all not bomb buttons and last click open 1 node', () => {
      const testStore = configureStore({
        reducer: {
          minesweeper: minesweeperSlice,
        },
      });

      // [1][3] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.47);
      // [3][2] Field
      jest.spyOn(Math, 'random').mockReturnValueOnce(0.87);

      testStore.dispatch(setSettings({ size: 4, bombCount: 2 }));
      testStore.dispatch(generateMinesweeperPattern());
      testStore.dispatch(calculateMinesweeper());
      testStore.dispatch(setVisible({ arrIndex: 1, index: 1 }));
      testStore.dispatch(setVisible({ arrIndex: 0, index: 3 }));
      testStore.dispatch(setVisible({ arrIndex: 2, index: 3 }));
      testStore.dispatch(setVisible({ arrIndex: 3, index: 0 }));
      testStore.dispatch(setVisible({ arrIndex: 3, index: 2 }));
      testStore.dispatch(setVisible({ arrIndex: 3, index: 3 }));

      expect(testStore.getState().minesweeper.visibilityList).toEqual([
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
      ]);
      expect(testStore.getState().minesweeper.isWin).toEqual(true);
    });
  });
});
