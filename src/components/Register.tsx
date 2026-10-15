import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { roles, roleOrder, register, useSession, type Role } from '@/lib/auth';
import { navigate } from '@/lib/router';
import { districts } from '@/data/districts';

const signupRoles = roleOrder.filter((r) => r !== 'admin');

export function Register() {
  const [role, setRole] = useState<Role>('student');
  const session = useSession();
  const active = roles[role];

  return (
    <section id="register" className="section bg-gradient-to-b from-white via-brand-50/30 to-brand-50/50">
      <div className="container-page">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-stretch">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-4">Join Padasala</span>
            <h2 className="heading text-[26px] sm:text-4xl leading-[1.15] sm:leading-[1.1] text-balance">
              One account for everything education
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-base text-ink-500 leading-relaxed">
              Pick your role and create a free account in a minute.
            </p>

            <div className="reveal-stagger mt-5 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
              {signupRoles.map((r) => {
                const { label, desc, icon: Icon } = roles[r];
                const isActive = r === role;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-left rounded-2xl p-3 sm:p-4 ring-1 transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white ring-brand-600 shadow-glow'
                        : 'bg-white text-ink-700 ring-slate-200 hover:ring-brand-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="font-display font-bold text-[13px] sm:text-sm leading-tight">{label}</span>
                    </div>
                    <p className={`mt-1.5 text-[11px] sm:text-xs leading-snug ${isActive ? 'text-white/80' : 'text-ink-500'}`}>{desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3 text-sm text-ink-500">
              <CheckCircle2 className="h-5 w-5 text-brand-600" /> Free to join · No credit card required
            </div>
          </div>

          <div className="lg:col-span-7 reveal">
            <div className="glass rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-8">
              {session ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">You're logged in, {session.name}!</h3>
                  <p className="mt-2 text-ink-500 max-w-sm mx-auto">Continue to your {roles[session.role].label.toLowerCase()} dashboard.</p>
                  <a href={`#${roles[session.role].home}`} className="btn-primary mt-6">
                    Open dashboard <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    register({
                      role,
                      name: String(f.get('name')),
                      phone: String(f.get('phone')),
                      email: String(f.get('email') ?? ''),
                      district: String(f.get('district') ?? ''),
                    });
                    navigate(roles[role].home);
                  }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <h3 className="font-display text-xl font-bold text-ink-900 sm:col-span-2">
                    Create your {active.label} account
                  </h3>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="fname">{role === 'student' || role === 'teacher' ? 'Full name' : 'Name of school / centre / company'}</label>
                    <input id="fname" name="name" required className="input" placeholder="Name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">Mobile number</label>
                    <input id="phone" name="phone" required inputMode="numeric" pattern="[0-9 +]{10,14}" className="input" placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="label" htmlFor="rdistrict">District</label>
                    <select id="rdistrict" name="district" required className="input">
                      <option value="">Select…</option>
                      {districts.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="email">Email (optional)</label>
                    <input id="email" name="email" type="email" className="input" placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="rpass">Create password</label>
                    <input id="rpass" type="password" required minLength={6} className="input" />
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
