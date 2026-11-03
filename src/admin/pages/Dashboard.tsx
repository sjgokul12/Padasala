import { useEffect, useState } from 'react';
import {
  Users, School, BookOpenCheck, CalendarDays, UserRound, ArrowRight, ClipboardCheck, UserPlus, Zap, CheckCircle2, MapPin,
  GraduationCap, Store, Info, PlusCircle,
} from 'lucide-react';
import { adminApi, errorText, useAdminSession, listingTypes, formatDate, roleLabels, type ListingType, type ReviewStatus } from '../lib';
import { Card, CardHeader, Spinner, ErrorNote, PillLink } from '../ui';
import { ClipboardArt, MegaphoneArt, TrophyArt, SchoolBuilding } from '../illustrations';
import booksCap from '../assets/books-cap.webp';

interface Stats {
  listings: { c: ListingType; label: string; total: number; pending: number; approved: number; rejected: number }[];
  pending_total: number;
  accounts_total: number;
  students: number;
  signups: { date: string; count: number }[];
  recent: { c: ListingType; type: string; id: string; title: string; ownerName: string; status: ReviewStatus; updatedAt: number }[];
  upcoming_events: number;
  next_events: { id: number; title: string; event_date: string; venue: string; district: string | null }[];
  new_accounts: { name: string; role: string; created_at: string }[];
  days: number;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const queueIcons: Record<ListingType, { icon: typeof School; cls: string }> = {
  schoolProfiles: { icon: School, cls: 'from-sky-400 to-blue-600' },
  coaching: { icon: BookOpenCheck, cls: 'from-orange-300 to-orange-500' },
  events: { icon: CalendarDays, cls: 'from-rose-400 to-rose-600' },
  teacherProfiles: { icon: GraduationCap, cls: 'from-blue-400 to-indigo-600' },
  vendors: { icon: Store, cls: 'from-amber-300 to-orange-500' },
};

export function Dashboard() {
  const session = useAdminSession()!;
  const [days, setDays] = useState(14);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    adminApi<Stats>(`/api/admin/stats.php?days=${days}`).then(setStats).catch((e) => setError(errorText(e)));
  };
  useEffect(load, [days]);

  if (error) return <ErrorNote text={error} onRetry={load} />;
  if (!stats) return <Spinner />;

  const by = (c: ListingType) => stats.listings.find((l) => l.c === c)!;
  const firstPending = stats.listings.find((l) => l.pending > 0);

  const kpis = [
    {
      label: 'Waiting for approval', value: stats.pending_total, icon: Users, tone: 'from-sky-400 to-blue-600', wave: '#60a5fa',
      note: stats.pending_total ? <span className="font-semibold text-amber-600">Review now →</span> : <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All caught up</span>,
      href: firstPending ? `#/${listingTypes[firstPending.c].slug}` : undefined,
    },
    { label: 'Schools', value: by('schoolProfiles').approved, icon: School, tone: 'from-emerald-400 to-emerald-600', wave: '#34d399', note: `${by('schoolProfiles').total} total listed`, href: '#/schools' },
    { label: 'Coaching centres', value: by('coaching').approved, icon: BookOpenCheck, tone: 'from-violet-400 to-purple-600', wave: '#a78bfa', note: `${by('coaching').total} total listed`, href: '#/coaching' },
    { label: 'Upcoming events', value: stats.upcoming_events, icon: CalendarDays, tone: 'from-amber-300 to-orange-500', wave: '#fb923c', note: `${by('events').total} total posted`, href: '#/events' },
    { label: 'Students', value: stats.students, icon: UserRound, tone: 'from-cyan-400 to-teal-500', wave: '#2dd4bf', note: `+ ${stats.accounts_total} school, coaching & other accounts`, href: '#/students' },
  ];

  // Recent activities: new accounts + listing changes, newest first.
  const activities = [
    ...stats.new_accounts.map((a) => ({
      key: `a-${a.created_at}-${a.name}`,
      icon: PlusCircle, iconCls: 'text-emerald-500',
      title: `New account added · ${a.name}`,
      sub: roleLabels[a.role] ?? a.role,
      time: new Date(a.created_at.replace(' ', 'T')).getTime(),
      chip: { text: 'Success', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
      href: '#/accounts',
    })),
    ...stats.recent.map((r) => ({
      key: `l-${r.c}-${r.id}`,
      icon: r.c === 'events' ? CalendarDays : Info,
      iconCls: r.c === 'events' ? 'text-orange-500' : 'text-[#1e88e5]',
      title: `${listingTypes[r.c].singular.replace(/^./, (c) => c.toUpperCase())} ${r.status === 'pending' ? 'submitted' : r.status} · ${r.title}`,
      sub: r.ownerName,
      time: r.updatedAt,
      chip: r.status === 'pending'
        ? { text: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-amber-100' }
        : r.status === 'approved'
          ? { text: 'Approved', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-100' }
          : { text: 'Rejected', cls: 'bg-rose-50 text-rose-700 ring-rose-100' },
      href: `#/${listingTypes[r.c].slug}?open=${r.id}`,
    })),
  ].sort((a, b) => b.time - a.time).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e88e5] via-[#2196f3] to-[#64b5f6] px-5 py-4 text-white shadow-[0_14px_36px_-18px_rgba(21,101,192,0.6)] sm:px-7 sm:py-5">
        <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-3 md:pr-[260px]">
          <div className="min-w-0">
            <h1 className="font-display text-xl font-extrabold leading-tight sm:text-2xl">
              {greeting()}, <span className="whitespace-nowrap">{session.user.name.split(' ')[0]} <span aria-hidden>👋</span></span>
            </h1>
            <p className="mt-0.5 text-sm font-medium text-blue-50">Here's what's happening on Padasala.</p>
          </div>
          <a href="#overview" onClick={(e) => { e.preventDefault(); document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0b2545] shadow-md shadow-blue-900/20 transition hover:-translate-y-0.5">
            View Overview <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-3 hidden w-[250px] items-end justify-end md:flex" aria-hidden>
          <SchoolBuilding className="absolute bottom-0 right-0 h-[92%] opacity-95" />
          <img src={booksCap} alt="" className="relative z-10 mb-[-4px] mr-[118px] h-[118%] drop-shadow-xl" />
        </div>
      </section>

      {/* KPIs */}
      <div id="overview" className="grid scroll-mt-24 grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map(({ label, value, icon: Icon, tone, wave, note, href }, i) => (
          <a key={label} href={href} className={`group ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <Card className="relative h-full overflow-hidden p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_44px_-16px_rgba(21,101,192,0.4)]">
              <svg className="pointer-events-none absolute -bottom-1 right-0 h-16 w-32 opacity-25" viewBox="0 0 120 60" preserveAspectRatio="none" aria-hidden>
                <path d="M0 60 L0 42 C20 30 30 46 50 32 S80 10 100 22 L120 8 L120 60 Z" fill={wave} />
              </svg>
              <div className="relative flex items-start gap-3">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-white shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <div className="flex min-h-[2.5em] items-start text-sm font-bold leading-tight text-[#0b2545]">{label}</div>
                  <div className="mt-1 font-display text-3xl font-extrabold text-[#0b2545]">{value.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="relative mt-3 text-xs font-medium text-slate-500">{note}</div>
            </Card>
          </a>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr] [&>*]:min-w-0">
        {/* Approval queue */}
        <Card>
          <CardHeader icon={ClipboardCheck} title="Approval Queue" subtitle="Listings stay hidden until approved" action={<PillLink href={firstPending ? `#/${listingTypes[firstPending.c].slug}` : '#/schools'}>View All <ArrowRight className="h-3.5 w-3.5" /></PillLink>} />
          <div className="flex items-center gap-2 px-5 pb-5 sm:px-6">
            <ClipboardArt className="hidden w-28 shrink-0 sm:block 2xl:w-36" />
            <ul className="min-w-0 flex-1 divide-y divide-blue-50">
              {stats.listings.map((l) => {
                const { icon: Icon, cls } = queueIcons[l.c];
                return (
                  <li key={l.c}>
                    <a href={`#/${listingTypes[l.c].slug}`} className="flex items-center gap-3 rounded-xl px-1 py-2.5 hover:bg-blue-50/60">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${cls} text-white shadow`}><Icon className="h-[18px] w-[18px]" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[#0b2545]">{listingTypes[l.c].label}</span>
                        <span className="block whitespace-nowrap text-xs text-slate-500">{l.approved} approved • {l.rejected} rejected</span>
                      </span>
                      {l.pending > 0
                        ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{l.pending} pending</span>
                        : <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 ring-1 ring-cyan-100">Clear</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>

        {/* New accounts chart */}
        <Card>
          <CardHeader
            icon={UserPlus}
            title="New accounts"
            subtitle={`Schools, coaching, teachers, vendors & organizers · last ${stats.days} days`}
            action={
              <select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Range" className="rounded-full border-0 bg-blue-50 py-1.5 pl-3 pr-8 text-xs font-bold text-[#0b2545] ring-1 ring-blue-100 focus:ring-2 focus:ring-[#1e88e5]">
                <option value={7}>Last 7 Days</option>
                <option value={14}>Last 14 Days</option>
                <option value={30}>Last 30 Days</option>
              </select>
            }
          />
          <ColumnChart data={stats.signups} />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
        {/* Recent activity */}
        <Card>
          <CardHeader icon={Zap} title="Recent Activities" action={<PillLink href="#/accounts">View All <ArrowRight className="h-3.5 w-3.5" /></PillLink>} />
          <div className="flex items-center gap-2 px-5 pb-5 sm:px-6">
            <MegaphoneArt className="hidden w-32 shrink-0 sm:block" />
            {activities.length === 0 ? (
              <p className="flex-1 py-8 text-center text-sm text-slate-500">No activity yet. New accounts and listings will appear here.</p>
            ) : (
              <ul className="min-w-0 flex-1 divide-y divide-blue-50">
                {activities.map(({ key, icon: Icon, iconCls, title, sub, time, chip, href }) => (
                  <li key={key}>
                    <a href={href} className="flex items-center gap-3 rounded-xl px-1 py-2.5 hover:bg-blue-50/60">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow ring-1 ring-blue-50 ${iconCls}`}><Icon className="h-[18px] w-[18px]" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#0b2545]">{title}</span>
                        <span className="block truncate text-xs text-slate-500">{sub} · {formatDate(time, true)}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${chip.cls}`}>{chip.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Upcoming events */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#42a5f5] via-[#1e88e5] to-[#1565c0] p-6 text-white shadow-[0_20px_50px_-20px_rgba(21,101,192,0.6)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl" aria-hidden />
          <div className="relative flex items-start justify-between gap-3">
            <TrophyArt className="w-28 shrink-0 drop-shadow-xl sm:w-32" />
            <a href="#/events" className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#1565c0] shadow">View All <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
          <h2 className="relative mt-2 font-display text-2xl font-extrabold">Upcoming Events</h2>
          {stats.next_events.length === 0 ? (
            <p className="relative mt-1 text-sm text-blue-50">Events will appear here once posted and approved.</p>
          ) : (
            <ul className="relative mt-3 space-y-2">
              {stats.next_events.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-white/15 px-3 py-2.5 backdrop-blur">
                  <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-[#1565c0]">
                    <span className="text-[10px] font-bold uppercase leading-none">{new Date(`${e.event_date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span>
                    <span className="font-display text-lg font-extrabold leading-none">{new Date(`${e.event_date}T00:00:00`).getDate()}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{e.title}</span>
                    <span className="flex items-center gap-1 truncate text-xs text-blue-50"><MapPin className="h-3 w-3" /> {e.venue}{e.district ? `, ${e.district}` : ''}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/**
 * Single-series column chart: one gradient column per day on a pale track, today in a deeper blue,
 * a dashed average line and a hover tooltip. Columns shrink to fit any width (7, 14 or 30 days).
 */
function ColumnChart({ data }: { data: { date: string; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((n, d) => n + d.count, 0);
  const avg = total / data.length;
  const busiest = data.reduce((b, d) => (d.count > b.count ? d : b), data[0]);
  const label = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const showLabel = (i: number) => i === data.length - 1 || (data.length <= 7 ? true : i % Math.ceil(data.length / 6) === 0 && i < data.length - 2);

  return (
    <div className="px-5 pb-5 sm:px-6">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <div className="font-display text-3xl font-extrabold leading-none text-[#0b2545]">{total}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">new accounts</div>
        </div>
        <div className="border-l border-blue-100 pl-5">
          <div className="font-display text-lg font-extrabold leading-none text-[#1565c0]">{avg.toFixed(1)}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">per day</div>
        </div>
        {busiest.count > 0 && (
          <div className="border-l border-blue-100 pl-5">
            <div className="font-display text-lg font-extrabold leading-none text-[#1565c0]">{busiest === data[data.length - 1] ? 'Today' : label(busiest.date)}</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">busiest day</div>
          </div>
        )}
      </div>

      <div className="relative mt-5 h-44" role="img" aria-label={`New accounts per day over ${data.length} days: ${total} in total`}>
        {/* Average line */}
        {total > 0 && (
          <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-amber-400/70" style={{ bottom: `calc(24px + (100% - 24px) * ${avg / max})` }} aria-hidden>
            <span className="absolute -top-2.5 right-0 rounded-full bg-amber-100 px-1.5 text-[10px] font-bold text-amber-700">avg</span>
          </div>
        )}
        <div className="flex h-full items-stretch gap-[3px] sm:gap-1.5">
          {data.map((d, i) => {
            const today = i === data.length - 1;
            const h = d.count ? Math.max(6, (d.count / max) * 100) : 0;
            return (
              <div
                key={d.date}
                className="relative flex min-w-0 flex-1 flex-col items-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="relative w-full max-w-[34px] flex-1 overflow-hidden rounded-xl bg-blue-50/80" style={{ maxHeight: 'calc(100% - 24px)' }}>
                  <div
                    className={`absolute inset-x-0 bottom-0 rounded-xl transition-all duration-500 ${
                      today ? 'bg-gradient-to-t from-[#0d47a1] to-[#1e88e5]' : hover === i ? 'bg-gradient-to-t from-[#1565c0] to-[#42a5f5]' : 'bg-gradient-to-t from-[#1e88e5] to-[#90caf9]'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <div className="mt-1.5 h-[18px] whitespace-nowrap text-[10px] font-semibold text-slate-500">
                  {showLabel(i) ? (today ? 'Today' : label(d.date)) : ''}
                </div>
                {hover === i && (
                  <div className="pointer-events-none absolute bottom-full z-20 mb-1 -translate-y-1 whitespace-nowrap rounded-xl bg-[#0b2545] px-3 py-1.5 text-center text-xs text-white shadow-lg">
                    <div className="font-bold">{d.count} new</div>
                    <div className="text-blue-200">{today ? 'Today' : label(d.date)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
