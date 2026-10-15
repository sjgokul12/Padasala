import type { ReactNode } from 'react';
import {
  MapPin, Briefcase, Clock, IndianRupee, CalendarDays, Building2, Package, Trophy, DoorOpen, BadgePercent,
  Palette, Phone, GraduationCap, Star, Users, Trash2, MessageCircle, Share2, ExternalLink, Mail, Truck,
} from 'lucide-react';
import { type Post, txt, useCollection, type CollectionName } from '@/lib/store';
import { useSession } from '@/lib/auth';
import { Card, Chip, EmptyState, formatDate, maskPhone } from './ui';

const Meta = ({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-600">
    <Icon className="h-3.5 w-3.5 shrink-0 text-[#0284c7]" /> {children}
  </span>
);

const waNumber = (p: string) => {
  const d = p.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

export const todayIso = () => new Date().toISOString().slice(0, 10);

/* ---------- School job vacancy ---------- */

export function JobCard({ post, action }: { post: Post; action?: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[#0284c7] ring-1 ring-sky-100">
          <Briefcase className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-[#0b1f33]">{txt(post.title)}</h3>
          <div className="text-sm text-slate-500">{post.ownerName}</div>
        </div>
        <Chip>{txt(post.jobType)}</Chip>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <Meta icon={MapPin}>{txt(post.district)}</Meta>
        {post.experience && <Meta icon={Clock}>{txt(post.experience)}</Meta>}
        {post.qualification && <Meta icon={GraduationCap}>{txt(post.qualification)}</Meta>}
      </div>
      {post.salary && (
        <div className="mt-3 inline-flex items-center font-display text-lg font-extrabold text-[#0369a1]">
          <IndianRupee className="h-4 w-4" />{txt(post.salary).replace(/₹/g, '')}
        </div>
      )}
      {post.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{txt(post.description)}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500">{post.lastDate ? `Apply by ${formatDate(txt(post.lastDate))}` : txt(post.subject)}</span>
        {action}
      </div>
    </Card>
  );
}

/* ---------- Event ---------- */

const categoryTone: Record<string, 'sky' | 'amber' | 'violet' | 'emerald' | 'rose' | 'slate'> = {
  Sports: 'emerald', Competition: 'amber', Cultural: 'rose', Academic: 'sky', Workshop: 'violet', Seminar: 'violet', Exhibition: 'sky',
};

export function EventCard({ post }: { post: Post }) {
  const date = txt(post.date);
  const d = new Date(`${date}T00:00:00`);
  const past = date < todayIso();
  const details = `${txt(post.title)}\n📅 ${formatDate(date)}${post.time ? ` · ${txt(post.time)}` : ''}\n📍 ${txt(post.venue)}, ${txt(post.district)}\nBy ${post.ownerName} — via Padasala`;
  const inviteMsg = `Hi! I saw "${txt(post.title)}" on Padasala (${formatDate(date)}, ${txt(post.venue)}). Please send me the invitation and registration details.`;

  return (
    <Card className={`overflow-hidden flex flex-col ${past ? 'opacity-70' : ''}`}>
      <div className="relative h-36 sm:h-40 bg-gradient-to-br from-sky-100 via-sky-50 to-violet-100">
        {post.image ? (
          <img src={txt(post.image)} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <CalendarDays className="absolute inset-0 m-auto h-12 w-12 text-sky-300" />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-2xl bg-white/95 px-3 py-1.5 shadow-md">
          <span className="text-[10px] font-bold uppercase text-rose-500">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
          <span className="font-display text-xl font-black leading-none text-[#0b1f33]">{d.getDate()}</span>
        </div>
        <div className="absolute right-3 top-3"><Chip tone={categoryTone[txt(post.category)] ?? 'sky'}>{txt(post.category)}</Chip></div>
        {past && <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold text-white">Completed</span>}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-[#0b1f33]">{txt(post.title)}</h3>
        <div className="mt-2 flex flex-col gap-1.5">
          <Meta icon={Clock}>{formatDate(date)}{post.time ? ` · ${txt(post.time)}` : ''}</Meta>
          <Meta icon={MapPin}>{txt(post.venue)}, {txt(post.district)}</Meta>
          <Meta icon={Building2}>{post.ownerName}{post.organizerType ? ` · ${txt(post.organizerType)}` : ''}</Meta>
        </div>
        {post.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{txt(post.description)}</p>}
        {!past && (
          <div className="mt-auto pt-4 grid grid-cols-[1fr_auto] gap-2">
            <a
              href={`https://wa.me/${waNumber(txt(post.whatsapp))}?text=${encodeURIComponent(inviteMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-[#1ebe5a] transition"
            >
              <MessageCircle className="h-4 w-4" /> Get invite on WhatsApp
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(details)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            >
              <Share2 className="h-4 w-4" />
            </a>
            {post.registerLink && (
              <a href={txt(post.registerLink)} target="_blank" rel="noreferrer" className="col-span-2 btn-outline text-sm py-2">
                Register online <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------- School requirement (hardware / software) ---------- */

export function RequirementCard({ post, action }: { post: Post; action?: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
            <Package className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-bold leading-snug text-[#0b1f33]">{txt(post.item)}</h3>
            <div className="text-sm text-slate-500">{post.ownerName}</div>
          </div>
        </div>
        <Chip tone="violet">{txt(post.category)}</Chip>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl bg-slate-50 px-3 py-2"><div className="text-[11px] font-semibold text-slate-500">Quantity</div><div className="font-bold text-slate-800">{txt(post.quantity)}</div></div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2"><div className="text-[11px] font-semibold text-slate-500">Budget</div><div className="font-bold text-slate-800">{txt(post.budget) || 'Open'}</div></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <Meta icon={MapPin}>{txt(post.district)}</Meta>
        {post.neededBy && <Meta icon={CalendarDays}>Needed by {formatDate(txt(post.neededBy))}</Meta>}
      </div>
      {post.details && <p className="mt-2 text-sm text-slate-600">{txt(post.details)}</p>}
      {action && <div className="mt-auto pt-4">{action}</div>}
    </Card>
  );
}

/* ---------- School updates: admission / concession / achievement / extra curricular ---------- */

const kindMeta = {
  admission: { label: 'Admission open', icon: DoorOpen, tone: 'emerald' as const },
  concession: { label: 'Concession', icon: BadgePercent, tone: 'amber' as const },
  achievement: { label: 'Achievement', icon: Trophy, tone: 'violet' as const },
  extracurricular: { label: 'Extra curricular', icon: Palette, tone: 'rose' as const },
};

export function SchoolPostCard({ post }: { post: Post }) {
  const kind = txt(post.kind) as keyof typeof kindMeta;
  const { label, icon: Icon, tone } = kindMeta[kind];
  const title =
    kind === 'admission' ? `${txt(post.occasion)} admissions — ${txt(post.classes)}`
    : kind === 'extracurricular' ? txt(post.activity)
    : txt(post.title);
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <Chip tone={tone}><Icon className="h-3.5 w-3.5" /> {label}</Chip>
        <span className="text-xs font-semibold text-slate-400">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      </div>
      <h3 className="mt-3 font-display font-bold leading-snug text-[#0b1f33]">{title}</h3>
      <div className="text-sm font-semibold text-[#0284c7]">{post.ownerName}</div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {kind === 'admission' && <Meta icon={CalendarDays}>{formatDate(txt(post.startDate))}{post.lastDate ? ` – ${formatDate(txt(post.lastDate))}` : ''}</Meta>}
        {kind === 'concession' && <><Meta icon={BadgePercent}>{txt(post.benefit)}</Meta><Meta icon={Users}>{txt(post.eligibility)}</Meta></>}
        {kind === 'achievement' && <><Meta icon={Star}>{txt(post.category)}</Meta>{post.date && <Meta icon={CalendarDays}>{formatDate(txt(post.date))}</Meta>}</>}
        {kind === 'extracurricular' && <>{post.schedule && <Meta icon={Clock}>{txt(post.schedule)}</Meta>}{post.coach && <Meta icon={Users}>{txt(post.coach)}</Meta>}{post.fee && <Meta icon={IndianRupee}>{txt(post.fee)}</Meta>}</>}
      </div>
      {post.details && <p className="mt-2 text-sm text-slate-600">{txt(post.details)}</p>}
    </Card>
  );
}

/* ---------- Coaching centre / tutor ---------- */

export function CoachingCard({ post }: { post: Post }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <Chip tone={post.providerType === 'Individual Tutor' ? 'emerald' : post.providerType === 'Institute' ? 'violet' : 'sky'}>{txt(post.providerType)}</Chip>
        <Chip tone="slate">{txt(post.mode)}</Chip>
      </div>
      <h3 className="mt-3 font-display text-base sm:text-lg font-bold leading-snug text-[#0b1f33]">{txt(post.name)}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(post.subjects as string[]).map((s) => <Chip key={s} tone="slate">{s}</Chip>)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl bg-sky-50/70 px-3 py-2">
          <div className="text-[11px] font-semibold text-slate-500">Charges / month</div>
          <div className="font-display font-extrabold text-[#0369a1]">₹{Number(post.charges).toLocaleString('en-IN')}</div>
        </div>
        <div className="rounded-2xl bg-sky-50/70 px-3 py-2">
          <div className="text-[11px] font-semibold text-slate-500">Experience</div>
          <div className="font-display font-extrabold text-[#0369a1]">{txt(post.experience)} yrs</div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <Meta icon={MapPin}>{txt(post.area)}, {txt(post.district)}</Meta>
        {post.classes && <Meta icon={GraduationCap}>{txt(post.classes)}</Meta>}
      </div>
      {post.achievements && (
        <p className="mt-3 flex gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Trophy className="mt-0.5 h-4 w-4 shrink-0" /> {txt(post.achievements)}
        </p>
      )}
      <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
        <a href={`tel:${txt(post.phone)}`} className="btn-primary text-sm py-2.5 px-3"><Phone className="h-4 w-4" /> Call</a>
        <a href={`https://wa.me/${waNumber(txt(post.phone))}?text=${encodeURIComponent(`Hi, I found ${txt(post.name)} on Padasala and would like to know more.`)}`} target="_blank" rel="noreferrer" className="btn-outline text-sm py-2.5 px-3">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </Card>
  );
}

/* ---------- Student tuition requirement ---------- */

export function TuitionRequestCard({ post, showContact }: { post: Post; showContact: boolean }) {
  const phone = txt(post.phone);
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <Chip tone="emerald">{txt(post.classLevel)}</Chip>
        <Chip tone="slate">{txt(post.mode)}</Chip>
      </div>
      <h3 className="mt-3 font-display font-bold text-[#0b1f33]">Needs: {txt(post.subjects)}</h3>
      <div className="mt-2 flex flex-col gap-1.5">
        <Meta icon={MapPin}>{txt(post.area)}, {txt(post.district)}</Meta>
        {post.budget && <Meta icon={IndianRupee}>{txt(post.budget)}</Meta>}
      </div>
      {post.details && <p className="mt-2 text-sm text-slate-600">{txt(post.details)}</p>}
      <div className="mt-auto pt-4" />
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-800 truncate">{txt(post.studentName)}</div>
          <div className="text-sm text-slate-500">{showContact ? phone : maskPhone(phone)}</div>
        </div>
        {showContact && (
          <a href={`tel:${phone}`} className="btn-primary text-sm px-4 py-2"><Phone className="h-4 w-4" /> Call</a>
        )}
      </div>
    </Card>
  );
}

/* ---------- Teacher profile ---------- */

export function TeacherCard({ post, action }: { post: Post; action?: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#009bf8] to-[#0062f5] font-display text-lg font-bold text-white">
          {txt(post.name).charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base sm:text-lg font-bold text-[#0b1f33]">{txt(post.name)}</h3>
          <div className="text-sm text-slate-500">{txt(post.qualification)} · {txt(post.experience)} yrs exp.</div>
        </div>
        <Chip>{txt(post.jobType)}</Chip>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(post.subjects as string[]).map((s) => <Chip key={s} tone="slate">{s}</Chip>)}
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        <Meta icon={MapPin}>Prefers: {txt(post.districts)}</Meta>
        {post.expectedSalary && <Meta icon={IndianRupee}>{txt(post.expectedSalary)}</Meta>}
        {post.availability && <Meta icon={CalendarDays}>Available: {txt(post.availability)}</Meta>}
      </div>
      {post.about && <p className="mt-2 text-sm text-slate-600">{txt(post.about)}</p>}
      {action && <div className="mt-auto pt-4 flex flex-wrap gap-2">{action}</div>}
    </Card>
  );
}

/* ---------- Vendor ---------- */

export function VendorCard({ post, action }: { post: Post; action?: ReactNode }) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white">
          <Truck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base sm:text-lg font-bold text-[#0b1f33]">{txt(post.company)}</h3>
          <div className="text-sm text-slate-500">{txt(post.experience)} yrs experience</div>
        </div>
        <Chip tone="violet">{txt(post.category)}</Chip>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">{txt(post.services)}</p>
      <div className="mt-2 flex flex-col gap-1.5">
        <Meta icon={MapPin}>Serves: {txt(post.locations)}</Meta>
        <Meta icon={Users}>{txt(post.contactPerson)}</Meta>
        <Meta icon={Phone}>{txt(post.phone)}</Meta>
        {post.email && <Meta icon={Mail}>{txt(post.email)}</Meta>}
      </div>
      {post.about && <p className="mt-2 text-sm text-slate-600">{txt(post.about)}</p>}
      {action && <div className="mt-auto pt-4 flex flex-wrap gap-2">{action}</div>}
    </Card>
  );
}

/* ---------- The logged-in user's own posts, with delete ---------- */

export function MyPosts({ collection, kind, render, title = 'Your posts' }: { collection: CollectionName; kind?: string; render: (p: Post) => ReactNode; title?: string }) {
  const session = useSession();
  const store = useCollection(collection);
  if (!session) return null;
  const mine = store.items.filter((p) => p.ownerId === session.id && (!kind || p.kind === kind));
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-display text-lg font-extrabold text-[#0b1f33]">{title} ({mine.length})</h3>
      {mine.length === 0 ? (
        <EmptyState title="Nothing posted yet" text="Use the form above — your posts will appear here." />
      ) : (
        <div className="reveal-stagger grid gap-4 md:grid-cols-2">
          {mine.map((p) => (
            <div key={p.id} className="relative">
              {render(p)}
              <button
                onClick={() => window.confirm('Delete this post?') && store.remove(p.id)}
                aria-label="Delete post"
                className="absolute -right-1.5 -top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-md ring-1 ring-rose-100 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const grid = 'reveal-stagger grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3';
