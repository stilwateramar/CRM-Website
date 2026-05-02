import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { StillwaterAuthProvider } from './stillwater/StillwaterAuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StillwaterAuthProvider>
        <App />
        <Toaster position="top-right" />
      </StillwaterAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
