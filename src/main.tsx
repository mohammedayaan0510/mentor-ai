import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// Replace with your real Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "961768486806-g3hqirremrepr2hklkvjtbvtdp290hdb.apps.googleusercontent.com";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string'
      ? reason
      : (reason?.message || String(reason || ''));
    if (
      message.includes('Websocket closed without opened') ||
      message.includes('[vite] failed to connect') ||
      (message.includes('Websocket') && message.includes('closed'))
    ) {
      event.preventDefault();
    }
  });
}
