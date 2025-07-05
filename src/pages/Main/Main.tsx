import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { Terminal } from '@Terminal/Terminal';
import { Settings } from '@Settings/Settings';
import { Calculator } from '@Calculator/Calculator';
import { ToDo } from '@ToDo/ToDo';
import { Chat } from '@Chat/Chat';
import { Simon } from '@Simon/Simon';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Minesweeper } from '@webos-project/minesweeper';
import { Translate } from '@Translate/Translate';
import { MessageAlert } from '@Components/MessageAlert/MessageAlert';
import { Welcome } from '@Components/Welcome/Welcome';
import { fetchUser } from '@Features/user/redux/userSlice';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Background } from '@Features/settings/enums';
import { App } from '@webos-project/common';
import { Button } from '@Components/Button/Button';
import { useTypedDispatch, useTypedSelector } from '@Hooks';
import { addAppIcon } from '@Features/icons/redux/icon.slice';
import minesweeperIcon from '@Icons/minesweeper.svg';

import styles from './main.module.css';
import { Icon } from '@Components/Icon/Icon';
import { AppIconState } from '@Features/icons/redux/types/icon.slice.types';

const Main: FC<ChildrenNever> = () => {
  const apps = useTypedSelector((state) => state.apps.apps);
  const icons = useTypedSelector((state) => state.icon.icons);
  const backgroundImage = useTypedSelector((state) => state.settings.background);
  const [themeBackground, setThemeBackground] = useState('');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(!sessionStorage.getItem('isWelcomeOpen'));
  const dispatch = useTypedDispatch();
  const [modalX, setModalX] = useState(0);
  const [modalY, setModalY] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser() as any);
  }, [dispatch]);

  const backgroundImagesAssets = useMemo(
    () => ({
      [Background.Car]: car,
      [Background.Fog]: fog,
      [Background.Sea]: sea,
      [Background.Dynamic]: dynamic,
      [Background.Dynamic2]: dynamic2,
      [Background.Planet]: planet,
      [Background.Tree]: tree,
      [Background.Cat]: cat,
      [Background.House]: house,
      [Background.Waterfall]: waterfall,
    }),
    [],
  );

  useEffect(() => {
    // @ts-ignore
    setThemeBackground(backgroundImagesAssets[backgroundImage]);
  }, [backgroundImage, backgroundImagesAssets]);

  const handleWelcomeClose = useCallback(() => {
    setIsWelcomeOpen(false);
    sessionStorage.setItem('isWelcomeOpen', 'No');
  }, []);

  function handleContext(event: any) {
    event.preventDefault();
    if (!(event.target.id === 'main-container')) {
      return;
    }
    setModalX(event.pageX);
    setModalY(event.pageY);
    setModalOpen(true);
  }

  function handleAddIcon() {
    dispatch(addAppIcon({ app: App.Minesweeper, image: minesweeperIcon }));
  }

  return (
    <div style={{ backgroundImage: `url(${themeBackground})` }} className={styles.container} id="main-container" onContextMenu={handleContext}>
      <AnimatePresence>{isWelcomeOpen && <Welcome handleWelcomeClose={handleWelcomeClose} />}</AnimatePresence>
      {<div style={{ position: 'absolute', zIndex: 2, top: modalY, left: modalX }} className={styles.createIconModal1}>
        <div className={styles.createIconModal1Buttons}>
          <Button onClick={handleAddIcon}>Add Icon</Button>
        </div>
      </div>}
      <div> 
        {icons.map((icon) => (
          <Icon type={(icon as AppIconState).additionalState.app} imgSource={icon.image} position={icon.position} />
        ))}
      </div>
      <div>
        {Object.values(apps).map((app) => {
          if (app === null) {
            return <></>;
          }
          switch (app.type) {
            case App.Terminal:
              return <Terminal appId={app.id} />;
            case App.Settings:
              return <Settings appId={app.id} />;
            case App.Calculator:
              return <Calculator appId={app.id} />;
            case App.Chat:
              return <Chat appId={app.id} />;
            case App.Simon:
              return <Simon appId={app.id} />;
            case App.Minesweeper:
              return <Minesweeper appId={app.id} />;
            case App.Translate:
              return <Translate appId={app.id} />;
            case App.ToDo:
              return <ToDo appId={app.id} />;
            default:
              return <></>;
          }
        })}
        <MessageAlert />
      </div>
    </div>
  );
};

export { Main };
