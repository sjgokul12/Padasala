import { useSyncExternalStore } from 'react';
import { seeds, legacySeedImages } from '@/data/seed';

// All app data goes through this file. For now it is kept in the browser (localStorage), so posts are only
// visible on the device that made them. Replacing read/write here with a backend (e.g. Supabase) makes the
// data shared between all users without touching the pages.

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
    } catch {
      // Ignore quota / private-mode errors; the in-memory value still updates.
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

export function useCollection(name: CollectionName) {
  const seed = seeds[name] as Post[];
  const [items] = useStored<Post[]>(name, seed);
  const current = () => read<Post[]>(name, seed);

  return {
    items,
    add(data: Record<string, Value>, owner: { id: string; name: string }) {
      const post: Post = { ...data, id: uid(), createdAt: Date.now(), ownerId: owner.id, ownerName: owner.name };
      write(name, [post, ...current()]);
      return post;
    },
    update(id: string, patch: Record<string, Value>) {
      write(name, current().map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    remove(id: string) {
      write(name, current().filter((p) => p.id !== id));
    },
  };
}

/** Read a field as display text. */
export const txt = (v: Value) => (Array.isArray(v) ? v.join(', ') : v === undefined ? '' : String(v));
