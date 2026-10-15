import React from 'react';
import Marquee from 'react-fast-marquee';
import { Sparkles } from 'lucide-react';
import bookAirplaneImg from '@/assets/book_airplane_3d.jpg';
import gradCapImg from '@/assets/grad_cap_3d.jpg';

interface BoardSkillItem {
  id: string;
  title: string;
  accentColor: string;
  gradient: string;
  glowColor: string;
  iconType: string;
}

const items: BoardSkillItem[] = [
  {
    id: 'chess',
    title: 'Chess',
    accentColor: '#38bdf8',
    gradient: 'from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]',
    glowColor: 'rgba(37,99,235,0.35)',
    iconType: 'chess',
  },
  {
    id: 'silambam',
    title: 'Silambam',
    accentColor: '#f59e0b',
    gradient: 'from-[#fed7aa] via-[#f59e0b] to-[#d97706]',
    glowColor: 'rgba(245,158,11,0.35)',
    iconType: 'silambam',
  },
  {
    id: 'yoga',
    title: 'Yoga',
    accentColor: '#10b981',
    gradient: 'from-[#a7f3d0] via-[#10b981] to-[#059669]',
    glowColor: 'rgba(16,185,129,0.35)',
    iconType: 'yoga',
  },
  {
    id: 'spoken-english',
    title: 'Spoken English',
    accentColor: '#0ea5e9',
    gradient: 'from-[#7dd3fc] via-[#0ea5e9] to-[#0284c7]',
    glowColor: 'rgba(14,165,233,0.35)',
    iconType: 'spoken-english',
  },
  {
    id: 'robotics',
    title: 'Robotics',
    accentColor: '#a855f7',
    gradient: 'from-[#d8b4fe] via-[#a855f7] to-[#7c3aed]',
    glowColor: 'rgba(168,85,247,0.35)',
    iconType: 'robotics',
  },
  {
    id: 'fitness',
    title: 'Fitness',
    accentColor: '#f43f5e',
    gradient: 'from-[#fbcfe8] via-[#f43f5e] to-[#e11d48]',
    glowColor: 'rgba(244,63,94,0.35)',
    iconType: 'fitness',
  },
  {
    id: 'cbse',
    title: 'CBSE',
    accentColor: '#2563eb',
    gradient: 'from-[#93c5fd] via-[#3b82f6] to-[#1e40af]',
    glowColor: 'rgba(59,130,246,0.35)',
    iconType: 'cbse',
  },
  {
    id: 'state-board',
    title: 'State Board',
    accentColor: '#16a34a',
    gradient: 'from-[#86efac] via-[#22c55e] to-[#15803d]',
    glowColor: 'rgba(34,197,94,0.35)',
    iconType: 'state-board',
  },
  {
    id: 'neet',
    title: 'NEET',
    accentColor: '#e11d48',
    gradient: 'from-[#fda4af] via-[#f43f5e] to-[#be123c]',
    glowColor: 'rgba(244,63,94,0.35)',
    iconType: 'neet',
  },
  {
    id: 'jee',
    title: 'JEE Prep',
    accentColor: '#ea580c',
    gradient: 'from-[#fdba74] via-[#f97316] to-[#c2410c]',
    glowColor: 'rgba(249,115,22,0.35)',
    iconType: 'jee',
  },
  {
    id: 'matriculation',
    title: 'Matriculation',
    accentColor: '#ca8a04',
    gradient: 'from-[#fde047] via-[#eab308] to-[#ca8a04]',
    glowColor: 'rgba(234,179,8,0.35)',
    iconType: 'matriculation',
  },
  {
    id: 'olympiad',
    title: 'Olympiad',
    accentColor: '#7c3aed',
    gradient: 'from-[#c084fc] via-[#8b5cf6] to-[#6d28d9]',
    glowColor: 'rgba(139,92,246,0.35)',
    iconType: 'olympiad',
  },
  {
    id: 'coding',
    title: 'Coding & AI',
    accentColor: '#0891b2',
    gradient: 'from-[#67e8f9] via-[#06b6d4] to-[#0e7490]',
    glowColor: 'rgba(6,182,212,0.35)',
    iconType: 'coding',
  },
  {
    id: 'abacus',
    title: 'Abacus',
    accentColor: '#dc2626',
    gradient: 'from-[#fca5a5] via-[#ef4444] to-[#b91c1c]',
    glowColor: 'rgba(239,68,68,0.35)',
    iconType: 'abacus',
  },
];

/* 3D Glossy Vector Icons */
function Glossy3DIcon({ type }: { type: string }) {
  switch (type) {
    case 'chess':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="chessPawnGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <radialGradient id="chessHighlight" cx="35%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="28" r="13" fill="url(#chessPawnGrad)" />
          <circle cx="46" cy="24" r="5" fill="url(#chessHighlight)" />
          <ellipse cx="50" cy="42" rx="14" ry="4" fill="url(#chessPawnGrad)" />
          <path
            d="M40 44 C40 58, 34 66, 30 73 L70 73 C66 66, 60 58, 60 44 Z"
            fill="url(#chessPawnGrad)"
          />
          <ellipse cx="50" cy="73" rx="22" ry="5" fill="url(#chessPawnGrad)" />
          <path d="M26 73 L24 81 C24 83, 76 83, 76 81 L74 73 Z" fill="url(#chessPawnGrad)" />
          <ellipse cx="50" cy="81" rx="25" ry="5" fill="#cbd5e1" opacity="0.9" />
          <ellipse cx="50" cy="80" rx="24" ry="4.5" fill="url(#chessPawnGrad)" />
        </svg>
      );

    case 'silambam':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="stickGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="stickGrad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          <g transform="rotate(45 50 50)">
            <rect x="46" y="14" width="8" height="72" rx="4" fill="url(#stickGrad1)" />
            <line x1="46" y1="28" x2="54" y2="28" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="42" x2="54" y2="42" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="58" x2="54" y2="58" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="72" x2="54" y2="72" stroke="#451a03" strokeWidth="1.5" />
          </g>
          <g transform="rotate(-45 50 50)">
            <rect x="46" y="14" width="8" height="72" rx="4" fill="url(#stickGrad2)" />
            <line x1="46" y1="28" x2="54" y2="28" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="42" x2="54" y2="42" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="58" x2="54" y2="58" stroke="#451a03" strokeWidth="1.5" />
            <line x1="46" y1="72" x2="54" y2="72" stroke="#451a03" strokeWidth="1.5" />
          </g>
          <circle cx="50" cy="50" r="4" fill="#fef3c7" opacity="0.9" />
        </svg>
      );

    case 'yoga':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="yogaGrad" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
            <radialGradient id="yogaHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="27" r="16" fill="url(#yogaHalo)" />
          <circle cx="50" cy="27" r="9" fill="url(#yogaGrad)" />
          <path d="M45 36 L55 36 L57 57 C57 59, 43 59, 43 57 Z" fill="url(#yogaGrad)" />
          <path
            d="M45 38 C34 43, 25 51, 28 61 C30 64, 36 61, 43 55"
            fill="none"
            stroke="url(#yogaGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M55 38 C66 43, 75 51, 72 61 C70 64, 64 61, 57 55"
            fill="none"
            stroke="url(#yogaGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M20 72 C20 62, 35 59, 50 62 C65 59, 80 62, 80 72 C80 80, 68 80, 50 78 C32 80, 20 80, 20 72 Z"
            fill="url(#yogaGrad)"
          />
          <ellipse cx="26" cy="70" rx="5" ry="3" fill="#ffffff" opacity="0.8" />
          <ellipse cx="74" cy="70" rx="5" ry="3" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'spoken-english':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="chatGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <radialGradient id="chatGlint" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M22 27 C22 21, 27 17, 34 17 L66 17 C73 17, 78 21, 78 27 L78 53 C78 59, 73 63, 66 63 L42 63 L28 75 L30 63 L34 63 C27 63, 22 59, 22 53 Z"
            fill="url(#chatGrad)"
          />
          <path
            d="M24 27 C24 22, 28 19, 34 19 L66 19 C69 19, 72 20, 74 22 C68 24, 40 27, 26 43 C25 38, 24 32, 24 27 Z"
            fill="url(#chatGlint)"
          />
          <circle cx="38" cy="40" r="4.5" fill="#0284c7" />
          <circle cx="50" cy="40" r="4.5" fill="#0284c7" />
          <circle cx="62" cy="40" r="4.5" fill="#0284c7" />
        </svg>
      );

    case 'robotics':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="robotBodyGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f3e8ff" />
              <stop offset="100%" stopColor="#d8b4fe" />
            </linearGradient>
          </defs>
          <rect x="47" y="14" width="6" height="12" rx="3" fill="#c084fc" />
          <circle cx="50" cy="13" r="6" fill="#f43f5e" />
          <circle cx="48" cy="11" r="2" fill="#ffffff" />
          <rect x="18" y="43" width="8" height="16" rx="4" fill="#a855f7" />
          <rect x="74" y="43" width="8" height="16" rx="4" fill="#a855f7" />
          <rect x="23" y="24" width="54" height="52" rx="16" fill="url(#robotBodyGrad)" />
          <rect x="30" y="35" width="40" height="24" rx="10" fill="#1e1b4b" />
          <circle cx="41" cy="47" r="5" fill="#38bdf8" />
          <circle cx="42" cy="46" r="1.5" fill="#ffffff" />
          <circle cx="59" cy="47" r="5" fill="#38bdf8" />
          <circle cx="60" cy="46" r="1.5" fill="#ffffff" />
          <path d="M42 66 Q50 71 58 66" stroke="#7e22ce" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'fitness':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="dumbbellGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <g transform="rotate(35 50 50)">
            <rect x="36" y="45" width="28" height="10" rx="5" fill="url(#barGrad)" />
            <rect x="42" y="45" width="16" height="10" fill="#be123c" opacity="0.3" />
            <rect x="31" y="36" width="6" height="28" rx="3" fill="url(#dumbbellGrad)" />
            <rect x="23" y="30" width="8" height="40" rx="4" fill="url(#dumbbellGrad)" />
            <ellipse cx="23" cy="50" rx="3" ry="19" fill="#fda4af" />
            <rect x="63" y="36" width="6" height="28" rx="3" fill="url(#dumbbellGrad)" />
            <rect x="69" y="30" width="8" height="40" rx="4" fill="url(#dumbbellGrad)" />
            <ellipse cx="77" cy="50" rx="3" ry="19" fill="#9f1239" />
          </g>
        </svg>
      );

    case 'cbse':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="capGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <polygon points="50,22 86,37 50,52 14,37" fill="url(#capGrad)" />
          <path d="M30 46 L30 63 C30 72, 70 72, 70 63 L70 46 Z" fill="url(#capGrad)" />
          <circle cx="50" cy="37" r="3.5" fill="#f59e0b" />
          <path d="M50 37 Q74 42 76 56" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <polygon points="73,56 79,56 77,69 74,69" fill="#f59e0b" />
          <circle cx="50" cy="74" r="5" fill="#f59e0b" />
          <polygon points="50,71 51.5,73.5 54,74 52,76 52.5,78.5 50,77 47.5,78.5 48,76 46,74 48.5,73.5" fill="#ffffff" />
        </svg>
      );

    case 'state-board':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="bookCoverGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#bbf7d0" />
            </linearGradient>
          </defs>
          <path
            d="M50 32 C40 25, 25 26, 16 30 C15 30, 14 31, 14 33 L14 68 C14 70, 25 66, 50 72 Z"
            fill="url(#bookCoverGrad)"
          />
          <path
            d="M50 32 C60 25, 75 26, 84 30 C85 30, 86 31, 86 33 L86 68 C86 70, 75 66, 50 72 Z"
            fill="url(#bookCoverGrad)"
          />
          <line x1="50" y1="32" x2="50" y2="72" stroke="#16a34a" strokeWidth="2.5" />
          <line x1="22" y1="40" x2="42" y2="38" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="48" x2="42" y2="46" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="56" x2="40" y2="54" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="58" y1="38" x2="78" y2="40" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="58" y1="46" x2="78" y2="48" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="58" y1="54" x2="76" y2="56" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M50 32 L50 60 L54 56 L58 60 L58 34" fill="#ef4444" opacity="0.8" />
        </svg>
      );

    case 'neet':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="medGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#ffe4e6" />
              <stop offset="100%" stopColor="#fecdd3" />
            </linearGradient>
          </defs>
          <path
            d="M40 20 H60 V38 H78 V58 H60 V76 H40 V58 H22 V38 H40 Z"
            fill="url(#medGrad)"
          />
          <path
            d="M32 30 C32 46, 68 46, 68 30"
            fill="none"
            stroke="#be123c"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M50 42 L50 56" stroke="#be123c" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="60" r="6" fill="#be123c" />
          <circle cx="50" cy="60" r="3" fill="#ffffff" />
          <circle cx="32" cy="28" r="3" fill="#be123c" />
          <circle cx="68" cy="28" r="3" fill="#be123c" />
        </svg>
      );

    case 'jee':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="trophyGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>
          <path
            d="M32 24 H68 V46 C68 56, 58 62, 50 62 C42 62, 32 56, 32 46 Z"
            fill="url(#trophyGrad)"
          />
          <path
            d="M32 28 C22 28, 20 44, 34 46"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M68 28 C78 28, 80 44, 66 46"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect x="46" y="62" width="8" height="12" fill="url(#trophyGrad)" />
          <polygon points="28,80 72,80 66,74 34,74" fill="url(#trophyGrad)" />
          <polygon points="50,32 52,38 58,38 53,42 55,48 50,44 45,48 47,42 42,38 48,38" fill="#ea580c" />
        </svg>
      );

    case 'matriculation':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="shieldGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef9c3" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
          </defs>
          <path
            d="M50 18 L76 28 C76 56, 50 78, 50 78 C50 78, 24 56, 24 28 Z"
            fill="url(#shieldGrad)"
          />
          <polygon
            points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42"
            fill="#ca8a04"
          />
        </svg>
      );

    case 'olympiad':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="medalGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f3e8ff" />
              <stop offset="100%" stopColor="#e9d5ff" />
            </linearGradient>
          </defs>
          <polygon points="40,18 30,50 44,46" fill="#ec4899" />
          <polygon points="60,18 70,50 56,46" fill="#3b82f6" />
          <circle cx="50" cy="54" r="22" fill="url(#medalGrad)" />
          <circle cx="50" cy="54" r="17" fill="#8b5cf6" />
          <polygon points="50,43 53,50 60,50 55,55 57,62 50,57 43,62 45,55 40,50 47,50" fill="#ffffff" />
        </svg>
      );

    case 'coding':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="chipGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cffafe" />
              <stop offset="100%" stopColor="#a5f3fc" />
            </linearGradient>
          </defs>
          <rect x="22" y="24" width="56" height="52" rx="12" fill="url(#chipGrad)" />
          <path
            d="M40 40 L30 50 L40 60"
            fill="none"
            stroke="#0891b2"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M60 40 L70 50 L60 60"
            fill="none"
            stroke="#0891b2"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="53" y1="38" x2="47" y2="62" stroke="#0e7490" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'abacus':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
          <defs>
            <linearGradient id="abacusFrame" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#fecaca" />
            </linearGradient>
          </defs>
          <rect x="20" y="24" width="60" height="52" rx="8" fill="url(#abacusFrame)" />
          <rect x="25" y="29" width="50" height="42" rx="4" fill="#991b1b" opacity="0.1" />
          <line x1="20" y1="44" x2="80" y2="44" stroke="#dc2626" strokeWidth="3" />
          <line x1="36" y1="24" x2="36" y2="76" stroke="#b91c1c" strokeWidth="2" />
          <line x1="50" y1="24" x2="50" y2="76" stroke="#b91c1c" strokeWidth="2" />
          <line x1="64" y1="24" x2="64" y2="76" stroke="#b91c1c" strokeWidth="2" />
          <ellipse cx="36" cy="36" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="50" cy="36" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="64" cy="36" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="36" cy="54" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="36" cy="62" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="50" cy="58" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="64" cy="54" rx="5" ry="3" fill="#ffffff" />
          <ellipse cx="64" cy="62" rx="5" ry="3" fill="#ffffff" />
        </svg>
      );

    default:
      return null;
  }
}

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fbff] via-white to-[#f0f6ff] pt-14 pb-14 sm:pt-16 sm:pb-16 select-none">
      {/* Decorative Radial Atmosphere Glow */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-sky-200/40 via-blue-100/20 to-transparent blur-3xl rounded-full"
        aria-hidden
      />

      {/* Floating 3D Graphic - Left (Book & Airplane) */}
      <div className="pointer-events-none hidden sm:block absolute left-2 sm:left-6 md:left-10 lg:left-14 top-8 sm:top-10 w-24 sm:w-32 md:w-40 lg:w-48 z-0 opacity-90 sm:opacity-100 transition-all duration-700">
        <div className="relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_55%,transparent_75%)]">
          <img
            src={bookAirplaneImg}
            alt="Open book and paper airplane"
            className="w-full h-auto drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Floating 3D Graphic - Right (Graduation Cap & Sparkles) */}
      <div className="pointer-events-none hidden sm:block absolute right-2 sm:right-6 md:right-10 lg:right-14 top-8 sm:top-10 w-24 sm:w-32 md:w-40 lg:w-48 z-0 opacity-90 sm:opacity-100 transition-all duration-700">
        <div className="relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_55%,transparent_75%)]">
          <img
            src={gradCapImg}
            alt="Graduation cap with sparkles"
            className="w-full h-auto drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Header Container */}
      <div className="container-page relative z-10 text-center max-w-3xl mx-auto px-4">
        {/* Top Badge: ⭐ OUR ACTIVITIES */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#edf4ff] border border-blue-200/80 shadow-[0_2px_8px_rgba(59,130,246,0.12)] text-[#2563eb] font-extrabold text-[11px] sm:text-xs tracking-wider uppercase mb-3 sm:mb-4">
          <Sparkles className="h-3.5 w-3.5 fill-[#2563eb] text-[#2563eb]" />
          <span>Our Activities</span>
        </div>

        {/* Main Title with Radiance Marks */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-3">
          {/* Left Radiance Dashes */}
          <div className="hidden sm:flex items-center gap-1 text-sky-400 opacity-90 select-none">
            <span className="inline-block w-3.5 h-[3px] rounded-full bg-sky-400 rotate-[-25deg] translate-y-[-3px]" />
            <span className="inline-block w-4 h-[3px] rounded-full bg-sky-400" />
            <span className="inline-block w-3.5 h-[3px] rounded-full bg-sky-400 rotate-[25deg] translate-y-[3px]" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Boards & Skills{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
              We Cover
            </span>
          </h2>

          {/* Right Radiance Dashes */}
          <div className="hidden sm:flex items-center gap-1 text-sky-400 opacity-90 select-none">
            <span className="inline-block w-3.5 h-[3px] rounded-full bg-sky-400 rotate-[25deg] translate-y-[-3px]" />
            <span className="inline-block w-4 h-[3px] rounded-full bg-sky-400" />
            <span className="inline-block w-3.5 h-[3px] rounded-full bg-sky-400 rotate-[-25deg] translate-y-[3px]" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base font-semibold text-slate-500 tracking-wide">
          Learn <span className="text-slate-300">•</span> Practice <span className="text-slate-300">•</span> Grow <span className="text-slate-300">•</span> Build a Better You
        </p>
      </div>

      {/* Marquee Slider Area - Ultra Glassmorphic Cards */}
      <div
        className="relative mt-8 sm:mt-11"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)',
        }}
      >
        <Marquee speed={40} gradient={false} pauseOnHover autoFill className="py-4 overflow-visible">
          {items.map((item) => (
            <div
              key={item.id}
              className="group mx-2.5 sm:mx-3.5 relative flex-shrink-0 w-[125px] sm:w-[140px] md:w-[150px] rounded-[24px] sm:rounded-[28px] bg-white/45 backdrop-blur-2xl border-[1.5px] border-white/80 shadow-[0_12px_32px_rgba(2,132,199,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,255,255,0.3)] p-3.5 sm:p-4 md:p-5 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 hover:bg-white/75 hover:shadow-[0_20px_45px_rgba(37,99,235,0.16)] hover:border-sky-200 cursor-pointer"
            >
              {/* Glossy App Squircle Icon */}
              <div
                className={`relative w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] md:w-[82px] md:h-[82px] rounded-[20px] sm:rounded-[24px] bg-gradient-to-br ${item.gradient} p-2.5 sm:p-3 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}
                style={{
                  boxShadow: `0 10px 24px -4px ${item.glowColor}, inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.15)`,
                }}
              >
                {/* 3D Gloss Highlight Sheen */}
                <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-gradient-to-b from-white/45 via-transparent to-black/10 pointer-events-none" />

                {/* 3D Vector Icon */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Glossy3DIcon type={item.iconType} />
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-3 text-xs sm:text-sm font-bold text-slate-800 text-center tracking-tight group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              {/* Matching Indicator Bar */}
              <div
                className="mt-2 w-6 sm:w-7 h-[3px] sm:h-[3.5px] rounded-full transition-all duration-300 group-hover:w-10"
                style={{ backgroundColor: item.accentColor }}
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Decorative Wave Curves at Bottom */}
      <div className="pointer-events-none absolute -bottom-4 -left-4 w-48 sm:w-80 h-24 sm:h-36 bg-gradient-to-tr from-sky-400/20 via-blue-300/10 to-transparent rounded-tr-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-4 -right-4 w-48 sm:w-80 h-24 sm:h-36 bg-gradient-to-tl from-purple-400/20 via-indigo-300/10 to-transparent rounded-tl-full blur-2xl" />
    </section>
  );
}
