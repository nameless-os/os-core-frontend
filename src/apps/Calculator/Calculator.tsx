// Libraries
import React, { FC } from 'react';

// Components
import { Window } from '@Components/Window/Window';
import { Icon } from '@Components/Icon/Icon';
import { CalculatorButtons } from '@Calculator/components/CalculatorButtons/CalculatorButtons';
import { CalculatorInput } from '@Calculator/components/CalculatorInput/CalculatorInput';
import { CalculatorLastOperationsList } from '@Calculator/components/CalculatorLastOperationsList/CalculatorLastOperationsList';

// Enums
import { App } from '@Enums/app.enum';

// Assets
import imgSource from '@Icons/calculator.svg';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './calculator.module.css';

const Calculator: FC<ChildrenNever> = React.memo(() => (
  <>
    <Icon imgSource={imgSource} type={App.Calculator} />
    <Window type={App.Calculator}>
      <div className={styles.container}>
        <CalculatorInput />
        <CalculatorLastOperationsList />
        <CalculatorButtons />
      </div>
    </Window>
  </>
));

export { Calculator };
