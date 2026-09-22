import { Star, MapPin, BookOpen } from 'lucide-react';
import { tuitions } from '@/data/content';
import { SectionHeading } from './SectionHeading';

const modeStyle: Record<string, string> = {
  Online: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  Offline: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  Home: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
};

export function Tuition() {
  return (
    <section id="tuition" className="section bg-gradient-to-b from-brand-50/50 via-brand-50/30 to-white">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Tuition & skill classes"
          title="Tuition centres, home tutors & skill coaches"
          subtitle="Find online, offline and home tuition for academics plus skill classes in chess, silambam, yoga and spoken English."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tuitions.map((t, i) => (
            <article
              key={t.id}
              className="card card-hover p-6 flex flex-col animate-fadeUp"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className={`chip ${modeStyle[t.mode]}`}>{t.mode}</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {t.rating}
                </span>
              </div>

              <h3 className="mt-4 font-display text-base font-bold text-ink-900 leading-snug">{t.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{t.tutor}</p>

              <div className="mt-3 space-y-1.5 text-sm text-ink-700">
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand-500" /> {t.subject}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-500" /> {t.location}</div>
              </div>

              <div className="mt-3 text-xs font-semibold text-ink-500">{t.level}</div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <span key={s} className="chip bg-slate-50 text-ink-700 ring-1 ring-slate-100">{s}</span>
                ))}
              </div>

              <a href="#register" className="btn-outline text-sm mt-5 w-full">Enquire now</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
