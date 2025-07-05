import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { App } from '@webos-project/common';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';
import { useApp } from '@Hooks';

import styles from './icon.module.css';

interface Props extends ChildrenNever {
  imgSource: string;
  type: App;
}

export const Icon: FC<Props> = ({ imgSource, type }: Props) => {
  const icon = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { handleOpen } = useApp(type);

  return (
    <div className={styles.container} style={{ top: '1rem', left: '1rem' }} ref={icon} data-cy={`icon-${type}`}>
      <Button onDoubleClick={handleOpen} className={`${styles.imgContainer}`} aria-label={`${type} icon`}>
        <img src={imgSource} alt="" className={`${styles.img}`} />
      </Button>
      <span className={styles.title}>{t(`apps.${type}`)}</span>
    </div>
  );
};
