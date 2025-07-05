import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { App, Position } from '@webos-project/common';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useApp } from '@Hooks';

import styles from './icon.module.css';

interface Props extends ChildrenNever {
  imgSource: string;
  type: App;
  position: Position;
}

export const Icon: FC<Props> = ({ imgSource, type, position }: Props) => {
  const icon = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { handleOpen } = useApp(type);

  return (
    <div className={styles.container} style={{ top: position.top, left: position.left }} ref={icon} data-cy={`icon-${type}`}>
      <Button onDoubleClick={handleOpen} className={`${styles.imgContainer}`} aria-label={`${type} icon`}>
        <img src={imgSource} alt="" className={`${styles.img}`} />
      </Button>
      <span className={styles.title}>{t(`apps.${type}`)}</span>
    </div>
  );
};
