/* Decorative SVG illustrations for the admin panel (blue 3D-style, gradients). All are aria-hidden. */
import { useId } from 'react';

type P = { className?: string };

/** Graduation cap logo mark. */
export function CapLogo({ className = '' }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 96 72" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4fc3f7" />
          <stop offset="1" stopColor="#1565c0" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e88e5" />
          <stop offset="1" stopColor="#0d47a1" />
        </linearGradient>
      </defs>
      <path d="M22 34v14c0 6 12 12 26 12s26-6 26-12V34L48 46z" fill={`url(#${id}b)`} />
      <path d="M48 6 4 26l44 20 44-20z" fill={`url(#${id}t)`} />
      <path d="M48 6 4 26l44 20 44-20z" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
      <path d="M48 26 80 31v20" fill="none" stroke="#ffb300" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="54" r="4.5" fill="#ffb300" />
      <circle cx="48" cy="26" r="3" fill="#0d47a1" />
    </svg>
  );
}

/** Light-blue school building with trees. */
export function SchoolBuilding({ className = '' }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f2fd" />
          <stop offset="1" stopColor="#90caf9" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64b5f6" />
          <stop offset="1" stopColor="#1e88e5" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#81d4fa" />
          <stop offset="1" stopColor="#0288d1" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="160" rx="112" ry="8" fill="#1e88e5" opacity=".15" />
      {/* wings */}
      <rect x="30" y="78" width="70" height="80" fill={`url(#${id}w)`} />
      <rect x="140" y="78" width="70" height="80" fill={`url(#${id}w)`} />
      <path d="M24 80 65 58l41 22z" fill={`url(#${id}r)`} />
      <path d="M134 80l41-22 41 22z" fill={`url(#${id}r)`} />
      {/* centre + tower */}
      <rect x="92" y="54" width="56" height="104" fill="#bbdefb" />
      <path d="M86 58 120 34l34 24z" fill={`url(#${id}r)`} />
      <rect x="108" y="10" width="24" height="30" fill="#e3f2fd" />
      <path d="M104 12 120 0l16 12z" fill="#1e88e5" />
      <circle cx="120" cy="25" r="6" fill="#fff" stroke="#64b5f6" strokeWidth="2" />
      <path d="M120 21v4l3 2" stroke="#1565c0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* door */}
      <path d="M108 158v-30a12 12 0 0 1 24 0v30z" fill="#1976d2" />
      {/* windows */}
      {[42, 62, 82, 152, 172, 192].map((x) =>
        [92, 122].map((y) => <rect key={`${x}-${y}`} x={x - 6} y={y} width="12" height="16" rx="2" fill="#1e88e5" opacity=".75" />),
      )}
      {[104, 128].map((x) => <rect key={x} x={x} y={72} width="10" height="16" rx="2" fill="#1e88e5" opacity=".75" />)}
      {/* trees */}
      {[
        [14, 132, 18],
        [226, 128, 20],
        [212, 142, 14],
      ].map(([x, y, r]) => (
        <g key={x}>
          <rect x={x - 2} y={y + r - 6} width="4" height="22" fill="#1565c0" opacity=".6" />
          <circle cx={x} cy={y} r={r} fill={`url(#${id}t)`} />
        </g>
      ))}
    </svg>
  );
}

/** Clipboard with ticks and magnifier (approval queue). */
export function ClipboardArt({ className = '' }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#64b5f6" />
          <stop offset="1" stopColor="#1565c0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#42a5f5" />
          <stop offset="1" stopColor="#0d47a1" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="160" rx="62" ry="7" fill="#1e88e5" opacity=".15" />
      <rect x="14" y="20" width="108" height="134" rx="14" fill={`url(#${id}b)`} transform="rotate(-8 68 87)" />
      <rect x="24" y="30" width="88" height="114" rx="8" fill="#fff" transform="rotate(-8 68 87)" />
      <rect x="44" y="10" width="46" height="20" rx="8" fill="#1565c0" transform="rotate(-8 68 87)" />
      {[52, 80, 108].map((y, i) => (
        <g key={y} transform="rotate(-8 68 87)">
          <rect x="34" y={y} width="16" height="16" rx="4" fill="#e3f2fd" stroke="#90caf9" />
          <path d={`M37 ${y + 8}l4 4 7-8`} stroke="#1e88e5" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="56" y={y + 3} width={i === 1 ? 34 : 44} height="4" rx="2" fill="#bbdefb" />
          <rect x="56" y={y + 10} width="26" height="3" rx="1.5" fill="#e3f2fd" />
        </g>
      ))}
      <circle cx="112" cy="116" r="24" fill="#e3f2fd" stroke={`url(#${id}m)`} strokeWidth="8" />
      <path d="M100 116l8 8 14-15" stroke="#1e88e5" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M129 134l16 16" stroke="#0d47a1" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

/** Megaphone (recent activity). */
export function MegaphoneArt({ className = '' }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 140 110" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#64b5f6" />
          <stop offset="1" stopColor="#1565c0" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="102" rx="52" ry="6" fill="#1e88e5" opacity=".15" />
      <path d="M30 46h18l46-28v70L48 60H30a8 8 0 0 1-8-8v-0a8 8 0 0 1 8-6z" fill={`url(#${id}a)`} />
      <ellipse cx="94" cy="53" rx="8" ry="35" fill="#0d47a1" />
      <ellipse cx="94" cy="53" rx="4" ry="22" fill="#90caf9" />
      <path d="M38 60l8 28h12l-6-28z" fill="#1565c0" />
      <path d="M112 30l12-8M114 53h14M112 76l12 8" stroke="#ffb300" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Gold trophy (upcoming events). */
export function TrophyArt({ className = '' }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 140 150" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe082" />
          <stop offset=".5" stopColor="#ffb300" />
          <stop offset="1" stopColor="#e65100" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e88e5" />
          <stop offset="1" stopColor="#0d47a1" />
        </linearGradient>
      </defs>
      <path d="M40 30H18c0 26 12 38 28 40M100 30h22c0 26-12 38-28 40" fill="none" stroke={`url(#${id}g)`} strokeWidth="8" strokeLinecap="round" />
      <path d="M36 18h68v26c0 26-16 44-34 44S36 70 36 44z" fill={`url(#${id}g)`} />
      <path d="M70 34l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#fff8e1" opacity=".9" />
      <rect x="62" y="86" width="16" height="18" fill="#ffa000" />
      <rect x="44" y="102" width="52" height="12" rx="4" fill="#ffb300" />
      <rect x="30" y="112" width="80" height="26" rx="6" fill={`url(#${id}s)`} />
      <rect x="50" y="120" width="40" height="8" rx="3" fill="#90caf9" opacity=".6" />
      {[[18, 14, '#ffb300'], [124, 20, '#4fc3f7'], [128, 90, '#ffb300'], [12, 84, '#4fc3f7']].map(([x, y, c]) => (
        <rect key={`${x}`} x={x as number} y={y as number} width="7" height="7" rx="1.5" fill={c as string} transform={`rotate(30 ${x} ${y})`} />
      ))}
    </svg>
  );
}

/** Soft background waves + dot grids for the page canvas. */
export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#eef6ff_0%,#e3f0ff_45%,#f3f8ff_100%)]" />
      <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[10%] h-[460px] w-[620px] rounded-full bg-blue-300/20 blur-3xl" />
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 260" preserveAspectRatio="none">
        <path d="M0 160c240-80 480-80 720-20s480 60 720-40v160H0z" fill="#dbeafe" opacity=".6" />
        <path d="M0 200c260-50 520-40 760 0s460 30 680-30v90H0z" fill="#bfdbfe" opacity=".45" />
      </svg>
      <div className="absolute bottom-24 left-[22%] h-28 w-40 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-60" />
      <div className="absolute right-8 top-[55%] h-32 w-28 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-60" />
    </div>
  );
}
