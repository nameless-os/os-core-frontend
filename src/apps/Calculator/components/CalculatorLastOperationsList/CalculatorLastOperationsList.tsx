import { FC } from 'react';
import { v4 as uuid4 } from 'uuid';

import { useTypedSelector } from '@Hooks';

import styles from './calculatorLastOperationsList.module.css';

interface Props {
  appId: string;
}

const CalculatorLastOperationsList: FC<Props> = ({ appId }) => {
  const lastOperations = useTypedSelector((state) => state.calculator.calculatorsData[appId].lastOperations);

  return (
    <ul className={styles.operationHistory}>
      {lastOperations.map((el, index) => (
        <li className={styles[`operation${index}`]} key={uuid4()}>
          {el}
        </li>
      ))}
    </ul>
  );
};

export { CalculatorLastOperationsList };
