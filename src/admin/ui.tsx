import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, Inbox, Clock, XCircle } from 'lucide-react';
import { useToasts, type ReviewStatus } from './lib';

type Tone = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';

const tones: Record<Tone, string> = {
  primary: 'bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white hover:brightness-110 shadow-md shadow-blue-500/30',
  secondary: 'bg-white/90 text-slate-700 ring-1 ring-blue-100 hover:bg-white hover:ring-blue-200 shadow-sm',
  danger: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:brightness-110 shadow-md shadow-rose-500/25',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110 shadow-md shadow-emerald-500/25',
  ghost: 'text-slate-600 hover:bg-blue-50',
};

export function Button({ tone = 'primary', size = 'md', busy, children, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: 'sm' | 'md';
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      {...rest}
      disabled={busy || rest.disabled}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
      } ${tones[tone]} ${className}`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Frosted-glass card. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-white/85 ring-1 ring-white shadow-[0_12px_40px_-16px_rgba(21,101,192,0.28)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

/** Card title row; `icon` shows a soft blue tile before the title. */
export function CardHeader({ title, subtitle, action, icon: Icon }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; icon?: typeof Clock }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-[#1e88e5] ring-1 ring-blue-100">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-[17px] font-extrabold text-[#0b2545]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/** "View All →" style pill link. */
export function PillLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#1565c0] ring-1 ring-blue-100 transition hover:bg-blue-100">
      {children}
    </a>
  );
}

/** Light page banner with title, description and an illustration on the right. */
export function PageHeader({ title, subtitle, action, art }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; art?: ReactNode }) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-white/90 via-blue-50/90 to-blue-100/80 px-6 py-7 ring-1 ring-white shadow-[0_12px_40px_-16px_rgba(21,101,192,0.3)] sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute right-48 top-6 hidden h-20 w-24 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-70 md:block" aria-hidden />
      <div className="relative z-10 max-w-xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#0b2545] sm:text-[40px] sm:leading-[1.1]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm font-medium text-slate-600 sm:text-[15px]">{subtitle}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
      {art && <div className="pointer-events-none absolute -bottom-2 right-2 hidden h-[115%] items-end md:flex" aria-hidden>{art}</div>}
    </div>
  );
}

const statusStyle: Record<ReviewStatus, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-amber-200', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 ring-rose-200', icon: XCircle },
};

export function StatusPill({ status }: { status: ReviewStatus }) {
  const s = statusStyle[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${s.cls}`}>
      <Icon className="h-3.5 w-3.5" /> {s.label}
    </span>
  );
}

export function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'sky' | 'amber' | 'rose' | 'emerald' }) {
  const cls = {
    slate: 'bg-slate-100 text-slate-600',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}

export function Field({ label, hint, error, children, htmlFor }: { label: ReactNode; hint?: ReactNode; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p> : hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export const inputCls =
  'block w-full rounded-2xl border-0 bg-white/90 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-inset ring-blue-100 shadow-sm placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-[#1e88e5] disabled:bg-slate-50';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />;
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={`${inputCls} pr-11`} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Centered dialog on desktop, bottom sheet on phones. */
export function Dialog({ open, onClose, title, children, footer, wide }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEscape(open, onClose);
  const pressedOnBackdrop = useRef(false);
  if (!open) return null;
  // Close only when both the press and the release happen on the dark background (not when selecting text in a field).
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/50 backdrop-blur-[2px] sm:items-center sm:p-4"
      onPointerDown={(e) => { pressedOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pressedOnBackdrop.current && e.target === e.currentTarget) onClose();
        pressedOnBackdrop.current = false;
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} animate-fadeUp`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="font-display text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3.5 pb-[calc(env(safe-area-inset-bottom)+0.875rem)]">{footer}</div>}
      </div>
    </div>
  );
}

/** Slide-in panel from the right (full screen on phones). */
export function SidePanel({ open, onClose, title, children, footer }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEscape(open, onClose);
  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-900/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        role="dialog"
        className={`absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0 font-display text-base font-bold text-slate-900">{title}</div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{open && children}</div>
        {footer && open && <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-3.5 pb-[calc(env(safe-area-inset-bottom)+0.875rem)]">{footer}</div>}
      </aside>
    </div>
  );
}

function useEscape(open: boolean, onClose: () => void) {
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
}

export function EmptyState({ title, text, icon: Icon = Inbox }: { title: string; text?: string; icon?: typeof Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-14 text-sm font-medium text-slate-500">
      <Loader2 className="h-5 w-5 animate-spin text-[#0284c7]" /> {label}
    </div>
  );
}

export function ErrorNote({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="flex-1">{text}</span>
      {onRetry && <button onClick={onRetry} className="font-bold underline">Retry</button>}
    </div>
  );
}

/** Pill tabs with optional icon and count (status filters, account types). The active tab is solid blue. */
export function Segmented<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string; count?: number; icon?: typeof Clock; iconCls?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]" role="tablist">
      {options.map(({ id, label, count, icon: Icon, iconCls }) => {
        const active = value === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? 'bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white shadow-md shadow-blue-500/30'
                : 'bg-white/80 text-slate-700 ring-1 ring-blue-100 hover:bg-white'
            }`}
          >
            {Icon && <Icon className={`h-[18px] w-[18px] ${active ? 'text-white' : iconCls ?? 'text-[#1e88e5]'}`} />}
            {label}
            {count !== undefined && (
              <span className={`min-w-[22px] rounded-lg px-1.5 py-0.5 text-center text-[11px] font-bold ${active ? 'bg-white/25 text-white' : 'bg-blue-50 text-slate-600'}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Simple page switcher: ‹ 1 2 3 ›. */
export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const btn = 'flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-bold transition';
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav className="flex items-center justify-end gap-1.5 px-5 py-4" aria-label="Pages">
      <button className={`${btn} bg-blue-50 text-slate-600 disabled:opacity-40`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">‹</button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - nums[i - 1] > 1 && <span className="text-slate-400">…</span>}
          <button className={`${btn} ${n === page ? 'bg-[#1e88e5] text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-600 ring-1 ring-blue-100'}`} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}>{n}</button>
        </span>
      ))}
      <button className={`${btn} bg-blue-50 text-slate-600 disabled:opacity-40`} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">›</button>
    </nav>
  );
}

export function Toasts() {
  const list = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg animate-fadeUp ${t.tone === 'success' ? 'bg-slate-900' : 'bg-rose-600'}`}
        >
          {t.tone === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4" />}
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel, tone = 'danger', onConfirm, onClose, children }: {
  open: boolean;
  title: string;
  text: ReactNode;
  confirmLabel: string;
  tone?: Tone;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  children?: ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button tone="secondary" onClick={onClose}>Cancel</Button>
          <Button
            tone={tone}
            busy={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-slate-600">{text}</div>
      {children}
    </Dialog>
  );
}
