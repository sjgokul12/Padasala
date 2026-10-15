import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App.tsx';
import './index.css';

// In the Android app, target="_blank" links (WhatsApp, registration pages, social profiles) would otherwise do
// nothing. Navigating normally lets Capacitor hand them to WhatsApp / the browser.
if (Capacitor.isNativePlatform()) {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a[target="_blank"]') as HTMLAnchorElement | null;
    if (!link?.href) return;
    e.preventDefault();
    window.location.href = link.href;
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
