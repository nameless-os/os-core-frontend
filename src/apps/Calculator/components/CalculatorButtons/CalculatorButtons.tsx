import React, { FC } from 'react';

import { CalculatorNumberButtons } from '@Calculator/components/CalculatorNumberButtons/CalculatorNumberButtons';
import { CalculatorOperationButtons } from '@Calculator/components/CalculatorOperationButtons/CalculatorOperationButtons';

import styles from './calculatorButtons.module.css';

interface Props {
  appId: string;
}

const CalculatorButtons: FC<Props> = React.memo(({ appId }) => (
  <div className={styles.wrapper}>
    <div className={styles.buttons}>
      <CalculatorNumberButtons appId={appId} />
      <CalculatorOperationButtons appId={appId} />
    </div>
  </div>
));

export { CalculatorButtons };
