// Libraries
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

// Assets
import planet from '@Backgrounds/darkPlanet.webp';
import sea from '@Backgrounds/sea.webp';
import tree from '@Backgrounds/tree.webp';
import fog from '@Backgrounds/fog.webp';
import car from '@Backgrounds/car.webp';
import cat from '@Backgrounds/cat.webp';
import house from '@Backgrounds/house.gif';
import waterfall from '@Backgrounds/waterfall.gif';
import dynamic from '@Backgrounds/dynamic.gif';
import dynamic2 from '@Backgrounds/dynamic2.gif';

// Apps
import { Terminal } from '@Terminal/Terminal';
import { Settings } from '@Settings/Settings';
import { Calculator } from '@Calculator/Calculator';
import { ToDo } from '@ToDo/ToDo';
import { Chat } from '@Chat/Chat';
import { Simon } from '@Simon/Simon';
import { Minesweeper } from '@Minesweeper/Minesweeper';
import { Translate } from '@Translate/Translate';

// Components
import { MessageAlert } from '@Components/MessageAlert/MessageAlert';
import { Welcome } from '@Components/Welcome/Welcome';

// Features
import { fetchUser } from '@Features/user/redux/userSlice';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Enums
import { BackgroundImage } from '@Features/theme/types/backgroundImage';

// Styles
import styles from './main.module.css';

const Main: FC<ChildrenNever> = () => {
  const backgroundImage = useSelector((state: RootState) => state.theme.backgroundImage);
  const [themeBackground, setThemeBackground] = useState('');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(!sessionStorage.getItem('isWelcomeOpen'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const backgroundImagesAssets = useMemo(() => ({
    [BackgroundImage.Car]: car,
    [BackgroundImage.Fog]: fog,
    [BackgroundImage.Sea]: sea,
    [BackgroundImage.Dynamic]: dynamic,
    [BackgroundImage.Dynamic2]: dynamic2,
    [BackgroundImage.Planet]: planet,
    [BackgroundImage.Tree]: tree,
    [BackgroundImage.Cat]: cat,
    [BackgroundImage.House]: house,
    [BackgroundImage.Waterfall]: waterfall,
  }), []);

  useEffect(() => {
    setThemeBackground(backgroundImagesAssets[backgroundImage]);
  }, [backgroundImage, backgroundImagesAssets]);

  const handleWelcomeClose = useCallback(() => {
    setIsWelcomeOpen(false);
    sessionStorage.setItem('isWelcomeOpen', 'No');
  }, []);

  return (
    <div style={{ backgroundImage: `url(${themeBackground})` }} className={styles.container} id="main-container">
      <AnimatePresence>
        {isWelcomeOpen && <Welcome handleWelcomeClose={handleWelcomeClose} />}
      </AnimatePresence>
      <div>
        <Terminal />
        <Settings />
        <Calculator />
        <ToDo />
        <Chat />
        <Simon />
        <Minesweeper />
        <Translate />
        <MessageAlert />
      </div>
    </div>
  );
};

export { Main };
