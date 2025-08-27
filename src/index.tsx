import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initCoreServices } from './initCoreServices';
import { AppId, CoreAPI } from '@nameless-os/sdk';
import { registerBaseApps } from './api/app/initAppAPI';

const container = document.getElementById('root');
const root = createRoot(container!);

const systemApi: CoreAPI = await initCoreServices();
console.log(systemApi, 'initCoreServices');
window.nameless_os = {
  registerExternalApp: (app) => ({
    appId: systemApi.app.registerApp(app) as AppId,
    apis: systemApi,
  }),
};
registerBaseApps(systemApi);

root.render(
  <React.StrictMode>
    <Suspense fallback="">
      <App/>
    </Suspense>
  </React.StrictMode>,
);

export { systemApi };
