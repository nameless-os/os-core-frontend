import React, { FC, RefObject } from 'react';

import { SimonStatus } from '@Simon/enums/simonStatus.enum';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useTypedSelector } from '@Hooks';

import styles from './simonButton.module.css';

interface Props extends ChildrenNever {
  btnRef: RefObject<HTMLButtonElement>;
  btnNumber: number;
  handleClick: (btnNumber: number) => void;
  numberOfButtons: number;
}

const SimonButton: FC<Props> = React.memo(({ btnRef, btnNumber, handleClick, numberOfButtons }: Props) => {
  const status = useTypedSelector((store) => store.simon.simonStatus);

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
