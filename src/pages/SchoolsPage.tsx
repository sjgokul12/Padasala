import { useState } from 'react';
import {
  Building2, Search, Megaphone, LayoutDashboard, Sparkles, Star, Briefcase, CalendarDays, Package, Trophy,
  DoorOpen, BadgePercent, Palette, Users, Truck, Plus, X, CheckCircle2, Phone, Inbox, Heart,
} from 'lucide-react';
import { useRoute, navigate } from '@/lib/router';
import { useSession } from '@/lib/auth';
import { useCollection, txt, type Post } from '@/lib/store';
import {
  Tabs, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, SectionTitle,
  EnquiryButton, EnquiryInbox, type FieldDef,
} from '@/components/ui';
import {
  SchoolPostCard, JobCard, EventCard, RequirementCard, TeacherCard, VendorCard, MyPosts, grid,
} from '@/components/listings';
import { SchoolHero, SchoolGrid, useFavorites } from '@/components/SchoolShowcase';
import { districts } from '@/data/districts';
import {
  schoolProfileFields, amenityOptions, jobFields, eventFields, requirementFields, achievementFields,
  admissionFields, concessionFields, extracurricularFields,
} from '@/data/forms';

type Tab = 'find' | 'updates' | 'dashboard';

export function SchoolsPage() {
  const { segments, query } = useRoute();
  const tab: Tab = segments[1] === 'dashboard' ? 'dashboard' : segments[1] === 'updates' ? 'updates' : 'find';
  const [q, setQ] = useState(() => query.get('q') ?? '');

  const showResults = () => {
    if (tab !== 'find') navigate('/schools');
    window.setTimeout(() => document.getElementById('school-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <>
      <SchoolHero top as="h1" query={q} onQuery={setQ} onSearch={showResults} onFilters={showResults} />
      <div className="container-page pb-16 pt-2">
        <Tabs<Tab>
          active={tab}
          onChange={(t) => navigate(t === 'find' ? '/schools' : `/schools/${t}`)}
          tabs={[
            { id: 'find', label: 'Find Schools', icon: Search },
            { id: 'updates', label: 'Admissions & Updates', icon: Megaphone },
            { id: 'dashboard', label: 'School Dashboard', icon: LayoutDashboard },
          ]}
        />
        <div className="mt-6 sm:mt-8">
          {tab === 'find' && <FindSchools q={q} />}
          {tab === 'updates' && <SchoolUpdates />}
          {tab === 'dashboard' && (
            <RequireRole allow={['school']} reason="School dashboard is for registered schools">
              <Dashboard />
            </RequireRole>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Public: directory ---------- */

function FindSchools({ q }: { q: string }) {
  const { items } = useCollection('schoolProfiles');
  const { favs } = useFavorites();
  const [district, setDistrict] = useState('');
  const [board, setBoard] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);

  const boards = [...new Set(items.map((s) => txt(s.board)))];
  const words = q.toLowerCase().trim();
  const list = items.filter(
    (s) =>
      (!words || `${txt(s.name)} ${txt(s.district)} ${txt(s.board)} ${txt(s.amenities)} ${txt(s.courses)}`.toLowerCase().includes(words)) &&
      (!district || s.district === district) &&
      (!board || s.board === board) &&
      (!savedOnly || favs.includes(s.id)),
  );

  return (
    <div id="school-results" className="scroll-mt-28">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div className="grid grid-cols-2 sm:flex gap-2.5 flex-1">
          <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
          <FilterSelect label="All boards" value={board} onChange={setBoard} options={boards} />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-sm font-semibold text-slate-500">{list.length} school{list.length === 1 ? '' : 's'}{words ? ` for “${q.trim()}”` : ''}</span>
          <button
            onClick={() => setSavedOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${savedOnly ? 'bg-rose-50 text-rose-600 ring-rose-200' : 'bg-white text-slate-700 ring-slate-200'}`}
          >
            <Heart className={`h-4 w-4 ${savedOnly ? 'fill-rose-500 text-rose-500' : ''}`} /> Saved ({favs.length})
          </button>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState title={savedOnly ? 'No saved schools yet' : 'No schools match your search'} text={savedOnly ? 'Tap the heart on a school card to save it.' : 'Try another name, district or board.'} />
      ) : (
        <SchoolGrid schools={list} />
      )}
    </div>
  );
}

/* ---------- Public: updates feed ---------- */

function SchoolUpdates() {
  const { items } = useCollection('schoolPosts');
  const [kind, setKind] = useState('');
  const [district, setDistrict] = useState('');
  const profiles = useCollection('schoolProfiles').items;
  const districtOf = (ownerId: string) => txt(profiles.find((p) => p.ownerId === ownerId)?.district);

  const list = items.filter((p) => (!kind || p.kind === kind) && (!district || districtOf(p.ownerId) === district));
  const kinds = [
    { id: '', label: 'All' },
    { id: 'admission', label: 'Admissions' },
    { id: 'concession', label: 'Concessions' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'extracurricular', label: 'Extra Curricular' },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
          {kinds.map((k) => (
            <button key={k.id} onClick={() => setKind(k.id)} className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold ${kind === k.id ? 'bg-[#0b1f33] text-white' : 'bg-white ring-1 ring-slate-200 text-slate-700'}`}>
              {k.label}
            </button>
          ))}
        </div>
        <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
      </div>
      {list.length === 0 ? <EmptyState title="No updates yet" /> : <div className={grid}>{list.map((p) => <SchoolPostCard key={p.id} post={p} />)}</div>}
    </>
  );
}

/* ---------- School dashboard ---------- */

const sections = [
  { id: 'profile', label: 'Total Profile', icon: Building2 },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'features', label: 'Features', icon: Star },
  { id: 'job', label: 'Post a Job Vacancy', icon: Briefcase },
  { id: 'event', label: 'Post an Event', icon: CalendarDays },
  { id: 'requirement', label: 'Post a Requirement', icon: Package },
  { id: 'achievement', label: 'Post an Achievement', icon: Trophy },
  { id: 'admission', label: 'Post Admission Open', icon: DoorOpen },
  { id: 'concession', label: 'Post a Concession', icon: BadgePercent },
  { id: 'extracurricular', label: 'Post Extra Curricular', icon: Palette },
  { id: 'teachers', label: 'Teacher Profiles', icon: Users },
  { id: 'vendors', label: 'Vendors List', icon: Truck },
  { id: 'inbox', label: 'Enquiries', icon: Inbox },
] as const;

type SectionId = (typeof sections)[number]['id'];

function Dashboard() {
  const [active, setActive] = useState<SectionId>('profile');
  const current = sections.find((s) => s.id === active)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 items-start">
      {/* Menu: side list on desktop, swipeable chips on phones */}
      <nav className="min-w-0 lg:sticky lg:top-28">
        <div className="lg:hidden -mx-5 px-5 flex gap-2 overflow-x-auto no-scrollbar">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)} className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ${active === id ? 'bg-[#0284c7] text-white' : 'bg-white ring-1 ring-slate-200 text-slate-700'}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <Card className="hidden lg:block p-2">
          {sections.map(({ id, label, icon: Icon }, i) => (
            <div key={id}>
              {(i === 3 || i === 10) && <div className="mx-3 my-2 border-t border-slate-100" />}
              <button
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition ${active === id ? 'bg-sky-50 text-[#0284c7]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <Icon className="h-4 w-4 shrink-0" /> {label}
              </button>
            </div>
          ))}
        </Card>
      </nav>

      <div className="min-w-0">
        <SectionTitle title={current.label} />
        <DashboardSection id={active} />
      </div>
    </div>
  );
}

function useMyProfile() {
  const session = useSession()!;
  const profiles = useCollection('schoolProfiles');
  const mine = profiles.items.find((p) => p.ownerId === session.id);
  const save = (patch: Record<string, string | string[] | number | boolean | undefined>) =>
    mine ? profiles.update(mine.id, patch) : profiles.add({ name: session.name, ...patch }, session);
  return { mine, save, session };
}

const postForms: Partial<Record<SectionId, { fields: FieldDef[]; collection: 'jobs' | 'events' | 'requirements' | 'schoolPosts'; kind?: string; help: string; render: (p: Post) => JSX.Element }>> = {
  job: { fields: jobFields, collection: 'jobs', help: 'Vacancies appear on the Teacher Job Posting page for teachers to see.', render: (p) => <JobCard post={p} /> },
  event: { fields: eventFields, collection: 'events', help: 'Events appear on the Events page, sorted by date and filterable by district. Students can ask for the invitation on WhatsApp.', render: (p) => <EventCard post={p} /> },
  requirement: { fields: requirementFields, collection: 'requirements', help: 'Need bags, ties, notebooks, computers or software? Registered vendors see this and can send you quotations.', render: (p) => <RequirementCard post={p} /> },
  achievement: { fields: achievementFields, collection: 'schoolPosts', kind: 'achievement', help: 'Share results, medals and milestones with parents.', render: (p) => <SchoolPostCard post={p} /> },
  admission: { fields: admissionFields, collection: 'schoolPosts', kind: 'admission', help: 'Announce admissions — Vijayadasami, new academic year or any occasion.', render: (p) => <SchoolPostCard post={p} /> },
  concession: { fields: concessionFields, collection: 'schoolPosts', kind: 'concession', help: 'Fee concessions offered to students (sibling, merit, sports quota…).', render: (p) => <SchoolPostCard post={p} /> },
  extracurricular: { fields: extracurricularFields, collection: 'schoolPosts', kind: 'extracurricular', help: 'Activities your school provides beyond academics.', render: (p) => <SchoolPostCard post={p} /> },
};

function DashboardSection({ id }: { id: SectionId }) {
  if (id === 'profile') return <ProfileSection />;
  if (id === 'amenities') return <AmenitiesSection />;
  if (id === 'features') return <FeaturesSection />;
  if (id === 'teachers') return <TeachersForSchools />;
  if (id === 'vendors') return <VendorsForSchools />;
  if (id === 'inbox') return <EnquiryInbox title="Quotations & enquiries received" />;
  return <PostSection id={id} />;
}

function PostSection({ id }: { id: SectionId }) {
  const config = postForms[id]!;
  const { session } = useMyProfile();
  const store = useCollection(config.collection);
  return (
    <>
      <Card className="p-5 sm:p-6">
        <p className="mb-5 text-sm text-slate-500">{config.help}</p>
        <DynamicForm key={id} fields={config.fields} onSubmit={(v) => store.add(config.kind ? { ...v, kind: config.kind } : v, session)} />
      </Card>
      <MyPosts collection={config.collection} kind={config.kind} render={config.render} />
    </>
  );
}

function ProfileSection() {
  const { mine, save } = useMyProfile();
  const counts = {
    vacancies: useCollection('jobs').items.filter((p) => p.ownerId === mine?.ownerId).length,
    events: useCollection('events').items.filter((p) => p.ownerId === mine?.ownerId).length,
    requirements: useCollection('requirements').items.filter((p) => p.ownerId === mine?.ownerId).length,
    updates: useCollection('schoolPosts').items.filter((p) => p.ownerId === mine?.ownerId).length,
  };
  const filled = schoolProfileFields.filter((f) => mine?.[f.name]).length + (txt(mine?.amenities) ? 1 : 0) + (txt(mine?.features) ? 1 : 0);
  const pct = Math.round((filled / (schoolProfileFields.length + 2)) * 100);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="col-span-2 sm:col-span-1 p-4">
          <div className="text-xs font-semibold text-slate-500">Profile complete</div>
          <div className="font-display text-2xl font-black text-[#0284c7]">{pct}%</div>
          <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-[#009bf8] to-[#0062f5]" style={{ width: `${pct}%` }} /></div>
        </Card>
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k} className="p-4">
            <div className="text-xs font-semibold capitalize text-slate-500">{k}</div>
            <div className="font-display text-2xl font-black text-[#0b1f33]">{v}</div>
          </Card>
        ))}
      </div>
      <Card className="p-5 sm:p-6">
        <DynamicForm key={mine?.id ?? 'new'} fields={schoolProfileFields} initial={mine} reset={false} submitLabel="Save profile" onSubmit={save} />
      </Card>
    </div>
  );
}

function AmenitiesSection() {
  const { mine, save } = useMyProfile();
  const selected = (mine?.amenities as string[] | undefined) ?? [];
  const [custom, setCustom] = useState('');
  const toggle = (a: string) => save({ amenities: selected.includes(a) ? selected.filter((x) => x !== a) : [...selected, a] });
  const all = [...new Set([...amenityOptions, ...selected])];

  return (
    <Card className="p-5 sm:p-6">
      <p className="mb-4 text-sm text-slate-500">Tap to select the facilities your school offers. Changes save automatically.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {all.map((a) => {
          const on = selected.includes(a);
          return (
            <button key={a} onClick={() => toggle(a)} className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left text-sm font-semibold ring-1 transition ${on ? 'bg-sky-50 text-[#0284c7] ring-sky-300' : 'bg-white text-slate-700 ring-slate-200 hover:ring-sky-200'}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${on ? 'bg-[#0284c7] text-white' : 'ring-1 ring-slate-300'}`}>{on && <CheckCircle2 className="h-3.5 w-3.5" />}</span>
              {a}
            </button>
          );
        })}
      </div>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) { save({ amenities: [...selected, custom.trim()] }); setCustom(''); } }}>
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add another amenity" className="input py-2.5" />
        <button className="btn-primary px-4"><Plus className="h-4 w-4" /> Add</button>
      </form>
    </Card>
  );
}

function FeaturesSection() {
  const { mine, save } = useMyProfile();
  const features = (mine?.features as string[] | undefined) ?? [];
  const [text, setText] = useState('');

  return (
    <Card className="p-5 sm:p-6">
      <p className="mb-4 text-sm text-slate-500">Highlights that make your school special — teaching methods, programmes, results.</p>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { save({ features: [...features, text.trim()] }); setText(''); } }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. NEET foundation from Class 8" className="input py-2.5" />
        <button className="btn-primary px-4"><Plus className="h-4 w-4" /> Add</button>
      </form>
      {features.length === 0 ? (
        <div className="mt-5"><EmptyState title="No features added yet" /></div>
      ) : (
        <ul className="mt-5 space-y-2">
          {features.map((f, i) => (
            <li key={`${f}-${i}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <Star className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="flex-1">{f}</span>
              <button aria-label="Remove" onClick={() => save({ features: features.filter((_, j) => j !== i) })} className="text-slate-400 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ---------- Schools-only access ---------- */

export function TeachersForSchools() {
  const { items } = useCollection('teacherProfiles');
  const [district, setDistrict] = useState('');
  const [subject, setSubject] = useState('');
  const subjects = [...new Set(items.flatMap((t) => t.subjects as string[]))].sort();
  const list = items.filter((t) => (!district || (t.districts as string[]).includes(district)) && (!subject || (t.subjects as string[]).includes(subject)));

  return (
    <>
      <div className="mb-4 grid grid-cols-2 sm:flex gap-2.5">
        <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
        <FilterSelect label="All subjects" value={subject} onChange={setSubject} options={subjects} />
      </div>
      {list.length === 0 ? <EmptyState title="No teacher profiles match" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((t) => (
            <TeacherCard key={t.id} post={t} action={<><EnquiryButton to={t.ownerId} toName={txt(t.name)} about={`Teaching position (${txt(t.subjects)})`} /><a href={`tel:${txt(t.phone)}`} className="btn-outline text-sm px-4 py-2"><Phone className="h-4 w-4" /> Call</a></>} />
          ))}
        </div>
      )}
    </>
  );
}

export function VendorsForSchools() {
  const { items } = useCollection('vendors');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const categories = [...new Set(items.map((v) => txt(v.category)))].sort();
  const list = items.filter((v) => (!category || v.category === category) && (!district || (v.locations as string[]).some((l) => l === district || l === 'All Tamil Nadu')));

  return (
    <>
      <div className="mb-4 grid grid-cols-2 sm:flex gap-2.5">
        <FilterSelect label="All categories" value={category} onChange={setCategory} options={categories} />
        <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
      </div>
      {list.length === 0 ? <EmptyState title="No vendors match" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((v) => (
            <VendorCard key={v.id} post={v} action={<><EnquiryButton to={v.ownerId} toName={txt(v.company)} about={txt(v.category)} /><a href={`tel:${txt(v.phone)}`} className="btn-outline text-sm px-4 py-2"><Phone className="h-4 w-4" /> Call</a></>} />
          ))}
        </div>
      )}
    </>
  );
}
