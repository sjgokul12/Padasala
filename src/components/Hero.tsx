import { useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  BookOpen,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Building2,
  GraduationCap,
  Users,
} from 'lucide-react';
import studentBooksImg from '@/assets/student_books_transparent.png';
import schoolBuildingImg from '@/assets/school_building_transparent.png';
import gradCapImg from '@/assets/grad_cap_transparent.png';
import noteStationeryImg from '@/assets/note_stationery_transparent.png';

const tabs = [
  { id: 'schools', label: 'Schools', icon: Building2, placeholder: 'Search for school, course, teacher or event...' },
  { id: 'courses', label: 'Courses', icon: BookOpen, placeholder: 'Search NEET, JEE, Foundation, Skill courses...' },
  { id: 'jobs', label: 'Teacher Jobs', icon: Briefcase, placeholder: 'Search subject, grade, school or location...' },
  { id: 'events', label: 'Events', icon: CalendarDays, placeholder: 'Search sports, science expo, cultural fests...' },
] as const;

const popularCities = ['Coimbatore', 'Chennai', 'Bangalore', 'Madurai', 'Salem'];

const bottomNavBadges = [
  { label: 'Schools', icon: Building2, href: '#schools' },
  { label: 'Courses', icon: BookOpen, href: '#courses' },
  { label: 'Teachers', icon: Users, href: '#jobs' },
  { label: 'Events', icon: CalendarDays, href: '#events' },
];

export function Hero() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('schools');
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  const handleCityClick = (city: string) => {
    setSelectedCity(city === selectedCity ? '' : city);
    setShowCityDropdown(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionId =
      activeTab === 'jobs' ? 'jobs' : activeTab === 'courses' ? 'courses' : activeTab === 'events' ? 'events' : 'schools';
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-8 lg:pt-28 lg:pb-6 md:min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#cae8ff] via-[#e2f2ff] to-[#f4faff] select-none"
    >
      {/* ========================================================================= */}
      {/* 3D ATMOSPHERIC VISUAL ENVIRONMENT & FLOATING ANIMATIONS */}
      {/* ========================================================================= */}

      {/* Radiant Sun/Sky Ambient Glows */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-white/95 via-sky-200/50 to-transparent blur-3xl rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/4 -left-20 w-96 h-96 bg-sky-300/35 blur-[90px] rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 w-[450px] h-[450px] bg-blue-300/30 blur-[100px] rounded-full"
        aria-hidden
      />

      {/* Floating Paper Airplane with Dotted Loop Trail (Top Left) */}
      <div className="pointer-events-none absolute top-20 sm:top-16 left-0 sm:left-4 lg:left-6 z-0 sm:z-20 opacity-70 sm:opacity-100 animate-plane-bob">
        <svg
          className="w-24 sm:w-32 lg:w-36 h-20 sm:h-24 text-sky-400/90 drop-shadow-md"
          viewBox="0 0 160 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flight path dotted curve */}
          <path
            d="M 5 85 C 20 20, 60 15, 80 50 C 90 70, 110 65, 125 35"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* 3D Paper Plane */}
          <g transform="translate(110, 10) rotate(-15)">
            <polygon points="40,2 2,24 16,36" fill="#007cf8" />
            <polygon points="40,2 16,36 22,26" fill="#0050d8" />
            <polygon points="40,2 22,26 40,28" fill="#38bdf8" />
            <polygon points="40,2 2,24 22,26" fill="#93c5fd" />
          </g>
        </svg>
      </div>

      {/* 3D Student Visual on Stack of Books - Moved UP Higher on the Left */}
      <div className="pointer-events-none hidden lg:block absolute bottom-12 sm:bottom-16 lg:bottom-14 xl:bottom-20 left-0 sm:left-2 lg:left-4 xl:left-6 z-20 w-56 sm:w-64 lg:w-[300px] xl:w-[340px] 2xl:w-[370px] group">
        {/* Pulsing Lightbulb Aura Glow */}
        <div className="pointer-events-none absolute top-4 left-8 w-16 h-16 bg-yellow-300/50 blur-xl rounded-full animate-glow-pulse" />
        
        <div className="relative overflow-visible transition-transform duration-500 group-hover:scale-105">
          <img
            src={studentBooksImg}
            alt="Padasala Student sitting on books Learn, Grow, Achieve"
            className="w-full h-auto drop-shadow-2xl animate-float-slow"
          />
        </div>
      </div>

      {/* 3D Miniature School Campus in Background (Left-Center) - Moved UP */}
      <div className="pointer-events-none hidden lg:block absolute bottom-8 sm:bottom-12 lg:bottom-10 xl:bottom-16 left-[18%] sm:left-[21%] lg:left-[23%] xl:left-[25%] -translate-x-1/2 w-44 sm:w-52 lg:w-60 xl:w-68 2xl:w-72 z-0 opacity-85 transition-all duration-700">
        <div className="relative overflow-visible">
          <img
            src={schoolBuildingImg}
            alt="School Campus Building"
            className="w-full h-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Floating 3D Graduation Cap (Top Right) */}
      <div className="pointer-events-none absolute top-24 sm:top-16 right-2 sm:right-10 lg:right-14 z-0 sm:z-20 w-16 sm:w-32 md:w-36 lg:w-40 animate-float-slow opacity-80 sm:opacity-95">
        <div className="relative overflow-visible">
          <img
            src={gradCapImg}
            alt="3D Graduation Cap"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Floating 3D Note & Stationery (Far Right) */}
      <div className="pointer-events-none hidden 2xl:block absolute top-1/2 -translate-y-1/3 right-4 z-20 w-48 animate-float-gentle opacity-95">
        <div className="relative overflow-visible">
          <img
            src={noteStationeryImg}
            alt="Education Note and stationery"
            className="w-full h-auto drop-shadow-xl"
          />
        </div>
      </div>

      {/* Bottom Organic Soft Wave Clouds Layer */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 sm:h-32 z-0 overflow-hidden">
        <svg
          className="absolute -bottom-1 w-full h-full text-white preserve-3d opacity-95"
          viewBox="0 0 1440 180"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C180,30 360,100 540,50 C720,10 900,80 1080,35 C1260,0 1380,50 1440,70 L1440,180 L0,180 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 1-SCREEN HERO CONTENT: TWO-COLUMN COMPOSITION (TEXT | SEARCH PANEL) */}
      {/* ========================================================================= */}
      <div className="container-page relative z-10 w-full flex-1 flex flex-col justify-center my-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center">
          
          {/* ===================================================================== */}
          {/* LEFT 6 COLS: HEADLINE, DESCRIPTION & CTA BUTTONS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 lg:pl-48 xl:pl-56 2xl:pl-64 space-y-3.5 sm:space-y-4 text-center lg:text-left animate-fadeUp">
            
            {/* Mobile-only Student Display */}
            <div className="lg:hidden mx-auto w-32 sm:w-52 relative">
              <div className="pointer-events-none absolute top-3 left-6 w-12 h-12 bg-yellow-300/40 blur-lg rounded-full animate-glow-pulse" />
              <img
                src={studentBooksImg}
                alt="Padasala Student"
                className="w-full h-auto drop-shadow-lg animate-float-slow"
              />
            </div>

            {/* Eyebrow Pill */}
            <div className="inline-flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/90 border border-sky-300/80 px-3 sm:px-3.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wide sm:tracking-wider text-[#034078] shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#0284c7] fill-[#0284c7]" />
                INDIA'S MODERN EDUCATION PLATFORM
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-[28px] sm:text-4xl lg:text-[36px] xl:text-[42px] font-black leading-[1.14] tracking-tight text-[#0b1f33] text-balance">
              Find the right{' '}
              <span className="text-[#0088ff]">school</span>,{' '}
              <span className="text-[#0088ff]">course</span>,
              <br className="hidden sm:inline" />
              {' '}teacher and{' '}
              <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
                event
              </span>
              <br className="hidden sm:inline" />
              {' '}—{' '}
              <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
                all in one place.
              </span>
            </h1>

            {/* Subheading / Description */}
            <p className="max-w-md mx-auto lg:mx-0 text-sm text-slate-700 leading-relaxed font-medium">
              Padasala connects students, parents, schools, teachers and tuition centres. Discover verified schools,
              prepare for NEET & JEE, apply for teaching jobs, join skill classes and never miss a school event.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
              {/* Primary CTA */}
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] hover:from-[#007cf8] hover:to-[#0050d8] px-3 sm:px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_8px_25px_rgba(0,114,255,0.38),inset_0_1.5px_2px_rgba(255,255,255,0.6)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,114,255,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  🚀 Get started<span className="hidden min-[400px]:inline"> free</span>
                </span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </a>

              {/* Secondary CTA */}
              <a
                href="#schools"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-sky-300/80 hover:border-sky-400 px-3 sm:px-6 py-3 text-xs sm:text-sm font-bold text-[#0284c7] shadow-[0_4px_16px_rgba(2,132,199,0.08)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Compass className="h-4 w-4 text-[#0284c7] stroke-[2.4]" />
                <span>Explore schools</span>
              </a>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT 6 COLS: FROSTED GLASS SEARCH PANEL & QUICK ACTION CARDS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 animate-fadeUp" style={{ animationDelay: '120ms' }}>
            <div className="relative rounded-[26px] sm:rounded-[36px] bg-white/55 backdrop-blur-2xl border-[1.5px] border-white/95 p-3.5 sm:p-6 shadow-[0_20px_50px_rgba(2,132,199,0.12),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,255,255,0.35)]">
              
              {/* Tab Switcher - 4 Glass Pill Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center justify-center gap-1.5 rounded-2xl sm:rounded-full py-2.5 px-2.5 text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] text-white shadow-[0_8px_20px_rgba(0,114,255,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.7)] scale-[1.02]'
                          : 'bg-white/60 hover:bg-white/85 text-slate-700 backdrop-blur-md border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:scale-[1.01]'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white stroke-[2.4]' : 'text-[#0284c7] stroke-[2.2]'}`} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="mt-3.5 sm:mt-4 space-y-3">
                {/* Search input pill */}
                <div className="relative flex items-center rounded-full bg-white/80 backdrop-blur-md border border-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(0,0,0,0.02)] px-4 sm:px-5 py-3 focus-within:ring-2 focus-within:ring-[#0ea5e9] focus-within:border-transparent transition-all">
                  <Search className="h-4 w-4 text-slate-800 shrink-0 mr-2.5 stroke-[2.2]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={currentTab.placeholder}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Search filter options"
                    className="ml-2 text-slate-700 hover:text-[#0284c7] transition"
                  >
                    <SlidersHorizontal className="h-4 w-4 stroke-[2]" />
                  </button>
                </div>

                {/* Location & Search Button Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
                  {/* Location Selector Pill */}
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      className="w-full rounded-full bg-white/80 backdrop-blur-md border border-white/95 px-4 py-2 sm:py-2.5 flex items-center justify-between text-left hover:border-sky-300 transition shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="h-4 w-4 text-[#0284c7] shrink-0 fill-[#0284c7]/20" />
                        <div className="truncate">
                          <div className="text-[10px] font-bold text-slate-500 leading-none mb-0.5">Location</div>
                          <div className="text-xs font-semibold text-slate-700 truncate">
                            {selectedCity ? selectedCity : 'Select city or area'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showCityDropdown ? 'rotate-90' : ''}`} />
                    </button>

                    {/* City Dropdown Menu */}
                    {showCityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-30 rounded-2xl bg-white/95 backdrop-blur-xl p-2 shadow-xl border border-slate-200/80 animate-fadeUp">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">Popular Cities</div>
                        {['Coimbatore', 'Chennai', 'Bangalore', 'Madurai', 'Salem', 'Erode', 'Tiruchirappalli'].map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleCityClick(city)}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                              selectedCity === city
                                ? 'bg-sky-50 text-[#0284c7] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Search Button - 3D Glossy Pill with Glow & Radiance Marks */}
                  <div className="relative inline-flex items-center">
                    <button
                      type="submit"
                      className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#009bf8] via-[#007cf8] to-[#0062f5] hover:from-[#007cf8] hover:to-[#0050d8] px-7 py-2.5 sm:py-3 text-sm font-bold text-white shadow-[0_8px_25px_rgba(0,114,255,0.45),inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-2px_3px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
                    >
                      <span className="absolute top-1 inset-x-4 h-2 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                      <span>Search</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>

                    {/* Radiance speed dashes (Exact reference style) */}
                    <div className="hidden sm:flex flex-col gap-1 ml-2 text-[#007cf8] select-none pointer-events-none">
                      <span className="inline-block w-3 h-[2.5px] rounded-full bg-[#007cf8] rotate-[25deg] translate-x-1" />
                      <span className="inline-block w-3.5 h-[2.5px] rounded-full bg-[#007cf8]" />
                      <span className="inline-block w-3 h-[2.5px] rounded-full bg-[#007cf8] -rotate-[25deg] translate-x-1" />
                    </div>
                  </div>

                </div>
              </form>

              {/* City Filter Chips */}
              <div className="mt-3 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
                {popularCities.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className={`shrink-0 rounded-full px-3 py-1.5 sm:py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#0284c7] text-white shadow-sm'
                          : 'bg-white/65 hover:bg-white/90 text-slate-700 backdrop-blur-md border border-white/85 shadow-[0_2px_6px_rgba(0,0,0,0.02)]'
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="shrink-0 inline-flex items-center gap-0.5 rounded-full bg-white/65 hover:bg-white/90 text-[#0284c7] backdrop-blur-md border border-white/85 px-3 py-1.5 sm:py-1 text-xs font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition"
                >
                  More <ChevronDown className="h-3 w-3 text-[#0284c7]" />
                </button>
              </div>

              {/* Bottom Quick Feature Cards - Ultra Glassmorphic */}
              <div className="mt-3.5 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* For Schools Card */}
                <a
                  href="#register"
                  className="group rounded-[22px] bg-white/55 backdrop-blur-2xl border-[1.5px] border-white/90 p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(2,132,199,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-white/80 hover:shadow-[0_12px_28px_rgba(2,132,199,0.14)] hover:border-sky-200 transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dbeafe] via-[#bae6fd] to-[#7dd3fc] text-[#0284c7] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <Building2 className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#0284c7] group-hover:text-blue-700 transition-colors">
                        For Schools
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                        Manage your school & admissions.
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white/95 border border-blue-100 text-[#0284c7] group-hover:bg-[#0284c7] group-hover:text-white transition-all shrink-0 ml-1.5 shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                </a>

                {/* For Teachers Card */}
                <a
                  href="#jobs"
                  className="group rounded-[22px] bg-white/55 backdrop-blur-2xl border-[1.5px] border-white/90 p-3 sm:p-3.5 shadow-[0_8px_24px_rgba(124,58,237,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:bg-white/80 hover:shadow-[0_12px_28px_rgba(124,58,237,0.14)] hover:border-purple-200 transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3e8ff] via-[#e9d5ff] to-[#d8b4fe] text-[#7c3aed] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <GraduationCap className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#7c3aed] group-hover:text-purple-700 transition-colors">
                        For Teachers
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                        Apply for teaching jobs easily.
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white/95 border border-purple-100 text-[#7c3aed] group-hover:bg-[#7c3aed] group-hover:text-white transition-all shrink-0 ml-1.5 shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM CENTER 4 QUICK NAV BADGES (EXACT FROM REFERENCE BOTTOM BAR) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full pt-2 pb-1 hidden md:flex items-center justify-center">
        <div className="flex items-center gap-6 sm:gap-10">
          {bottomNavBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <a
                key={badge.label}
                href={badge.href}
                className="group flex flex-col items-center gap-1 text-slate-600 hover:text-[#0284c7] transition-all hover:-translate-y-1"
              >
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_4px_12px_rgba(2,132,199,0.08)] group-hover:bg-sky-50 group-hover:border-sky-300 transition-all">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0284c7] stroke-[2.2]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold tracking-tight text-slate-700 group-hover:text-[#0284c7] transition-colors">
                  {badge.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

    </section>
  );
}
