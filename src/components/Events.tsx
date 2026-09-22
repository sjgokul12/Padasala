import { useState, useRef } from 'react';
import {
  CalendarDays,
  MapPin,
  Building2,
  Trophy,
  GraduationCap,
  Music,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Swords,
  Crown,
  Flower2,
} from 'lucide-react';
import { events } from '@/data/content';
import bookAirplaneImg from '@/assets/book_airplane_3d.jpg';
import calendar3dImg from '@/assets/calendar_3d.jpg';

const categoryBadges: Record<string, { icon: typeof Trophy; label: string; textClass: string }> = {
  Competition: { icon: Trophy, label: 'Competition', textClass: 'text-amber-600' },
  Academic: { icon: GraduationCap, label: 'Academic', textClass: 'text-sky-600' },
  Cultural: { icon: Music, label: 'Cultural', textClass: 'text-pink-600' },
  Sports: { icon: Trophy, label: 'Sports', textClass: 'text-emerald-600' },
  Workshop: { icon: GraduationCap, label: 'Workshop', textClass: 'text-violet-600' },
};

const categoryBadgesRight: Record<string, { icon: typeof Swords; bg: string; color: string }> = {
  'Inter-School Silambam Championship': { icon: Swords, bg: 'bg-amber-50 border-amber-200/80', color: 'text-amber-600' },
  'District Chess Open Tournament': { icon: Crown, bg: 'bg-purple-50 border-purple-200/80', color: 'text-purple-600' },
  'Science & Robotics Expo 2025': { icon: Bot, bg: 'bg-sky-50 border-sky-200/80', color: 'text-sky-600' },
  'Annual Cultural Fest — Rangoli': { icon: Flower2, bg: 'bg-pink-50 border-pink-200/80', color: 'text-pink-600' },
};

export function Events() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const totalPages = 5;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const scrollToPage = (pageIdx: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      scrollRef.current.scrollTo({
        left: (pageIdx / (totalPages - 1)) * maxScroll,
        behavior: 'smooth',
      });
      setActivePage(pageIdx);
    }
  };

  return (
    <section
      id="events"
      className="relative overflow-hidden bg-gradient-to-b from-[#f0f7ff] via-white to-[#f4f9ff] py-16 sm:py-20 lg:py-24 select-none"
    >
      {/* Decorative Atmosphere Radial Aura */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-sky-200/35 via-blue-100/20 to-transparent blur-3xl rounded-full"
        aria-hidden
      />

      {/* Floating 3D Graphic - Top Left (Book & Paper Airplane) */}
      <div className="pointer-events-none absolute left-2 sm:left-6 md:left-10 lg:left-12 top-6 sm:top-8 w-24 sm:w-36 md:w-44 lg:w-48 z-0 opacity-85 sm:opacity-95">
        <div className="relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_50%,transparent_75%)]">
          <img
            src={bookAirplaneImg}
            alt="3D Book and Airplane"
            className="w-full h-auto drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Floating 3D Graphic - Top Right (3D Calendar & Slogan) */}
      <div className="pointer-events-none absolute right-2 sm:right-6 md:right-10 lg:right-14 top-6 sm:top-8 z-0 flex flex-col items-end opacity-90">
        <div className="w-20 sm:w-28 md:w-36 relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_50%,transparent_75%)]">
          <img
            src={calendar3dImg}
            alt="3D Calendar"
            className="w-full h-auto drop-shadow-xl"
            loading="lazy"
          />
        </div>
        {/* Handwritten Tagline */}
        <div className="hidden sm:flex flex-col items-center rotate-[-6deg] font-black tracking-tight mt-1 text-right">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#0284c7]">Learn</span>
            <span className="text-[10px] text-amber-400">✦</span>
          </div>
          <div className="text-sm sm:text-base font-black text-[#2563eb] -mt-1">Participate</div>
          <div className="text-base sm:text-lg font-black text-[#0369a1] -mt-1 underline decoration-amber-400 decoration-2">
            Grow
          </div>
        </div>
      </div>

      {/* Header Container */}
      <div className="container-page relative z-10 text-center max-w-3xl mx-auto px-4">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#edf4ff] border border-blue-200/80 shadow-[0_2px_8px_rgba(59,130,246,0.12)] text-[#2563eb] font-extrabold text-[11px] sm:text-xs tracking-wider uppercase mb-3 sm:mb-4">
          <CalendarDays className="h-3.5 w-3.5 fill-[#2563eb] text-[#2563eb]" />
          <span>School Events & Competitions</span>
        </div>

        {/* Main Heading */}
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          What's happening{' '}
          <span className="text-slate-900">in schools </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 underline decoration-amber-400 decoration-wavy decoration-2">
            near you
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm md:text-base font-semibold text-slate-500 tracking-wide max-w-2xl mx-auto">
          Sports, cultural, academic and workshop events posted by schools — register online and get reminders before the event.
        </p>
      </div>

      {/* Cards Grid / Scrollable Container */}
      <div className="container-page relative z-10 mt-10 sm:mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {events.map((e, idx) => {
            const badge = categoryBadges[e.category] ?? {
              icon: Trophy,
              label: e.category,
              textClass: 'text-sky-600',
            };
            const BadgeIcon = badge.icon;
            const rightDecor = categoryBadgesRight[e.title] ?? {
              icon: Sparkles,
              bg: 'bg-sky-50 border-sky-200/80',
              color: 'text-sky-600',
            };
            const RightIcon = rightDecor.icon;

            return (
              <article
                key={e.id}
                className="group relative flex flex-col justify-between rounded-[30px] sm:rounded-[34px] bg-white/85 backdrop-blur-2xl border-[1.5px] border-white p-3.5 sm:p-4 shadow-[0_12px_36px_rgba(2,132,199,0.07),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-white hover:shadow-[0_20px_45px_rgba(2,132,199,0.15)] hover:border-sky-200 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Image Container with Badges */}
                <div className="relative h-44 sm:h-48 w-full rounded-[22px] sm:rounded-[24px] overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                  {/* Top-Left Category Pill */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold shadow-sm border border-white">
                      <BadgeIcon className={`h-3 w-3 ${badge.textClass} stroke-[2.5]`} />
                      <span className={badge.textClass}>{badge.label}</span>
                    </span>
                  </div>

                  {/* Bottom-Right Date Pill */}
                  <div className="absolute bottom-2.5 right-2.5 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm border border-white">
                      <CalendarDays className="h-3 w-3 text-[#0284c7] stroke-[2.2]" />
                      <span>{e.date}</span>
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="flex-1 flex flex-col justify-between pt-4 pb-2 px-1">
                  <div>
                    {/* Event Title */}
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#0284c7] transition-colors line-clamp-2">
                      {e.title}
                    </h3>

                    {/* Meta Row: Date & Location */}
                    <div className="mt-2.5 flex items-center gap-3 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-[#0284c7]" />
                        {e.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#0284c7]" />
                        {e.location}
                      </span>
                    </div>

                    {/* Organizer Row */}
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">By {e.organizer}</span>
                    </div>
                  </div>

                  {/* Bottom Action Row: Register/Closed Button + Right Decorative Badge */}
                  <div className="mt-5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {/* Left CTA Button */}
                    {e.registrationOpen ? (
                      <a
                        href="#register"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] hover:from-[#007cf8] hover:to-[#0050d8] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_6px_18px_rgba(0,114,255,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100/90 text-slate-400 font-bold px-5 py-2.5 text-xs sm:text-sm border border-slate-200/80 cursor-not-allowed"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Closed</span>
                      </button>
                    )}

                    {/* Right Circular Emblem */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110 ${rightDecor.bg} ${rightDecor.color}`}
                    >
                      <RightIcon className="h-5 w-5 stroke-[2.2]" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel Navigation Controls & Pagination */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous events"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm hover:text-[#0284c7] hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToPage(idx)}
                aria-label={`Go to event slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activePage === idx
                    ? 'w-6 h-2 bg-blue-600 shadow-sm shadow-blue-500/40'
                    : 'w-2 h-2 bg-blue-200 hover:bg-blue-300'
                }`}
              />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next events"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 shadow-sm hover:text-[#0284c7] hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Decorative Wave Curves & Dots */}
      <div className="pointer-events-none absolute -bottom-4 -left-4 w-48 sm:w-72 h-20 sm:h-28 bg-gradient-to-tr from-sky-400/20 via-blue-300/10 to-transparent rounded-tr-full blur-xl" />
      <div className="pointer-events-none absolute bottom-4 right-6 w-24 h-24 bg-radial-dots opacity-40" />
    </section>
  );
}
