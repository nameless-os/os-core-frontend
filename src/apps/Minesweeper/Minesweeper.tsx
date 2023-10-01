// Libraries
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { App } from '@Enums/app.enum';
import { Difficulty } from '@Enums/difficulty.enum';

// Assets
import imgSource from '@Icons/minesweeper.svg';

// Redux
import { calculateMinesweeper, generateMinesweeperPattern } from '@Minesweeper/redux/minesweeperSlice/minesweeperSlice';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Icon } from '@Components/Icon/Icon';
import { Window } from '@Components/Window/Window';
import { DifficultiesScreen } from '@Minesweeper/components/DifficultiesScreen/DifficultiesScreen';
import { MinesweeperNode } from '@Minesweeper/components/MinesweeperNode/MinesweeperNode';
import { Sidebar } from '@Minesweeper/components/Sidebar/Sidebar';

// Styles
import styles from './minesweeper.module.css';

const Minesweeper: FC<ChildrenNever> = React.memo(() => {
  const pattern = useSelector((state: RootState) => state.minesweeper.pattern);
  const size = useSelector((state: RootState) => state.minesweeper.size);
  const difficulty = useSelector((state: RootState) => state.minesweeper.difficulty);
  const isOpen = useSelector((state: RootState) => state.apps.appsState[App.Minesweeper].isOpen);
  const isCollapsed = useSelector((state: RootState) => state.apps.appsState[App.Minesweeper].isCollapsed);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (difficulty === Difficulty.None) {
      return;
    }
    dispatch(generateMinesweeperPattern());
    dispatch(calculateMinesweeper());
  }, [dispatch, difficulty]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.style.gridTemplateColumns = `repeat(${size}, ${100 / size}%)`;
      mainContentRef.current.style.gridTemplateRows = `repeat(${size}, ${100 / size}%)`;
    }
  }, [size, isOpen, isCollapsed]);

  return (
    <>
      <Icon imgSource={imgSource} type={App.Minesweeper} />
      <Window type={App.Minesweeper}>
        {difficulty === Difficulty.None ? (
          <DifficultiesScreen />
        ) : (
          <div className={styles.wrapper}>
            <div className={styles.main} ref={mainContentRef}>
              {pattern.length && pattern.map((arr, arrIndex) => arr.map((el, i) => (
                <MinesweeperNode value={el} arrIndex={arrIndex} index={i} key={uuidv4()} />
              )))}
            </div>
            <Sidebar />
          </div>
        )}
      </Window>
    </>
  );
});

export { Minesweeper };
