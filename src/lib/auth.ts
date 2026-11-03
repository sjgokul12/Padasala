import {
  User, Building2, BookOpen, Briefcase, Truck, CalendarDays, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import { useStored, getStored, setStored, uid, type Post } from './store';
import { api, ApiError, backendEnabled } from './api';
import { seeds } from '@/data/seed';

export type Role = 'student' | 'school' | 'coaching' | 'teacher' | 'vendor' | 'organizer' | 'admin';

export const roles: Record<Role, { label: string; desc: string; icon: LucideIcon; home: string }> = {
  student: { label: 'Student / Parent', desc: 'Mock tests & tuition requirements', icon: User, home: '/students' },
  school: { label: 'School', desc: 'School profile, posts, teachers & vendors', icon: Building2, home: '/schools/dashboard' },
  coaching: { label: 'Coaching Centre', desc: 'Tuition, skill classes & courses', icon: BookOpen, home: '/coaching/academic' },
  teacher: { label: 'Teacher', desc: 'Post your job requirement', icon: Briefcase, home: '/teachers' },
  vendor: { label: 'Vendor', desc: 'Company details & school requirements', icon: Truck, home: '/vendors' },
  organizer: { label: 'Event Organizer', desc: 'Post events for students', icon: CalendarDays, home: '/events' },
  admin: { label: 'Padasala Admin', desc: 'Question bank & moderation', icon: ShieldCheck, home: '/admin' },
};

/** Account types on the public Login / Register screens. The admin signs in on the separate admin panel (/admin/). */
export const roleOrder: Role[] = ['student', 'school', 'coaching', 'teacher', 'vendor', 'organizer'];

export interface Session {
  id: string;
  role: Role;
  name: string;
  /** Backend login token (only when the PHP backend is connected). */
  token?: string;
}

export const useSession = () => useStored<Session | null>('session', null)[0];
/** Login token for backend requests (undefined when logged out or in demo mode). */
export const getToken = () => getStored<Session | null>('session', null)?.token;

export interface RegisterData {
  role: Role;
  name: string;
  phone: string;
  password: string;
  /** The OTP sent to the mobile number (see requestOtp). */
  otp: string;
  email?: string;
  district?: string;
}

export type OtpPurpose = 'register' | 'login';

export interface OtpSent {
  /** Seconds before another OTP can be requested. */
  resendIn: number;
  /** Shown on screen only in development / demo mode (no SMS is sent there). */
  devCode?: string;
}

// Demo mode (no backend): OTPs are simulated on the device.
const demoOtps = new Map<string, string>();
const demoKey = (purpose: OtpPurpose, role: Role, phone: string) => `${purpose}:${role}:${phone.replace(/\D/g, '').slice(-10)}`;

/** Send an OTP to a mobile number. Throws an Error with a message to show (e.g. already registered). */
export async function requestOtp(purpose: OtpPurpose, role: Role, phone: string): Promise<OtpSent> {
  if (backendEnabled) {
    const r = await api<{ resend_in: number; dev_otp?: string }>('/api/auth/otp-send.php', {
      method: 'POST',
      body: { purpose, role, phone },
    });
    return { resendIn: r.resend_in, devCode: r.dev_otp };
  }

  const digits = phone.replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(digits)) throw new Error('Enter a valid 10-digit mobile number.');
  const exists = users().some((u) => u.role === role && u.phone === digits);
  if (purpose === 'register' && exists) throw new Error('An account of this type already exists for this mobile number. Please log in.');
  if (purpose === 'login' && !exists) throw new Error('No account of this type found for this mobile number. Please register first.');
  const code = String(Math.floor(100000 + Math.random() * 900000));
  demoOtps.set(demoKey(purpose, role, digits), code);
  return { resendIn: 30, devCode: code };
}

function checkDemoOtp(purpose: OtpPurpose, role: Role, phone: string, otp: string) {
  const key = demoKey(purpose, role, phone);
  if (!otp || demoOtps.get(key) !== otp.trim()) throw new Error('Wrong OTP. Please check and try again.');
  demoOtps.delete(key);
}

/** Log in with an OTP instead of a password. */
export async function loginWithOtp(role: Role, phone: string, otp: string): Promise<Session> {
  if (backendEnabled) {
    const { user, token } = await api<{ user: BackendUser; token: string }>('/api/auth/login-otp.php', {
      method: 'POST',
      body: { role, phone, otp },
    });
    const session = fromBackend(user, token);
    setStored('session', session);
    return session;
  }
  checkDemoOtp('login', role, phone, otp);
  const user = users().find((u) => u.role === role && u.phone === phone.replace(/\D/g, '').slice(-10))!;
  const session = { id: user.id, role, name: String(user.name) };
  setStored('session', session);
  return session;
}

interface BackendUser {
  id: number;
  role: Role;
  name: string;
}

const fromBackend = (user: BackendUser, token: string): Session => ({ id: `u${user.id}`, role: user.role, name: user.name, token });

const users = () => getStored<Post[]>('users', seeds.users as Post[]);

/**
 * Log in with account type + mobile + password.
 * With the backend: checked by the server (wrong password → error). Demo mode: matched on this device only.
 * Throws an Error with a message to show the user.
 */
export async function login(role: Role, phone: string, password: string): Promise<Session> {
  if (backendEnabled) {
    const { user, token } = await api<{ user: BackendUser; token: string }>('/api/auth/login.php', {
      method: 'POST',
      body: { role, phone, password },
    });
    const session = fromBackend(user, token);
    setStored('session', session);
    return session;
  }

  const user = users().find((u) => u.role === role && u.phone === phone.replace(/\D/g, ''));
  if (!user) throw new Error(`No ${roles[role].label} account found for this mobile number. Register first, or try the demo account.`);
  const session = { id: user.id, role, name: String(user.name) };
  setStored('session', session);
  return session;
}

/** Demo accounts exist only in demo mode (no backend). */
export const demoAccountsAvailable = !backendEnabled;

export function loginDemo(role: Role): Session {
  const user = users().find((u) => u.role === role && String(u.id).startsWith('demo-'))!;
  const session = { id: user.id, role, name: String(user.name) };
  setStored('session', session);
  return session;
}

/** Create an account and log in. Throws an Error with a message to show the user. */
export async function register(data: RegisterData): Promise<Session> {
  if (backendEnabled) {
    const { user, token } = await api<{ user: BackendUser; token: string }>('/api/auth/register.php', {
      method: 'POST',
      body: data,
    });
    const session = fromBackend(user, token);
    setStored('session', session);
    return session;
  }

  checkDemoOtp('register', data.role, data.phone, data.otp);
  const { password: _password, otp: _otp, ...profile } = data;
  void _password; // demo mode keeps no passwords
  void _otp;
  const phone = profile.phone.replace(/\D/g, '');
  const existing = users().find((u) => u.role === profile.role && u.phone === phone);
  const id = existing?.id ?? uid();
  if (!existing) {
    const user: Post = { ...profile, phone, id, createdAt: Date.now(), ownerId: id, ownerName: profile.name };
    setStored('users', [user, ...users()]);
  }
  const session = { id, role: profile.role, name: existing ? String(existing.name) : profile.name };
  setStored('session', session);
  return session;
}

export function logout() {
  const session = getStored<Session | null>('session', null);
  setStored('session', null);
  if (backendEnabled && session?.token) {
    api('/api/auth/logout.php', { method: 'POST', token: session.token }).catch(() => {
      // Already logged out locally; the server token will expire on its own.
    });
  }
}

/**
 * On app start: confirm the saved login with the server. An expired or logged-out token clears the session;
 * a network problem keeps it (so the app still opens offline).
 */
export async function verifySession(): Promise<void> {
  const session = getStored<Session | null>('session', null);
  if (!backendEnabled || !session) return;
  if (!session.token) {
    setStored('session', null); // demo-mode login left over from before the backend was connected
    return;
  }
  try {
    const { user } = await api<{ user: BackendUser }>('/api/auth/me.php', { token: session.token });
    setStored('session', fromBackend(user, session.token));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) setStored('session', null);
  }
}

// Login dialog state (in-memory).
export interface LoginUi {
  open: boolean;
  role: Role;
  mode: 'login' | 'register';
}

const closedUi: LoginUi = { open: false, role: 'student', mode: 'login' };

export const useLoginUi = () => useStored<LoginUi>('ui:login', closedUi)[0];
export const openLogin = (role: Role = 'student', mode: LoginUi['mode'] = 'login') =>
  setStored<LoginUi>('ui:login', { open: true, role, mode });
export const closeLogin = () => setStored<LoginUi>('ui:login', { ...getStored('ui:login', closedUi), open: false });
