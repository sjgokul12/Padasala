import React from 'react';
import {
  GraduationCap,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  BookOpen,
  Users,
  Building2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import stackBooksCapImg from '@/assets/stack_books_cap_3d.jpg';
import bookAirplaneImg from '@/assets/book_airplane_3d.jpg';

const navSections = [
  {
    title: 'EXPLORE',
    icon: BookOpen,
    links: [
      { label: 'Schools', href: '#schools' },
      { label: 'Courses', href: '#courses' },
      { label: 'Teacher Jobs', href: '#jobs' },
      { label: 'Tuition', href: '#tuition' },
      { label: 'Events', href: '#events' },
      { label: 'Admissions', href: '#register' },
    ],
  },
  {
    title: 'FOR',
    icon: Users,
    links: [
      { label: 'Students & Parents', href: '#register' },
      { label: 'Schools', href: '#register' },
      { label: 'Teachers', href: '#jobs' },
      { label: 'Tuition Centres', href: '#tuition' },
      { label: 'Coaches', href: '#courses' },
      { label: 'Admins', href: '#about' },
    ],
  },
  {
    title: 'COMPANY',
    icon: Building2,
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'How It Works', href: '#about' },
      { label: 'Benefits', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Help & Support', href: '#contact' },
      { label: 'Careers', href: '#jobs' },
    ],
  },
  {
    title: 'LEGAL',
    icon: ShieldCheck,
    links: [
      { label: 'Privacy Policy', href: '#about' },
      { label: 'Terms & Conditions', href: '#about' },
      { label: 'Refund Policy', href: '#about' },
      { label: 'Grievance Officer', href: '#contact' },
      { label: 'Cookies', href: '#about' },
    ],
  },
];

const socials = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#eaf4fe] via-[#f4f9ff] to-[#d9ecfd] pt-8 sm:pt-10 pb-6 select-none text-slate-800">
      
      {/* Decorative Atmosphere Radial Glows */}
      <div
        className="pointer-events-none absolute -top-12 left-1/4 w-[500px] h-[200px] bg-gradient-to-b from-sky-200/35 to-transparent blur-3xl rounded-full"
        aria-hidden
      />

      {/* Floating 3D Graphic - Top Left Corner Accent */}
      <div className="pointer-events-none absolute -left-6 sm:-left-8 top-2 w-20 sm:w-28 z-0 opacity-35 transition-all">
        <div className="relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_40%,transparent_75%)]">
          <img
            src={stackBooksCapImg}
            alt="3D books with graduation cap"
            className="w-full h-auto drop-shadow-md"
            loading="lazy"
          />
        </div>
      </div>

      {/* Floating 3D Graphic - Top Right Corner Accent */}
      <div className="pointer-events-none absolute -right-4 sm:right-2 top-2 z-0 opacity-60">
        <div className="w-16 sm:w-24 relative overflow-hidden rounded-full [mask-image:radial-gradient(circle_at_center,black_50%,transparent_75%)]">
          <img
            src={bookAirplaneImg}
            alt="3D Paper airplane"
            className="w-full h-auto drop-shadow-md"
            loading="lazy"
          />
        </div>
      </div>

      <div className="container-page relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Content - Compact & Slim */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Column 1: Brand & Contacts (Compact 4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3.5 bg-white/45 backdrop-blur-md p-4 sm:p-5 rounded-[22px] border border-white/80 shadow-[0_4px_20px_rgba(2,132,199,0.04)]">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00a8ff] via-[#0084ff] to-[#0060f0] text-white shadow-[0_4px_12px_rgba(0,132,255,0.35)]">
                <GraduationCap className="h-5 w-5 stroke-[2.4]" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-slate-900">
                Pada<span className="text-[#0284c7]">sala</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              India's modern education platform connecting schools, students, teachers, tuition centres and events.
            </p>

            {/* Contact Details */}
            <div className="space-y-1.5 pt-0.5 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                <span>support@padasala.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-white text-[#0284c7] shadow-sm hover:bg-[#0284c7] hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links (Compact 8 cols on lg) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 bg-white/35 backdrop-blur-md p-4 sm:p-5 rounded-[22px] border border-white/80 shadow-[0_4px_20px_rgba(2,132,199,0.03)]">
            {navSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.title} className="space-y-2.5">
                  {/* Category Header */}
                  <div className="flex items-center gap-1.5 pb-1 border-b border-blue-100/60">
                    <Icon className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                    <h4 className="font-display text-[11px] font-extrabold tracking-wider uppercase text-slate-900">
                      {sec.title}
                    </h4>
                  </div>

                  {/* Links List */}
                  <ul className="space-y-1.5">
                    {sec.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#0284c7] transition-colors"
                        >
                          <span>{link.label}</span>
                          <ChevronRight className="h-2.5 w-2.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="mt-6 pt-4 border-t border-blue-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-slate-700 text-center sm:text-left">
            © {new Date().getFullYear()} Padasala. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white px-3.5 py-1 font-bold text-[#0284c7] shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
