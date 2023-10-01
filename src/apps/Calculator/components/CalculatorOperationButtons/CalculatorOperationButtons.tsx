// Libraries
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

// Redux
import {
  addToCalculatorInput,
  clearCalculatorInput,
  deleteLastCalculatorInputCharacter,
  getCalculatorResultAndUpdateLastOperations,
} from '@Calculator/redux/calculatorSlice/calculatorSlice';

// Components
import { CalculatorButton } from '@Calculator/components/CalculatorButton/CalculatorButton';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './calculatorOperationButtons.module.css';

const operationButtons = ['+', '-', '*', '/', '^', '.'];

const CalculatorOperationButtons: FC<ChildrenNever> = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation('calculator');

  function handleDeleteLastCharacter() {
    dispatch(deleteLastCalculatorInputCharacter());
  }

  function handleClearInput() {
    dispatch(clearCalculatorInput());
  }

  function handleSubmit() {
    dispatch(getCalculatorResultAndUpdateLastOperations());
  }

  function handleAddValueToInput(value: string) {
    dispatch(addToCalculatorInput(value));
  }

  return (
    <div className={styles.operationButtons}>
      {operationButtons.map(
        (value): ReactNode => (
          <div className={styles.operationButton} key={value}>
            <CalculatorButton value={value} handleClick={() => handleAddValueToInput(value)} label={value} />
          </div>
        ),
      )}
      <div className={styles.operationButton}>
        <CalculatorButton value="C" handleClick={handleClearInput} label={t('calculator.deleteAll')} />
      </div>
      <div className={styles.clearOneButton}>
        <CalculatorButton value={<FontAwesomeIcon icon={faDeleteLeft} />} handleClick={handleDeleteLastCharacter} label={t('calculator.deleteOne')} />
      </div>
      <div className={styles.enterButton}>
        <CalculatorButton value={t('calculator.enter')} handleClick={handleSubmit} label={t('calculator.enter')} />
      </div>
    </div>
  );
});

export { CalculatorOperationButtons };
