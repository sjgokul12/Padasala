import { useSyncExternalStore } from 'react';

// Hash-based routes ("#/schools") work on any static host and inside the Android app without server config.
// Plain anchors ("#contact") still belong to the home page sections.

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  if (!hash.startsWith('#/')) return { path: '/', segments: [] as string[], anchor: hash.slice(1), query: new URLSearchParams() };
  const [path, search = ''] = hash.slice(1).split('?');
  return { path, segments: path.split('/').filter(Boolean), anchor: '', query: new URLSearchParams(search) };
}

export function navigate(path: string) {
  window.location.hash = path;
}

export const isActive = (current: string, target: string) =>
  target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
