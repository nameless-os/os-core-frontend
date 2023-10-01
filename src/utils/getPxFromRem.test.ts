// Utils
import { getPxFromRem } from '@Utils/getPxFromRem';

// Constants
import { PX_TO_REM_RATIO } from '@Constants/PxToRemRatio';

describe('getPxFromRem test', () => {
  it('should work correctly if input has one space', () => {
    const result = getPxFromRem(3);
    expect(result).toBe(window.innerHeight * PX_TO_REM_RATIO * 3);
  });
});
