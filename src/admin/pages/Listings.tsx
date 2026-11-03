import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  Search, CheckCircle2, XCircle, Pencil, Trash2, Eye, EyeOff, Phone, MapPin, ImageOff, User, MessageSquare, Hourglass, LayoutGrid, Clock,
} from 'lucide-react';
import booksCap from '../assets/books-cap.webp';
import { SchoolBuilding } from '../illustrations';
import { useRoute, navigate } from '@/lib/router';
import { districts } from '@/data/districts';
import {
  adminApi, errorText, toast, listingTypes, itemTitle, itemSubtitle, itemImage, itemDistrict, humanize, str, formatDate, timeAgo, roleLabels,
  type ListingType, type Item, type FieldMeta, type ReviewStatus,
} from '../lib';
import { refreshPending } from '../Shell';
import {
  Card, PageHeader, Spinner, ErrorNote, StatusPill, EmptyState, Segmented, Button, SidePanel, Dialog, ConfirmDialog, Field, inputCls, Badge, Pager,
} from '../ui';

interface Data {
  items: Item[];
  counts: Record<'all' | ReviewStatus, number>;
  fields: FieldMeta[];
}

type Filter = 'all' | ReviewStatus;

const descriptions: Record<ListingType, string> = {
  schoolProfiles: 'School profiles appear on the Schools page only after you approve them.',
  coaching: 'Tuition, extra-curricular and course providers. Approve them to make them public.',
  events: 'Events posted by schools and organizers. Students see an event once it is approved.',
  teacherProfiles: 'Teacher job profiles, visible to schools once approved.',
  vendors: 'Vendor companies, visible to schools once approved.',
};

export function Listings({ type }: { type: ListingType }) {
  const meta = listingTypes[type];
  const { query } = useRoute();
  const openId = query.get('open');

  // Opened from a dashboard link (?open=) → start on "All" so that listing is in the list whatever its status.
  const [filter, setFilter] = useState<Filter>(openId ? 'all' : 'pending');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [district, setDistrict] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Item | null>(null);
  const [rejecting, setRejecting] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const t = window.setTimeout(() => setQ(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  const [page, setPage] = useState(1);
  // Each request gets a number; a slower, older reply never replaces the list of the tab you are on now.
  const requestNo = useRef(0);

  const load = () => {
    setError('');
    const no = ++requestNo.current;
    const params = new URLSearchParams({ c: type, status: filter, q, district });
    adminApi<Data>(`/api/admin/listings.php?${params}`)
      .then((d) => {
        if (no === requestNo.current) setData({ ...d, items: d.items.filter((i) => filter === 'all' || i.status === filter) });
      })
      .catch((e) => no === requestNo.current && setError(errorText(e)));
  };
  // The page is remounted per listing type (key in AdminApp), so filters start fresh for each type.
  useEffect(load, [type, filter, q, district]);
  useEffect(() => setPage(1), [filter, q, district]);

  const selected = useMemo(() => data?.items.find((i) => i.id === openId) ?? null, [data, openId]);
  const open = (item: Item) => navigate(`/${meta.slug}?open=${item.id}`);
  const close = () => navigate(`/${meta.slug}`);

  const moderate = async (item: Item, status: 'approved' | 'rejected', note = '') => {
    try {
      await adminApi('/api/admin/moderate.php', { method: 'POST', body: { c: type, id: Number(item.id), status, note } });
      toast(status === 'approved' ? `Approved “${itemTitle(item)}”` : `Rejected “${itemTitle(item)}”`);
      refreshPending();
      load();
    } catch (e) {
      toast(errorText(e), 'error');
    }
  };

  const remove = async (item: Item) => {
    try {
      await adminApi(`/api/admin/listings.php?c=${type}&action=delete&id=${item.id}`, { method: 'POST' });
      toast(`Deleted “${itemTitle(item)}”`);
      setDeleting(null);
      if (openId === item.id) close();
      refreshPending();
      load();
    } catch (e) {
      toast(errorText(e), 'error');
    }
  };

  /** Approve / Hide / Reject pill buttons. */
  const actions = (item: Item, size: 'sm' | 'md' = 'sm') => {
    const pad = size === 'sm' ? 'px-3.5 py-2 text-[13px]' : 'px-4 py-2.5 text-sm';
    return (
      <>
        {item.status !== 'approved' && (
          <button onClick={() => moderate(item, 'approved')} className={`inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 font-bold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100 ${pad}`}>
            <CheckCircle2 className="h-4 w-4" /> Approve
          </button>
        )}
        {item.status !== 'rejected' && (
          <button onClick={() => setRejecting(item)} className={`inline-flex items-center gap-1.5 rounded-xl font-bold ring-1 transition ${pad} ${item.status === 'approved' ? 'bg-blue-50 text-[#1565c0] ring-blue-100 hover:bg-blue-100' : 'bg-rose-50 text-rose-600 ring-rose-100 hover:bg-rose-100'}`}>
            {item.status === 'approved' ? <><EyeOff className="h-4 w-4" /> Hide</> : <><XCircle className="h-4 w-4" /> Reject</>}
          </button>
        )}
      </>
    );
  };

  const counts = data?.counts;
  const PER_PAGE = 10;
  const pages = Math.max(1, Math.ceil((data?.items.length ?? 0) / PER_PAGE));
  const shown = data?.items.slice((page - 1) * PER_PAGE, page * PER_PAGE) ?? [];

  return (
    <>
      <PageHeader
        title={meta.label}
        subtitle={<>{descriptions[type].split('. ')[0]}. <span className="text-[#1e88e5]">{descriptions[type].split('. ').slice(1).join('. ')}</span></>}
        art={
          <div className="relative flex h-full items-end">
            <img src={booksCap} alt="" className="relative z-10 mb-1 h-[88%] drop-shadow-xl" />
            <SchoolBuilding className="-ml-6 mb-1 h-[78%]" />
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'pending', label: 'Pending', count: counts?.pending, icon: Hourglass, iconCls: 'text-[#1565c0]' },
            { id: 'approved', label: 'Approved', count: counts?.approved, icon: CheckCircle2, iconCls: 'text-emerald-500' },
            { id: 'rejected', label: 'Rejected', count: counts?.rejected, icon: XCircle, iconCls: 'text-rose-500' },
            { id: 'all', label: 'All', count: counts?.all, icon: LayoutGrid },
          ]}
        />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_190px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1565c0]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${meta.label.toLowerCase()}, owner, phone…`} className={`${inputCls} h-12 !rounded-2xl pl-12 xl:w-80`} />
          </div>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`${inputCls} h-12 font-semibold`} aria-label="District">
            <option value="">All districts</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <div className="p-4"><ErrorNote text={error} onRetry={load} /></div>
        ) : !data ? (
          <Spinner />
        ) : data.items.length === 0 ? (
          <EmptyState
            title={q || district ? 'No matches' : filter === 'pending' ? 'Nothing waiting for approval' : `No ${filter === 'all' ? '' : `${filter} `}${meta.label.toLowerCase()}`}
            text={q || district ? 'Try a different search or district.' : filter === 'pending' ? 'All caught up. New listings appear here as soon as they are posted.' : `Listings that are ${filter === 'all' ? 'posted' : filter} show up here.`}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-extrabold uppercase tracking-wide text-[#0b2545]">
                  <tr className="border-b border-blue-50">
                    <th className="px-6 py-4">{meta.singular}</th>
                    <th className="px-4 py-4">Posted by</th>
                    <th className="px-4 py-4">District</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/80">
                  {shown.map((item) => (
                    <tr key={item.id} className="group bg-white/40 transition hover:bg-blue-50/50">
                      <td className="max-w-[320px] px-6 py-4">
                        <button onClick={() => open(item)} className="flex items-center gap-3.5 text-left">
                          <Thumb item={item} />
                          <span className="min-w-0">
                            <span className="block truncate text-[15px] font-bold text-[#0b2545] group-hover:text-[#1565c0]">{itemTitle(item)}</span>
                            <span className="block truncate text-[13px] text-[#1e88e5]">{itemSubtitle(type, item)}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-[#0b2545]">{item.ownerName}</div>
                        {item.ownerPhone && <div className="text-[13px] text-[#1e88e5]">{item.ownerPhone}</div>}
                      </td>
                      <td className="max-w-[180px] px-4 py-4">
                        <span className="flex items-center gap-1.5 truncate font-semibold text-[#0b2545]"><MapPin className="h-4 w-4 shrink-0 text-[#1565c0]" /> {itemDistrict(item) || '—'}</span>
                      </td>
                      <td className="px-4 py-4"><StatusPill status={item.status} /></td>
                      <td className="whitespace-nowrap px-4 py-4" title={formatDate(item.updatedAt, true)}>
                        <span className="flex items-center gap-1.5 text-[#1e88e5]"><Clock className="h-4 w-4 text-[#1565c0]" /> {timeAgo(item.updatedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {actions(item)}
                          <IconButton label="View details" onClick={() => open(item)}><Eye className="h-[18px] w-[18px]" /></IconButton>
                          <IconButton label="Edit" onClick={() => setEditing(item)}><Pencil className="h-[18px] w-[18px]" /></IconButton>
                          <IconButton label="Delete" danger onClick={() => setDeleting(item)}><Trash2 className="h-[18px] w-[18px]" /></IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phone cards */}
            <ul className="divide-y divide-blue-50 md:hidden">
              {shown.map((item) => (
                <li key={item.id} className="p-4">
                  <button onClick={() => open(item)} className="flex w-full items-start gap-3 text-left">
                    <Thumb item={item} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#0b2545]">{itemTitle(item)}</span>
                        <StatusPill status={item.status} />
                      </span>
                      <span className="mt-0.5 block text-xs text-[#1e88e5]">{itemSubtitle(type, item)}</span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{itemDistrict(item) || '—'} · {item.ownerName} · {timeAgo(item.updatedAt)}</span>
                    </span>
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {actions(item)}
                    <IconButton label="Edit" onClick={() => setEditing(item)}><Pencil className="h-[18px] w-[18px]" /></IconButton>
                    <IconButton label="Delete" danger onClick={() => setDeleting(item)}><Trash2 className="h-[18px] w-[18px]" /></IconButton>
                  </div>
                </li>
              ))}
            </ul>
            <Pager page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </Card>

      {/* Details */}
      <SidePanel
        open={!!selected}
        onClose={close}
        title={selected ? <span className="flex items-center gap-2"><span className="truncate">{itemTitle(selected)}</span><StatusPill status={selected.status} /></span> : ''}
        footer={selected && (
          <>
            {actions(selected, 'md')}
            <span className="flex-1" />
            <Button tone="secondary" onClick={() => setEditing(selected)}><Pencil className="h-4 w-4" /> Edit</Button>
            <Button tone="ghost" className="!text-rose-600" onClick={() => setDeleting(selected)}><Trash2 className="h-4 w-4" /></Button>
          </>
        )}
      >
        {selected && data && <Details type={type} item={selected} fields={data.fields} />}
      </SidePanel>

      {editing && data && (
        <EditDialog
          type={type}
          item={editing}
          fields={data.fields}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      <RejectDialog item={rejecting} onClose={() => setRejecting(null)} onReject={async (note) => { await moderate(rejecting!, 'rejected', note); setRejecting(null); }} />

      <ConfirmDialog
        open={!!deleting}
        title={`Delete this ${meta.singular}?`}
        text={<><b className="text-slate-900">{deleting && itemTitle(deleting)}</b> will be removed permanently for everyone. This cannot be undone. To only hide it, use Reject / Hide instead.</>}
        confirmLabel="Delete permanently"
        onConfirm={() => remove(deleting!)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

function IconButton({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition ${danger ? 'bg-rose-50/70 text-rose-500 ring-rose-100 hover:bg-rose-100' : 'bg-blue-50/80 text-[#1565c0] ring-blue-100 hover:bg-blue-100'}`}
    >
      {children}
    </button>
  );
}

function Thumb({ item }: { item: Item }) {
  const src = itemImage(item);
  const initials = itemTitle(item).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return src ? (
    <img src={src} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-4 ring-blue-50" loading="lazy" />
  ) : (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-1.5 ring-1 ring-blue-100">
      <span className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#2196f3] to-[#1565c0] font-display text-base font-extrabold text-white shadow-md shadow-blue-500/30">
        {initials}
      </span>
    </span>
  );
}

function Details({ type, item, fields }: { type: ListingType; item: Item; fields: FieldMeta[] }) {
  const image = itemImage(item);
  const shown = fields.filter((f) => f.type !== 'image' && str(item[f.name]) !== '');
  return (
    <div className="space-y-6">
      {image ? (
        <img src={image} alt="" className="aspect-video w-full rounded-xl object-cover ring-1 ring-slate-200" />
      ) : fields.some((f) => f.type === 'image') ? (
        <div className="flex aspect-[3/1] items-center justify-center gap-2 rounded-xl bg-slate-50 text-xs font-medium text-slate-400 ring-1 ring-slate-200">
          <ImageOff className="h-4 w-4" /> No photo uploaded
        </div>
      ) : null}

      {item.status === 'rejected' && item.reviewNote && (
        <div className="flex gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" /> <span><b>Reason given:</b> {item.reviewNote}</span>
        </div>
      )}

      <section>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Posted by</h3>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200"><User className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900">{item.ownerName}</div>
            <div className="text-xs text-slate-500">
              {roleLabels[str(item.ownerRole)] ?? 'Account'}
              {item.ownerStatus === 'blocked' && <> · <span className="font-semibold text-rose-600">blocked</span></>}
            </div>
          </div>
          {item.ownerPhone && (
            <a href={`tel:${item.ownerPhone}`} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-[#0284c7] ring-1 ring-slate-200">
              <Phone className="h-3.5 w-3.5" /> {item.ownerPhone}
            </a>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{listingTypes[type].singular} details</h3>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {shown.map((f) => {
            const v = item[f.name];
            const wide = f.type === 'longtext' || (Array.isArray(v) && v.length > 3);
            return (
              <div key={f.name} className={wide ? 'sm:col-span-2' : ''}>
                <dt className="text-xs font-medium text-slate-500">{humanize(f.name)}</dt>
                <dd className="mt-0.5 break-words text-sm text-slate-900">
                  {Array.isArray(v) ? (
                    <span className="flex flex-wrap gap-1">{v.map((x) => <Badge key={String(x)}>{String(x)}</Badge>)}</span>
                  ) : f.type === 'url' ? (
                    <a href={str(v)} target="_blank" rel="noreferrer" className="font-medium text-[#0284c7] hover:underline">{str(v)}</a>
                  ) : f.type === 'date' ? (
                    formatDate(str(v))
                  ) : f.type === 'district' ? (
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {str(v)}</span>
                  ) : (
                    <span className="whitespace-pre-line">{str(v)}</span>
                  )}
                </dd>
              </div>
            );
          })}
          {type === 'events' && (
            <div>
              <dt className="text-xs font-medium text-slate-500">Registrations</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{str(item.registrations) || '0'}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div><div className="font-medium">Created</div><div className="mt-0.5 text-slate-800">{formatDate(item.createdAt, true)}</div></div>
        <div><div className="font-medium">Last updated</div><div className="mt-0.5 text-slate-800">{formatDate(item.updatedAt, true)}</div></div>
      </section>
    </div>
  );
}

function RejectDialog({ item, onClose, onReject }: { item: Item | null; onClose: () => void; onReject: (note: string) => Promise<void> }) {
  const [note, setNote] = useState('');
  useEffect(() => setNote(''), [item]);
  const hide = item?.status === 'approved';
  return (
    <ConfirmDialog
      open={!!item}
      title={hide ? 'Hide this listing?' : 'Reject this listing?'}
      text={<><b className="text-slate-900">{item && itemTitle(item)}</b> will not be shown to anyone except its owner, who sees it as “Not approved”. You can approve it again later.</>}
      confirmLabel={hide ? 'Hide listing' : 'Reject'}
      onConfirm={() => onReject(note.trim())}
      onClose={onClose}
    >
      <div className="mt-4">
        <Field label={<>Reason <span className="font-normal text-slate-400">(shown to the owner, optional)</span></>} htmlFor="reject-note">
          <textarea id="reject-note" rows={3} maxLength={255} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="e.g. Please add a real photo of the school" />
        </Field>
      </div>
    </ConfirmDialog>
  );
}

/** Edit any listing; the form is built from the field list the server sends. */
function EditDialog({ type, item, fields, onClose, onSaved }: {
  type: ListingType;
  item: Item;
  fields: FieldMeta[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const editable = fields.filter((f) => f.type !== 'image');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {};
    for (const f of editable) {
      const raw = String(form.get(f.name) ?? '').trim();
      body[f.name] = f.type === 'list' ? raw.split(',').map((s) => s.trim()).filter(Boolean) : raw;
    }
    setBusy(true);
    setErrors({});
    setError('');
    try {
      await adminApi(`/api/admin/listings.php?c=${type}&action=update&id=${item.id}`, { method: 'POST', body });
      toast('Changes saved');
      onSaved();
    } catch (err) {
      setError(errorText(err));
      setErrors((err as { fields?: Record<string, string> }).fields ?? {});
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open
      wide
      onClose={onClose}
      title={`Edit ${listingTypes[type].singular}`}
      footer={
        <>
          <Button tone="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="edit-listing" busy={busy}>Save changes</Button>
        </>
      }
    >
      <form id="edit-listing" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {editable.map((f) => {
          const id = `f-${f.name}`;
          const value = item[f.name];
          const wide = f.type === 'longtext' || f.type === 'list';
          const label = <>{humanize(f.name)}{f.required && <span className="text-rose-500"> *</span>}</>;
          let control;
          if (f.type === 'enum' || f.type === 'district') {
            const options = f.type === 'district' ? districts : f.values ?? [];
            control = (
              <select id={id} name={f.name} defaultValue={str(value)} required={f.required} className={inputCls}>
                {!f.required && <option value="">—</option>}
                {options.map((o) => <option key={o} value={o}>{humanize(o)}</option>)}
              </select>
            );
          } else if (f.type === 'longtext') {
            control = <textarea id={id} name={f.name} rows={4} maxLength={f.max} defaultValue={str(value)} required={f.required} className={inputCls} />;
          } else {
            const inputType = { int: 'number', date: 'date', time: 'time', email: 'email', phone: 'tel' }[f.type] ?? 'text';
            control = (
              <input
                id={id}
                name={f.name}
                type={inputType}
                min={f.min}
                max={f.type === 'int' ? f.max : undefined}
                maxLength={f.type === 'text' ? f.max : undefined}
                defaultValue={Array.isArray(value) ? value.join(', ') : str(value)}
                required={f.required}
                className={inputCls}
              />
            );
          }
          return (
            <div key={f.name} className={wide ? 'sm:col-span-2' : ''}>
              <Field label={label} htmlFor={id} error={errors[f.name]} hint={f.type === 'list' ? 'Separate with commas' : undefined}>{control}</Field>
            </div>
          );
        })}
        {error && !Object.keys(errors).length && <div className="sm:col-span-2"><ErrorNote text={error} /></div>}
        <p className="text-xs text-slate-500 sm:col-span-2">Admin edits keep the current approval status. Photos can be changed only by the owner.</p>
      </form>
    </Dialog>
  );
}
