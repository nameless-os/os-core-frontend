import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { changeDifficulty, restartGame, updateStatus } from '@Simon/redux/simonSlice/simonSlice';
import 'src/features/i18n';
import { SimonDifficulty as Difficulty } from '../../enums/simonDifficulty.enum';
import { SimonStatus } from '@Simon/enums/simonStatus.enum';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';

import styles from './simonBar.module.css';

interface Props extends ChildrenNever {
  difficulty: Difficulty;
}

export const SimonBar: FC<Props> = React.memo(({ difficulty }: Props) => {
  const status = useTypedSelector((store) => store.simon.simonStatus);
  const level = useTypedSelector((store) => store.simon.level);

  const dispatch = useTypedDispatch();
  const { t } = useTranslation('simon');

  function startGame() {
    dispatch(updateStatus({ status: SimonStatus.Showing }));
  }

  function handleRestartGame() {
    dispatch(restartGame());
  }

  function handleChangeDifficulty() {
    dispatch(changeDifficulty({ difficulty: Difficulty.None }));
  }

  return (
    <div className={styles.wrapper}>
      <div>
        <p>
          {t('difficulty')}
          {': '}
          {t(`difficulties.${difficulty}`)}
        </p>
        <p className={styles.level}>
          {t('level')}
          {': '}
          {level}
        </p>
      </div>
      {status === SimonStatus.Waiting && (
        <Button onClick={startGame} className={styles.btn}>
          {t('start')}
        </Button>
      )}
      {status === SimonStatus.Losed && (
        <div className={styles.buttons}>
          <Button onClick={handleChangeDifficulty} className={styles.btn}>
            {t('changeDifficulty')}
          </Button>
          <Button onClick={handleRestartGame} className={styles.btn}>
            {t('restart')}
          </Button>
        </div>
      )}
    </div>
  );
});
