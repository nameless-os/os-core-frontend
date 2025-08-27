import { useStartMenu } from '../../stores/startMenu.store';
import { useRegisteredAppsStore } from '../../api/app/appDefinitons.store';
import { useMemo } from 'react';
import styles from './startMenu.module.css';
import { systemApi } from '../../index';

const StartMenu = () => {
  const appsObj = useRegisteredAppsStore((s) => s.apps);
  const apps = useMemo(() => Object.values(appsObj), [appsObj]);
  const close = useStartMenu((s) => s.closeStartMenu);

  return (
    <div className={styles.startMenu}>
      {apps.map((app) => (
        <button
          key={app.appId}
          className={styles.menuItem}
          onClick={() => {
            systemApi.app.startApp(app.appId);
            close();
          }}
        >
          <img src={app.icon} className={styles.icon} alt={app.name} />
          <span>{app.name}</span>
        </button>
      ))}
    </div>
  );
};

export { StartMenu };
