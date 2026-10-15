import { useEffect } from 'react';
import { X, Briefcase, Truck, ChevronRight, LogIn, LogOut, UserPlus, LayoutDashboard, Database } from 'lucide-react';
import { useRoute, isActive } from '@/lib/router';
import { useSession, openLogin, logout, roles } from '@/lib/auth';
import { Logo, DownloadBadge, href, showDownload } from './nav';

const postingLinks = [
  { label: 'Teacher Job Posting', desc: 'Teachers post job requirements · school vacancies', to: '/teachers', icon: Briefcase, tone: 'from-[#009bf8] to-[#0062f5]' },
  { label: 'Vendors Posting', desc: 'Vendors post company details · school requirements', to: '/vendors', icon: Truck, tone: 'from-[#8b5cf6] to-[#6d28d9]' },
];

export function SideDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { path } = useRoute();
  const session = useSession();

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

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        role="dialog"
        aria-label="Side menu"
        className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-4 border-b border-slate-100">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Account */}
          {session ? (
            <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white p-4 ring-1 ring-sky-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#009bf8] to-[#0062f5] font-bold text-white">
                  {session.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-display font-bold text-[#0b1f33]">{session.name}</div>
                  <div className="text-xs text-slate-500">{roles[session.role].label}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={href(roles[session.role].home)} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0284c7] py-2 text-sm font-semibold text-white">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </a>
                <button onClick={logout} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-100">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => openLogin()} className="inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                <LogIn className="h-4 w-4" /> Login
              </button>
              <button onClick={() => openLogin('student', 'register')} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] to-[#0062f5] py-2.5 text-sm font-semibold text-white">
                <UserPlus className="h-4 w-4" /> Register
              </button>
            </div>
          )}

          {/* Posting portals */}
          <div>
            <div className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Post & find</div>
            <div className="space-y-2.5">
              {postingLinks.map(({ label, desc, to, icon: Icon, tone }) => (
                <a
                  key={to}
                  href={href(to)}
                  className={`flex items-center gap-3 rounded-3xl p-3.5 ring-1 transition ${isActive(path, to) ? 'bg-sky-50 ring-sky-200' : 'bg-white ring-slate-100 hover:ring-sky-200 hover:bg-sky-50/50'} shadow-sm`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-[#0b1f33]">{label}</span>
                    <span className="block text-xs text-slate-500 leading-snug">{desc}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </a>
              ))}
              {session?.role === 'admin' && (
                <a href={href('/admin')} className="flex items-center gap-3 rounded-3xl p-3.5 ring-1 ring-slate-100 bg-white shadow-sm hover:ring-sky-200">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md">
                    <Database className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-bold text-[#0b1f33]">Question Bank</span>
                    <span className="block text-xs text-slate-500">Upload NEET questions & papers</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

        </div>

        {showDownload && (
          <div className="border-t border-slate-100 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] flex items-center justify-between gap-3 bg-slate-50/60">
            <div className="text-xs text-slate-500 leading-snug">Get Padasala on your Android phone</div>
            <DownloadBadge />
          </div>
        )}
      </aside>
    </div>
  );
}
