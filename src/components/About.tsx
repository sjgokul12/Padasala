import {
  ShieldCheck,
  Users,
  MapPin,
  Sparkles,
  HeartHandshake,
  Target,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Shield,
  Star,
  ChevronRight,
} from 'lucide-react';
import aboutHeroImg from '@/assets/about_hero_3d.jpg';

/* 3D Glossy Vector Graphics for the 6 Right Cards */
function Card3DVisual({ type }: { type: string }) {
  switch (type) {
    case 'shield':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="shieldGrad" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <radialGradient id="shieldGlint" cx="30%" cy="25%" r="45%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Base Platform */}
          <ellipse cx="50" cy="84" rx="32" ry="8" fill="#dbeafe" opacity="0.8" />
          <ellipse cx="50" cy="82" rx="28" ry="6" fill="#bfdbfe" opacity="0.9" />
          {/* Shield 3D Outer */}
          <path
            d="M50 14 L80 26 C80 58, 50 80, 50 80 C50 80, 20 58, 20 26 Z"
            fill="url(#shieldGrad)"
          />
          {/* Glossy Bevel */}
          <path
            d="M50 18 L76 28 C76 56, 50 76, 50 76 C50 76, 24 56, 24 28 Z"
            fill="url(#shieldGlint)"
          />
          {/* White Glowing Checkmark */}
          <path
            d="M38 46 L46 54 L64 36"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'community':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="avatarGrad1" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="avatarGrad2" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="84" rx="34" ry="8" fill="#dbeafe" opacity="0.8" />
          {/* Left Avatar */}
          <g transform="translate(-14, 4)">
            <circle cx="45" cy="36" r="9" fill="url(#avatarGrad2)" />
            <path d="M30 68 C30 54, 60 54, 60 68 Z" fill="url(#avatarGrad2)" />
          </g>
          {/* Right Avatar */}
          <g transform="translate(14, 4)">
            <circle cx="55" cy="36" r="9" fill="url(#avatarGrad2)" />
            <path d="M40 68 C40 54, 70 54, 70 68 Z" fill="url(#avatarGrad2)" />
          </g>
          {/* Center Main Avatar */}
          <g>
            <circle cx="50" cy="30" r="12" fill="url(#avatarGrad1)" />
            <circle cx="46" cy="26" r="4" fill="#ffffff" opacity="0.7" />
            <path d="M30 68 C30 50, 70 50, 70 68 Z" fill="url(#avatarGrad1)" />
          </g>
        </svg>
      );

    case 'map':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="mapFold1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="mapFold2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="pinGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="82" rx="34" ry="7" fill="#dbeafe" opacity="0.8" />
          {/* 3D Folded Map Base */}
          <polygon points="16,56 38,48 38,78 16,84" fill="url(#mapFold1)" />
          <polygon points="38,48 62,56 62,84 38,78" fill="url(#mapFold2)" />
          <polygon points="62,56 84,48 84,78 62,84" fill="url(#mapFold1)" />
          {/* Map Grid Roads */}
          <line x1="22" y1="62" x2="34" y2="58" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="42" y1="58" x2="58" y2="64" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="66" y1="64" x2="78" y2="58" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          {/* Floating Location Pin */}
          <g transform="translate(0, -6)">
            <path
              d="M50 20 C42 20, 36 26, 36 34 C36 45, 50 58, 50 58 C50 58, 64 45, 64 34 C64 26, 58 20, 50 20 Z"
              fill="url(#pinGrad)"
            />
            <circle cx="50" cy="33" r="5.5" fill="#ffffff" />
            <circle cx="48" cy="31" r="2" fill="#0284c7" />
          </g>
        </svg>
      );

    case 'chart':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="84" rx="34" ry="7" fill="#dbeafe" opacity="0.8" />
          {/* 3D Bar 1 */}
          <rect x="22" y="54" width="14" height="26" rx="4" fill="url(#barGrad1)" />
          {/* 3D Bar 2 */}
          <rect x="42" y="40" width="14" height="40" rx="4" fill="url(#barGrad2)" />
          {/* 3D Bar 3 */}
          <rect x="62" y="24" width="14" height="56" rx="4" fill="url(#barGrad3)" />
          {/* Upward Growth Arrow */}
          <path
            d="M18 56 Q45 36 78 18"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="74,14 86,16 82,28" fill="#0ea5e9" />
        </svg>
      );

    case 'lotus':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="lotusGrad1" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="lotusGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="82" rx="32" ry="7" fill="#dbeafe" opacity="0.8" />
          {/* Left Petal */}
          <path
            d="M50 72 C32 68, 16 52, 28 36 C42 46, 48 62, 50 72 Z"
            fill="url(#lotusGrad2)"
            opacity="0.9"
          />
          {/* Right Petal */}
          <path
            d="M50 72 C68 68, 84 52, 72 36 C58 46, 52 62, 50 72 Z"
            fill="url(#lotusGrad2)"
            opacity="0.9"
          />
          {/* Center Petal */}
          <path
            d="M50 20 C40 38, 42 60, 50 72 C58 60, 60 38, 50 20 Z"
            fill="url(#lotusGrad1)"
          />
          <circle cx="50" cy="32" r="3" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'mobile':
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_8px_16px_rgba(2,132,199,0.22)]">
          <defs>
            <linearGradient id="phoneBody" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="phoneScreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="84" rx="30" ry="7" fill="#dbeafe" opacity="0.8" />
          {/* Phone Body with 3D tilt */}
          <g transform="rotate(12 50 50)">
            <rect x="30" y="16" width="40" height="66" rx="10" fill="url(#phoneBody)" />
            {/* Screen */}
            <rect x="33" y="20" width="34" height="58" rx="7" fill="url(#phoneScreen)" />
            {/* Top Speaker pill */}
            <rect x="44" y="23" width="12" height="2" rx="1" fill="#94a3b8" />
            {/* Screen Checkmark Bubble */}
            <circle cx="50" cy="46" r="9" fill="#0284c7" />
            <path
              d="M45 46 L48 50 L56 42"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

const points = [
  {
    icon: ShieldCheck,
    title: 'Verified listings only',
    desc: 'Every school, tutor and job is checked before going live.',
    visualType: 'shield',
  },
  {
    icon: Users,
    title: 'Whole community',
    desc: 'Students, parents, schools, teachers and coaches on one platform.',
    visualType: 'community',
  },
  {
    icon: MapPin,
    title: 'Hyperlocal & pan-India',
    desc: 'Find what is near you or explore opportunities across the country.',
    visualType: 'map',
  },
  {
    icon: Target,
    title: 'Outcomes focused',
    desc: 'Mock tests, analytics and admission tracking built in from day one.',
    visualType: 'chart',
  },
  {
    icon: HeartHandshake,
    title: 'Skill & culture',
    desc: 'Chess, silambam, yoga and cultural events alongside academics.',
    visualType: 'lotus',
  },
  {
    icon: Sparkles,
    title: 'Modern experience',
    desc: 'A clean, fast and responsive interface on every device.',
    visualType: 'mobile',
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-[#eaf4fe] via-[#f4f9ff] to-[#e0f0fe] py-14 sm:py-20 lg:py-24 select-none text-slate-800"
    >
      {/* Decorative Atmosphere Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/40 via-blue-100/20 to-transparent blur-3xl rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 w-[600px] h-[300px] bg-gradient-to-b from-blue-200/30 to-transparent blur-3xl rounded-full"
        aria-hidden
      />

      {/* Decorative Wave Curves at Bottom */}
      <div className="pointer-events-none absolute -bottom-4 -left-4 w-60 sm:w-80 h-28 sm:h-36 bg-gradient-to-tr from-sky-400/20 via-blue-300/10 to-transparent rounded-tr-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-4 -right-4 w-60 sm:w-80 h-28 sm:h-36 bg-gradient-to-tl from-purple-400/20 via-indigo-300/10 to-transparent rounded-tl-full blur-2xl" />

      <div className="container-page relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 xl:gap-14 items-center">

          {/* Left Column: Heading, Paragraphs, Trust Badges, 3D Hero Art & Promise Card */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-7 reveal">
            {/* Eyebrow Badge */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf4ff] border border-blue-200/80 shadow-[0_2px_8px_rgba(59,130,246,0.12)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0284c7]">
                <GraduationCap className="h-4 w-4 stroke-[2.4]" /> ABOUT PADASALA
              </span>
            </div>

            {/* Main Title */}
            <h2 className="font-display text-[26px] sm:text-4xl lg:text-[44px] xl:text-[48px] font-black leading-[1.12] tracking-tight text-slate-900 text-balance">
              An education platform built for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 underline decoration-sky-400 decoration-wavy decoration-2">
                next decade
              </span>
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-3.5 text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
              <p>
                Schools, students, teachers and tutors on <strong className="text-slate-900 font-bold">one trusted platform</strong>.
              </p>
              <p>
                Find the right school, course or mentor — <strong className="text-slate-900 font-bold">without endless calls and forms</strong>.
              </p>
            </div>

            {/* Trust Badges Strip (3 Items in Frosted Glass Box) */}
            <div className="flex items-center justify-between gap-1 rounded-2xl bg-white/60 backdrop-blur-md border border-white p-2.5 sm:p-3 shadow-sm text-[11px] sm:text-xs font-bold text-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#0284c7] shrink-0 stroke-[2.5]" />
                <span>Trusted Platform</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#0284c7] shrink-0 stroke-[2.5]" />
                <span>10K+ Users</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>100% Secure</span>
              </div>
            </div>

            {/* 3D Illustration Graphic (Cap on books with diploma scroll on pedestal) */}
            <div className="relative py-0 sm:py-2 flex justify-center">
              <div className="w-36 sm:w-64 md:w-72 relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_55%,transparent_75%)] transition-transform duration-700 hover:scale-105">
                <img
                  src={aboutHeroImg}
                  alt="3D Graduation Cap on Books with Diploma"
                  className="w-full h-auto drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom "Our promise" Glassmorphic Card */}
            <div className="group rounded-[26px] bg-white/70 backdrop-blur-xl border-[1.5px] border-white p-4 sm:p-5 shadow-[0_10px_28px_rgba(2,132,199,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00a8ff] via-[#0084ff] to-[#0060f0] text-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Target className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                    Our promise
                  </h3>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5">
                    Trustworthy information, real people behind every listing, and tools that actually help students and schools succeed.
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-sky-100 text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white transition-all shrink-0 shadow-sm">
                <ArrowRight className="h-4 w-4 stroke-[2.4]" />
              </div>
            </div>

          </div>

          {/* Right Column: 6 Frosted Glass Feature Cards Grid (2 cols x 3 rows) */}
          <div className="reveal-stagger lg:col-span-7 rail [--rail-gutter:16px] md:grid md:grid-cols-2 gap-4 sm:gap-5">
            {points.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="group relative rounded-[26px] sm:rounded-[28px] bg-white/75 backdrop-blur-2xl border-[1.5px] border-white p-4 sm:p-5 shadow-[0_10px_30px_rgba(2,132,199,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-white/95 hover:shadow-[0_18px_40px_rgba(2,132,199,0.14)] hover:border-sky-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[160px] sm:min-h-[175px]"
                >
                  {/* Top Row: Icon Badge & Right 3D Visual Graphic */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009bf8] to-[#0062f5] text-white shadow-[0_4px_12px_rgba(0,114,255,0.3)] shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5 stroke-[2.2]" />
                    </div>

                    {/* Right 3D Visual Illustration */}
                    <div className="transition-transform duration-500 group-hover:scale-110 -mt-1 -mr-1">
                      <Card3DVisual type={p.visualType} />
                    </div>
                  </div>

                  {/* Card Content & Circular Arrow Row */}
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#0284c7] transition-colors leading-tight">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {p.desc}
                      </p>
                    </div>

                    {/* Right Circle Arrow Button */}
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 border border-sky-100 text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white transition-all shrink-0 shadow-sm">
                      <ChevronRight className="h-4 w-4 stroke-[2.4]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
