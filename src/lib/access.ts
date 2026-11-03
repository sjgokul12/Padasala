import type { Role } from './auth';

/**
 * Who can see whose content — the Padasala visibility chart.
 *
 *              School  Coaching  Student  Teacher  Event org.  Vendor
 * Schools       yes      yes       yes      yes       yes        yes
 * Coaching      yes      yes       yes      yes       yes        yes
 * Students      — no student profile is visible to anyone else —
 * Teachers      yes      no        no       no        no         no
 * Events        yes      yes       yes      yes       yes        yes
 * Vendors       yes      no        no       no        no         no
 *
 * Extra rule from the coaching requirement: students' tuition requests are visible to coaching centres.
 * The Padasala admin can see everything for moderation.
 */
export type ContentKind = 'school' | 'coaching' | 'student' | 'teacher' | 'event' | 'vendor' | 'tuitionRequest';

const EVERYONE = 'everyone' as const;

const viewers: Record<ContentKind, Role[] | typeof EVERYONE> = {
  school: EVERYONE,
  coaching: EVERYONE,
  event: EVERYONE,
  student: [], // only the student themself
  teacher: ['school'],
  vendor: ['school'],
  tuitionRequest: ['coaching'],
};

/** Roles allowed to view a kind of content (for RequireRole). Admin is always included. */
export function viewersOf(kind: ContentKind): Role[] {
  const v = viewers[kind];
  return v === EVERYONE ? ['student', 'school', 'coaching', 'teacher', 'vendor', 'organizer', 'admin'] : [...v, 'admin'];
}

/** Only the logged-in account that posted something can edit or delete it. */
export function canManage(post: { ownerId: string }, session: { id: string; role: Role } | null): boolean {
  return !!session && session.id === post.ownerId;
}

export function canSee(kind: ContentKind, role: Role | undefined, isOwner = false): boolean {
  if (isOwner) return true;
  const v = viewers[kind];
  if (v === EVERYONE) return true;
  return !!role && (role === 'admin' || v.includes(role));
}
