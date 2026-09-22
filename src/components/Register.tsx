import { useState } from 'react';
import { User, Building2, Briefcase, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

const roles = [
  { id: 'student', label: 'Student / Parent', icon: User, desc: 'Search schools, join courses and track events.' },
  { id: 'school', label: 'School', icon: Building2, desc: 'Post vacancies, events and manage admissions.' },
  { id: 'teacher', label: 'Teacher', icon: Briefcase, desc: 'Apply to schools with one professional profile.' },
  { id: 'tutor', label: 'Tuition / Coach', icon: BookOpen, desc: 'List batches and reach students near you.' },
] as const;

export function Register() {
  const [role, setRole] = useState<typeof roles[number]['id']>('student');
  const [submitted, setSubmitted] = useState(false);
  const active = roles.find((r) => r.id === role)!;

  return (
    <section id="register" className="section bg-gradient-to-b from-white via-brand-50/30 to-brand-50/50">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-4">Join Padasala</span>
            <h2 className="heading text-3xl sm:text-4xl leading-[1.1] text-balance">
              One account for everything education
            </h2>
            <p className="mt-4 text-ink-500 leading-relaxed">
              Pick your role and create a free account. Students discover schools and courses, schools manage admissions and posts, teachers apply for jobs, and tuition centres reach more learners.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isActive = r.id === role;
                return (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setSubmitted(false); }}
                    className={`text-left rounded-2xl p-4 ring-1 transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white ring-brand-600 shadow-glow'
                        : 'bg-white text-ink-700 ring-slate-200 hover:ring-brand-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5" />
                      <span className="font-display font-bold text-sm">{r.label}</span>
                    </div>
                    <p className={`mt-1.5 text-xs ${isActive ? 'text-white/80' : 'text-ink-500'}`}>{r.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-ink-500">
              <CheckCircle2 className="h-5 w-5 text-brand-600" /> Free to join · No credit card required
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass rounded-[2rem] p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">You're on the list!</h3>
                  <p className="mt-2 text-ink-500 max-w-sm mx-auto">
                    Your {active.label.toLowerCase()} account request has been received. Our team will verify and activate your profile shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
                    Submit another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <h3 className="font-display text-xl font-bold text-ink-900 sm:col-span-2">
                    Create your {active.label} account
                  </h3>
                  <div>
                    <label className="label" htmlFor="fname">Full name</label>
                    <input id="fname" required className="input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Phone</label>
                    <input id="phone" required className="input" placeholder="10-digit mobile" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="email">Email</label>
                    <input id="email" type="email" required className="input" placeholder="you@example.com" />
                  </div>
                  {role === 'school' && (
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="schoolname">School name</label>
                      <input id="schoolname" required className="input" placeholder="Official school name" />
                    </div>
                  )}
                  {role === 'teacher' && (
                    <>
                      <div>
                        <label className="label" htmlFor="subject">Primary subject</label>
                        <input id="subject" className="input" placeholder="e.g. Physics" />
                      </div>
                      <div>
                        <label className="label" htmlFor="exp">Experience</label>
                        <input id="exp" className="input" placeholder="e.g. 5 years" />
                      </div>
                    </>
                  )}
                  {role === 'tutor' && (
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="skills">Skills / subjects</label>
                      <input id="skills" className="input" placeholder="Chess, Silambam, Maths..." />
                    </div>
                  )}
                  {role === 'student' && (
                    <div>
                      <label className="label" htmlFor="grade">Class / grade</label>
                      <input id="grade" className="input" placeholder="e.g. Class 11" />
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="city">City</label>
                    <input id="city" required className="input" placeholder="e.g. Coimbatore" />
                  </div>

                  <button type="submit" className="btn-primary sm:col-span-2 mt-2">
                    Create account <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="sm:col-span-2 text-xs text-ink-500 text-center">
                    By continuing you agree to Padasala's Terms & Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
