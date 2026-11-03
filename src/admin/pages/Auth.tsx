import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { GraduationCap, ShieldCheck, LogIn, UserPlus, CheckCircle2, Building2, CalendarDays, BookOpen, Smartphone, KeyRound } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { setSession, type AdminUser } from '../lib';
import { CapLogo, BackgroundDecor } from '../illustrations';
import booksCap from '../assets/books-cap.webp';
import { Button, Field, Input, PasswordInput, ErrorNote } from '../ui';

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <BackgroundDecor />
      {/* Brand panel (desktop) */}
      <div className="relative hidden w-[44%] max-w-xl flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1e88e5] via-[#1976d2] to-[#0d47a1] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <img src={booksCap} alt="" className="pointer-events-none absolute -right-6 bottom-16 w-56 opacity-95 drop-shadow-2xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-14 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg">
            <CapLogo className="h-full w-full" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-2xl font-extrabold">Padasala <span className="font-semibold text-blue-100">Admin</span></span>
            <span className="block text-xs text-blue-100">Learn • Grow • Excel</span>
          </span>
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl font-extrabold leading-tight">Review and manage everything listed on Padasala.</h2>
          <ul className="mt-8 space-y-4 text-sm text-white/80">
            {[
              [Building2, 'Approve schools before they appear publicly'],
              [BookOpen, 'Verify coaching centres, teachers and vendors'],
              [CalendarDays, 'Check events before students see them'],
              [ShieldCheck, 'Block accounts that misuse the platform'],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Building2;
              return (
                <li key={text as string} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><I className="h-4 w-4 text-white" /></span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="relative text-xs text-blue-100/80">Restricted area · authorised Padasala staff only</p>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white">
              <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl font-extrabold text-[#0b1f33]">Pada<span className="text-[#0284c7]">sala</span> <span className="font-semibold text-slate-400">Admin</span></span>
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-slate-400">
            <a href="/" className="font-semibold hover:text-slate-600">← Back to padasala website</a>
          </p>
        </div>
      </div>
    </div>
  );
}

type Errors = Record<string, string>;

function useSubmit() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Errors>({});
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setFields({});
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      if (e instanceof ApiError) setFields(e.fields);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, fields, run };
}

/** Password rules shown under the new-password field (same as the server's admin rules). */
export function passwordProblem(p: string): string | null {
  if (p.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return 'Password must contain both letters and numbers, e.g. Padasala2026.';
  return null;
}

/**
 * "Forgot password": send an OTP to the admin's saved mobile, then set a new password with it.
 * With `username` given (Settings page) the username step is skipped.
 */
export function ForgotPasswordFlow({ username: fixedUsername, onDone, onCancel }: { username?: string; onDone: () => void; onCancel?: () => void }) {
  const { busy, error, fields, run } = useSubmit();
  const [username, setUsername] = useState(fixedUsername ?? '');
  const [sent, setSent] = useState<{ hint: string; devOtp?: string } | null>(null);
  const [wait, setWait] = useState(0);
  const [otp, setOtp] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  const send = () =>
    run(async () => {
      const r = await api<{ phone_hint: string; resend_in: number; dev_otp?: string }>('/api/admin/password-reset.php?action=send', {
        method: 'POST',
        body: { username },
      });
      setSent({ hint: r.phone_hint, devOtp: r.dev_otp });
      setWait(r.resend_in);
    });

  const reset = (e: FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(next) ?? (next !== confirm ? 'Passwords do not match.' : null);
    setLocalError(problem ?? '');
    if (problem) return;
    run(async () => {
      await api('/api/admin/password-reset.php?action=reset', { method: 'POST', body: { username, otp, new_password: next } });
      onDone();
    });
  };

  if (!sent) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="space-y-4">
        <p className="text-sm text-slate-600">We'll send a 6-digit OTP to the mobile number saved for {fixedUsername ? 'your admin account' : 'this admin'}.</p>
        {!fixedUsername && (
          <Field label="Username" htmlFor="fp-username" error={fields.username}>
            <Input id="fp-username" required autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          </Field>
        )}
        {error && !fields.username && <ErrorNote text={error} />}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" busy={busy}><Smartphone className="h-4 w-4" /> Send OTP</Button>
          {onCancel && <Button tone="ghost" onClick={onCancel}>Cancel</Button>}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={reset} className="space-y-4">
      <p className="text-sm text-slate-600">OTP sent to <b className="text-slate-900">{sent.hint}</b>. It works for 5 minutes.</p>
      {sent.devOtp && (
        <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
          Test mode — no SMS is sent yet. Your OTP is <b className="font-mono">{sent.devOtp}</b>
        </p>
      )}
      <Field label="OTP" htmlFor="fp-otp" error={fields.otp}>
        <Input id="fp-otp" required inputMode="numeric" autoComplete="one-time-code" maxLength={8} autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit OTP" />
      </Field>
      <Field label="New password" htmlFor="fp-new" error={fields.new_password} hint="At least 8 characters, with letters and numbers.">
        <PasswordInput id="fp-new" required autoComplete="new-password" value={next} onChange={(e) => { setNext(e.target.value); setLocalError(''); }} />
      </Field>
      <Field label="Confirm new password" htmlFor="fp-confirm">
        <PasswordInput id="fp-confirm" required autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setLocalError(''); }} />
      </Field>
      {(localError || (error && !fields.otp && !fields.new_password)) && <ErrorNote text={localError || error} />}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" busy={busy}><KeyRound className="h-4 w-4" /> Set new password</Button>
        <button type="button" disabled={wait > 0 || busy} onClick={send} className="text-sm font-semibold text-[#1565c0] disabled:text-slate-400">
          {wait > 0 ? `Resend OTP in ${wait}s` : 'Resend OTP'}
        </button>
      </div>
    </form>
  );
}

export function LoginScreen() {
  const { busy, error, fields, run } = useSubmit();
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset-done'>('login');

  if (mode === 'forgot') {
    return (
      <AuthLayout>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">Forgot password</h1>
        <div className="mt-6">
          <ForgotPasswordFlow onDone={() => setMode('reset-done')} onCancel={() => setMode('login')} />
        </div>
      </AuthLayout>
    );
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      const { user, token } = await api<{ user: AdminUser; token: string }>('/api/admin/login.php', {
        method: 'POST',
        body: { username: f.get('username'), password: f.get('password') },
      });
      setSession({ user, token });
    });
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-extrabold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Use your Padasala admin username and password.</p>
      {mode === 'reset-done' && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 className="h-4 w-4" /> Password changed. Sign in with your new password.
        </p>
      )}
      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Username" htmlFor="username" error={fields.username}>
          <Input id="username" name="username" required autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus placeholder="admin" />
        </Field>
        <Field label="Password" htmlFor="password" error={fields.password}>
          <PasswordInput id="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
        </Field>
        <div className="-mt-1 text-right">
          <button type="button" onClick={() => setMode('forgot')} className="text-sm font-semibold text-[#1565c0] hover:underline">Forgot password?</button>
        </div>
        {error && !Object.keys(fields).length && <ErrorNote text={error} />}
        <Button type="submit" busy={busy} className="w-full py-3">
          <LogIn className="h-4 w-4" /> Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export function SetupScreen({ keyRequired }: { keyRequired: boolean }) {
  const { busy, error, fields, run } = useSubmit();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm !== '' && confirm !== password;
  const rules = [
    { ok: password.length >= 8, text: 'At least 8 characters' },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), text: 'Letters and numbers' },
  ];

  const [ruleError, setRuleError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const broken = rules.find((r) => !r.ok);
    if (broken) {
      setRuleError(broken.text === 'Letters and numbers'
        ? 'Password must contain both letters and numbers, e.g. Padasala2026.'
        : 'Password must be at least 8 characters.');
      return;
    }
    setRuleError('');
    if (mismatch) return;
    const f = new FormData(e.currentTarget);
    run(async () => {
      const { user, token } = await api<{ user: AdminUser; token: string }>('/api/admin/setup.php', {
        method: 'POST',
        body: { name: f.get('name'), username: f.get('username'), phone: f.get('phone'), email: f.get('email'), password, setup_key: f.get('setup_key') ?? '' },
      });
      setSession({ user, token });
    });
  };

  return (
    <AuthLayout>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#0284c7] ring-1 ring-sky-100">
        <ShieldCheck className="h-3.5 w-3.5" /> First-time setup
      </span>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-slate-900">Create the admin account</h1>
      <p className="mt-1 text-sm text-slate-500">This page works only once. After this, everyone signs in with a username and password.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Your name" htmlFor="name" error={fields.name}>
          <Input id="name" name="name" required autoComplete="name" placeholder="Padasala Admin" />
        </Field>
        <Field label="Username" htmlFor="username" error={fields.username} hint="Lowercase letters, numbers, dot, dash or underscore.">
          <Input id="username" name="username" required autoComplete="username" autoCapitalize="none" spellCheck={false} pattern="[A-Za-z0-9][A-Za-z0-9._\-]{2,39}" placeholder="admin" />
        </Field>
        <Field label="Mobile number" htmlFor="phone" error={fields.phone} hint="If you forget the password, an OTP is sent here.">
          <Input id="phone" name="phone" required inputMode="numeric" autoComplete="tel" pattern="[0-9 +]{10,14}" placeholder="10-digit mobile" />
        </Field>
        <Field label={<>Email <span className="font-normal text-slate-400">(optional)</span></>} htmlFor="email" error={fields.email}>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@padasala.net" />
        </Field>
        <Field label="Password" htmlFor="password" error={ruleError || fields.password}>
          <PasswordInput id="password" required autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setRuleError(''); }} />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {rules.map((r) => (
              <span key={r.text} className={`inline-flex items-center gap-1 text-xs font-medium ${r.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {r.text}
              </span>
            ))}
          </div>
        </Field>
        <Field label="Confirm password" htmlFor="confirm" error={mismatch ? 'Passwords do not match.' : undefined}>
          <PasswordInput id="confirm" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {keyRequired && (
          <Field label="Setup key" htmlFor="setup_key" error={fields.setup_key} hint="Given to you with the server details (admin_setup_key in config.php).">
            <Input id="setup_key" name="setup_key" required autoComplete="off" spellCheck={false} />
          </Field>
        )}
        {error && !Object.keys(fields).length && <ErrorNote text={error} />}
        <Button type="submit" busy={busy} className="w-full py-3">
          <UserPlus className="h-4 w-4" /> Create admin account
        </Button>
      </form>
    </AuthLayout>
  );
}
