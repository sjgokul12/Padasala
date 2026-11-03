import { MapPin, BookOpen, IndianRupee } from 'lucide-react';
import { useCollection, txt } from '@/lib/store';
import { SectionHeading } from './SectionHeading';

const modeStyle: Record<string, string> = {
  Online: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  Offline: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  Home: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
};

export function Tuition() {
  // Newest tuition centres and tutors listed by coaching accounts.
  const tuitions = useCollection('coaching').items.filter((c) => c.category === 'academic').slice(0, 8);

  return (
    <section id="tuition" className="section bg-gradient-to-b from-brand-50/50 via-brand-50/30 to-white">
      <div className="container-page">
        <SectionHeading
          center
          eyebrow="Tuition & skill classes"
          title="Tuition centres, home tutors & skill coaches"
          subtitle="Online, offline and home tuition — plus chess, silambam and yoga."
        />

        {tuitions.length === 0 ? (
          <p className="mt-8 text-center text-sm font-semibold text-ink-500">
            No tuition centres listed yet. <a href="#/coaching/academic" className="text-brand-700">Coaching centres can add theirs here.</a>
          </p>
        ) : (
          <div className="reveal-stagger rail mt-8 sm:mt-12 md:grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tuitions.map((t) => (
              <article key={t.id} className="card card-hover p-5 sm:p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className={`chip ${modeStyle[txt(t.mode)] ?? modeStyle.Offline}`}>{txt(t.mode)}</span>
                  <span className="flex items-center gap-0.5 text-sm font-semibold text-emerald-700">
                    <IndianRupee className="h-3.5 w-3.5" />{Number(t.charges).toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-ink-900 leading-snug">{txt(t.name)}</h3>
                <p className="mt-1 text-sm text-ink-500">{txt(t.providerType)} · {txt(t.experience)} yrs experience</p>

                <div className="mt-3 space-y-1.5 text-sm text-ink-700">
                  <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand-500" /> {txt(t.subjects)}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-500" /> {txt(t.area)}, {txt(t.district)}</div>
                </div>

                {t.classes && <div className="mt-3 mb-5 text-xs font-semibold text-ink-500">{txt(t.classes)}</div>}

                <a href="#/coaching/academic" className="btn-outline text-sm mt-auto w-full">Enquire now</a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
