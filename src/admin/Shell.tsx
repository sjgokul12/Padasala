import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
import {
  LayoutDashboard, School, BookOpenCheck, CalendarDays, GraduationCap, Store, Users, Database, Settings,
  LogOut, Menu, X, ChevronDown, Search, Bell, CheckCircle2, Backpack,
} from 'lucide-react';
import { useRoute, navigate } from '@/lib/router';
import { useAdminSession, signOut, adminApi, listingTypes, type ListingType } from './lib';
import { BackgroundDecor, CapLogo } from './illustrations';

/* ---------- Pending counts (sidebar badges + bell) ---------- */

let pending: Partial<Record<ListingType, number>> = {};
const pendingListeners = new Set<() => void>();

export function refreshPending() {
  adminApi<{ listings: { c: ListingType; pending: number }[] }>('/api/admin/stats.php')
    .then((s) => {
      pending = Object.fromEntries(s.listings.map((l) => [l.c, l.pending]));
      pendingListeners.forEach((l) => l());
    })
    .catch(() => undefined);
}

const usePending = () =>
  useSyncExternalStore(
    (cb) => {
      pendingListeners.add(cb);
      return () => pendingListeners.delete(cb);
    },
    () => pending,
  );

/* ---------- Navigation ---------- */

const groups: { title: string; items: { to: string; label: string; icon: typeof School; type?: ListingType }[] }[] = [
  { title: '', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    title: 'Listings',
    items: [
      { to: '/schools', label: 'Schools', icon: School, type: 'schoolProfiles' },
      { to: '/coaching', label: 'Coaching', icon: BookOpenCheck, type: 'coaching' },
      { to: '/events', label: 'Events', icon: CalendarDays, type: 'events' },
      { to: '/teachers', label: 'Teachers', icon: GraduationCap, type: 'teacherProfiles' },
      { to: '/vendors', label: 'Vendors', icon: Store, type: 'vendors' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { to: '/students', label: 'Students', icon: Backpack },
      { to: '/accounts', label: 'Accounts', icon: Users },
      { to: '/questions', label: 'Question bank', icon: Database },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function Sidebar({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  const counts = usePending();
  return (
    <div className="relative flex h-full flex-col overflow-hidden border-r border-white bg-gradient-to-b from-white/95 to-blue-50/95 text-[#0b2545] backdrop-blur-2xl">
      <a href="#/" onClick={onNavigate} className="relative flex flex-col items-center px-4 pb-3 pt-5 text-center">
        <CapLogo className="h-11 w-14" />
        <span className="mt-1 font-display text-xl font-extrabold tracking-tight text-[#0b2545]">Padasala</span>
        <span className="text-[11px] font-medium text-[#1565c0]">Learn • Grow • Excel</span>
      </a>
      <div className="mx-4 mb-3 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
      <nav className="relative flex-1 space-y-4 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]" aria-label="Admin">
        {groups.map((g) => (
          <div key={g.title || 'main'}>
            {g.title && <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1565c0]/80">{g.title}</div>}
            <ul className="space-y-0.5">
              {g.items.map(({ to, label, icon: Icon, type }) => {
                const active = path === to;
                const n = type ? counts[type] ?? 0 : 0;
                return (
                  <li key={to}>
                    <a
                      href={`#${to}`}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        active ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-[#1565c0] shadow-sm' : 'text-[#0b2545] hover:bg-blue-50/70'
                      }`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? 'bg-gradient-to-br from-[#2196f3] to-[#1565c0] text-white shadow-md shadow-blue-500/30' : 'text-[#1565c0]'}`}>
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex-1">{label}</span>
                      {n > 0 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700" title={`${n} waiting for approval`}>{n}</span>
                      )}
                      {active && <span className="absolute right-1.5 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#1e88e5]" aria-hidden />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <p className="px-4 pb-4 text-center text-[10px] text-slate-400">© {new Date().getFullYear()} Padasala. All rights reserved.</p>
    </div>
  );
}

/** Opens on outside-click-close. */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return { open, setOpen, ref };
}

function Notifications() {
  const counts = usePending();
  const { open, setOpen, ref } = useDropdown();
  const items = (Object.keys(listingTypes) as ListingType[]).filter((t) => (counts[t] ?? 0) > 0);
  const total = items.reduce((n, t) => n + (counts[t] ?? 0), 0);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications: ${total} waiting for approval`}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#1565c0] ring-1 ring-white shadow-md shadow-blue-500/10 hover:bg-white"
      >
        <Bell className="h-[22px] w-[22px]" />
        {total > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">{total}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-blue-100 animate-fadeUp" onClick={() => setOpen(false)}>
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Waiting for approval</div>
          {items.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-4 text-sm font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> All caught up</div>
          ) : (
            items.map((t) => (
              <a key={t} href={`#/${listingTypes[t].slug}`} className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50">
                {listingTypes[t].label}
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{counts[t]} pending</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const session = useAdminSession()!;
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2.5 rounded-2xl py-1 pl-1 pr-2 hover:bg-white/60" aria-expanded={open}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2196f3] to-[#1565c0] text-lg font-bold text-white shadow-md shadow-blue-500/30">
          {session.user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-[140px] truncate font-display text-base font-bold text-[#0b2545]">{session.user.name}</span>
          <span className="block text-xs text-slate-500">@{session.user.username}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-[#0b2545] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-blue-100 animate-fadeUp" onClick={() => setOpen(false)}>
          <div className="px-3 py-2">
            <div className="truncate text-sm font-bold text-slate-900">{session.user.name}</div>
            <div className="truncate text-xs text-slate-500">{session.user.email ?? `@${session.user.username}`}</div>
          </div>
          <a href="#/settings" className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50">
            <Settings className="h-4 w-4 text-[#1e88e5]" /> Account settings
          </a>
          <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function GlobalSearch() {
  const { segments, query } = useRoute();
  const [value, setValue] = useState(segments[0] === 'search' ? query.get('q') ?? '' : '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };
  return (
    <form onSubmit={submit} role="search" className="relative hidden min-w-0 max-w-md flex-1 md:block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1565c0]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search here..."
        aria-label="Search schools, coaching, events, teachers and vendors"
        className="h-12 w-full rounded-full border-0 bg-white/80 pl-12 pr-4 text-[15px] text-slate-800 ring-1 ring-white shadow-md shadow-blue-500/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
      />
    </form>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { path } = useRoute();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    refreshPending();
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  }, [path]);

  return (
    <div className="relative min-h-screen">
      <BackgroundDecor />

      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 hidden w-[224px] shadow-[8px_0_30px_-12px_rgba(21,101,192,0.25)] transition-transform duration-300 lg:block ${collapsed ? '-translate-x-full' : ''}`}>
        <Sidebar path={path} />
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-slate-900/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute inset-y-0 left-0 w-[240px] max-w-[80%] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="absolute right-3 top-4 z-10 rounded-xl p-1.5 text-slate-500 hover:bg-blue-50">
            <X className="h-5 w-5" />
          </button>
          <Sidebar path={path} onNavigate={() => setMobileOpen(false)} />
        </aside>
      </div>

      <div className={`transition-[padding] duration-300 ${collapsed ? 'lg:pl-0' : 'lg:pl-[224px]'}`}>
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 backdrop-blur-md sm:gap-4 sm:px-6 lg:px-8 lg:py-4">
          <button
            onClick={() => (window.matchMedia('(min-width: 1024px)').matches ? setCollapsed((v) => !v) : setMobileOpen(true))}
            aria-label="Toggle menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[#0b2545] hover:bg-white/70"
          >
            <Menu className="h-6 w-6" />
          </button>
          <GlobalSearch />
          <span className="flex-1" />
          <Notifications />
          <UserMenu />
        </header>
        <main className="mx-auto min-w-0 max-w-[1400px] overflow-x-clip px-4 pb-10 pt-2 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
