import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getCalculatorResultAndUpdateLastOperations,
  setCalculatorInput,
} from '@Calculator/redux/calculatorSlice/calculatorSlice';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './calculatorInput.module.css';

interface Props {
  appId: string;
}

const CalculatorInput: FC<Props> = ({ appId }) => {
  const inputValue = useTypedSelector((state) => state.calculator.calculatorsData[appId].inputValue);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('calculator');

  function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    const numbersAndOperatorsRegExp = new RegExp(/^[\d+\-*^./\s]*$/);
    if (numbersAndOperatorsRegExp.test(event.target.value)) {
      dispatch(setCalculatorInput({ inputValue: event.target.value, appId }));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    dispatch(getCalculatorResultAndUpdateLastOperations(appId));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} aria-label={t('calculator.enter')}>
      <input
        autoFocus
        type="text"
        className={`${styles.input} ${inputValue === 'Error' ? styles.error : ''}`}
        value={inputValue !== 'Error' && inputValue !== 'Infinity' ? inputValue : ''}
        placeholder={inputValue === 'Error' || inputValue === 'Infinity' ? inputValue : ''}
        onChange={handleChangeInput}
        aria-label={t('calculator.inputAriaLabel')}
      />
    </form>
  );
};

export { CalculatorInput };
