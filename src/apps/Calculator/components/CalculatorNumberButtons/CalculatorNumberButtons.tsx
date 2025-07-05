import React, { FC, ReactNode } from 'react';

import { addToCalculatorInput } from '@Calculator/redux/calculatorSlice/calculatorSlice';
import { CalculatorButton } from '@Calculator/components/CalculatorButton/CalculatorButton';
import { useTypedDispatch } from '@Hooks';

import styles from './calculatorNumberButtons.module.css';

const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

interface Props {
  appId: string;
}

const CalculatorNumberButtons: FC<Props> = React.memo(({ appId }) => {
  const dispatch = useTypedDispatch();

  function handleAddValueToInput(value: string) {
    dispatch(addToCalculatorInput({ inputValue: value, appId }));
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
