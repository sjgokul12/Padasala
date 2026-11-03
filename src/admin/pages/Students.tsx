import { useEffect, useRef, useState } from 'react';
import {
  Search, Ban, CheckCircle2, Phone, Mail, ShieldCheck, Users, Activity, ClipboardList, BookOpen, MapPin, School, Target, UserRound, Eye,
} from 'lucide-react';
import { classLevels } from '@/data/forms';
import { adminApi, errorText, toast, formatDate, timeAgo } from '../lib';
import { Card, PageHeader, Spinner, ErrorNote, EmptyState, Button, ConfirmDialog, Badge, SidePanel, Pager, inputCls } from '../ui';
import booksCap from '../assets/books-cap.webp';

interface Student {
  id: number;
  name: string;
  accountName: string;
  phone: string | null;
  email: string | null;
  status: 'active' | 'blocked';
  verified: boolean;
  district: string | null;
  photo: string | null;
  classLevel: string | null;
  targetExam: string | null;
  school: string | null;
  board: string | null;
  parentName: string | null;
  hasProfile: boolean;
  tests: number;
  bestPct: number | null;
  lastTestAt: string | null;
  tuition: number;
  createdAt: string;
  lastLoginAt: string | null;
}

interface Summary { total: number; active_7d: number; tests: number; tuition_requests: number; with_profile: number }

interface Detail {
  student: Student;
  attempts: { id: number; title: string; mode: string; score: number; max: number; correct: number; wrong: number; skipped: number; total: number; durationSec: number; createdAt: string }[];
  tuition: { id: number; studentName: string; classLevel: string; subjects: string[]; mode: string; area: string; district: string | null; budget: string | null; phone: string; details: string | null; createdAt: string }[];
  logins: { method: string; created_at: string }[];
}

const exams = ['NEET', 'JEE', 'Board exams', 'Foundation / Olympiad', 'Other'];
const PER_PAGE = 15;

export function Students() {
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [cls, setCls] = useState('');
  const [exam, setExam] = useState('');
  const [data, setData] = useState<{ students: Student[]; summary: Summary } | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const [target, setTarget] = useState<Student | null>(null);
  const requestNo = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => setQ(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  const load = () => {
    setError('');
    const no = ++requestNo.current;
    adminApi<{ students: Student[]; summary: Summary }>(`/api/admin/students.php?${new URLSearchParams({ q, status, class: cls, exam })}`)
      .then((d) => no === requestNo.current && setData(d))
      .catch((e) => no === requestNo.current && setError(errorText(e)));
  };
  useEffect(load, [q, status, cls, exam]);
  useEffect(() => setPage(1), [q, status, cls, exam]);

  const toggle = async (s: Student) => {
    const next = s.status === 'active' ? 'blocked' : 'active';
    try {
      await adminApi('/api/admin/students.php', { method: 'POST', body: { id: s.id, status: next } });
      toast(next === 'blocked' ? `Blocked ${s.name}` : `Unblocked ${s.name}`);
      setTarget(null);
      load();
    } catch (e) {
      toast(errorText(e), 'error');
    }
  };

  const list = data?.students ?? [];
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const sum = data?.summary;

  const kpis = [
    { label: 'Students', value: sum?.total, icon: Users, tone: 'from-sky-400 to-blue-600', note: `${sum?.with_profile ?? 0} with a profile` },
    { label: 'Active this week', value: sum?.active_7d, icon: Activity, tone: 'from-emerald-400 to-emerald-600', note: 'Signed in in the last 7 days' },
    { label: 'Mock tests taken', value: sum?.tests, icon: ClipboardList, tone: 'from-violet-400 to-purple-600', note: 'All students together' },
    { label: 'Tuition requests', value: sum?.tuition_requests, icon: BookOpen, tone: 'from-amber-300 to-orange-500', note: 'Seen by coaching centres' },
  ];

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={<>All student and parent accounts, their profiles, mock-test results and tuition requests. <span className="text-[#1e88e5]">Student details are private — only you can see this page.</span></>}
        art={<img src={booksCap} alt="" className="mb-1 mr-10 h-[92%] drop-shadow-xl" />}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, tone, note }) => (
          <Card key={label} className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-white shadow-lg`}><Icon className="h-6 w-6" /></span>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-tight text-[#0b2545]">{label}</div>
                <div className="font-display text-2xl font-extrabold text-[#0b2545]">{value === undefined ? '—' : value.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">{note}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[1fr_170px_190px_150px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1565c0]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, school, parent…" className={`${inputCls} h-12 pl-12`} />
        </div>
        <select value={cls} onChange={(e) => setCls(e.target.value)} className={`${inputCls} h-12 font-semibold`} aria-label="Class">
          <option value="">All classes</option>
          {classLevels.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={exam} onChange={(e) => setExam(e.target.value)} className={`${inputCls} h-12 font-semibold`} aria-label="Preparing for">
          <option value="">All exams</option>
          {exams.map((x) => <option key={x}>{x}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} h-12 font-semibold`} aria-label="Status">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <div className="p-4"><ErrorNote text={error} onRetry={load} /></div>
        ) : !data ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState icon={UserRound} title={q || cls || exam || status ? 'No matching students' : 'No students yet'} text="Student and parent accounts appear here as soon as they register." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-extrabold uppercase tracking-wide text-[#0b2545]">
                  <tr className="border-b border-blue-50">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-4 py-4">Class · exam</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Mock tests</th>
                    <th className="px-4 py-4">Last sign-in</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/80">
                  {shown.map((s) => (
                    <tr key={s.id} className={`group transition ${s.status === 'blocked' ? 'bg-rose-50/40' : 'bg-white/40 hover:bg-blue-50/50'}`}>
                      <td className="px-6 py-3.5">
                        <button onClick={() => setOpenId(s.id)} className="flex items-center gap-3 text-left">
                          <Avatar s={s} />
                          <span className="min-w-0">
                            <span className="block truncate font-bold text-[#0b2545] group-hover:text-[#1565c0]">{s.name}</span>
                            <span className="block truncate text-[13px] text-[#1e88e5]">{s.school || (s.hasProfile ? '—' : 'No profile yet')}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        {s.classLevel ? <div className="font-semibold text-[#0b2545]">{s.classLevel}</div> : <span className="text-slate-400">—</span>}
                        {s.targetExam && <div className="text-xs text-slate-500">{s.targetExam}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 font-semibold text-[#0b2545]">{s.phone}{s.verified && <span title="Mobile verified by OTP"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /></span>}</div>
                        {s.district && <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" />{s.district}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        {s.tests ? (
                          <>
                            <div className="font-semibold text-[#0b2545]">{s.tests} test{s.tests > 1 ? 's' : ''}</div>
                            <div className="text-xs text-slate-500">Best {s.bestPct ?? 0}% · {timeAgo(s.lastTestAt)}</div>
                          </>
                        ) : <span className="text-slate-400">None yet</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-[#1e88e5]" title={formatDate(s.lastLoginAt, true)}>{timeAgo(s.lastLoginAt)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {s.status === 'blocked' ? <Badge tone="rose">Blocked</Badge> : <Badge tone="emerald">Active</Badge>}
                          <button onClick={() => setOpenId(s.id)} aria-label="View details" title="View details" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/80 text-[#1565c0] ring-1 ring-blue-100 hover:bg-blue-100"><Eye className="h-[18px] w-[18px]" /></button>
                          <Button size="sm" tone="secondary" onClick={() => setTarget(s)} className={s.status === 'active' ? '!text-rose-600' : ''}>
                            {s.status === 'active' ? <><Ban className="h-3.5 w-3.5" /> Block</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Unblock</>}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-blue-50 md:hidden">
              {shown.map((s) => (
                <li key={s.id} className="p-4">
                  <button onClick={() => setOpenId(s.id)} className="flex w-full items-start gap-3 text-left">
                    <Avatar s={s} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#0b2545]">{s.name}</span>
                        {s.status === 'blocked' ? <Badge tone="rose">Blocked</Badge> : <Badge tone="emerald">Active</Badge>}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#1e88e5]">{[s.classLevel, s.targetExam].filter(Boolean).join(' · ') || 'No profile yet'}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{s.phone} · {s.tests} tests · {timeAgo(s.lastLoginAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <Pager page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </Card>

      <SidePanel open={openId !== null} onClose={() => setOpenId(null)} title="Student details">
        {openId !== null && <StudentDetail id={openId} onBlockToggle={(s) => setTarget(s)} />}
      </SidePanel>

      <ConfirmDialog
        open={!!target}
        title={target?.status === 'active' ? 'Block this student?' : 'Unblock this student?'}
        text={target?.status === 'active'
          ? <><b className="text-slate-900">{target?.name}</b> will be signed out everywhere and cannot log in until you unblock them.</>
          : <><b className="text-slate-900">{target?.name}</b> will be able to log in again.</>}
        confirmLabel={target?.status === 'active' ? 'Block student' : 'Unblock'}
        tone={target?.status === 'active' ? 'danger' : 'primary'}
        onConfirm={async () => { await toggle(target!); setOpenId(null); }}
        onClose={() => setTarget(null)}
      />
    </>
  );
}

function Avatar({ s, big }: { s: Student; big?: boolean }) {
  const size = big ? 'h-20 w-20 text-2xl' : 'h-12 w-12 text-sm';
  const initials = s.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return s.photo ? (
    <img src={s.photo} alt="" className={`${size} shrink-0 rounded-2xl object-cover ring-4 ring-blue-50`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 font-display font-extrabold text-white shadow-md shadow-indigo-500/30`}>
      {initials}
    </span>
  );
}

function StudentDetail({ id, onBlockToggle }: { id: number; onBlockToggle: (s: Student) => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    adminApi<Detail>(`/api/admin/students.php?id=${id}`).then(setD).catch((e) => setError(errorText(e)));
  }, [id]);

  if (error) return <ErrorNote text={error} />;
  if (!d) return <Spinner />;
  const s = d.student;
  const info: [typeof School, string, string | null][] = [
    [School, 'School', s.school ? `${s.school}${s.board ? ` (${s.board})` : ''}` : null],
    [Target, 'Preparing for', s.targetExam],
    [BookOpen, 'Class', s.classLevel],
    [UserRound, 'Parent / guardian', s.parentName],
    [MapPin, 'District', s.district],
    [Mail, 'Email', s.email],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar s={s} big />
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-extrabold text-[#0b2545]">{s.name}</div>
          <div className="text-sm text-slate-500">Joined {formatDate(s.createdAt)} · last sign-in {timeAgo(s.lastLoginAt)}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.phone && <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1565c0] ring-1 ring-blue-100"><Phone className="h-3.5 w-3.5" /> {s.phone}</a>}
            {s.status === 'blocked' ? <Badge tone="rose">Blocked</Badge> : <Badge tone="emerald">Active</Badge>}
            {s.verified && <Badge tone="sky"><ShieldCheck className="h-3 w-3" /> Mobile verified</Badge>}
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Profile</h3>
        {!s.hasProfile ? (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-100">This student has not filled in a profile yet.</p>
        ) : (
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {info.filter(([, , v]) => v).map(([Icon, label, v]) => (
              <div key={label} className="flex items-start gap-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1e88e5]" />
                <div><dt className="text-xs text-slate-500">{label}</dt><dd className="text-sm font-semibold text-[#0b2545]">{v}</dd></div>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mock tests ({d.attempts.length})</h3>
        {d.attempts.length === 0 ? (
          <p className="text-sm text-slate-500">No mock tests taken yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl ring-1 ring-blue-50">
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-50/60 text-[11px] font-bold uppercase text-slate-500">
                <tr><th className="px-3 py-2">Test</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">✓ / ✗ / –</th><th className="px-3 py-2">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {d.attempts.map((a) => {
                  const pct = a.max ? Math.round((100 * a.score) / a.max) : 0;
                  return (
                    <tr key={a.id}>
                      <td className="px-3 py-2"><div className="font-semibold text-[#0b2545]">{a.title}</div><div className="text-xs text-slate-500">{a.mode} · {Math.round(a.durationSec / 60)} min</div></td>
                      <td className="px-3 py-2"><span className={`font-bold ${pct >= 60 ? 'text-emerald-600' : pct >= 35 ? 'text-amber-600' : 'text-rose-600'}`}>{a.score}/{a.max}</span><div className="text-xs text-slate-500">{pct}%</div></td>
                      <td className="px-3 py-2 text-xs"><span className="text-emerald-600">{a.correct}</span> / <span className="text-rose-600">{a.wrong}</span> / <span className="text-slate-500">{a.skipped}</span></td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">{formatDate(a.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Tuition requests ({d.tuition.length})</h3>
        {d.tuition.length === 0 ? (
          <p className="text-sm text-slate-500">No tuition requests posted.</p>
        ) : (
          <ul className="space-y-2">
            {d.tuition.map((t) => (
              <li key={t.id} className="rounded-xl bg-white p-3 ring-1 ring-blue-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-[#0b2545]">{t.subjects.join(', ')}</div>
                  <span className="text-xs text-slate-400">{formatDate(t.createdAt)}</span>
                </div>
                <div className="mt-0.5 text-xs text-slate-500">{[t.classLevel, t.mode, t.area, t.district, t.budget].filter(Boolean).join(' · ')}</div>
                {t.details && <p className="mt-1 text-sm text-slate-600">{t.details}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-slate-100 pt-4">
        <Button tone={s.status === 'active' ? 'secondary' : 'primary'} className={s.status === 'active' ? '!text-rose-600' : ''} onClick={() => onBlockToggle(s)}>
          {s.status === 'active' ? <><Ban className="h-4 w-4" /> Block this student</> : <><CheckCircle2 className="h-4 w-4" /> Unblock this student</>}
        </Button>
      </div>
    </div>
  );
}
