import { useEffect, useState, type ReactNode } from 'react';
import { X, Lock, CheckCircle2, Inbox, Send, type LucideIcon } from 'lucide-react';
import { useSession, openLogin, roles, type Role } from '@/lib/auth';
import { useCollection, type Value } from '@/lib/store';

/* ---------- Page banner ---------- */

export function PageHero({
  eyebrow, title, subtitle, icon: Icon, children,
}: { eyebrow: string; title: ReactNode; subtitle?: ReactNode; icon: LucideIcon; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#cae8ff] via-[#e6f4ff] to-white pt-[88px] sm:pt-32 pb-6 sm:pb-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-white/70 blur-3xl rounded-full" aria-hidden />
      <div className="container-page relative reveal">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-sky-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0284c7] shadow-sm">
          <Icon className="h-3.5 w-3.5" /> {eyebrow}
        </span>
        <h1 className="mt-2.5 sm:mt-3 font-display text-[26px] sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0b1f33] leading-[1.15] sm:leading-tight text-balance">
          {title}
        </h1>
        {subtitle && <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-lg text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-none">{subtitle}</p>}
        {children && <div className="mt-4 sm:mt-5 flex flex-wrap gap-2.5">{children}</div>}
      </div>
    </section>
  );
}

/* ---------- Tabs ---------- */

export interface TabDef<T extends string> {
  id: T;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export function Tabs<T extends string>({ tabs, active, onChange }: { tabs: TabDef<T>[]; active: T; onChange: (id: T) => void }) {
  return (
    <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar" role="tablist">
      {tabs.map(({ id, label, icon: Icon, count }) => {
        const on = id === active;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(id)}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm font-bold transition-all ${
              on
                ? 'bg-gradient-to-r from-[#009bf8] to-[#0062f5] text-white shadow-[0_8px_20px_rgba(0,114,255,0.3)]'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300 hover:text-[#0284c7]'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {count !== undefined && (
              <span className={`rounded-full px-1.5 text-[11px] ${on ? 'bg-white/25' : 'bg-sky-50 text-[#0284c7]'}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Modal (bottom sheet on phones) ---------- */

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-2xl animate-fadeUp pb-[env(safe-area-inset-bottom)]`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/95 backdrop-blur px-5 sm:px-6 pt-5 pb-3 border-b border-slate-100">
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0b1f33]">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Config-driven form ---------- */

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'time' | 'number' | 'tel' | 'email' | 'url' | 'multi';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Span both columns on wider screens. */
  full?: boolean;
}

export type FormValues = Record<string, Value>;

export function DynamicForm({
  fields, initial, submitLabel = 'Post', onSubmit, reset = true,
}: { fields: FieldDef[]; initial?: FormValues; submitLabel?: string; onSubmit: (v: FormValues) => void; reset?: boolean }) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? (f.type === 'multi' ? [] : '')]));
  const [values, setValues] = useState<FormValues>(blank);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (name: string, v: Value) => setValues((s) => ({ ...s, [name]: v }));

  return (
    <form
      className="grid sm:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const missing = fields.find((f) => f.required && f.type === 'multi' && !(values[f.name] as string[]).length);
        if (missing) {
          setError(`Please choose at least one option for “${missing.label}”.`);
          return;
        }
        setError('');
        onSubmit(values);
        if (reset) setValues(blank());
        setDone(true);
        window.setTimeout(() => setDone(false), 3000);
      }}
    >
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const span = f.full || f.type === 'textarea' || f.type === 'multi' ? 'sm:col-span-2' : '';
        const value = values[f.name];
        return (
          <div key={f.name} className={span}>
            <label className="label" htmlFor={id}>
              {f.label} {f.required && <span className="text-rose-500">*</span>}
            </label>
            {f.type === 'textarea' ? (
              <textarea id={id} rows={3} required={f.required} placeholder={f.placeholder} className="input resize-none" value={String(value)} onChange={(e) => set(f.name, e.target.value)} />
            ) : f.type === 'select' ? (
              <select id={id} required={f.required} className="input" value={String(value)} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">Select…</option>
                {f.options!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === 'multi' ? (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 p-2.5">
                {f.options!.map((o) => {
                  const list = value as string[];
                  const on = list.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => set(f.name, on ? list.filter((x) => x !== o) : [...list, o])}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? 'bg-[#0284c7] text-white' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300'}`}
                    >
                      {on && '✓ '}{o}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                id={id}
                type={f.type ?? 'text'}
                required={f.required}
                placeholder={f.placeholder}
                inputMode={f.type === 'tel' ? 'numeric' : undefined}
                pattern={f.type === 'tel' ? '[0-9 +]{10,14}' : undefined}
                className="input"
                value={String(value)}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
      {error && <p className="sm:col-span-2 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className="btn-primary px-6 w-full sm:w-auto">
          <Send className="h-4 w-4" /> {submitLabel}
        </button>
        {done && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}

/* ---------- Small pieces ---------- */

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white ring-1 ring-slate-100 shadow-soft ${className}`}>{children}</div>;
}

export function Chip({ children, tone = 'sky' }: { children: ReactNode; tone?: 'sky' | 'slate' | 'emerald' | 'amber' | 'violet' | 'rose' }) {
  const tones = {
    sky: 'bg-sky-50 text-[#0284c7] ring-sky-100',
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-slate-300" />
      <p className="mt-2 font-display font-bold text-slate-700">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

/** Renders children only for the allowed roles; otherwise a prompt to log in with the right category. */
export function RequireRole({ allow, children, reason }: { allow: Role[]; children: ReactNode; reason: string }) {
  const session = useSession();
  if (session && allow.includes(session.role)) return <>{children}</>;
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white ring-1 ring-sky-100 px-5 py-8 sm:p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0284c7] shadow-sm ring-1 ring-sky-100">
        <Lock className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-lg font-extrabold text-[#0b1f33]">{reason}</p>
      <p className="mt-1 text-sm text-slate-500">
        {session ? `You are logged in as ${roles[session.role].label}. ` : ''}
        Login as {allow.map((r) => roles[r].label).join(' or ')} to continue.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {allow.map((r) => (
          <button key={r} onClick={() => openLogin(r)} className="btn-primary px-5 text-sm">
            Login as {roles[r].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0b1f33]">{title}</h2>
      {action}
    </div>
  );
}

export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="input py-2.5 sm:w-auto">
      <option value="">{label}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

export const maskPhone = (p: string) => (p.length >= 10 ? `${p.slice(0, 2)}••••••${p.slice(-2)}` : '••••••••••');

export const formatDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/* ---------- Enquiry (schools → teachers / vendors, vendors → schools) ---------- */

export function EnquiryButton({ to, toName, about, label = 'Send Enquiry' }: { to: string; toName: string; about: string; label?: string }) {
  const session = useSession();
  const enquiries = useCollection('enquiries');
  const [open, setOpen] = useState(false);
  const alreadySent = session && enquiries.items.some((e) => e.ownerId === session.id && e.to === to && e.about === about);

  if (!session) return null;
  return (
    <>
      <button onClick={() => setOpen(true)} disabled={!!alreadySent} className={alreadySent ? 'btn-outline text-sm px-4 py-2 opacity-70' : 'btn-primary text-sm px-4 py-2'}>
        {alreadySent ? <><CheckCircle2 className="h-4 w-4" /> Enquiry sent</> : <><Send className="h-4 w-4" /> {label}</>}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Enquiry to ${toName}`}>
        <DynamicForm
          submitLabel="Send enquiry"
          fields={[
            { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Describe what you need, quantity, timeline…' },
            { name: 'phone', label: 'Your contact number', type: 'tel', required: true },
          ]}
          onSubmit={(v) => {
            enquiries.add({ ...v, to, toName, about, fromRole: session.role }, session);
            window.setTimeout(() => setOpen(false), 900);
          }}
        />
      </Modal>
    </>
  );
}

/** Enquiries received by the logged-in user. */
export function EnquiryInbox({ title = 'Enquiries received' }: { title?: string }) {
  const session = useSession();
  const { items } = useCollection('enquiries');
  if (!session) return null;
  const mine = items.filter((e) => e.to === session.id);
  return (
    <div>
      <SectionTitle title={`${title} (${mine.length})`} />
      {mine.length === 0 ? (
        <EmptyState title="No enquiries yet" text="When someone sends you an enquiry it will appear here." />
      ) : (
        <div className="grid gap-3">
          {mine.map((e) => (
            <Card key={e.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display font-bold text-[#0b1f33]">{e.ownerName}</span>
                <Chip tone="slate">{new Date(e.createdAt).toLocaleDateString('en-IN')}</Chip>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">Regarding: {String(e.about)}</p>
              <p className="mt-2 text-sm text-slate-700">{String(e.message)}</p>
              <a href={`tel:${String(e.phone)}`} className="mt-2 inline-block text-sm font-bold text-[#0284c7]">📞 {String(e.phone)}</a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Android brand mark for the download button ---------- */

export function AndroidIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.4 11.4 0 0 0 12 8.12c-1.77 0-3.43.39-4.92 1.02L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  );
}
