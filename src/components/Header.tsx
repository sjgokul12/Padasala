import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Menu, ChevronDown, LogIn, LogOut, LayoutDashboard, UserPlus } from 'lucide-react';
import { useRoute, isActive } from '@/lib/router';
import { useSession, openLogin, logout, roles, roleOrder } from '@/lib/auth';
import { SideDrawer } from './SideDrawer';
import { DownloadBadge, Logo, mainNav, href } from './nav';

/** Click-to-open dropdown that closes on outside click. */
function Dropdown({ trigger, children, align = 'left', hover }: { trigger: (open: boolean) => ReactNode; children: ReactNode; align?: 'left' | 'right'; hover?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { path } = useRoute();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={hover ? () => setOpen(true) : undefined}
      onMouseLeave={hover ? () => setOpen(false) : undefined}
    >
      <div onClick={() => setOpen((v) => (hover ? true : !v))}>{trigger(open)}</div>
      {open && (
        <div className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} pt-2 z-50`} onClick={() => setOpen(false)}>
          <div className="w-72 rounded-3xl bg-white p-2 shadow-[0_20px_50px_rgba(8,47,73,0.18)] ring-1 ring-slate-200/80 animate-fadeUp">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const session = useSession();

  if (session) {
    const info = roles[session.role];
    return (
      <Dropdown
        align="right"
        trigger={(open) => (
          <button className="inline-flex items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 ring-1 ring-slate-200 hover:ring-sky-300 transition">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#009bf8] to-[#0062f5] text-xs font-bold text-white">
              {session.name.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[110px] truncate text-sm font-semibold text-slate-700">{session.name}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      >
        <div className="px-3 py-2">
          <div className="text-sm font-bold text-[#0b1f33] truncate">{session.name}</div>
          <div className="text-xs text-slate-500">Logged in as {info.label}</div>
        </div>
        <a href={href(info.home)} className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-[#0284c7]">
          <LayoutDashboard className="h-4 w-4" /> My dashboard
        </a>
        <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </Dropdown>
    );
  }

  return (
    <Dropdown
      align="right"
      trigger={(open) => (
        <button className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 bg-white/70 hover:bg-white transition shadow-sm">
          <LogIn className="h-4 w-4" /> Login
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    >
      <div className="px-3 pt-1.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Login as</div>
      {roleOrder.map((r) => {
        const { label, desc, icon: Icon } = roles[r];
        return (
          <button key={r} onClick={() => openLogin(r)} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left hover:bg-sky-50 group">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] group-hover:bg-white">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-800 group-hover:text-[#0284c7]">{label}</span>
              <span className="block text-[11px] text-slate-500">{desc}</span>
            </span>
          </button>
        );
      })}
      <button onClick={() => openLogin('student', 'register')} className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-sky-50 px-3 py-2.5 text-sm font-bold text-[#0284c7] hover:bg-sky-100">
        <UserPlus className="h-4 w-4" /> New user? Register
      </button>
    </Dropdown>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const { path } = useRoute();
  const session = useSession();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setDrawer(false), [path]);

  return (
    <>
      {/* Scroll progress */}
      <div
        ref={progressRef}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#009bf8] via-[#6366f1] to-[#a855f7] pt-[env(safe-area-inset-top)]"
        style={{ transform: 'scaleX(0)' }}
      />
      <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4 pt-3 sm:pt-5 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          <div
            className={`flex items-center justify-between gap-2 rounded-full pl-3 pr-2.5 sm:px-4 py-2 transition-all duration-300 ${
              scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/70'
                : 'bg-white/80 backdrop-blur-xl shadow-[0_8px_25px_rgba(14,165,233,0.08)] ring-1 ring-white/80'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Side menu (desktop) */}
              <button
                onClick={() => setDrawer(true)}
                aria-label="Open side menu"
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-[#0284c7] ring-1 ring-sky-100 hover:bg-sky-100 transition"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Logo />
            </div>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {mainNav.map((n) => {
                const active = isActive(path, n.to);
                const cls = `relative inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 xl:px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-[#0284c7] bg-sky-50' : 'text-slate-600 hover:text-[#0284c7]'
                }`;
                if (!n.children) return <a key={n.to} href={href(n.to)} className={cls}>{n.label}</a>;
                return (
                  <Dropdown
                    key={n.to}
                    hover
                    trigger={(open) => (
                      <button className={cls} aria-haspopup="menu" aria-expanded={open}>
                        {n.label}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  >
                    {n.children.map((c) => (
                      <a key={c.to} href={href(c.to)} className={`block rounded-2xl px-3.5 py-2.5 hover:bg-sky-50 group ${path === c.to ? 'bg-sky-50' : ''}`}>
                        <span className="block text-sm font-bold text-slate-800 group-hover:text-[#0284c7]">{c.label}</span>
                        <span className="block text-xs text-slate-500">{c.desc}</span>
                      </a>
                    ))}
                  </Dropdown>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              <DownloadBadge />
              <AccountMenu />
              {!session && (
                <button
                  onClick={() => openLogin('student', 'register')}
                  className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Register
                </button>
              )}
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2">
              <DownloadBadge compact />
              {session ? (
                <button
                  onClick={() => setDrawer(true)}
                  aria-label="My account"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#009bf8] to-[#0062f5] text-sm font-bold text-white shadow-sm"
                >
                  {session.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={() => openLogin()}
                  aria-label="Login"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-[#0284c7] ring-1 ring-sky-100"
                >
                  <LogIn className="h-[18px] w-[18px]" />
                </button>
              )}
              <button
                onClick={() => setDrawer(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ring-1 ring-slate-200 text-slate-700"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <SideDrawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}
