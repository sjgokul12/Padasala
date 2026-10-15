import { useState } from 'react';
import { CalendarDays, PlusCircle, MapPin } from 'lucide-react';
import { useSession } from '@/lib/auth';
import { useCollection, txt } from '@/lib/store';
import { PageHero, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, Modal } from '@/components/ui';
import { EventCard, MyPosts, todayIso, grid } from '@/components/listings';
import { districts } from '@/data/districts';
import { eventFields, eventCategories } from '@/data/forms';

export function EventsPage() {
  const { items } = useCollection('events');
  const session = useSession();
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [when, setWhen] = useState<'upcoming' | 'past'>('upcoming');
  const [posting, setPosting] = useState(false);

  const today = todayIso();
  const list = items
    .filter((e) => (when === 'upcoming' ? txt(e.date) >= today : txt(e.date) < today))
    .filter((e) => !district || e.district === district)
    .filter((e) => !category || e.category === category)
    .sort((a, b) => (when === 'upcoming' ? 1 : -1) * txt(a.date).localeCompare(txt(b.date)));

  // Group by month so the list reads like a calendar.
  const groups = list.reduce<Record<string, typeof list>>((acc, e) => {
    const key = new Date(`${txt(e.date)}T00:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  const canPost = session && (session.role === 'school' || session.role === 'organizer');

  return (
    <>
      <PageHero
        icon={CalendarDays}
        eyebrow="Events"
        title={<>Events for students, <span className="text-[#0284c7]">by date & district</span></>}
        subtitle="School events by date and district — invites on WhatsApp."
      >
        <button onClick={() => setPosting(true)} className="btn-primary px-5"><PlusCircle className="h-4 w-4" /> Post an event</button>
      </PageHero>

      <div className="container-page pb-16">
        <div className="sticky top-[72px] sm:top-[88px] z-30 -mx-5 px-5 sm:mx-0 sm:px-0 py-3 bg-white/85 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              {(['upcoming', 'past'] as const).map((w) => (
                <button key={w} onClick={() => setWhen(w)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${when === w ? 'bg-white text-[#0284c7] shadow' : 'text-slate-600'}`}>{w}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2.5">
              <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
              <FilterSelect label="All categories" value={category} onChange={setCategory} options={eventCategories} />
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-4"><EmptyState title={`No ${when} events${district ? ` in ${district}` : ''}`} text="Try another district or category." /></div>
        ) : (
          Object.entries(groups).map(([month, evs]) => (
            <section key={month} className="mt-6">
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-[#0b1f33]">
                <span className="h-2 w-2 rounded-full bg-[#0284c7]" /> {month}
                <span className="text-sm font-semibold text-slate-400">· {evs.length} event{evs.length > 1 ? 's' : ''}</span>
              </h2>
              <div className={grid}>{evs.map((e) => <EventCard key={e.id} post={e} />)}</div>
            </section>
          ))
        )}

        {canPost && <MyPosts collection="events" render={(p) => <EventCard post={p} />} title="Events you posted" />}
      </div>

      <Modal open={posting} onClose={() => setPosting(false)} title="Post an event" wide>
        <RequireRole allow={['school', 'organizer']} reason="Registered schools and event organizers can post events">
          <PostEvent onDone={() => setPosting(false)} />
        </RequireRole>
      </Modal>
    </>
  );
}

function PostEvent({ onDone }: { onDone: () => void }) {
  const session = useSession()!;
  const store = useCollection('events');
  return (
    <>
      <p className="mb-4 flex items-start gap-2 text-sm text-slate-500">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0284c7]" />
        Students see events by date and district. The WhatsApp number receives invitation requests from students.
      </p>
      <Card className="p-0 ring-0 shadow-none">
        <DynamicForm
          fields={eventFields}
          submitLabel="Publish event"
          onSubmit={(v) => {
            store.add({ ...v, organizerType: session.role === 'school' ? 'School' : 'Event Organizer' }, session);
            window.setTimeout(onDone, 900);
          }}
        />
      </Card>
    </>
  );
}
