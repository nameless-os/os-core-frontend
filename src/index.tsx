import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'src/redux/store';
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Suspense fallback="">
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>,
);
