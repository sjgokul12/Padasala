import { GraduationCap, Home, Building2, BookOpen, CalendarDays, type LucideIcon } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { AndroidIcon } from './ui';

// The Android APK is served from public/downloads. Hide download buttons inside the app itself.
export const APK_URL = '/downloads/padasala.apk';
export const showDownload = !Capacitor.isNativePlatform();

export const coachingLinks = [
  { label: 'Academic', desc: 'Individual tutors & tuition centres', to: '/coaching/academic' },
  { label: 'Extra Curricular', desc: 'Chess, silambam, music, yoga & more', to: '/coaching/extra' },
  { label: 'Courses (NEET & others)', desc: 'NEET, JEE & competitive exams', to: '/coaching/courses' },
];

/** Main navigation — shown in the top navbar (desktop) and in the side drawer (every screen size). */
export const mainNav: { label: string; to: string; icon: LucideIcon; children?: typeof coachingLinks }[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Schools', to: '/schools', icon: Building2 },
  { label: 'Coaching', to: '/coaching', icon: BookOpen, children: coachingLinks },
  { label: 'Student', to: '/students', icon: GraduationCap },
  { label: 'Events', to: '/events', icon: CalendarDays },
];

export const href = (to: string) => `#${to}`;

export function DownloadBadge({ compact }: { compact?: boolean }) {
  if (!showDownload) return null;
  return (
    <a
      href={APK_URL}
      download="Padasala.apk"
      title="Download the Padasala Android app"
      className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f33] via-[#12304d] to-[#0b1f33] py-1.5 pl-1.5 pr-3 text-white shadow-[0_8px_20px_rgba(11,31,51,0.28)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(11,31,51,0.35)]"
    >    
      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#3DDC84]/15 text-[#3DDC84]">
        <AndroidIcon className="h-[18px] w-[18px]" />
      </span>
      {compact ? (
        <span className="text-xs font-bold">Get App</span>
      ) : (
        <span className="text-left leading-none">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-white/60">Download</span>
          <span className="mt-0.5 block text-[13px] font-bold">Android App</span>
        </span>
      )}
      {/* Shine sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </a>
  );
}

export function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2.5 group shrink-0">
      <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white shadow-md shadow-sky-500/25 transition-transform group-hover:scale-105">
        <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1f33]">
        Pada<span className="text-[#0284c7]">sala</span>
      </span>
    </a>
  );
}
