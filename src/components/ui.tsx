import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  X, Lock, CheckCircle2, Inbox, Send, ImagePlus, Paperclip, FileText,
  FileSpreadsheet, File, Download, Eye, UploadCloud, type LucideIcon,
} from 'lucide-react';
import { useSession, openLogin, roles, type Role } from '@/lib/auth';
import { useCollection, type Value } from '@/lib/store';
import { ApiError } from '@/lib/api';

/* ---------- Page banner ---------- */

export function PageHero({
  eyebrow, title, subtitle, icon: Icon, children, flush,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  icon: LucideIcon;
  children?: ReactNode;
  /** Placed below other content rather than at the page top, so no room for the fixed header is needed. */
  flush?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-b from-[#cae8ff] via-[#e6f4ff] to-white ${flush ? 'pt-6 sm:pt-10' : 'pt-[88px] sm:pt-32'} pb-6 sm:pb-12`}>
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

export function Modal({ open, onClose, title, children, wide, top }: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
  /** Show above another open dialog (e.g. the OTP step on top of the login dialog). */
  top?: boolean;
}) {
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
  const pressedOnBackdrop = useRef(false);

  if (!open) return null;
  // Close only on a real click on the dark background: the press AND the release must both happen there.
  // (Pressing inside a field — e.g. selecting typed text — and releasing outside must not close the form.)
  return (
    <div
      className={`fixed inset-0 ${top ? 'z-[90]' : 'z-[80]'} flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-sm sm:p-4`}
      onPointerDown={(e) => { pressedOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => {
        if (pressedOnBackdrop.current && e.target === e.currentTarget) onClose();
        pressedOnBackdrop.current = false;
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
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
  type?: 'text' | 'textarea' | 'select' | 'date' | 'time' | 'number' | 'tel' | 'email' | 'url' | 'password' | 'multi' | 'image' | 'file';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Span both columns on wider screens. */
  full?: boolean;
  /** Number fields: allowed range (same as the server's rule). */
  min?: number;
  max?: number;
  /** Small help text under the field. */
  hint?: string;
  /** Accepted file extensions or mime types for 'file' type, e.g. '.pdf,.doc,.docx,.xls,.xlsx,.csv,image/*' */
  accept?: string;
}

/** "(optional)" is added to the label of fields that are not required, unless the label already says so. */
const optionalTag = (f: FieldDef) => !f.required && f.type !== 'image' && f.type !== 'file' && !/optional/i.test(f.label);

export type FormValues = Record<string, Value>;

export function DynamicForm({
  fields, initial, submitLabel = 'Post', onSubmit, reset = true,
}: {
  fields: FieldDef[];
  initial?: FormValues;
  submitLabel?: string;
  /** May be async (e.g. a server call); a thrown Error's message is shown under the form. */
  onSubmit: (v: FormValues) => unknown;
  reset?: boolean;
}) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? (f.type === 'multi' ? [] : '')]));
  const [values, setValues] = useState<FormValues>(blank);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Server messages for individual fields, shown in red under that field.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (name: string, v: Value) => {
    setValues((s) => ({ ...s, [name]: v }));
    setFieldErrors((fe) => {
      if (!fe[name]) return fe;
      const { [name]: _gone, ...rest } = fe;
      void _gone;
      return rest;
    });
  };

  return (
    <form
      className="grid sm:grid-cols-2 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        const missing = fields.find((f) => f.required && f.type === 'multi' && !(values[f.name] as string[]).length);
        if (missing) {
          setError(`Please choose at least one option for “${missing.label}”.`);
          return;
        }
        setError('');
        setFieldErrors({});
        setBusy(true);
        try {
          await onSubmit(values);
        } catch (err) {
          const perField = err instanceof ApiError ? err.fields : {};
          const named = fields.filter((f) => perField[f.name]);
          if (named.length) {
            setFieldErrors(perField);
            setError(`Please check: ${named.map((f) => f.label).join(', ')}.`);
            document.getElementById(`f-${named[0].name}`)?.focus();
          } else {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
          }
          return;
        } finally {
          setBusy(false);
        }
        if (reset) setValues(blank());
        setDone(true);
        window.setTimeout(() => setDone(false), 3000);
      }}
    >
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const span = f.full || f.type === 'textarea' || f.type === 'multi' || f.type === 'image' || f.type === 'file' ? 'sm:col-span-2' : '';
        const value = values[f.name];
        return (
          <div key={f.name} className={span}>
            <label className="label" htmlFor={id}>
              {f.label} {f.required && <span className="text-rose-500">*</span>}
              {optionalTag(f) && <span className="font-normal text-slate-400"> (optional)</span>}
            </label>
            {f.type === 'image' ? (
              <ImageUpload id={id} value={String(value ?? '')} onChange={(v) => set(f.name, v)} />
            ) : f.type === 'file' ? (
              <FileUpload
                id={id}
                value={typeof value === 'string' ? value : undefined}
                fileName={typeof values[`${f.name}Name`] === 'string' ? (values[`${f.name}Name`] as string) : undefined}
                accept={f.accept}
                onChange={(fileData) => {
                  if (fileData) {
                    setValues((s) => ({
                      ...s,
                      [f.name]: fileData.url,
                      [`${f.name}Name`]: fileData.name,
                      [`${f.name}Size`]: fileData.size,
                    }));
                  } else {
                    setValues((s) => {
                      const copy = { ...s };
                      delete copy[f.name];
                      delete copy[`${f.name}Name`];
                      delete copy[`${f.name}Size`];
                      return copy;
                    });
                  }
                }}
              />
            ) : f.type === 'textarea' ? (
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
                // Links: plain text so "www.school.com" is accepted (the server adds https://).
                type={f.type === 'url' ? 'text' : f.type ?? 'text'}
                required={f.required}
                placeholder={f.placeholder}
                inputMode={f.type === 'tel' || f.type === 'number' ? 'numeric' : f.type === 'url' ? 'url' : undefined}
                pattern={f.type === 'tel' ? '[0-9 +]{10,14}' : undefined}
                min={f.type === 'number' ? f.min : undefined}
                max={f.type === 'number' ? f.max : undefined}
                step={f.type === 'number' ? 1 : undefined}
                autoCapitalize={f.type === 'url' || f.type === 'email' ? 'none' : undefined}
                aria-invalid={fieldErrors[f.name] ? true : undefined}
                className={`input ${fieldErrors[f.name] ? 'ring-2 ring-rose-300 border-rose-300' : ''}`}
                value={String(value ?? '')}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
            {fieldErrors[f.name] ? (
              <p className="mt-1 text-xs font-semibold text-rose-600">{fieldErrors[f.name]}</p>
            ) : f.hint ? (
              <p className="mt-1 text-xs text-slate-500">{f.hint}</p>
            ) : null}
          </div>
        );
      })}
      {error && <p className="sm:col-span-2 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={busy} className="btn-primary px-6 w-full sm:w-auto disabled:opacity-70">
          <Send className="h-4 w-4" /> {busy ? 'Please wait…' : submitLabel}
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

/* ---------- Image upload ---------- */

/** Resize a photo on the device and return it as a compact JPEG data URL (keeps storage small). */
async function compressImage(file: File, maxSide = 1000, quality = 0.78): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('This file could not be read as an image.'));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff'; // transparent PNGs get a white background in JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ImageUpload({ id, value, onChange, round }: { id: string; value: string; onChange: (dataUrl: string) => void; round?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) return setError('Please choose an image file (JPG, PNG, WebP).');
    if (file.size > 20 * 1024 * 1024) return setError('That image is larger than 20 MB. Please choose a smaller one.');
    setBusy(true);
    try {
      onChange(await compressImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not upload this image.');
    } finally {
      setBusy(false);
    }
  };

  const input = (
    <input
      id={id}
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }}
    />
  );

  return (
    <div>
      {value ? (
        <div className={`relative overflow-hidden ring-1 ring-slate-200 ${round ? 'h-28 w-28 rounded-full' : 'h-44 sm:h-52 w-full rounded-2xl'}`}>
          <img src={value} alt="Uploaded" className="h-full w-full object-cover" />
          <div className={`absolute flex gap-1.5 ${round ? 'inset-x-0 bottom-1 justify-center' : 'right-2 top-2'}`}>
            <label htmlFor={id} className="cursor-pointer rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0284c7] shadow">
              {busy ? '…' : 'Change'}
            </label>
            <button type="button" onClick={() => onChange('')} aria-label="Remove image" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow">
              <X className="h-4 w-4" />
            </button>
          </div>
          {input}
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 border-2 border-dashed border-sky-200 bg-sky-50/50 text-center transition hover:border-sky-300 hover:bg-sky-50 ${round ? 'h-28 w-28 rounded-full' : 'rounded-2xl px-4 py-7'}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0284c7] shadow-sm ring-1 ring-sky-100">
            <ImagePlus className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-[#0284c7]">{busy ? 'Uploading…' : 'Upload image'}</span>
          {!round && <span className="text-xs text-slate-500">From gallery or camera · JPG, PNG</span>}
          {input}
        </label>
      )}
      {error && <p className="mt-2 text-sm font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

/* ---------- Document & File upload (PDF, Word, Excel, Images, all types) ---------- */

export interface PickedFile {
  url: string;
  name: string;
  size: number;
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileCategory(nameOrUrl: string): {
  category: 'pdf' | 'excel' | 'word' | 'image' | 'other';
  label: string;
  color: string;
  bg: string;
  ring: string;
  Icon: typeof FileText;
} {
  const clean = (nameOrUrl || '').split('?')[0].toLowerCase();
  const ext = clean.split('.').pop() || '';
  if (ext === 'pdf' || clean.includes('application/pdf')) {
    return { category: 'pdf', label: 'PDF', color: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-200', Icon: FileText };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || clean.includes('spreadsheet') || clean.includes('excel')) {
    return { category: 'excel', label: ext.toUpperCase() || 'EXCEL', color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200', Icon: FileSpreadsheet };
  }
  if (['doc', 'docx'].includes(ext) || clean.includes('word') || clean.includes('msword')) {
    return { category: 'word', label: ext.toUpperCase() || 'DOC', color: 'text-[#0284c7]', bg: 'bg-sky-50', ring: 'ring-sky-200', Icon: FileText };
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) || clean.startsWith('data:image/')) {
    return { category: 'image', label: ext.toUpperCase() || 'IMAGE', color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-200', Icon: ImagePlus };
  }
  return { category: 'other', label: ext ? ext.toUpperCase() : 'DOC', color: 'text-slate-600', bg: 'bg-slate-50', ring: 'ring-slate-200', Icon: File };
}

export function FileUpload({
  id,
  value,
  fileName,
  onChange,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,image/*',
}: {
  id: string;
  value?: string;
  fileName?: string;
  onChange: (file: PickedFile | null) => void;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const pick = (file?: File) => {
    if (!file) return;
    setError('');
    // 15 MB limit
    if (file.size > 15 * 1024 * 1024) {
      setError('That file is larger than 15 MB. Please choose a smaller one.');
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      setBusy(false);
      onChange({
        url: reader.result as string,
        name: file.name,
        size: file.size,
      });
    };
    reader.onerror = () => {
      setBusy(false);
      setError('Could not read this file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const displayName = fileName || (value && !value.startsWith('data:') ? value.split('/').pop()?.split('?')[0] : '') || 'Attached document';
  const meta = getFileCategory(displayName || value || '');

  const fileInput = (
    <input
      id={id}
      type="file"
      accept={accept}
      className="sr-only"
      onChange={(e) => {
        pick(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  return (
    <div>
      {value ? (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ring-1 ${meta.bg} ${meta.ring} ${meta.color}`}>
              <meta.Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0b1f33] truncate" title={displayName}>
                {displayName}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                <span className={`font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded ${meta.bg} ${meta.color} ring-1 ${meta.ring}`}>
                  {meta.label}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Attached
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor={id} className="cursor-pointer rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-[#0284c7] ring-1 ring-sky-100 transition hover:bg-sky-100">
              {busy ? '…' : 'Change'}
            </label>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove attached file"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-500 ring-1 ring-rose-100 transition hover:bg-rose-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {fileInput}
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-center transition ${
            dragOver ? 'border-[#0284c7] bg-sky-50' : 'border-sky-200 bg-sky-50/40 hover:border-sky-300 hover:bg-sky-50'
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0284c7] shadow-sm ring-1 ring-sky-100">
            <UploadCloud className="h-5 w-5" />
          </span>
          <div>
            <span className="text-sm font-bold text-[#0284c7]">
              {busy ? 'Reading document…' : 'Upload document, quotation or catalogue'}
            </span>
            <p className="mt-0.5 text-xs text-slate-500">
              Supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx, .csv), Images (up to 15 MB)
            </p>
          </div>
          {fileInput}
        </label>
      )}
      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

/* ---------- Attachment badge (display & download) ---------- */

export function AttachmentBadge({
  url,
  name,
  label,
}: {
  url?: string;
  name?: string;
  label?: string;
}) {
  if (!url) return null;
  const fileName = name || (url.startsWith('data:') ? 'document' : url.split('/').pop()?.split('?')[0]) || 'Attachment';
  const meta = getFileCategory(fileName || url);
  const isDirectlyViewable = meta.category === 'pdf' || meta.category === 'image';

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={url}
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold ring-1 transition shadow-sm ${meta.bg} ${meta.color} ${meta.ring} hover:opacity-90`}
      >
        <meta.Icon className="h-4 w-4 shrink-0" />
        <span className="max-w-[200px] truncate sm:max-w-[320px]">{label || fileName}</span>
        <Download className="h-3.5 w-3.5 opacity-70 ml-0.5" />
      </a>
      {isDirectlyViewable && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5 text-[#0284c7]" /> View
        </a>
      )}
    </div>
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
export function RequireRole({ allow, children, reason, loginOptions }: {
  allow: Role[];
  children: ReactNode;
  reason: string;
  /** Login buttons to offer; defaults to every allowed role. */
  loginOptions?: Role[];
}) {
  const session = useSession();
  if (session && allow.includes(session.role)) return <>{children}</>;
  // The admin login is never advertised to visitors.
  const loginAs = (loginOptions ?? allow).filter((r) => r !== 'admin');
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white ring-1 ring-sky-100 px-5 py-8 sm:p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0284c7] shadow-sm ring-1 ring-sky-100">
        <Lock className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-lg font-extrabold text-[#0b1f33]">{reason}</p>
      <p className="mt-1 text-sm text-slate-500">
        {session ? `You are logged in as ${roles[session.role].label}. ` : ''}
        Login as {loginAs.map((r) => roles[r].label).join(' or ')} to continue.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {loginAs.map((r) => (
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
            {
              name: 'attachment',
              label: 'Attach document / quotation / brochure',
              type: 'file',
              full: true,
              hint: 'Upload quotation, proposal, catalogue, or document (PDF, Word, Excel, Images up to 15 MB)',
            },
          ]}
          onSubmit={async (v) => {
            await enquiries.add({ ...v, to, toName, about, fromRole: session.role }, session);
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
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{String(e.message)}</p>
              {typeof e.attachment === 'string' && e.attachment && (
                <AttachmentBadge
                  url={e.attachment}
                  name={typeof e.attachmentName === 'string' ? e.attachmentName : undefined}
                />
              )}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <a href={`tel:${String(e.phone)}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0284c7]">📞 {String(e.phone)}</a>
                {e.fromRole && <span className="text-xs text-slate-400 capitalize">From: {String(e.fromRole)}</span>}
              </div>
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
