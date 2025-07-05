import { SimonDifficulty as Difficulty } from '../../enums/simonDifficulty.enum';
import { SimonStatus } from '@Simon/enums/simonStatus.enum';
import * as simonLogic from '@Simon/logic';
import store from 'src/redux/store';

import { changeDifficulty, restartGame, startShowing, updateStatus } from './simonSlice';

describe('simon slice', () => {
  it('should change difficulty then calls changeDifficulty', () => {
    store.dispatch(changeDifficulty({ difficulty: Difficulty.Medium }));

    expect(store.getState().simon.difficulty).toEqual(Difficulty.Medium);
    expect(store.getState().simon.level).toEqual(1);
    expect(store.getState().simon.move).toEqual(1);
    expect(store.getState().simon.simonStatus).toEqual(SimonStatus.Waiting);
    expect(store.getState().simon.pattern).toEqual([]);
  });

  it('should update status then calls updateStatus', () => {
    store.dispatch(updateStatus({ status: SimonStatus.Showing }));

    expect(store.getState().simon.simonStatus).toEqual(SimonStatus.Showing);
  });

  describe('startShowing', () => {
    beforeEach(() => {
      jest.spyOn(simonLogic, 'generatePattern').mockReturnValue([1, 2, 3]);
      jest.spyOn(simonLogic, 'updatePattern').mockReturnValue([1, 2, 4]);
    });

    it('should generate pattern then calls with difficulty easy', () => {
      store.dispatch(changeDifficulty({ difficulty: Difficulty.Easy }));
      store.dispatch(startShowing());

      expect(simonLogic.generatePattern).toBeCalledTimes(1);
      expect(simonLogic.generatePattern).toHaveBeenCalledWith(4);
      expect(store.getState().simon.pattern).toEqual([1, 2, 3]);
    });

    it('should generate pattern then calls with difficulty normal', () => {
      store.dispatch(changeDifficulty({ difficulty: Difficulty.Medium }));
      store.dispatch(startShowing());

      expect(simonLogic.generatePattern).toBeCalledTimes(1);
      expect(simonLogic.generatePattern).toHaveBeenCalledWith(4);
      expect(store.getState().simon.pattern).toEqual([1, 2, 3]);
    });

    it('should generate pattern then calls with difficulty hard', () => {
      store.dispatch(changeDifficulty({ difficulty: Difficulty.Hard }));
      store.dispatch(startShowing());

      expect(simonLogic.generatePattern).toBeCalledTimes(1);
      expect(simonLogic.generatePattern).toHaveBeenCalledWith(9);
      expect(store.getState().simon.pattern).toEqual([1, 2, 3]);
    });

    it('should generate pattern then calls with difficulty extreme', () => {
      store.dispatch(changeDifficulty({ difficulty: Difficulty.Extreme }));
      store.dispatch(startShowing());

      expect(simonLogic.generatePattern).toBeCalledTimes(1);
      expect(simonLogic.generatePattern).toHaveBeenCalledWith(9);
      expect(store.getState().simon.pattern).toEqual([1, 2, 3]);
    });
  });

  describe('restartGame', () => {
    it('should restart game then calls restartGame', () => {
      store.dispatch(changeDifficulty({ difficulty: Difficulty.Easy }));
      store.dispatch(startShowing());
      store.dispatch(restartGame());

      expect(store.getState().simon.pattern).toEqual([]);
      expect(store.getState().simon.level).toEqual(1);
      expect(store.getState().simon.move).toEqual(1);
      expect(store.getState().simon.simonStatus).toEqual(SimonStatus.Showing);
    });
  });
});

export {};
