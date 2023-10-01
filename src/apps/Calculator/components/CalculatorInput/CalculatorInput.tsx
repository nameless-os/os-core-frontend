// Libraries
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Redux
import { getCalculatorResultAndUpdateLastOperations, setCalculatorInput } from '@Calculator/redux/calculatorSlice/calculatorSlice';
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './calculatorInput.module.css';

const CalculatorInput: FC<ChildrenNever> = () => {
  const inputValue = useSelector((state: RootState) => state.calculator.inputValue);

  const dispatch = useDispatch();
  const { t } = useTranslation('calculator');

  function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    const numbersAndOperatorsRegExp = new RegExp(/^[\d+\-*^./\s]*$/);
    if (numbersAndOperatorsRegExp.test(event.target.value)) {
      dispatch(setCalculatorInput(event.target.value));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    dispatch(getCalculatorResultAndUpdateLastOperations());
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
