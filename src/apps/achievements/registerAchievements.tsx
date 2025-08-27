import { AppInstanceId, CoreAPI, createPersistentAppTypeId } from '@nameless-os/sdk';

const PERSISTENT_APP_TYPE_ID = createPersistentAppTypeId('achievements');

function registerAchievementsApp(systemApi: CoreAPI) {
  return systemApi.app.registerApp({
    name: 'Achievements',
    persistentAppTypeId: PERSISTENT_APP_TYPE_ID,
    icon: '/assets/images/icons/achievements.svg',
    launch: async (instanceId: AppInstanceId) => {
      systemApi.windowManager.openWindow({
        title: 'Achievements',
        appInstanceId: instanceId,
        size: { width: 900, height: 600 },
        component: () => <></>,
      });
    },
  });
}

export { registerAchievementsApp };
