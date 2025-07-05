import React, { FC } from 'react';
import { Window } from '@Components/Window/Window';
import { CalculatorButtons } from '@Calculator/components/CalculatorButtons/CalculatorButtons';
import { CalculatorInput } from '@Calculator/components/CalculatorInput/CalculatorInput';
import { CalculatorLastOperationsList } from '@Calculator/components/CalculatorLastOperationsList/CalculatorLastOperationsList';
import { App, CommonAppProps } from '@webos-project/common';
import styles from './calculator.module.css';

const CalculatorComponent: FC<CommonAppProps> = ({  appId }) => (
  <>
    <Window type={App.Calculator} appId={appId}>
      <div className={styles.container}>
        <CalculatorInput appId={appId} />
        <CalculatorLastOperationsList appId={appId} />
        <CalculatorButtons appId={appId} />
      </div>
    </Window>
  </>
);

const Calculator = React.memo(CalculatorComponent);

export { Calculator };
