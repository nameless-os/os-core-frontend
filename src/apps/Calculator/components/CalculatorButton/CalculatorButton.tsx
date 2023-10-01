// Libraries
import React, { FC, ReactNode } from 'react';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './calculatorButton.module.css';

interface Props extends ChildrenNever {
  value: string | ReactNode;
  handleClick: () => void;
  label: string;
}

const CalculatorButton: FC<Props> = React.memo(({ value, handleClick, label }: Props) => (
  <Button className={styles.button} onClick={handleClick} aria-label={label}>
    {value}
  </Button>
));

export { CalculatorButton };
