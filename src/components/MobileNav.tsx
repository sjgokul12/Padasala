import { Home, Building2, BookOpen, GraduationCap, CalendarDays } from 'lucide-react';
import { useRoute, isActive } from '@/lib/router';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/schools', label: 'Schools', icon: Building2 },
  { to: '/coaching', label: 'Coaching', icon: BookOpen, href: '/coaching/academic' },
  { to: '/students', label: 'Student', icon: GraduationCap },
  { to: '/events', label: 'Events', icon: CalendarDays },
];

// App-style bottom tab bar, shown on phones only.
export function MobileNav() {
  const { path } = useRoute();

  return (
    <nav
      aria-label="Quick navigation"
      className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_-8px_24px_rgba(2,132,199,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 px-1">
        {items.map(({ to, label, icon: Icon, href }) => {
          const active = isActive(path, to);
          return (
            <a
              key={to}
              href={`#${href ?? to}`}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-0.5 pt-2 pb-2.5"
            >
              <span className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-sky-100 text-[#0284c7]' : 'text-slate-500'}`}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              </span>
              <span className={`text-[11px] font-semibold ${active ? 'text-[#0284c7]' : 'text-slate-500'}`}>{label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
