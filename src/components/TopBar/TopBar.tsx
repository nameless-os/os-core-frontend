// Libraries
import { FC } from 'react';

// Components
import { FullscreenButton } from '@Components/FullscreenButton/FullscreenButton';
import { Username } from '@Components/Username/Username';
import { TopDate } from '@Components/TopDate/TopDate';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Styles
import styles from './topBar.module.css';

export const TopBar: FC<ChildrenNever> = () => (
  <div className={styles.container} id="top-bar">
    <TopDate />
    <Username />
    <FullscreenButton />
  </div>
);
