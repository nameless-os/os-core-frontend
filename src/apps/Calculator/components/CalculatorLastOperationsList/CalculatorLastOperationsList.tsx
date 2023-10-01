// Libraries
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid4 } from 'uuid';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Types
import { RootState } from '@Types/rootState.type';

// Styles
import styles from './calculatorLastOperationsList.module.css';

const CalculatorLastOperationsList: FC<ChildrenNever> = () => {
  const lastOperations = useSelector((state: RootState) => state.calculator.lastOperations);

  return (
    <ul className={styles.operationHistory}>
      {lastOperations.map((el, index) => <li className={styles[`operation${index}`]} key={uuid4()}>{el}</li>)}
    </ul>
  );
};

export { CalculatorLastOperationsList };
