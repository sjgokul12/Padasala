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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon] ?? School;
            return (
              <article
                key={f.title}
                className="card card-hover p-7 animate-fadeUp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{f.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
