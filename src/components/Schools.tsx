import { useState } from 'react';
import {
  Star,
  MapPin,
  Check,
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { schools } from '@/data/content';

export function Schools() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, schools.length - 2) : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= schools.length - 2 ? 0 : prev + 1));
  };

  const visibleSchools = schools.slice(startIndex, startIndex + 2).length === 2
    ? schools.slice(startIndex, startIndex + 2)
    : schools.slice(0, 2);

  return (
    <section id="schools" className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f0f9ff]/60 via-[#f8fafc] to-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        
        {/* Section Header (Matching Attached Template Exact UI) */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl animate-fadeUp">
            {/* Eyebrow Pill */}
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100/90 border border-sky-200/90 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0284c7] shadow-sm">
              <Building2 className="h-4 w-4 text-[#0284c7]" /> VERIFIED SCHOOLS
            </span>

            {/* Main Headline */}
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0b1f33] leading-[1.18] text-balance">
              Discover schools that fit{' '}
              <span className="text-[#0284c7]">your child’s future</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Search by location, board, facilities and grade level. Compare profiles and apply for admission directly.
            </p>

            {/* Blue Accent Bar */}
            <div className="mt-4 h-1 w-12 rounded-full bg-[#0284c7]" />
          </div>

          {/* Top Right Action Button */}
          <div className="animate-fadeUp self-start lg:self-end">
            <a
              href="#register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0088ff] to-[#0070e0] hover:from-[#0070e0] hover:to-[#005bb5] px-7 py-3 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              <span>View all schools</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Schools Carousel Container with Prev / Next Buttons */}
        <div className="relative mt-12 sm:mt-14">
          
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous schools"
            className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-slate-100 text-slate-700 hover:bg-sky-50 hover:text-[#0284c7] hover:border-sky-200 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next schools"
            className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-slate-100 text-slate-700 hover:bg-sky-50 hover:text-[#0284c7] hover:border-sky-200 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {visibleSchools.map((s, idx) => (
              <article
                key={s.id}
                className="group relative rounded-[32px] bg-white border border-slate-100/90 shadow-[0_12px_35px_rgba(0,0,0,0.06)] p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] hover:border-sky-200 hover:-translate-y-1 flex flex-col sm:flex-row gap-5"
              >
                {/* Left Column: School Image with Overlay Badges */}
                <div className="relative w-full sm:w-[42%] lg:w-[44%] min-h-[220px] sm:min-h-[260px] rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Top-Left Status Pill Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    {s.tagType === 'smart' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] text-white px-3 py-1 text-xs font-bold shadow-md shadow-sky-900/20">
                        <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" /> {s.tag || 'Smart School'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] text-white px-3 py-1 text-xs font-bold shadow-md shadow-sky-900/20">
                        <Check className="h-3.5 w-3.5 stroke-[3]" /> {s.tag || 'Verified'}
                      </span>
                    )}
                  </div>

                  {/* Bottom Gallery Pill Overlay */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md p-1 pr-3 text-white shadow-lg border border-white/20">
                    <div className="flex -space-x-1 overflow-hidden">
                      {s.thumbnails?.slice(0, 3).map((thumb: string, tIdx: number) => (
                        <img
                          key={tIdx}
                          src={thumb}
                          alt="thumbnail"
                          className="inline-block h-5 w-6 rounded object-cover border border-white/40"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> +{s.photoCount || 3} photos
                    </span>
                  </div>
                </div>

                {/* Right Column: School Information & Controls */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  
                  {/* Header Row: Crest Emblem, Name & Star Rating */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Circular Emblem Icon */}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 shadow-sm border ${
                            idx === 0
                              ? 'bg-amber-50 border-amber-200 text-amber-600'
                              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          }`}
                        >
                          {idx === 0 ? (
                            <Sparkles className="h-5 w-5" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#0b1f33] leading-snug">
                            {s.name}
                          </h3>
                          
                          {/* Location & Grade */}
                          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <MapPin className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                            <span>{s.location}</span>
                            <span className="text-slate-300">•</span>
                            <span>{s.grades}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        {s.rating}
                      </span>
                    </div>

                    {/* Facilities Chips */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {s.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-xs font-semibold text-[#0284c7]"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>

                    {/* Courses Section */}
                    <div className="mt-3.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        COURSES
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.courses.map((course) => (
                          <span
                            key={course}
                            className="rounded-full bg-sky-50/80 border border-sky-100 px-3 py-1 text-xs font-semibold text-[#0284c7]"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="mt-5 flex items-center gap-2.5 pt-1">
                    <a
                      href="#register"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#0088ff] to-[#0070e0] hover:from-[#0070e0] hover:to-[#005bb5] py-2.5 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <span>Enroll now</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </a>
                    
                    <a
                      href="#schools"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50 py-2.5 px-4 text-sm font-bold text-[#0284c7] shadow-sm transition-all hover:-translate-y-0.5"
                    >
                      <User className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Profile</span>
                    </a>
                  </div>

                </div>
              </article>
            ))}
          </div>

          {/* Mobile pagination indicators */}
          <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {startIndex + 1} - {Math.min(startIndex + 2, schools.length)} of {schools.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
