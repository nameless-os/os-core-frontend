// Libraries
import React, { FC, RefObject } from 'react';
import { useSelector } from 'react-redux';

// Types
import { RootState } from '@Types/rootState.type';

// Enums
import { SimonStatus } from '@Simon/enums/simonStatus.enum';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './simonButton.module.css';

interface Props extends ChildrenNever {
  btnRef: RefObject<HTMLButtonElement>;
  btnNumber: number;
  handleClick: (btnNumber: number) => void;
  numberOfButtons: number;
}

const SimonButton: FC<Props> = React.memo(({ btnRef, btnNumber, handleClick, numberOfButtons }: Props) => {
  const status = useSelector((store: RootState) => store.simon.simonStatus);

  return (
    <Button
      disabled={status !== SimonStatus.Playing}
      forwardedRef={btnRef}
      onClick={() => handleClick(btnNumber)}
      aria-label="simon-button"
      className={styles[`btn${numberOfButtons}`]}
    />
  );
});

export { SimonButton };
