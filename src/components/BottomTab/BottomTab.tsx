import React, { FC } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { App } from '@webos-project/common';
import { useApp, useTypedSelector } from '@Hooks';
import { ChildrenNever } from '@Interfaces/childrenNever.interface';
import { Button } from '@Components/Button/Button';

import styles from './bottomTab.module.css';

interface Props extends ChildrenNever {
  type: App;
  icon: IconDefinition;
}

const BottomTab: FC<Props> = ({ type, icon }: Props) => {
  const apps = useTypedSelector((state) => state.apps.apps);
  const appsLength = Object.values(apps).filter((app) => app?.type === type).length;
  const isOpen = appsLength !== 0;
  const { appIndex, handleToggleCollapse, handleOpen } = useApp(type);

  return (
    <div data-cy="bottom-tab">
      {!isOpen && (
        <Button className={`${styles.close} ${styles.tab}`} onClick={handleOpen} aria-label={`${type} bottom icon`}>
          <FontAwesomeIcon icon={icon} />
        </Button>
      )}
      {isOpen && (
        <Button
          className={
            appIndex === 0 ? `${styles.isActive} ${styles.tab} ${styles.open}` : `${styles.tab} ${styles.open}`
          }
          onClick={handleToggleCollapse}
        >
          <FontAwesomeIcon icon={icon} />
          {appsLength > 1 && <p className={styles.appsLength}>{appsLength}</p>}
        </Button>
      )}
    </div>
  );
};

export { BottomTab };
