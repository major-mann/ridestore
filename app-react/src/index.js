import React from 'react';
import { createRoot } from 'react-dom/client';
import log from './log.js';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import './index.css';

import { App } from './App.js';
import reportWebVitals from './reportWebVitals.js';

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(log.debug);
