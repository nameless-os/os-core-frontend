// Libraries
import React, { FC, ReactNode } from 'react';
import { useDispatch } from 'react-redux';

// Redux
import { addToCalculatorInput } from '@Calculator/redux/calculatorSlice/calculatorSlice';

// Components
import { CalculatorButton } from '@Calculator/components/CalculatorButton/CalculatorButton';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './calculatorNumberButtons.module.css';

const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const CalculatorNumberButtons: FC<ChildrenNever> = React.memo(() => {
  const dispatch = useDispatch();

  function handleAddValueToInput(value: string) {
    dispatch(addToCalculatorInput(value));
  }

  return (
    <div className={styles.numberButtons}>
      {numberButtons.map(
        (value): ReactNode => (
          <div className={styles.numberButton} key={value}>
            <CalculatorButton value={value} handleClick={() => handleAddValueToInput(value)} label={value} />
          </div>
        ),
      )}
      <div className={styles.zeroButton}>
        <CalculatorButton value="0" handleClick={() => handleAddValueToInput('0')} label="0" />
      </div>
    </div>
  );
});

export { CalculatorNumberButtons };
