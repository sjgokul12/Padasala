import { useEffect, useState } from 'react';
import { Home, Building2, BookOpen, Briefcase, CalendarDays } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'schools', label: 'Schools', icon: Building2 },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'events', label: 'Events', icon: CalendarDays },
];

// App-style bottom tab bar, shown on phones only.
export function MobileNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const probe = window.innerHeight * 0.35;
      let current = 'home';
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Quick navigation"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_-8px_24px_rgba(2,132,199,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 px-1">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-0.5 pt-2 pb-2.5"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-sky-100 text-[#0284c7]' : 'text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-[#0284c7]' : 'text-slate-500'}`}>
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
