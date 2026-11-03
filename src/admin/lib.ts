import { useSyncExternalStore } from 'react';
import { api, ApiError } from '@/lib/api';

/* ---------- Admin session (separate from the public website login) ---------- */

export interface AdminUser {
  id: number;
  role: 'admin';
  name: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  last_login_at: string | null;
}

interface Session {
  token: string;
  user: AdminUser;
}

const KEY = 'padasala:admin-session';
const listeners = new Set<() => void>();

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

let current: Session | null = readSession();

export function setSession(next: Session | null) {
  current = next;
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the session still works until the tab closes.
  }
  listeners.forEach((l) => l());
}

export const useAdminSession = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );

export const updateUser = (user: AdminUser) => current && setSession({ ...current, user });

/** Call the backend as the signed-in admin. A 401 (expired / signed out elsewhere) returns to the sign-in screen. */
export async function adminApi<T>(path: string, options: { method?: 'GET' | 'POST'; body?: unknown } = {}): Promise<T> {
  try {
    return await api<T>(path, { ...options, token: current?.token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401 && current) setSession(null);
    throw e;
  }
}

export async function signOut() {
  const token = current?.token;
  setSession(null);
  if (token) api('/api/auth/logout.php', { method: 'POST', token }).catch(() => undefined);
}

/* ---------- Toasts ---------- */

export interface Toast {
  id: number;
  text: string;
  tone: 'success' | 'error';
}

let toasts: Toast[] = [];
const toastListeners = new Set<() => void>();
const emitToasts = () => toastListeners.forEach((l) => l());

export function toast(text: string, tone: Toast['tone'] = 'success') {
  const id = Date.now() + Math.random();
  toasts = [...toasts, { id, text, tone }];
  emitToasts();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emitToasts();
  }, 3800);
}

export const useToasts = () =>
  useSyncExternalStore(
    (cb) => {
      toastListeners.add(cb);
      return () => toastListeners.delete(cb);
    },
    () => toasts,
  );

export const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');

/* ---------- Listing types ---------- */

export type ListingType = 'schoolProfiles' | 'coaching' | 'events' | 'teacherProfiles' | 'vendors';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export const listingTypes: Record<ListingType, { label: string; singular: string; slug: string }> = {
  schoolProfiles: { label: 'Schools', singular: 'school', slug: 'schools' },
  coaching: { label: 'Coaching', singular: 'coaching centre', slug: 'coaching' },
  events: { label: 'Events', singular: 'event', slug: 'events' },
  teacherProfiles: { label: 'Teachers', singular: 'teacher profile', slug: 'teachers' },
  vendors: { label: 'Vendors', singular: 'vendor', slug: 'vendors' },
};

export const typeBySlug = (slug: string) =>
  (Object.keys(listingTypes) as ListingType[]).find((t) => listingTypes[t].slug === slug);

export type Item = Record<string, unknown> & {
  id: string;
  ownerName: string;
  ownerPhone?: string | null;
  status: ReviewStatus;
  reviewNote?: string | null;
  createdAt: number;
  updatedAt: number;
};

export interface FieldMeta {
  name: string;
  type: string;
  required: boolean;
  max?: number;
  min?: number;
  values?: string[];
}

export const str = (v: unknown) => (v === undefined || v === null ? '' : Array.isArray(v) ? v.join(', ') : String(v));

/** Main line shown for a listing. */
export const itemTitle = (item: Item) => str(item.name ?? item.title ?? item.company) || `#${item.id}`;

/** Second line shown for a listing, by type. */
export function itemSubtitle(type: ListingType, item: Item): string {
  const parts: Record<ListingType, unknown[]> = {
    schoolProfiles: [item.board, item.grades],
    coaching: [{ academic: 'Academic', extra: 'Extra curricular', courses: 'Courses' }[str(item.category)] ?? item.category, item.providerType],
    events: [item.category, item.date ? formatDate(str(item.date)) : '', item.venue],
    teacherProfiles: [item.qualification, item.subjects],
    vendors: [item.category, item.services],
  };
  return parts[type].map(str).filter(Boolean).join(' · ');
}

export const itemImage = (item: Item) => str(item.image ?? item.photo) || null;

export const itemDistrict = (item: Item) => str(item.district ?? item.districts ?? item.locations);

/** "providerType" → "Provider type". */
export const humanize = (name: string) =>
  ({ registerLink: 'Registration link', whatsapp: 'WhatsApp number', expectedSalary: 'Expected salary', classLevel: 'Class' } as Record<string, string>)[name] ??
  name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).replace(/ ([A-Z])/g, (_, c: string) => ` ${c.toLowerCase()}`);

export function formatDate(value: string | number | null | undefined, withTime = false): string {
  if (value === null || value === undefined || value === '') return '—';
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-IN', withTime
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(value: string | number | null | undefined): string {
  if (!value) return 'never';
  const t = typeof value === 'number' ? value : new Date(String(value).replace(' ', 'T')).getTime();
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
  return formatDate(t);
}

export const roleLabels: Record<string, string> = {
  school: 'School',
  coaching: 'Coaching centre',
  teacher: 'Teacher',
  vendor: 'Vendor',
  organizer: 'Event organizer',
};
