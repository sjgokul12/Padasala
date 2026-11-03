import { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle2, Phone, Mail, ShieldCheck } from 'lucide-react';
import { adminApi, errorText, toast, roleLabels, formatDate, timeAgo } from '../lib';
import { SchoolBuilding } from '../illustrations';
import { Card, PageHeader, Spinner, ErrorNote, EmptyState, Segmented, Button, ConfirmDialog, Badge, inputCls } from '../ui';

interface Account {
  id: number;
  role: string;
  name: string;
  phone: string | null;
  email: string | null;
  district: string | null;
  status: 'active' | 'blocked';
  verified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const roleOrder = ['school', 'coaching', 'teacher', 'vendor', 'organizer'];

export function Accounts() {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [data, setData] = useState<{ accounts: Account[]; counts: Record<string, number> } | null>(null);
  const [error, setError] = useState('');
  const [target, setTarget] = useState<Account | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setQ(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  const load = () => {
    setError('');
    adminApi<{ accounts: Account[]; counts: Record<string, number> }>(`/api/admin/accounts.php?${new URLSearchParams({ role, status, q })}`)
      .then(setData)
      .catch((e) => setError(errorText(e)));
  };
  useEffect(load, [role, status, q]);

  const toggle = async (a: Account) => {
    const next = a.status === 'active' ? 'blocked' : 'active';
    try {
      await adminApi('/api/admin/accounts.php', { method: 'POST', body: { id: a.id, status: next } });
      toast(next === 'blocked' ? `Blocked ${a.name}` : `Unblocked ${a.name}`);
      setTarget(null);
      load();
    } catch (e) {
      toast(errorText(e), 'error');
    }
  };

  const total = data ? Object.values(data.counts).reduce((n, c) => n + c, 0) : undefined;

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle={<>Schools, coaching centres, teachers, vendors and event organizers. <span className="text-[#1e88e5]">Student accounts are on the Students page.</span></>}
        art={<SchoolBuilding className="mb-1 mr-4 h-[85%]" />}
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <Segmented
            value={role}
            onChange={setRole}
            options={[{ id: '', label: 'All', count: total }, ...roleOrder.map((r) => ({ id: r, label: roleLabels[r], count: data?.counts[r] }))]}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_160px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, email…" className={`${inputCls} pl-9 xl:w-64`} />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls} aria-label="Status">
              <option value="">Any status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="p-4"><ErrorNote text={error} onRetry={load} /></div>
        ) : !data ? (
          <Spinner />
        ) : data.accounts.length === 0 ? (
          <EmptyState title={q || status ? 'No matching accounts' : 'No accounts yet'} text="Accounts appear here when schools, coaching centres and others register." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Last sign-in</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.accounts.map((a) => (
                    <tr key={a.id} className={a.status === 'blocked' ? 'bg-rose-50/30' : 'hover:bg-slate-50/60'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{a.name.charAt(0).toUpperCase()}</span>
                          <span className="font-semibold text-slate-900">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge tone="sky">{roleLabels[a.role]}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-700">
                          {a.phone}
                          {a.verified && <span title="Mobile verified by OTP"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /></span>}
                        </div>
                        {a.email && <div className="text-xs text-slate-500">{a.email}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{a.district ?? '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDate(a.createdAt)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500" title={formatDate(a.lastLoginAt, true)}>{timeAgo(a.lastLoginAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'blocked' ? <Badge tone="rose">Blocked</Badge> : <Badge tone="emerald">Active</Badge>}
                          <Button size="sm" tone="secondary" onClick={() => setTarget(a)} className={a.status === 'active' ? '!text-rose-600' : ''}>
                            {a.status === 'active' ? <><Ban className="h-3.5 w-3.5" /> Block</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Unblock</>}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-slate-100 md:hidden">
              {data.accounts.map((a) => (
                <li key={a.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">{a.name.charAt(0).toUpperCase()}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{a.name}</span>
                        {a.status === 'blocked' ? <Badge tone="rose">Blocked</Badge> : <Badge tone="emerald">Active</Badge>}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{roleLabels[a.role]}{a.district ? ` · ${a.district}` : ''} · joined {formatDate(a.createdAt)}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.phone && <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7]"><Phone className="h-3.5 w-3.5" /> {a.phone}</a>}
                        {a.email && <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><Mail className="h-3.5 w-3.5" /> {a.email}</a>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" tone="secondary" onClick={() => setTarget(a)} className={a.status === 'active' ? '!text-rose-600' : ''}>
                      {a.status === 'active' ? <><Ban className="h-3.5 w-3.5" /> Block account</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Unblock account</>}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!target}
        title={target?.status === 'active' ? 'Block this account?' : 'Unblock this account?'}
        text={target?.status === 'active'
          ? <><b className="text-slate-900">{target?.name}</b> will be signed out everywhere and cannot log in until you unblock them. Their listings stay as they are — reject them separately if needed.</>
          : <><b className="text-slate-900">{target?.name}</b> will be able to log in again.</>}
        confirmLabel={target?.status === 'active' ? 'Block account' : 'Unblock'}
        tone={target?.status === 'active' ? 'danger' : 'primary'}
        onConfirm={() => toggle(target!)}
        onClose={() => setTarget(null)}
      />
    </>
  );
}
