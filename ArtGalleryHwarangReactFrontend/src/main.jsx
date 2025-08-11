import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css';
import App from './App';
import { LocaleProvider } from './locale/localeoptions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router><React.StrictMode>
      <LocaleProvider>
    <App />
      </LocaleProvider>
  </React.StrictMode></Router>
);
