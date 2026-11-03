import { useEffect, useSyncExternalStore } from 'react';
import { seeds, legacySeedImages } from '@/data/seed';
import { api, backendEnabled, uploadImage, uploadFile } from './api';

// All app data goes through this file. With the PHP backend connected (VITE_API_URL) collections are loaded
// from and saved to the MySQL database; without it (demo mode) they are kept in the browser (localStorage).

export type Value = string | string[] | number | boolean | undefined;

export interface Post {
  id: string;
  createdAt: number;
  ownerId: string;
  ownerName: string;
  [field: string]: Value;
}

export type CollectionName = keyof typeof seeds;

const PREFIX = 'padasala:v1:';
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

// Keys starting with "ui:" are in-memory only.
const persisted = (key: string) => !key.startsWith('ui:');

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  if (persisted(key)) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) value = JSON.parse(raw) as T;
      // Saved copies of demo records pick up fields added to the seed data later.
      if (raw && Array.isArray(value) && Array.isArray(fallback)) {
        const seedById = new Map((fallback as Post[]).map((s) => [s.id, s]));
        value = (value as Post[]).map((p) => {
          const seed = seedById.get(p.id);
          if (!seed) return p;
          const merged = { ...seed, ...p };
          if (typeof p.image === 'string' && legacySeedImages.has(p.image)) merged.image = seed.image;
          return merged;
        }) as T;
      }
    } catch {
      // Storage blocked or corrupt: fall back to defaults.
    }
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  if (persisted(key)) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      // The in-memory value still updates; tell the user if the device storage is full (usually many photos).
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        window.alert('This device is out of space for Padasala data. Remove a few photos or posts and try again.');
      }
    }
  }
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  return () => listeners.get(key)!.delete(cb);
}

// Keep other open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key?.startsWith(PREFIX)) return;
    const key = e.key.slice(PREFIX.length);
    cache.delete(key);
    listeners.get(key)?.forEach((l) => l());
  });
}

export function useStored<T>(key: string, fallback: T): [T, (next: T) => void] {
  const value = useSyncExternalStore((cb) => subscribe(key, cb), () => read(key, fallback));
  return [value, (next: T) => write(key, next)];
}

export const getStored = read;
export const setStored = write;

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export interface CollectionApi {
  items: Post[];
  /** False until the first load from the server has finished (always true in demo mode). */
  loaded: boolean;
  add(data: Record<string, Value>, owner: { id: string; name: string }): Promise<Post>;
  update(id: string, patch: Record<string, Value>): Promise<void>;
  remove(id: string): Promise<void>;
}

/**
 * A list of app data (schools, events, listings…).
 * With the backend connected every list comes from the MySQL database and every change goes through the
 * server, which applies the visibility and ownership rules. Without it (demo mode) data stays on the device.
 */
export function useCollection(name: CollectionName): CollectionApi {
  // backendEnabled never changes while the app runs, so the same hook is always called.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return backendEnabled ? useRemoteCollection(name) : useLocalCollection(name);
}

function useLocalCollection(name: CollectionName): CollectionApi {
  const seed = seeds[name] as Post[];
  const [items] = useStored<Post[]>(name, seed);
  const current = () => read<Post[]>(name, seed);

  return {
    items,
    loaded: true,
    async add(data, owner) {
      const post: Post = { ...data, id: uid(), createdAt: Date.now(), ownerId: owner.id, ownerName: owner.name };
      write(name, [post, ...current()]);
      return post;
    },
    async update(id, patch) {
      write(name, current().map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    async remove(id) {
      write(name, current().filter((p) => p.id !== id));
    },
  };
}

/* ---------- Backend (MySQL) collections ---------- */

const NO_ITEMS: Post[] = [];
const remoteKey = (name: string) => `ui:db:${name}`;
const loadedKey = (name: string) => `ui:db-loaded:${name}`;
const remoteState = new Map<string, { loadedAt: number; loading: boolean; again: boolean }>();
const token = () => read<{ token?: string } | null>('session', null)?.token;
// Lists the server shows only to logged-in accounts (backend/includes/resources.php): no request when logged out.
const LOGIN_ONLY = new Set(['requirements', 'tuitionRequests', 'teacherProfiles', 'vendors', 'enquiries', 'studentProfiles', 'attempts', 'favorites']);

async function fetchCollection(name: string): Promise<void> {
  const state = remoteState.get(name) ?? { loadedAt: 0, loading: false, again: false };
  remoteState.set(name, state);
  if (state.loading) {
    state.again = true; // e.g. the login changed while loading: load once more afterwards
    return;
  }
  if (!token() && LOGIN_ONLY.has(name)) {
    write(remoteKey(name), NO_ITEMS);
    write(loadedKey(name), true);
    return;
  }
  state.loading = true;
  try {
    const { items } = await api<{ items: Post[] }>(`/api/data.php?c=${name}`, { token: token() });
    if (!state.again) write(remoteKey(name), items); // otherwise outdated: a newer load follows
  } catch {
    if (!state.again) write(remoteKey(name), NO_ITEMS); // not allowed / offline: show nothing rather than stale data
  } finally {
    state.loading = false;
    state.loadedAt = Date.now();
    write(loadedKey(name), true);
  }
  if (state.again) {
    state.again = false;
    await fetchCollection(name);
  }
}

// Logging in or out changes what each person may see: reload every list already in use.
if (backendEnabled) {
  subscribe('session', () => {
    for (const name of remoteState.keys()) fetchCollection(name);
  });
}

function useRemoteCollection(name: CollectionName): CollectionApi {
  const [items] = useStored<Post[]>(remoteKey(name), NO_ITEMS);
  const [loaded] = useStored<boolean>(loadedKey(name), false);
  const current = () => read<Post[]>(remoteKey(name), NO_ITEMS);

  useEffect(() => {
    const state = remoteState.get(name);
    if (!state || Date.now() - state.loadedAt > 30_000) fetchCollection(name);
  }, [name]);

  const write_ = async (action: string, id?: string, body: Record<string, Value> = {}) => {
    // A list load already running may miss this change: have it load again instead of applying its result.
    const state = remoteState.get(name);
    if (state?.loading) state.again = true;
    // Photos and documents picked on the device are uploaded first; the record stores their online link.
    const data: Record<string, Value> = { ...body };
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.startsWith('data:')) {
        const origName = (data[`${key}Name`] as string) || (key === 'image' ? 'photo.jpg' : 'document');
        const uploaded = await uploadFile(value, token(), origName);
        data[key] = uploaded.url;
        if (!data[`${key}Name`] && uploaded.name) data[`${key}Name`] = uploaded.name;
      }
    }
    return api<{ item?: Post | null }>(`/api/data.php?c=${name}&action=${action}${id ? `&id=${encodeURIComponent(id)}` : ''}`, {
      method: 'POST',
      body: data,
      token: token(),
    });
  };

  return {
    items,
    loaded,
    async add(data) {
      const { item } = await write_('create', undefined, data);
      if (item) write(remoteKey(name), [item, ...current()]);
      return item as Post;
    },
    async update(id, patch) {
      const { item } = await write_('update', id, patch);
      if (item) write(remoteKey(name), current().map((p) => (p.id === id ? item : p)));
      else write(remoteKey(name), current().filter((p) => p.id !== id));
    },
    async remove(id) {
      await write_('delete', id);
      write(remoteKey(name), current().filter((p) => p.id !== id));
    },
  };
}

/** Read a field as display text. */
export const txt = (v: Value) => (Array.isArray(v) ? v.join(', ') : v === undefined ? '' : String(v));
