import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './i18n';
import App from './App';
import { LocaleProvider } from './locale/localeoptions';
import { ThemeProvider } from './theme/themeoptions';
import { MessageboxProvider } from './ui/messagebox/messageboxcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <React.StrictMode>
      <LocaleProvider>
        <ThemeProvider>
          <MessageboxProvider>
            <App />
          </MessageboxProvider>
        </ThemeProvider>
      </LocaleProvider>
    </React.StrictMode>
  </Router>
);