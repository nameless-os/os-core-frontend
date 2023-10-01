// Libraries
import React, { FC } from 'react';

// Components
import { CalculatorNumberButtons } from '@Calculator/components/CalculatorNumberButtons/CalculatorNumberButtons';
import {
  CalculatorOperationButtons,
} from '@Calculator/components/CalculatorOperationButtons/CalculatorOperationButtons';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './calculatorButtons.module.css';

const CalculatorButtons: FC<ChildrenNever> = React.memo(() => (
  <div className={styles.wrapper}>
    <div className={styles.buttons}>
      <CalculatorNumberButtons />
      <CalculatorOperationButtons />
    </div>
  </div>
));

export { CalculatorButtons };
