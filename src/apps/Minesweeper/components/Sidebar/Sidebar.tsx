// Libraries
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

// Redux
import {
  calculateMinesweeper,
  generateMinesweeperPattern,
  setMinesweeperDifficulty,
} from '@Minesweeper/redux/minesweeperSlice/minesweeperSlice';

// Enums
import { Difficulty } from '@Enums/difficulty.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './sidebar.module.css';

const Sidebar: FC<ChildrenNever> = React.memo(() => {
  const availableFlags = useSelector((state: RootState) => state.minesweeper.availableFlags);
  const isLose = useSelector((state: RootState) => state.minesweeper.isLose);
  const isWin = useSelector((state: RootState) => state.minesweeper.isWin);

  const dispatch = useDispatch();
  const { t } = useTranslation('minesweeper');

  function handleRestart() {
    dispatch(generateMinesweeperPattern());
    dispatch(calculateMinesweeper());
  }

  function handleChangeDifficulty() {
    dispatch(setMinesweeperDifficulty({ difficulty: Difficulty.None }));
  }

  return (
    <div className={styles.sidebar}>
      <p>
        {`${t('Available')} `}
        <FontAwesomeIcon icon={faFlag} />
        {`: ${availableFlags}`}
      </p>
      {isLose && <p>{t('You lose!')}</p>}
      {isWin && <p>{t('You win!')}</p>}
      {(isLose || isWin) && (
        <div className={styles.endGameButtons}>
          <Button
            className={styles.btn}
            onClick={handleChangeDifficulty}
          >
            {t('Change difficulty')}
          </Button>
          <Button
            className={styles.btn}
            onClick={handleRestart}
          >
            {t('Restart')}
          </Button>
        </div>
      )}
    </div>
  );
});

export { Sidebar };
