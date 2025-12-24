import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './i18n';
import { App } from './App'; // Changed from default import to named import
import { LocaleProvider } from './locale/localeoptions';
import { ThemeProvider } from './theme/themeoptions';
import { SessionProvider } from './SessionProvider';
import { OrientationProvider } from './ui/orientation/OrientationContext';
import { MessageboxProvider } from './ui/messagebox/messageboxcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <React.StrictMode>
      <SessionProvider>
        <LocaleProvider>
          <ThemeProvider>
            <OrientationProvider>
              <MessageboxProvider>
                <App />
              </MessageboxProvider>
            </OrientationProvider>
          </ThemeProvider>
        </LocaleProvider>
      </SessionProvider>
    </React.StrictMode>
  </Router>
);