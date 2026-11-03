import { useState } from 'react';
import { BookOpen, Search, PlusCircle, Users, GraduationCap, Palette, Target } from 'lucide-react';
import { useRoute, navigate } from '@/lib/router';
import { useSession } from '@/lib/auth';
import { viewersOf } from '@/lib/access';
import { useCollection, txt } from '@/lib/store';
import { PageHero, Tabs, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, EnquiryInbox } from '@/components/ui';
import { CoachingCard, TuitionRequestCard, MyPosts, ManageActions, grid } from '@/components/listings';
import type { Post } from '@/lib/store';
import { districts } from '@/data/districts';
import { coachingCategoryInfo, coachingFields, type CoachingCategory } from '@/data/forms';

type View = 'browse' | 'post' | 'requests';

const catTabs = [
  { id: 'academic' as const, label: 'Academic', icon: GraduationCap },
  { id: 'extra' as const, label: 'Extra Curricular', icon: Palette },
  { id: 'courses' as const, label: 'Courses (NEET & others)', icon: Target },
];

export function CoachingPage() {
  const { segments } = useRoute();
  const cat: CoachingCategory = (['academic', 'extra', 'courses'] as const).find((c) => c === segments[1]) ?? 'academic';
  const [view, setView] = useState<View>('browse');

  return (
    <>
      <PageHero
        icon={BookOpen}
        eyebrow="Coaching Centres"
        title={<>Tutors, tuition centres & <span className="text-[#0284c7]">courses near you</span></>}
        subtitle="Compare subjects, experience and monthly fees near you."
      />
      <div className="container-page pb-16">
        {/* Category = the Coaching dropdown in the menu */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {catTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { navigate(`/coaching/${id}`); setView('browse'); }}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full px-2 py-3 text-center text-xs sm:text-sm font-bold transition ${
                cat === id ? 'bg-[#0b1f33] text-white shadow-lg' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300'
              }`}
            >
              <Icon className="h-5 w-5 sm:h-4 sm:w-4" /> {label}
            </button>
          ))}
        </div>

        {/* The listing is the default view (chosen with the category buttons above); tapping an active tab again returns to it. */}
        <Tabs<View>
          active={view}
          onChange={(v) => setView(v === view ? 'browse' : v)}
          tabs={[
            { id: 'post', label: 'Post your centre', icon: PlusCircle },
            { id: 'requests', label: 'Student Requirements', icon: Users },
          ]}
        />

        <div className="mt-6">
          {view === 'browse' && <Browse cat={cat} onAdd={() => setView('post')} />}
          {view === 'post' && (
            <RequireRole allow={['coaching']} reason="Only coaching centres and tutors can post here">
              <PostCentre cat={cat} />
            </RequireRole>
          )}
          {view === 'requests' && <StudentRequests />}
        </div>
      </div>
    </>
  );
}

function Browse({ cat, onAdd }: { cat: CoachingCategory; onAdd: () => void }) {
  const { items } = useCollection('coaching');
  const session = useSession();
  // The logged-in centre's own cards are shown first (with Edit/Delete), not repeated in the main list.
  const mine = session?.role === 'coaching' ? items.filter((c) => c.category === cat && c.ownerId === session.id) : [];
  const [q, setQ] = useState('');
  const [district, setDistrict] = useState('');
  const [provider, setProvider] = useState('');
  const [maxFee, setMaxFee] = useState('');

  const list = items
    .filter((c) => c.category === cat && !mine.includes(c))
    .filter((c) => !q || `${txt(c.name)} ${txt(c.subjects)} ${txt(c.area)}`.toLowerCase().includes(q.toLowerCase()))
    .filter((c) => !district || c.district === district)
    .filter((c) => !provider || c.providerType === provider)
    .filter((c) => !maxFee || Number(c.charges) <= Number(maxFee));

  return (
    <>
      {session?.role === 'coaching' && (
        <section className="mb-8 rounded-[28px] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 sm:p-6 ring-1 ring-emerald-100">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#0b1f33]">Your centre — {session.name}</h2>
              <p className="text-sm text-slate-500">Only you can see Edit and Delete on these cards.</p>
            </div>
            <button onClick={onAdd} className="btn-primary px-4 py-2 text-sm"><PlusCircle className="h-4 w-4" /> Add {mine.length ? 'another' : 'your centre'}</button>
          </div>
          {mine.length === 0 ? (
            <EmptyState title={`You have no ${coachingCategoryInfo[cat].title} listing yet`} text="Tap “Add your centre” to post your subjects, experience and monthly fee." />
          ) : (
            <div className={grid}>{mine.map((c) => <CoachingCard key={c.id} post={c} manage={<CoachingManage post={c} />} />)}</div>
          )}
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${coachingCategoryInfo[cat].subjectsLabel.toLowerCase()}, name or area…`} className="input pl-11 py-2.5" />
        </div>
        <div className="grid grid-cols-3 lg:flex gap-2">
          <FilterSelect label="District" value={district} onChange={setDistrict} options={districts} />
          <FilterSelect label="Type" value={provider} onChange={setProvider} options={['Individual Tutor', 'Tuition Centre', 'Institute']} />
          <select aria-label="Maximum fee" value={maxFee} onChange={(e) => setMaxFee(e.target.value)} className="input py-2.5 lg:w-auto">
            <option value="">Any fee</option>
            {[1000, 2000, 3000, 5000, 10000].map((f) => <option key={f} value={f}>Up to ₹{f.toLocaleString('en-IN')}</option>)}
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState title="No centres listed here yet" text="Coaching centres can add themselves from “Post your centre”." />
      ) : (
        <div className={grid}>{list.map((c) => <CoachingCard key={c.id} post={c} />)}</div>
      )}
    </>
  );
}

function PostCentre({ cat }: { cat: CoachingCategory }) {
  const session = useSession()!;
  const store = useCollection('coaching');
  return (
    <div className="space-y-8">
      <Card className="p-5 sm:p-6">
        <p className="mb-5 text-sm text-slate-500">
          Posting under <b className="text-[#0b1f33]">{coachingCategoryInfo[cat].title}</b>. Individual tutors and tuition centres both add subjects, experience, monthly charges and achievements. Switch the category above to post under another one.
        </p>
        <DynamicForm key={cat} fields={coachingFields(cat)} initial={{ name: session.name }} onSubmit={(v) => store.add({ ...v, category: cat }, session)} />
      </Card>
      <MyPosts collection="coaching" render={(p) => <CoachingCard post={p} manage={<CoachingManage post={p} />} />} title="Your listings" hideDelete />
      <EnquiryInbox />
    </div>
  );
}

// Students' tuition requests are visible only to coaching centres (see src/lib/access.ts).
function StudentRequests() {
  return (
    <RequireRole allow={viewersOf('tuitionRequest')} reason="Student requirements are visible only to coaching centres">
      <StudentRequestList />
    </RequireRole>
  );
}

function StudentRequestList() {
  const { items } = useCollection('tuitionRequests');
  const [district, setDistrict] = useState('');
  const list = items.filter((r) => !district || r.district === district);

  return (
    <>
      <Card className="mb-5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-sky-50 to-white">
        <p className="text-sm text-slate-600">
          Students post what tuition they need and where. <b className="text-emerald-700">Call them directly.</b>
        </p>
        <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
      </Card>
      {list.length === 0 ? <EmptyState title="No requirements in this district yet" /> : (
        <div className={grid}>{list.map((r) => <TuitionRequestCard key={r.id} post={r} showContact />)}</div>
      )}
    </>
  );
}

/** Edit / Delete on a coaching card (visible only to the centre that posted it, or the admin). */
function CoachingManage({ post }: { post: Post }) {
  const category = ((post.category as CoachingCategory) in coachingCategoryInfo ? post.category : 'academic') as CoachingCategory;
  return <ManageActions post={post} collection="coaching" fields={coachingFields(category)} what="coaching listing" />;
}
