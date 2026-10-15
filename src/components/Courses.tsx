import { useState } from 'react';
import { Star, Users, Clock, Monitor, Building2, Wifi, ArrowRight, Stethoscope, Atom, Lightbulb, BookMarked, Sparkles } from 'lucide-react';
import { courses } from '@/data/content';
import { SectionHeading } from './SectionHeading';

const categories = ['All', 'NEET', 'JEE', 'Foundation', 'Board', 'Skill'] as const;

const modeIcon: Record<string, typeof Monitor> = { Online: Wifi, Offline: Building2, Hybrid: Monitor };

// Colour + icon per course category.
const look: Record<string, { grad: string; icon: typeof Star; glow: string }> = {
  NEET: { grad: 'from-rose-500 via-pink-500 to-fuchsia-500', icon: Stethoscope, glow: 'shadow-rose-500/30' },
  JEE: { grad: 'from-orange-500 via-amber-500 to-yellow-500', icon: Atom, glow: 'shadow-orange-500/30' },
  Foundation: { grad: 'from-violet-600 via-purple-500 to-indigo-500', icon: Lightbulb, glow: 'shadow-violet-500/30' },
  Board: { grad: 'from-blue-600 via-sky-500 to-cyan-500', icon: BookMarked, glow: 'shadow-blue-500/30' },
  Skill: { grad: 'from-emerald-500 via-teal-500 to-cyan-500', icon: Sparkles, glow: 'shadow-emerald-500/30' },
};

export function Courses() {
  const [filter, setFilter] = useState<typeof categories[number]>('All');
  const filtered = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  return (
    <section id="courses" className="section bg-white">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Exam preparation & skills"
          title="Courses for NEET, JEE, Board & beyond"
          subtitle="Mock tests, daily practice and skill classes in one place."
        />

        <div className="mt-6 sm:mt-8 -mx-5 px-5 sm:mx-0 sm:px-0 flex flex-nowrap sm:flex-wrap sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filter === c
                  ? 'bg-[#0b1f33] text-white shadow-lg'
                  : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div key={filter} className="reveal-stagger rail mt-6 sm:mt-10 md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const ModeIcon = modeIcon[c.mode] ?? Monitor;
            const l = look[c.category];
            const CatIcon = l.icon;
            return (
              <article
                key={c.id}
                className={`group relative flex flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-100 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${l.glow}`}
              >
                {/* Coloured header */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${l.grad} px-5 pt-5 pb-14 text-white`}>
                  <span className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/15" />
                  <span className="pointer-events-none absolute right-10 -bottom-12 h-24 w-24 rounded-full bg-white/10" />
                  <CatIcon className="pointer-events-none absolute right-4 bottom-4 h-16 w-16 text-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                      <CatIcon className="h-3.5 w-3.5" /> {c.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-600 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {c.rating}
                    </span>
                  </div>
                  <h3 className="relative mt-4 font-display text-xl font-extrabold leading-snug">{c.title}</h3>
                  <p className="relative mt-0.5 text-sm text-white/85">{c.level}</p>
                </div>

                {/* Floating stats */}
                <div className="relative -mt-9 mx-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-white py-3 text-center shadow-lg ring-1 ring-slate-100">
                  <div className="px-1">
                    <Clock className="mx-auto h-4 w-4 text-brand-500" />
                    <div className="mt-1 text-[13px] font-bold text-ink-900">{c.duration}</div>
                  </div>
                  <div className="px-1">
                    <ModeIcon className="mx-auto h-4 w-4 text-brand-500" />
                    <div className="mt-1 text-[13px] font-bold text-ink-900">{c.mode}</div>
                  </div>
                  <div className="px-1">
                    <Users className="mx-auto h-4 w-4 text-brand-500" />
                    <div className="mt-1 text-[13px] font-bold text-ink-900">{c.enrolled.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.topics.map((t) => (
                      <span key={t} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-ink-700 ring-1 ring-slate-100">{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Course fee</div>
                      <div className="font-display text-2xl font-black text-ink-900">{c.price}</div>
                    </div>
                    <a
                      href="#/coaching/courses"
                      className={`group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${l.grad} py-1.5 pl-4 pr-1.5 text-sm font-bold text-white shadow-lg ${l.glow}`}
                    >
                      Enroll
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 transition-transform group-hover/btn:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
