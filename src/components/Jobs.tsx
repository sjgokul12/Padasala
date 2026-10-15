import { Briefcase, MapPin, Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { jobs } from '@/data/content';
import { SectionHeading } from './SectionHeading';

export function Jobs() {
  return (
    <section id="jobs" className="section bg-gradient-to-b from-brand-50/40 to-white">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Teacher job portal"
              title="Teachers, find your next school"
              subtitle="Schools post verified vacancies. Teachers apply with one professional profile and track every application in real time."
            />
            <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
              <a href="#register" className="btn-primary px-3 sm:px-5 text-sm sm:text-base">
                <span className="sm:hidden">Teacher profile</span>
                <span className="hidden sm:inline">Create teacher profile</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#register" className="btn-ghost px-3 sm:px-5 text-sm sm:text-base">
                Post a vacancy
              </a>
            </div>
            <div className="mt-5 sm:mt-8 glass rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">Application tracker</div>
              <p className="mt-1.5 text-sm text-ink-700">
                See applied, shortlisted, interview and offer stages — all in one dashboard.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 rail md:block md:space-y-4">
            {jobs.map((j, i) => (
              <article
                key={j.id}
                className="card card-hover p-4 sm:p-6 animate-fadeUp"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.1} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-ink-900">{j.title}</h3>
                      <div className="mt-1 text-sm text-ink-500">{j.school}</div>
                      <div className="mt-2 flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 text-[13px] sm:text-sm text-ink-700">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" /> {j.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-brand-500" /> {j.type}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-500" /> {j.posted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="font-display text-lg font-extrabold text-brand-700">
                      <span className="inline-flex items-center"><IndianRupee className="h-4 w-4" />{j.salary.replace('₹', '')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="chip bg-brand-50 text-brand-700">{j.subject}</span>
                      <span className="chip bg-slate-50 text-ink-700 ring-1 ring-slate-100">{j.experience}</span>
                    </div>
                    <a href="#register" className="btn-primary text-sm w-full sm:w-auto">Apply now</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
