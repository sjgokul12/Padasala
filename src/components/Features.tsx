import {
  School, GraduationCap, Briefcase, BookOpen, CalendarDays, ClipboardCheck, ArrowUpRight,
} from 'lucide-react';
import { features } from '@/data/content';
import { SectionHeading } from './SectionHeading';

const iconMap: Record<string, typeof School> = {
  School,
  GraduationCap,
  Briefcase,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
};

// One colour family per card.
const tones = [
  { card: 'from-sky-100 via-sky-50 to-white ring-sky-200/70', icon: 'from-sky-400 to-blue-600 shadow-sky-500/40', blob: 'bg-sky-300/50', title: 'group-hover:text-sky-700', arrow: 'text-sky-600 bg-sky-100' },
  { card: 'from-violet-100 via-violet-50 to-white ring-violet-200/70', icon: 'from-violet-400 to-purple-600 shadow-violet-500/40', blob: 'bg-violet-300/50', title: 'group-hover:text-violet-700', arrow: 'text-violet-600 bg-violet-100' },
  { card: 'from-emerald-100 via-emerald-50 to-white ring-emerald-200/70', icon: 'from-emerald-400 to-green-600 shadow-emerald-500/40', blob: 'bg-emerald-300/50', title: 'group-hover:text-emerald-700', arrow: 'text-emerald-600 bg-emerald-100' },
  { card: 'from-amber-100 via-amber-50 to-white ring-amber-200/70', icon: 'from-amber-400 to-orange-600 shadow-amber-500/40', blob: 'bg-amber-300/50', title: 'group-hover:text-amber-700', arrow: 'text-amber-600 bg-amber-100' },
  { card: 'from-rose-100 via-rose-50 to-white ring-rose-200/70', icon: 'from-rose-400 to-pink-600 shadow-rose-500/40', blob: 'bg-rose-300/50', title: 'group-hover:text-rose-700', arrow: 'text-rose-600 bg-rose-100' },
  { card: 'from-indigo-100 via-indigo-50 to-white ring-indigo-200/70', icon: 'from-indigo-400 to-blue-700 shadow-indigo-500/40', blob: 'bg-indigo-300/50', title: 'group-hover:text-indigo-700', arrow: 'text-indigo-600 bg-indigo-100' },
];

// Where each card leads.
const links = ['#/schools', '#/students', '#/teachers', '#/coaching/academic', '#/events', '#/schools/updates'];

export function Features() {
  return (
    <section className="section bg-gradient-to-b from-white via-brand-50/30 to-brand-50/50">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Everything in one platform"
          title="Built for every part of school life"
          subtitle="Schools, exams, teachers and events — together in one place."
        />

        <div className="reveal-stagger mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] ?? School;
            const t = tones[i % tones.length];
            return (
              <a
                key={f.title}
                href={links[i]}
                className={`group relative overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-br ${t.card} ring-1 p-4 sm:p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-18px_rgba(15,23,42,0.35)]`}
              >
                <span className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full ${t.blob} blur-2xl transition-transform duration-500 group-hover:scale-125`} />
                <div className="relative flex items-start justify-between">
                  <div className={`flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${t.icon} text-white shadow-lg`}>
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.1} />
                  </div>
                  <span className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-full ${t.arrow} opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className={`relative mt-3 sm:mt-5 font-display text-[15px] sm:text-xl font-bold leading-snug text-ink-900 transition-colors ${t.title}`}>{f.title}</h3>
                <p className="relative mt-1.5 sm:mt-2.5 text-xs sm:text-sm leading-relaxed text-ink-500 line-clamp-2">{f.desc}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
