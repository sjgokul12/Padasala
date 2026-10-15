import {
  School, GraduationCap, Briefcase, BookOpen, CalendarDays, ClipboardCheck,
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

export function Features() {
  return (
    <section className="section bg-gradient-to-b from-white via-brand-50/30 to-brand-50/50">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Everything in one platform"
          title="Built for every part of school life"
          subtitle="From school discovery to admissions, exam preparation to teacher hiring and events — Padasala brings the whole education community together."
        />

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] ?? School;
            return (
              <article
                key={f.title}
                className="card card-hover rounded-2xl sm:rounded-3xl p-4 sm:p-7 animate-fadeUp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                </div>
                <h3 className="mt-3 sm:mt-5 font-display text-[15px] sm:text-xl font-bold leading-snug text-ink-900">{f.title}</h3>
                <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm leading-relaxed text-ink-500 line-clamp-3 sm:line-clamp-none">{f.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
