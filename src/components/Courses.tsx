import { useState } from 'react';
import { Star, Users, Clock, Monitor, Building2, Wifi } from 'lucide-react';
import { courses } from '@/data/content';
import { SectionHeading } from './SectionHeading';

const categories = ['All', 'NEET', 'JEE', 'Foundation', 'Board', 'Skill'] as const;

export function Courses() {
  const [filter, setFilter] = useState<typeof categories[number]>('All');
  const filtered = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  const modeIcon: Record<string, typeof Monitor> = {
    Online: Wifi,
    Offline: Building2,
    Hybrid: Monitor,
  };

  return (
    <section id="courses" className="section bg-white">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Exam preparation & skills"
          title="Courses for NEET, JEE, Board & beyond"
          subtitle="Structured batches with mock tests, daily practice and performance analytics — plus skill classes like chess, silambam and spoken English."
        />

        <div className="mt-6 sm:mt-8 -mx-5 px-5 sm:mx-0 sm:px-0 flex flex-nowrap sm:flex-wrap sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filter === c
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div key={filter} className="rail mt-6 sm:mt-10 md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => {
            const ModeIcon = modeIcon[c.mode] ?? Monitor;
            return (
              <article
                key={c.id}
                className="card card-hover p-5 sm:p-6 flex flex-col animate-fadeUp"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="chip bg-brand-600 text-white">{c.category}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {c.rating}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-ink-900 leading-snug">{c.title}</h3>
                <div className="mt-2 text-sm text-ink-500">{c.level}</div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-ink-700">
                    <Clock className="h-4 w-4 text-brand-500" /> {c.duration}
                  </div>
                  <div className="flex items-center gap-2 text-ink-700">
                    <ModeIcon className="h-4 w-4 text-brand-500" /> {c.mode}
                  </div>
                  <div className="flex items-center gap-2 text-ink-700">
                    <Users className="h-4 w-4 text-brand-500" /> {c.enrolled.toLocaleString('en-IN')}
                  </div>
                  <div className="font-display font-bold text-brand-700">{c.price}</div>
                </div>

                <div className="mt-4 mb-5 flex flex-wrap gap-1.5">
                  {c.topics.map((t) => (
                    <span key={t} className="chip bg-slate-50 text-ink-700 ring-1 ring-slate-100">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5 border-t border-slate-100 flex gap-3">
                  <a href="#register" className="btn-primary text-sm flex-1">Enroll now</a>
                  <a href="#courses" className="btn-outline text-sm">Details</a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
