// Constants
import { PX_TO_REM_RATIO } from '@Constants/PxToRemRatio';

function getPxFromRem(rem: number): number {
  return window.innerHeight * PX_TO_REM_RATIO * rem;
}

export { getPxFromRem };
