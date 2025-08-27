import { AppInstanceId, CoreAPI, createPersistentAppTypeId } from '@nameless-os/sdk';
import { FileExplorer } from '@Apps/explorer/ui/FileExplorer';

const PERSISTENT_APP_TYPE_ID = createPersistentAppTypeId('explorer');

function registerExplorerApp(systemApi: CoreAPI) {
  return systemApi.app.registerApp({
    name: 'Explorer',
    persistentAppTypeId: PERSISTENT_APP_TYPE_ID,
    icon: '/assets/images/icons/explorer.svg',
    launch: async (instanceId: AppInstanceId) => {
      systemApi.windowManager.openWindow({
        title: 'Explorer',
        appInstanceId: instanceId,
        size: { width: 900, height: 600 },
        component: () => <FileExplorer/>,
      });
    },
  });
}

export { registerExplorerApp };
