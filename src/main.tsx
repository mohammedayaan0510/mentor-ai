import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Catch and prevent unhandled promise rejections from dev server websocket connections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = (typeof reason === 'string' 
      ? reason 
      : (reason?.message || String(reason || ''))).toLowerCase();

    if (
      message.includes('websocket') ||
      message.includes('[vite]')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = (event.message || '').toLowerCase();
    if (
      message.includes('websocket') ||
      message.includes('[vite]')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

