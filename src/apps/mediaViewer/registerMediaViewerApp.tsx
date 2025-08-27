import { registerExternalApp, AppInstanceId, createPersistentAppTypeId, CoreAPI } from '@nameless-os/sdk';
import { MediaViewer } from '@Apps/mediaViewer/ui/MediaViewer';

const PERSISTENT_APP_TYPE_ID = createPersistentAppTypeId('media_viewer');

function registerMediaViewerApp(systemApi: CoreAPI) {
  const { apis, appId } = registerExternalApp<{ filePath: string }>({
    name: 'Media Viewer',
    persistentAppTypeId: PERSISTENT_APP_TYPE_ID,
    icon: '/assets/images/icons/mediaPlayer.svg',
    fileAssociations: [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
      'mp4', 'webm', 'ogg', 'ogv', 'avi', 'mov'
    ],
    launch: async (instanceId: AppInstanceId,  { filePath }) => {
      apis.windowManager.openWindow({
        title: `Media Viewer - ${filePath.split('/').pop()}`,
        appInstanceId: instanceId,
        size: { width: 800, height: 600 },
        component: () => <MediaViewer filePath={filePath} />,
      });
    },
  });

  return appId;
}

export { registerMediaViewerApp };