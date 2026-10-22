import { useState } from 'react';
import {
  GraduationCap, ClipboardList, PencilLine, History, Atom, FlaskConical, Leaf, Dna, Layers, FileClock, Play, Info, Timer,
  UserPlus, LogOut, Pencil, Target, MapPin,
} from 'lucide-react';
import { useSession, register, logout, openLogin, roles } from '@/lib/auth';
import { useCollection, txt, type Post } from '@/lib/store';
import { useQuestionBank } from '@/lib/questionBank';
import { PageHero, Tabs, Card, DynamicForm, RequireRole, EmptyState, Chip, Modal } from '@/components/ui';
import { TuitionRequestCard, MyPosts } from '@/components/listings';
import { MockTest, buildPaper, SECONDS_PER_QUESTION, type AttemptResult } from '@/components/MockTest';
import { tuitionRequestFields, studentProfileFields } from '@/data/forms';
import type { Question, Subject } from '@/data/questions';

type Tab = 'tests' | 'tuition' | 'history';

const subjectCards: { id: Subject; icon: typeof Atom; tone: string }[] = [
  { id: 'Physics', icon: Atom, tone: 'from-sky-500 to-blue-600' },
  { id: 'Chemistry', icon: FlaskConical, tone: 'from-amber-500 to-orange-600' },
  { id: 'Botany', icon: Leaf, tone: 'from-emerald-500 to-green-600' },
  { id: 'Zoology', icon: Dna, tone: 'from-rose-500 to-pink-600' },
];

export function StudentsPage() {
  const session = useSession();
  const [tab, setTab] = useState<Tab>('tests');
  const profiles = useCollection('studentProfiles');
  const profile = session ? profiles.items.find((p) => p.ownerId === session.id) : undefined;

  // Step 1: create a student account (or complete the profile). Student profiles are private (see access.ts).
  if (session?.role !== 'student' || !profile) return <StudentOnboarding />;

  return (
    <>
      <StudentProfileCard profile={profile} />
      <PageHero
        flush
        icon={GraduationCap}
        eyebrow="Students"
        title={<>NEET mock tests & <span className="text-[#0284c7]">tuition you need</span></>}
        subtitle="Timed NEET-pattern tests with solutions, and tuition near you."
      />
      <div className="container-page pb-16">
        <Tabs<Tab>
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'tests', label: 'Mock Tests', icon: ClipboardList },
            { id: 'tuition', label: 'Post Tuition Requirement', icon: PencilLine },
            { id: 'history', label: 'My Results', icon: History },
          ]}
        />
        <div className="mt-6">
          {tab === 'tests' && <Tests />}
          {tab === 'tuition' && <TuitionRequirement />}
          {tab === 'history' && <MyResults />}
        </div>
      </div>
    </>
  );
}

/* ---------- Student account & profile ---------- */

function StudentOnboarding() {
  const session = useSession();
  const profiles = useCollection('studentProfiles');
  const otherRole = session && session.role !== 'student';
  // A student who registered elsewhere (e.g. the home page form) only needs to complete the profile.
  const completing = session?.role === 'student';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#cae8ff] via-[#e6f4ff] to-white pt-[88px] sm:pt-32 pb-16">
      <div className="container-page relative max-w-3xl">
        <div className="reveal text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009bf8] to-[#0062f5] text-white shadow-lg">
            <UserPlus className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-[26px] sm:text-4xl font-black tracking-tight text-[#0b1f33]">
            {completing ? 'Complete your student profile' : 'Create your student account'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">Takes a minute — then take NEET mock tests and find tuition.</p>
        </div>

        {otherRole ? (
          <Card className="reveal mt-6 p-6 text-center">
            <p className="font-display font-bold text-[#0b1f33]">You are logged in as {roles[session.role].label}.</p>
            <p className="mt-1 text-sm text-slate-500">The student section is only for students and parents.</p>
            <button onClick={logout} className="btn-primary mt-4 px-6"><LogOut className="h-4 w-4" /> Logout and create a student account</button>
          </Card>
        ) : (
          <Card className="reveal mt-6 p-5 sm:p-8">
            <DynamicForm
              submitLabel={completing ? 'Save profile' : 'Create student account'}
              initial={completing ? { name: session.name } : undefined}
              fields={completing ? studentProfileFields : [...studentProfileFields, { name: 'password', label: 'Create password', type: 'password', required: true }]}
              onSubmit={(values) => {
                const { password: _unused, ...v } = values; // the password is not stored until a backend exists
                void _unused;
                const s = completing
                  ? session
                  : register({ role: 'student', name: txt(v.name), phone: txt(v.phone), email: txt(v.email), district: txt(v.district) });
                profiles.add(v, s);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // the new profile card appears at the top
              }}
            />
            {!completing && (
              <p className="mt-5 text-center text-sm text-slate-600">
                Already have a student account?{' '}
                <button onClick={() => openLogin('student')} className="font-bold text-[#0284c7]">Login</button>
              </p>
            )}
          </Card>
        )}
      </div>
    </section>
  );
}

function StudentProfileCard({ profile }: { profile: Post }) {
  const profiles = useCollection('studentProfiles');
  const attempts = useCollection('attempts').items.filter((a) => a.ownerId === profile.ownerId);
  const requests = useCollection('tuitionRequests').items.filter((r) => r.ownerId === profile.ownerId);
  const [editing, setEditing] = useState(false);
  const best = attempts.reduce((m, a) => Math.max(m, Math.round((Number(a.score) / Number(a.max)) * 100)), 0);
  const name = txt(profile.name);

  return (
    <section className="bg-gradient-to-b from-[#cae8ff] to-[#e6f4ff] pt-[88px] sm:pt-28">
      <div className="container-page">
        <div className="reveal relative overflow-hidden rounded-[28px] bg-white p-5 sm:p-7 shadow-[0_20px_45px_-24px_rgba(2,132,199,0.55)] ring-1 ring-white">
          <span className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-sky-200/70 to-violet-200/50 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {profile.photo ? (
                <img src={txt(profile.photo)} alt={name} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full object-cover ring-4 ring-sky-100" />
              ) : (
                <span className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#009bf8] to-[#7c3aed] font-display text-2xl font-black text-white ring-4 ring-sky-100">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">Student profile</div>
                <h1 className="truncate font-display text-xl sm:text-2xl font-black text-[#0b1f33]">{name}</h1>
                <p className="truncate text-sm text-slate-600">
                  {txt(profile.classLevel)}{profile.school ? ` · ${txt(profile.school)}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Chip tone="violet"><Target className="h-3 w-3" /> {txt(profile.targetExam)}</Chip>
                  <Chip tone="slate"><MapPin className="h-3 w-3" /> {txt(profile.district)}</Chip>
                  {profile.board && <Chip>{txt(profile.board)}</Chip>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:w-[300px]">
              {[
                { label: 'Tests', value: attempts.length },
                { label: 'Best score', value: attempts.length ? `${best}%` : '—' },
                { label: 'Tuition asks', value: requests.length },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-sky-50/80 px-2 py-2.5 text-center ring-1 ring-sky-100">
                  <div className="font-display text-lg font-black text-[#0b1f33]">{s.value}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            <button onClick={() => setEditing(true)} className="btn-outline px-4 py-2 text-sm"><Pencil className="h-4 w-4" /> Edit profile</button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-100 hover:bg-rose-50"><LogOut className="h-4 w-4" /> Logout</button>
          </div>
        </div>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit student profile" wide>
        <DynamicForm
          fields={studentProfileFields}
          initial={profile}
          reset={false}
          submitLabel="Save profile"
          onSubmit={(v) => { profiles.update(profile.id, v); window.setTimeout(() => setEditing(false), 700); }}
        />
      </Modal>
    </section>
  );
}

interface Running {
  title: string;
  mode: string;
  pool: Question[];
  count: number;
  common: boolean;
  paper: Question[];
  key: number;
}

function Tests() {
  const bank = useQuestionBank();
  const session = useSession();
  const attempts = useCollection('attempts');
  const [count, setCount] = useState(20);
  const [running, setRunning] = useState<Running | null>(null);

  const papers = [...new Set(bank.filter((q) => q.source !== 'practice').map((q) => q.source))].sort().reverse();

  const start = (title: string, mode: string, pool: Question[], common = false, n = count) => {
    setRunning({ title, mode, pool, count: n, common, paper: buildPaper(pool, n, common), key: Date.now() });
  };

  const save = (r: AttemptResult) => {
    if (!running) return;
    attempts.add({ title: running.title, mode: running.mode, ...r, perSubject: JSON.stringify(r.perSubject) }, session ?? { id: 'guest', name: 'Guest' });
  };

  const practice = bank.filter((q) => q.source === 'practice');

  return (
    <>
      <Card className="mb-6 p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 bg-gradient-to-br from-[#0b1f33] to-[#0369a1] text-white ring-0">
        <div className="flex items-start gap-3 flex-1">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
          <p className="text-sm text-white/85">
            <b className="text-white">NEET pattern:</b> objective questions, +4 for correct, −1 for wrong, 0 if skipped. {SECONDS_PER_QUESTION / 60} minute per question; the test auto-submits when time is up. Questions and options are shuffled every attempt.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Timer className="h-4 w-4 text-sky-300" /> Questions
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="rounded-full bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 [&>option]:text-slate-900">
            {[10, 20, 40, 90, 180].map((n) => <option key={n} value={n}>{n}{n === 180 ? ' (full NEET)' : ''}</option>)}
          </select>
        </label>
      </Card>

      {/* Common test */}
      <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009bf8] to-[#0062f5] text-white shadow-lg">
          <Layers className="h-7 w-7" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-extrabold text-[#0b1f33]">Common Test — all subjects</h3>
          <p className="text-sm text-slate-500">Physics, Chemistry, Botany & Zoology mixed like the real NEET paper. {practice.length} questions in the bank.</p>
        </div>
        <button onClick={() => start('NEET Common Test', 'common', practice, true)} className="btn-primary px-6"><Play className="h-4 w-4" /> Start test</button>
      </Card>

      {/* Subject-wise */}
      <h3 className="mt-8 mb-3 font-display text-lg font-extrabold text-[#0b1f33]">Subject-wise tests</h3>
      <div className="reveal-stagger grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {subjectCards.map(({ id, icon: Icon, tone }) => {
          const pool = practice.filter((q) => q.subject === id);
          return (
            <Card key={id} className="p-4 sm:p-5 flex flex-col">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-md`}><Icon className="h-5 w-5" /></span>
              <h4 className="mt-3 font-display font-bold text-[#0b1f33]">{id}</h4>
              <p className="text-xs text-slate-500">{pool.length} questions</p>
              <button disabled={!pool.length} onClick={() => start(`${id} Test`, id, pool)} className="mt-4 btn-outline text-sm py-2 px-3 disabled:opacity-50">
                <Play className="h-4 w-4" /> Start
              </button>
            </Card>
          );
        })}
      </div>

      {/* Previous year papers */}
      <h3 className="mt-8 mb-3 font-display text-lg font-extrabold text-[#0b1f33]">Previous year question papers</h3>
      {papers.length === 0 ? (
        <Card className="p-5 sm:p-6 flex items-start gap-3">
          <FileClock className="h-6 w-6 shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">Previous-year NEET papers will appear here once the Padasala team uploads them in the Question Bank (admin login).</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {papers.map((p) => {
            const pool = bank.filter((q) => q.source === p);
            return (
              <Card key={p} className="p-4 flex items-center gap-3">
                <FileClock className="h-6 w-6 shrink-0 text-[#0284c7]" />
                <div className="flex-1"><div className="font-display font-bold text-[#0b1f33]">{p}</div><div className="text-xs text-slate-500">{pool.length} questions</div></div>
                <button onClick={() => start(p, p, pool, true, pool.length)} className="btn-primary text-sm px-4 py-2"><Play className="h-4 w-4" /> Start</button>
              </Card>
            );
          })}
        </div>
      )}

      {running && (
        <MockTest
          key={running.key}
          title={running.title}
          paper={running.paper}
          onClose={() => setRunning(null)}
          onFinish={save}
          onRetake={() => start(running.title, running.mode, running.pool, running.common, running.count)}
        />
      )}
    </>
  );
}

function TuitionRequirement() {
  const session = useSession();
  const store = useCollection('tuitionRequests');
  return (
    <RequireRole allow={['student']} reason="Login as a student or parent to post a tuition requirement">
      <Card className="p-5 sm:p-6">
        <p className="mb-5 text-sm text-slate-500">Tell coaching centres what you need. Registered coaching centres in your area can see this and contact you.</p>
        <DynamicForm fields={tuitionRequestFields} initial={{ studentName: session?.name }} onSubmit={(v) => store.add(v, session!)} />
      </Card>
      <MyPosts collection="tuitionRequests" render={(p) => <TuitionRequestCard post={p} showContact />} title="Your requirements" />
    </RequireRole>
  );
}

function MyResults() {
  const session = useSession();
  const { items } = useCollection('attempts');
  const mine = items.filter((a) => a.ownerId === (session?.id ?? 'guest'));
  if (mine.length === 0) return <EmptyState title="No tests taken yet" text="Your scores will appear here after you finish a mock test." />;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {mine.map((a) => {
        const pct = Math.round((Number(a.score) / Number(a.max)) * 100);
        return (
          <Card key={a.id} className="p-4 sm:p-5 flex items-center gap-4">
            <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl font-display font-black ${pct >= 60 ? 'bg-emerald-50 text-emerald-700' : pct >= 30 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
              <span className="text-lg leading-none">{txt(a.score)}</span>
              <span className="text-[10px] font-semibold">/ {txt(a.max)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold text-[#0b1f33] truncate">{txt(a.title)}</div>
              <div className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip tone="emerald">✓ {txt(a.correct)}</Chip>
                <Chip tone="rose">✗ {txt(a.wrong)}</Chip>
                <Chip tone="slate">– {txt(a.skipped)}</Chip>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
