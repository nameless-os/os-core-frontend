// Constants
import { PX_TO_REM_RATIO } from '@Constants/PxToRemRatio';

function getRemFromPx(px: number): number {
  return px / PX_TO_REM_RATIO / window.innerHeight;
}

export { getRemFromPx };
