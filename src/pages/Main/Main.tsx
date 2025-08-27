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
import { Welcome } from '@Components/Welcome/Welcome';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Background } from '@Features/settings/enums';
import { Button } from '@Components/Button/Button';
import { Window } from '@Components/Window/Window';

import styles from './main.module.css';
import { useWindowManagerStore } from '../../api/windowManager/windowManager.store';
import { AltTabOverlay } from '@Components/AltTabOverlay/AltTabOverlay';
import { Toaster } from 'sonner';
import { systemApi } from '../../index';
import { useBackground } from '@Settings/stores/settings.store';
import { AppInstanceId, WindowId } from '@nameless-os/sdk';

const Main: FC<ChildrenNever> = () => {
  const backgroundImage = useBackground();
  const [themeBackground, setThemeBackground] = useState('');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(!sessionStorage.getItem('isWelcomeOpen'));
  const [modalX, setModalX] = useState(0);
  const [modalY, setModalY] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [altTabVisible, setAltTabVisible] = useState(false);

  const windows = useWindowManagerStore(state => state.windows);

  function focusWindowById(id: WindowId) {
    systemApi.windowManager.focusWindow(id);
    setAltTabVisible(false);
  }

  const backgroundImagesAssets: Record<Background, string> = useMemo(
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
      [Background.CustomImage]: planet,
      [Background.CustomUrl]: planet,
    }),
    [],
  );

  useEffect(() => {
    setThemeBackground(backgroundImagesAssets[backgroundImage]);
  }, [backgroundImage, backgroundImagesAssets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.code === 'KeyQ')) {
        e.preventDefault();
        setAltTabVisible(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltTabVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleWelcomeClose = useCallback(() => {
    setIsWelcomeOpen(false);
    sessionStorage.setItem('isWelcomeOpen', 'No');
    setTimeout(() => {
      return systemApi.sound.playUrl('/assets/sounds/startup.mp3', {
        volume: 0.3,
        appId: undefined as unknown as AppInstanceId,
      });
    }, 1000);
  }, []);

  function handleContext(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!(event.target instanceof HTMLElement) || event.target.id !== 'main-container') {
      return;
    }

    setModalX(event.pageX);
    setModalY(event.pageY);
    setModalOpen(true);
  }

  function handleAddIcon() {
  }

  return (
    <div style={{ backgroundImage: `url(${themeBackground})` }} className={styles.container} id="main-container"
         onContextMenu={handleContext}>
      <AnimatePresence>{isWelcomeOpen && <Welcome handleWelcomeClose={handleWelcomeClose}/>}</AnimatePresence>
      {<div style={{ position: 'absolute', zIndex: 2, top: modalY, left: modalX }} className={styles.createIconModal1}>
        <div className={styles.createIconModal1Buttons}>
          <Button onClick={handleAddIcon}>Add Icon</Button>
        </div>
      </div>}
      <div>
        {windows.map((win) => {
          return !win.minimized && <Window key={win.id} windowProps={win}/>
        })}
      </div>
      <AltTabOverlay
        windows={windows}
        visible={altTabVisible}
        onSelect={focusWindowById}
      />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={5000}
      />
    </div>
  );
};

export { Main };
