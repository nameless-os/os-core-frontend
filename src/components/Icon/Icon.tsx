// Libraries
import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';

// Redux
import { setIconPosition } from 'src/redux/slices/appsSlice/appsSlice';

// I18n
import { useTranslation } from 'react-i18next';

// Hooks
import { useDragNDrop } from 'src/hooks/useDragNDrop/useDragNDrop';
import { useApp } from 'src/hooks/useApp/useApp';

// Enums
import { App } from '@Enums/app.enum';

// Types
import { RootState } from '@Types/rootState.type';

// Interfaces
import { ChildrenNever } from '@Interfaces/childrenNever.interface';

// Components
import { Button } from '@Components/Button/Button';

// Styles
import styles from './icon.module.css';

interface Props extends ChildrenNever {
  imgSource: string;
  type: App;
}

export const Icon: FC<Props> = ({ imgSource, type }: Props) => {
  const iconPosition = useSelector((state: RootState) => state.apps.appsState[type].iconPosition);

  const icon = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { handleOpen } = useApp(type);
  const { startDrag, newCoords, isDrag } = useDragNDrop(setIconPosition, icon, iconPosition, type);

  return (
    <div
      className={styles.container}
      style={{ top: newCoords?.top, left: newCoords?.left }}
      ref={icon}
      data-cy={`icon-${type}`}
    >
      <Button
        onDoubleClick={handleOpen}
        className={`${styles.imgContainer} ${isDrag ? styles.grabbed : ''}`}
        onMouseDown={startDrag}
        aria-label={`${type} icon`}
      >
        <img src={imgSource} alt="" className={`${styles.img}`} />
      </Button>
      <span className={styles.title}>{t(`apps.${type}`)}</span>
    </div>
  );
};
