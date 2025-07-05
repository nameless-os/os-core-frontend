import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  addToCalculatorInput,
  clearCalculatorInput,
  deleteLastCalculatorInputCharacter,
  getCalculatorResultAndUpdateLastOperations,
} from '@Calculator/redux/calculatorSlice/calculatorSlice';

import { CalculatorButton } from '@Calculator/components/CalculatorButton/CalculatorButton';
import { useTypedDispatch } from '@Hooks';

import styles from './calculatorOperationButtons.module.css';

const operationButtons = ['+', '-', '*', '/', '^', '.'];

interface Props {
  appId: string;
}

const CalculatorOperationButtons: FC<Props> = React.memo(({ appId }) => {
  const dispatch = useTypedDispatch();
  const { t } = useTranslation('calculator');

  function handleDeleteLastCharacter() {
    dispatch(deleteLastCalculatorInputCharacter(appId));
  }

  function handleClearInput() {
    dispatch(clearCalculatorInput(appId));
  }

  function handleSubmit() {
    dispatch(getCalculatorResultAndUpdateLastOperations(appId));
  }

  function handleAddValueToInput(value: string) {
    dispatch(addToCalculatorInput({ inputValue: value, appId }));
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
        <CalculatorButton
          value={<FontAwesomeIcon icon={faDeleteLeft} />}
          handleClick={handleDeleteLastCharacter}
          label={t('calculator.deleteOne')}
        />
      </div>
      <div className={styles.enterButton}>
        <CalculatorButton value={t('calculator.enter')} handleClick={handleSubmit} label={t('calculator.enter')} />
      </div>
    </div>
  );
});

export { CalculatorOperationButtons };
