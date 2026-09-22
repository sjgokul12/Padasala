import { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

const nav = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Schools', href: '#schools' },
  { label: 'Courses', href: '#courses' },
  { label: 'Teacher Jobs', href: '#jobs' },
  { label: 'Tuition', href: '#tuition' },
  { label: 'Events', href: '#events' },
  { label: 'About', href: '#about' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-6 transition-all duration-300">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/70'
              : 'bg-white/80 backdrop-blur-xl shadow-[0_8px_25px_rgba(14,165,233,0.08)] ring-1 ring-white/80'
          }`}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] text-white shadow-md shadow-sky-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b1f33]">
              Pada<span className="text-[#0284c7]">sala</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`relative px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  n.active
                    ? 'text-[#0284c7]'
                    : 'text-slate-600 hover:text-[#0284c7]'
                }`}
              >
                {n.label}
                {n.active && (
                  <span className="absolute -bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[#0284c7]" />
                )}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#search"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 hover:bg-white text-slate-600 hover:text-[#0284c7] ring-1 ring-slate-200/80 transition-all shadow-sm hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            <a
              href="#login"
              className="rounded-full px-5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 bg-white/70 hover:bg-white transition shadow-sm"
            >
              Login
            </a>
            <a
              href="#register"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] hover:from-[#007cf8] hover:to-[#0050d8] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition-all hover:shadow-lg hover:shadow-sky-500/35 hover:-translate-y-0.5"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ring-1 ring-slate-200 text-slate-700"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="lg:hidden mt-2 overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl p-4 shadow-xl ring-1 ring-slate-200/80">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-2.5 text-base font-semibold ${
                    n.active ? 'bg-sky-50 text-[#0284c7]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                <a
                  href="#login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700"
                >
                  Login
                </a>
                <a
                  href="#register"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                >
                  Register <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
