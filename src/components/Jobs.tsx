import { Briefcase, MapPin, Clock, IndianRupee, ArrowRight, UserRound, Plus } from 'lucide-react';
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
              subtitle="Verified vacancies, one profile, every application tracked."
            />
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <a
                href="#/teachers"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-gradient-to-r from-[#0062f5] via-[#2563eb] to-[#7c3aed] py-1.5 pl-5 pr-1.5 font-bold text-white shadow-[0_14px_30px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(124,58,237,0.7)]"
              >
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-[18px] w-[18px]" /> Create teacher profile
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2563eb] transition-transform group-hover:translate-x-0.5 group-hover:rotate-[-20deg]">
                  <ArrowRight className="h-[18px] w-[18px]" />
                </span>
              </a>
              <a
                href="#/schools/dashboard"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-white/80 py-1.5 pl-1.5 pr-5 font-bold text-[#0b1f33] ring-1 ring-sky-200 backdrop-blur transition-all hover:-translate-y-0.5 hover:ring-sky-400 hover:shadow-[0_12px_26px_-12px_rgba(2,132,199,0.5)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-50 text-[#0284c7] transition-transform group-hover:rotate-90">
                  <Plus className="h-5 w-5" strokeWidth={2.6} />
                </span>
                <span className="flex-1 text-left sm:flex-none">Post a vacancy</span>
                <ArrowRight className="h-4 w-4 text-[#0284c7] opacity-60 transition group-hover:opacity-100" />
              </a>
            </div>
            <div className="mt-5 sm:mt-8 glass rounded-2xl p-4 sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-600">Application tracker</div>
              <p className="mt-1.5 text-sm text-ink-700">
                Applied, shortlisted, interview, offer — all in one place.
              </p>
            </div>
          </div>

          <div className="reveal-stagger lg:col-span-8 rail md:block md:space-y-4">
            {jobs.map((j) => (
              <article
                key={j.id}
                className="card card-hover p-4 sm:p-6"
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
                    <a href="#/teachers" className="btn-primary text-sm w-full sm:w-auto">Apply now</a>
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
