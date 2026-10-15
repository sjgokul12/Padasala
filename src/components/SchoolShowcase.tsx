import { useEffect, useRef, useState } from 'react';
import {
  GraduationCap, Sparkles, Search, SlidersHorizontal, ArrowRight, Building2, Award, Zap, ShieldCheck, Heart, Check,
  Image as ImageIcon, Star, MapPin, User, ChevronLeft, ChevronRight, Phone, Mail, Globe, CheckCircle2,
} from 'lucide-react';
import heroImg from '@/assets/school-hero.webp';
import heroMobileImg from '@/assets/school-hero-mobile.webp';
import { useSession } from '@/lib/auth';
import { useCollection, useStored, txt, type Post } from '@/lib/store';
import { Modal, DynamicForm, Chip } from './ui';
import { SchoolPostCard, JobCard, EventCard } from './listings';

/* ---------- Banner with search ---------- */

const highlights = [
  { icon: Building2, title: '10,000+', text: 'Schools Listed' },
  { icon: Award, title: 'Multiple', text: 'Boards & Curriculums' },
  { icon: Zap, title: 'Direct', text: 'Admission Apply' },
  { icon: ShieldCheck, title: 'Verified', text: 'School Profiles' },
];

export function SchoolHero({
  query, onQuery, onSearch, onFilters, viewAllHref, top, as: Heading = 'h2',
}: {
  query: string;
  onQuery: (q: string) => void;
  onSearch: () => void;
  onFilters?: () => void;
  viewAllHref?: string;
  /** Page-top banner: leaves room for the fixed header. */
  top?: boolean;
  as?: 'h1' | 'h2';
}) {
  const ViewAll = ({ className }: { className: string }) =>
    viewAllHref ? (
      <a href={viewAllHref} className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0062f5] to-[#009bf8] font-bold text-white shadow-[0_14px_30px_-10px_rgba(0,98,245,0.7)] ring-4 ring-white/70 transition hover:-translate-y-0.5 ${className}`}>
        View all schools <ArrowRight className="h-4 w-4" />
      </a>
    ) : null;

  return (
    <div className={`relative overflow-hidden ${top ? 'pt-[84px] sm:pt-28 xl:pt-24' : 'pt-10 sm:pt-14'} pb-6 xl:pb-12`}>
      {/* Wide screens: full illustration behind the text */}
      <img src={heroImg} alt="" aria-hidden className="hidden xl:block absolute inset-0 h-full w-full object-cover object-right" />
      <div className="hidden xl:block absolute inset-0 bg-gradient-to-r from-[#eaf5ff] via-[#eaf5ff]/60 to-transparent" aria-hidden />
      {/* Phones & tablets: soft sky background, illustration shown as a card */}
      <div className="xl:hidden absolute inset-0 bg-gradient-to-b from-[#cfe9ff] via-[#e8f4ff] to-transparent" aria-hidden />

      <div className="container-page relative">
        <div className="reveal xl:min-h-[420px] xl:max-w-[640px] flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-3.5 sm:px-4 py-1.5 text-[12px] sm:text-[13px] font-semibold text-[#0b3b66] shadow-sm ring-1 ring-white backdrop-blur">
            <GraduationCap className="h-4 w-4 text-[#0284c7]" /> Find the right school for your child
            <Sparkles className="h-3.5 w-3.5 text-[#0284c7]" />
          </span>
          <Heading className="mt-3 sm:mt-4 font-display text-[30px] sm:text-5xl xl:text-[56px] font-black leading-[1.06] tracking-tight text-[#0b1f33]">
            Discover schools that fit{' '}
            <span className="bg-gradient-to-r from-[#0062f5] to-[#0ea5e9] bg-clip-text text-transparent">your child’s future</span>
          </Heading>
          <p className="mt-3 max-w-xl text-[15px] sm:text-lg leading-relaxed text-slate-600">
            Compare by location, board and facilities — apply directly.
          </p>

          {/* Illustration card (phones & tablets) */}
          <div className="xl:hidden relative mt-5 h-48 sm:h-64 overflow-hidden rounded-[28px] ring-4 ring-white shadow-[0_20px_40px_-20px_rgba(2,132,199,0.55)]">
            <img src={heroMobileImg} alt="Student in front of a school" className="h-full w-full object-cover object-[55%_35%]" />
            <ViewAll className="absolute bottom-3 left-3 px-4 py-2.5 text-sm" />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); onSearch(); }}
            className="mt-5 flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[0_18px_40px_-16px_rgba(2,132,199,0.45)] ring-1 ring-sky-100"
          >
            <Search className="h-5 w-5 shrink-0 text-[#0284c7]" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search by school name, location or board…"
              aria-label="Search schools"
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {onFilters && (
              <button type="button" onClick={onFilters} aria-label="Filters" className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#0284c7] hover:bg-sky-100">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            )}
            <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] to-[#0062f5] px-4 sm:px-7 py-3 text-sm sm:text-base font-bold text-white shadow-md shadow-sky-500/30 transition hover:shadow-lg">
              Search <ArrowRight className="hidden sm:block h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-2xl bg-white/80 px-3 py-2.5 shadow-sm ring-1 ring-white backdrop-blur">
                <Icon className="h-6 w-6 shrink-0 text-[#0284c7]" strokeWidth={1.8} />
                <div className="min-w-0 leading-tight">
                  <div className="text-[13px] font-extrabold text-[#0b1f33]">{title}</div>
                  <div className="text-[11px] text-slate-600">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ViewAll className="hidden xl:inline-flex absolute right-[9%] bottom-2 -rotate-3 px-7 py-3.5 text-lg" />
      </div>
    </div>
  );
}

/* ---------- Saved schools (heart) ---------- */

export function useFavorites() {
  const [favs, setFavs] = useStored<string[]>('favorites', []);
  return {
    favs,
    isFav: (id: string) => favs.includes(id),
    toggle: (id: string) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]),
  };
}

/* ---------- School card ---------- */

export function SchoolCardPro({ school, onEnroll, onProfile }: { school: Post; onEnroll: () => void; onProfile: () => void }) {
  const { isFav, toggle } = useFavorites();
  const saved = isFav(school.id);
  const amenities = ((school.amenities as string[] | undefined) ?? []).slice(0, 3);
  const courses = ((school.courses as string[] | undefined) ?? []).slice(0, 3);
  const tag = txt(school.tag) || 'New on Padasala';
  const TagIcon = tag === 'Smart School' ? GraduationCap : tag === 'Verified' ? Check : Sparkles;

  return (
    <article className="group relative flex h-full flex-col xl:flex-row gap-4 rounded-[28px] bg-white p-3 sm:p-3.5 shadow-[0_18px_40px_-20px_rgba(2,132,199,0.45)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgba(2,132,199,0.55)]">
      {/* Photo */}
      <div className="relative h-48 sm:h-52 xl:h-auto xl:min-h-[250px] xl:w-[40%] shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-sky-200 to-sky-50">
        {school.image ? (
          <img src={txt(school.image)} alt={txt(school.name)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <Building2 className="absolute inset-0 m-auto h-14 w-14 text-white" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0062f5] px-3 py-1 text-xs font-bold text-white shadow-md">
          <TagIcon className="h-3.5 w-3.5" strokeWidth={2.6} /> {tag}
        </span>
        <button
          onClick={() => toggle(school.id)}
          aria-label={saved ? 'Remove from saved' : 'Save school'}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110"
        >
          <Heart className={`h-[18px] w-[18px] ${saved ? 'fill-rose-500 text-rose-500' : 'text-[#0b3b66]'}`} />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <ImageIcon className="h-3.5 w-3.5" /> +{txt(school.photoCount) || 1} photos
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-1 pb-1 xl:py-1 xl:pr-1.5">
        <div className="flex items-start gap-2.5">
          <span className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[#0284c7] ring-1 ring-sky-100">
            <Building2 className="h-5 w-5" />
          </span>
          <h3 className="min-w-0 flex-1 font-display text-[17px] sm:text-lg xl:text-[17px] font-extrabold leading-tight text-[#0b1f33] line-clamp-2">{txt(school.name)}</h3>
          {school.rating ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {txt(school.rating)}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">New</span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 sm:pl-[50px] text-[13px] text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-[#0284c7]" />
          <span>{txt(school.district)}, TN</span>
          <span className="text-slate-300">•</span>
          <span>{txt(school.grades)}</span>
        </div>

        {amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.map((a) => <span key={a} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0369a1] ring-1 ring-sky-100">{a}</span>)}
          </div>
        )}
        {courses.length > 0 && (
          <>
            <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Courses</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {courses.map((c) => <span key={c} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0369a1] ring-1 ring-sky-200">{c}</span>)}
            </div>
          </>
        )}

        <div className="mt-auto flex items-center gap-2 pt-4">
          <button onClick={onEnroll} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] to-[#0062f5] py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:shadow-lg">
            Enroll now <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={onProfile} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 sm:px-5 py-2.5 text-sm font-bold text-[#0284c7] ring-1 ring-sky-200 transition hover:bg-sky-50">
            <User className="h-4 w-4" /> Profile
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Enroll + profile dialogs, shared by carousel and grid ---------- */

function useSchoolDialogs() {
  const [enroll, setEnroll] = useState<Post | null>(null);
  const [profile, setProfile] = useState<Post | null>(null);
  const dialogs = (
    <>
      <Modal open={!!enroll} onClose={() => setEnroll(null)} title={enroll ? `Admission enquiry — ${txt(enroll.name)}` : ''}>
        {enroll && <EnrollForm school={enroll} onDone={() => setEnroll(null)} />}
      </Modal>
      <Modal open={!!profile} onClose={() => setProfile(null)} title={profile ? txt(profile.name) : ''} wide>
        {profile && <SchoolProfileView school={profile} onEnroll={() => { setEnroll(profile); setProfile(null); }} />}
      </Modal>
    </>
  );
  return { open: (s: Post) => ({ onEnroll: () => setEnroll(s), onProfile: () => setProfile(s) }), dialogs };
}

function EnrollForm({ school, onDone }: { school: Post; onDone: () => void }) {
  const session = useSession();
  const enquiries = useCollection('enquiries');
  return (
    <>
      <p className="mb-4 text-sm text-slate-500">The school receives your enquiry and contacts you about admission. No account needed.</p>
      <DynamicForm
        submitLabel="Send admission enquiry"
        initial={{ studentName: session?.role === 'student' ? session.name : '' }}
        fields={[
          { name: 'studentName', label: 'Student / parent name', required: true },
          { name: 'phone', label: 'Mobile number', type: 'tel', required: true },
          { name: 'classLevel', label: 'Class applying for', type: 'select', required: true, options: ['Pre-KG', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)] },
          { name: 'message', label: 'Message (optional)', type: 'textarea', placeholder: 'Questions about fees, transport, hostel…' },
        ]}
        onSubmit={(v) => {
          enquiries.add(
            { to: school.ownerId, toName: txt(school.name), about: `Admission enquiry — ${txt(v.classLevel)}`, message: txt(v.message) || 'Interested in admission.', phone: v.phone, fromRole: session?.role ?? 'guest' },
            { id: session?.id ?? 'guest', name: session?.name ?? txt(v.studentName) },
          );
          window.setTimeout(onDone, 1200);
        }}
      />
    </>
  );
}

export function SchoolProfileView({ school, onEnroll }: { school: Post; onEnroll?: () => void }) {
  const posts = useCollection('schoolPosts').items.filter((p) => p.ownerId === school.ownerId);
  const jobs = useCollection('jobs').items.filter((p) => p.ownerId === school.ownerId);
  const events = useCollection('events').items.filter((p) => p.ownerId === school.ownerId);
  const amenities = (school.amenities as string[] | undefined) ?? [];
  const features = (school.features as string[] | undefined) ?? [];
  const courses = (school.courses as string[] | undefined) ?? [];

  return (
    <div className="space-y-5">
      {school.image && <img src={txt(school.image)} alt="" className="h-48 sm:h-56 w-full rounded-2xl object-cover" />}
      <div className="flex flex-wrap gap-2">
        <Chip>{txt(school.board)}</Chip>
        <Chip tone="slate">{txt(school.grades)}</Chip>
        {school.rating && <Chip tone="amber"><Star className="h-3 w-3 fill-amber-400" /> {txt(school.rating)}</Chip>}
        {school.established && <Chip tone="slate">Since {txt(school.established)}</Chip>}
        {school.students && <Chip tone="emerald">{txt(school.students)} students</Chip>}
        {school.teachers && <Chip tone="violet">{txt(school.teachers)} teachers</Chip>}
      </div>
      {school.about && <p className="text-sm text-slate-700">{txt(school.about)}</p>}
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        {school.address && <span className="flex gap-2 text-slate-600"><MapPin className="h-4 w-4 shrink-0 text-[#0284c7]" />{txt(school.address)}, {txt(school.district)}</span>}
        {school.phone && <a href={`tel:${txt(school.phone)}`} className="flex gap-2 font-semibold text-[#0284c7]"><Phone className="h-4 w-4" />{txt(school.phone)}</a>}
        {school.email && <span className="flex gap-2 text-slate-600"><Mail className="h-4 w-4 text-[#0284c7]" />{txt(school.email)}</span>}
        {school.website && <a href={txt(school.website)} target="_blank" rel="noreferrer" className="flex gap-2 text-[#0284c7]"><Globe className="h-4 w-4" />Website</a>}
      </div>
      {onEnroll && (
        <button onClick={onEnroll} className="btn-primary w-full sm:w-auto px-6">Enroll now <ArrowRight className="h-4 w-4" /></button>
      )}
      {amenities.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Amenities</h4>
          <div className="flex flex-wrap gap-1.5">{amenities.map((a) => <Chip key={a}><CheckCircle2 className="h-3 w-3" />{a}</Chip>)}</div>
        </div>
      )}
      {courses.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Courses & programmes</h4>
          <div className="flex flex-wrap gap-1.5">{courses.map((c) => <Chip key={c} tone="violet">{c}</Chip>)}</div>
        </div>
      )}
      {features.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Features</h4>
          <ul className="space-y-1.5 text-sm text-slate-700">{features.map((f) => <li key={f} className="flex gap-2"><Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />{f}</li>)}</ul>
        </div>
      )}
      {posts.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Admissions, concessions & achievements</h4>
          <div className="grid gap-3">{posts.map((p) => <SchoolPostCard key={p.id} post={p} />)}</div>
        </div>
      )}
      {jobs.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Open vacancies</h4>
          <div className="grid gap-3">{jobs.map((p) => <JobCard key={p.id} post={p} />)}</div>
        </div>
      )}
      {events.length > 0 && (
        <div>
          <h4 className="mb-2 font-display font-bold text-[#0b1f33]">Events</h4>
          <div className="grid gap-3 sm:grid-cols-2">{events.map((p) => <EventCard key={p.id} post={p} />)}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Carousel (home) ---------- */

export function SchoolCarousel({ schools }: { schools: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const { open, dialogs } = useSchoolDialogs();

  const step = () => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 20 : 1;
  };

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const visible = Math.max(1, Math.round(el.clientWidth / step()));
    setPages(Math.max(1, schools.length - visible + 1));
    setPage(Math.round(el.scrollLeft / step()));
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schools.length]);

  const scrollTo = (i: number) => ref.current?.scrollTo({ left: Math.max(0, Math.min(i, pages - 1)) * step(), behavior: 'smooth' });

  const Arrow = ({ dir }: { dir: -1 | 1 }) => (
    <button
      onClick={() => scrollTo(page + dir)}
      disabled={dir < 0 ? page === 0 : page >= pages - 1}
      aria-label={dir < 0 ? 'Previous schools' : 'Next schools'}
      className={`hidden md:flex absolute top-1/2 z-10 h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0284c7] shadow-[0_10px_25px_-8px_rgba(2,132,199,0.45)] ring-1 ring-sky-100 transition hover:scale-110 disabled:opacity-40 disabled:hover:scale-100 ${dir < 0 ? '-left-3 xl:-left-6' : '-right-3 xl:-right-6'}`}
    >
      {dir < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="relative">
      <Arrow dir={-1} />
      <div
        ref={ref}
        onScroll={measure}
        className="reveal-stagger no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2 scroll-px-5 md:mx-0 md:px-0 md:scroll-px-0"
      >
        {schools.map((s) => (
          <div key={s.id} className="w-[86%] max-w-[380px] shrink-0 snap-start md:w-[calc(50%-10px)] md:max-w-none">
            <SchoolCardPro school={s} {...open(s)} />
          </div>
        ))}
      </div>
      <Arrow dir={1} />
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-[#0062f5]' : 'w-2.5 bg-sky-200 hover:bg-sky-300'}`}
            />
          ))}
        </div>
      )}
      {dialogs}
    </div>
  );
}

/* ---------- Grid (Schools page) ---------- */

export function SchoolGrid({ schools }: { schools: Post[] }) {
  const { open, dialogs } = useSchoolDialogs();
  return (
    <>
      <div className="reveal-stagger grid gap-5 sm:grid-cols-2 xl:gap-6">
        {schools.map((s) => <SchoolCardPro key={s.id} school={s} {...open(s)} />)}
      </div>
      {dialogs}
    </>
  );
}
