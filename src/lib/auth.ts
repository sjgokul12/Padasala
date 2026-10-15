import {
  User, Building2, BookOpen, Briefcase, Truck, CalendarDays, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import { useStored, getStored, setStored, uid, type Post } from './store';
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

export const roleOrder: Role[] = ['student', 'school', 'coaching', 'teacher', 'vendor', 'organizer', 'admin'];

export interface Session {
  id: string;
  role: Role;
  name: string;
}

export const useSession = () => useStored<Session | null>('session', null)[0];

const users = () => getStored<Post[]>('users', seeds.users as Post[]);

/** Demo login: matches a registered account by role + mobile number (no password check until a backend exists). */
export function login(role: Role, phone: string): Session | null {
  const user = users().find((u) => u.role === role && u.phone === phone.replace(/\D/g, ''));
  if (!user) return null;
  const session = { id: user.id, role, name: String(user.name) };
  setStored('session', session);
  return session;
}

export function loginDemo(role: Role): Session {
  const user = users().find((u) => u.role === role && String(u.id).startsWith('demo-'))!;
  const session = { id: user.id, role, name: String(user.name) };
  setStored('session', session);
  return session;
}

export function register(data: { role: Role; name: string; phone: string; email?: string; district?: string }): Session {
  const phone = data.phone.replace(/\D/g, '');
  const existing = users().find((u) => u.role === data.role && u.phone === phone);
  const id = existing?.id ?? uid();
  if (!existing) {
    const user: Post = { ...data, phone, id, createdAt: Date.now(), ownerId: id, ownerName: data.name };
    setStored('users', [user, ...users()]);
  }
  const session = { id, role: data.role, name: existing ? String(existing.name) : data.name };
  setStored('session', session);
  return session;
}

export const logout = () => setStored('session', null);

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
