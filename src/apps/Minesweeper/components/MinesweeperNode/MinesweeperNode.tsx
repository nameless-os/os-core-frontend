// Libraries
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, faBahai, faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';

// Constants
import { BOMB_NUMBER } from '@Minesweeper/constants/bombNumber';

// Types
import { RootState } from '@Types/rootState.type';

// Redux
import { addFlag, removeFlag, setVisible } from '@Minesweeper/redux/minesweeperSlice/minesweeperSlice';

// Components
import { Button } from '@Components/Button/Button';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './minesweeperNode.module.css';

interface Props extends ChildrenNever {
  value: number;
  arrIndex: number;
  index: number;
}

const MinesweeperNode: FC<Props> = React.memo(({ value, arrIndex, index }: Props) => {
  const isVisible = useSelector((state: RootState) => state.minesweeper.visibilityList[arrIndex][index]);
  const isLose = useSelector((state: RootState) => state.minesweeper.isLose);
  const isWin = useSelector((state: RootState) => state.minesweeper.isWin);
  const isFlagAvailable = useSelector((state: RootState) => state.minesweeper.isFlagAvailable);

  const [isFlag, setIsFlag] = useState(false);
  const [isBombClick, setIsBombClick] = useState(false);

  const dispatch = useDispatch();

  function handleRightClick(event: React.MouseEvent) {
    event.preventDefault();

    if (isVisible) {
      return;
    }

    if (!isFlag && !isFlagAvailable) {
      return;
    }

    if (isFlag) {
      dispatch(removeFlag());
    } else {
      dispatch(addFlag());
    }

    setIsFlag(!isFlag);
  }

  function handleClick() {
    if (isFlag || isVisible) {
      return;
    }

    if (value === BOMB_NUMBER) {
      dispatch(setVisible({ arrIndex, index }));
      setIsBombClick(true);
    } else {
      dispatch(setVisible({ arrIndex, index }));
    }
  }

  useEffect(() => {
    if (!isLose && !isWin) {
      setIsBombClick(false);
      setIsFlag(false);
    }
  }, [isLose, isWin]);

  function getIcon(): React.ReactNode {
    if (isFlag && !isVisible) {
      return <FontAwesomeIcon icon={faFlag} className={styles.flag} aria-hidden="true" />;
    }

    if (isVisible && !isBombClick && value === BOMB_NUMBER) {
      return <FontAwesomeIcon icon={faBomb} />;
    }

    if (isBombClick) {
      return <FontAwesomeIcon icon={faBahai} />;
    }

    if (!isVisible) return null;

    switch (value) {
      case 1: {
        return <FontAwesomeIcon icon={fa1} />;
      }
      case 2: {
        return <FontAwesomeIcon icon={fa2} />;
      }
      case 3: {
        return <FontAwesomeIcon icon={fa3} />;
      }
      case 4: {
        return <FontAwesomeIcon icon={fa4} />;
      }
      case 5: {
        return <FontAwesomeIcon icon={fa5} />;
      }
      case 6: {
        return <FontAwesomeIcon icon={fa6} />;
      }
      case 7: {
        return <FontAwesomeIcon icon={fa7} />;
      }
      case 8: {
        return <FontAwesomeIcon icon={fa8} />;
      }
      default: return null;
    }
  }

  return (
    <Button
      className={classNames(styles.node, {
        [styles.lose]: value === BOMB_NUMBER && isLose,
        [styles.win]: value === BOMB_NUMBER && isWin,
        [styles[`bombAround${value}`]]: isVisible,
      })}
      onContextMenu={handleRightClick}
      onClick={handleClick}
    >
      {getIcon()}
    </Button>
  );
});

export { MinesweeperNode };
