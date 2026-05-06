import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './i18n';
import { App } from './App';
import { LocaleProvider } from './locale/localeoptions';
import { ThemeProvider } from './theme/themeoptions';
import { SessionProvider } from './SessionProvider';
import { OrientationProvider } from './ui/orientation/OrientationContext';
import { MessageboxProvider } from './ui/messagebox/messageboxcontext';
import { ErrorBoundary, PageErrorFallback } from './ui/errorboundary/errorboundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
        <React.StrictMode>
            <SessionProvider>
                <LocaleProvider>
                    <ThemeProvider>
                        <OrientationProvider>
                            <MessageboxProvider>
                                <ErrorBoundary fallback={<PageErrorFallback />}>
                                    <App />
                                </ErrorBoundary>
                            </MessageboxProvider>
                        </OrientationProvider>
                    </ThemeProvider>
                </LocaleProvider>
            </SessionProvider>
        </React.StrictMode>
    </Router>
);
