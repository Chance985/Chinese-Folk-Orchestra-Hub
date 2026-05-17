import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppTheme from './theme/AppTheme.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppTheme>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppTheme>
    </BrowserRouter>
  </React.StrictMode>,
);
