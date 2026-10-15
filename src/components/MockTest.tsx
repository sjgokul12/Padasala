import { useEffect, useMemo, useState } from 'react';
import {
  Clock, ChevronLeft, ChevronRight, Flag, Eraser, Send, LayoutGrid, X, CheckCircle2, XCircle, MinusCircle,
  RotateCcw, Sparkles, Trophy,
} from 'lucide-react';
import type { Question, Subject } from '@/data/questions';
import { subjects as subjectOrder } from '@/data/questions';

export const MARKS = { correct: 4, wrong: -1 };
export const SECONDS_PER_QUESTION = 60;

export interface AttemptResult {
  score: number;
  max: number;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  durationSec: number;
  perSubject: Record<string, { correct: number; wrong: number; total: number }>;
}

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Shuffle questions (balanced across subjects for a common test) and the options inside each question. */
export function buildPaper(pool: Question[], count: number, common: boolean): Question[] {
  let picked: Question[];
  if (common) {
    const bySubject = subjectOrder.map((s) => shuffle(pool.filter((q) => q.subject === s)));
    picked = [];
    for (let i = 0; picked.length < Math.min(count, pool.length); i++) {
      for (const list of bySubject) if (list[i] && picked.length < count) picked.push(list[i]);
    }
    // NEET papers are sectioned by subject.
    picked.sort((a, b) => subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject));
  } else {
    picked = shuffle(pool).slice(0, count);
  }
  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
  });
}

type Status = 'answered' | 'notAnswered' | 'notVisited' | 'marked' | 'answeredMarked';

const statusStyle: Record<Status, string> = {
  answered: 'bg-emerald-500 text-white',
  notAnswered: 'bg-rose-500 text-white',
  notVisited: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  marked: 'bg-violet-500 text-white',
  answeredMarked: 'bg-violet-500 text-white ring-4 ring-emerald-300',
};

const statusLabel: Record<Status, string> = {
  answered: 'Answered',
  notAnswered: 'Not answered',
  notVisited: 'Not visited',
  marked: 'Marked for review',
  answeredMarked: 'Answered & marked',
};

export function MockTest({ title, paper, onClose, onFinish, onRetake }: {
  title: string;
  paper: Question[];
  onClose: () => void;
  onFinish: (r: AttemptResult) => void;
  onRetake: () => void;
}) {
  const total = paper.length;
  const limit = total * SECONDS_PER_QUESTION;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [marked, setMarked] = useState<boolean[]>(() => Array(total).fill(false));
  const [visited, setVisited] = useState<boolean[]>(() => paper.map((_, i) => i === 0));
  const [left, setLeft] = useState(limit);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const submit = () => {
    const perSubject: AttemptResult['perSubject'] = {};
    let correct = 0;
    let wrong = 0;
    paper.forEach((q, i) => {
      const s = (perSubject[q.subject] ??= { correct: 0, wrong: 0, total: 0 });
      s.total++;
      if (answers[i] === null) return;
      if (answers[i] === q.answer) { correct++; s.correct++; } else { wrong++; s.wrong++; }
    });
    const r: AttemptResult = {
      score: correct * MARKS.correct + wrong * MARKS.wrong,
      max: total * MARKS.correct,
      correct, wrong, skipped: total - correct - wrong, total,
      durationSec: limit - left,
      perSubject,
    };
    setResult(r);
    onFinish(r);
  };

  useEffect(() => {
    if (result) return;
    if (left <= 0) { submit(); return; }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, result]);

  const go = (i: number) => {
    setIndex(i);
    setVisited((v) => v.map((x, j) => (j === i ? true : x)));
    setPalette(false);
  };

  const status = (i: number): Status => {
    const a = answers[i] !== null;
    if (marked[i]) return a ? 'answeredMarked' : 'marked';
    if (a) return 'answered';
    return visited[i] ? 'notAnswered' : 'notVisited';
  };

  const counts = useMemo(() => {
    const c: Record<Status, number> = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, answeredMarked: 0 };
    paper.forEach((_, i) => c[status(i)]++);
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, marked, visited]);

  const q = paper[index];
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  if (result) return <Result title={title} paper={paper} answers={answers} result={result} onClose={onClose} onRetake={onRetake} />;

  const Palette = (
    <div>
      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2">
        {paper.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`h-10 rounded-xl text-sm font-bold transition ${statusStyle[status(i)]} ${i === index ? 'outline outline-2 outline-offset-2 outline-[#0b1f33]' : ''}`}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {(Object.keys(statusLabel) as Status[]).map((s) => (
          <span key={s} className="flex items-center gap-2 text-slate-600">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold ${statusStyle[s]}`}>{counts[s]}</span>
            {statusLabel[s]}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 bg-[#0b1f33] px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 text-white">
        <div className="min-w-0">
          <div className="truncate font-display font-bold">{title}</div>
          <div className="text-xs text-white/60">{total} questions · +4 / −1</div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-lg font-bold ${left < 60 ? 'bg-rose-500 animate-pulse' : 'bg-white/10'}`}>
          <Clock className="h-4 w-4" /> {mm}:{ss}
        </div>
        <button
          onClick={() => window.confirm(`Submit the test?\n\nAnswered: ${counts.answered + counts.answeredMarked} of ${total}`) && submit()}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold hover:bg-emerald-600"
        >
          <Send className="h-4 w-4" /> Submit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_300px]">
          {/* Question */}
          <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-[#0284c7]">{q.subject}</span>
              <span className="text-sm font-semibold text-slate-500">Question {index + 1} of {total}</span>
            </div>
            <p className="mt-4 text-[17px] sm:text-lg font-semibold leading-relaxed text-[#0b1f33]">{q.text}</p>
            <div className="mt-5 grid gap-2.5">
              {q.options.map((opt, i) => {
                const on = answers[index] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => a.map((x, j) => (j === index ? (x === i ? null : i) : x)))}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium ring-2 transition ${on ? 'bg-sky-50 ring-[#0284c7] text-[#0b1f33]' : 'bg-white ring-slate-200 text-slate-700 hover:ring-sky-200'}`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${on ? 'bg-[#0284c7] text-white' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette (desktop) */}
          <aside className="hidden lg:block rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 self-start sticky top-0">
            <div className="mb-3 font-display font-bold text-[#0b1f33]">Questions</div>
            {Palette}
          </aside>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="border-t border-slate-200 bg-white px-3 sm:px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <button onClick={() => setPalette(true)} className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700" aria-label="Question palette">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button onClick={() => index > 0 && go(index - 1)} disabled={index === 0} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 disabled:opacity-40" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setAnswers((a) => a.map((x, j) => (j === index ? null : x)))} className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">
            <Eraser className="h-4 w-4" /> Clear
          </button>
          <button
            onClick={() => { setMarked((m) => m.map((x, j) => (j === index ? !x : x))); if (index < total - 1) go(index + 1); }}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full bg-violet-100 px-3 sm:px-4 py-2.5 text-sm font-semibold text-violet-700"
          >
            <Flag className="h-4 w-4" /> <span className="sm:hidden">Review</span><span className="hidden sm:inline">Mark for review & next</span>
          </button>
          <div className="hidden sm:block flex-1" />
          {index < total - 1 ? (
            <button onClick={() => go(index + 1)} className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#009bf8] to-[#0062f5] px-5 py-2.5 text-sm font-bold text-white">
              <span className="sm:hidden">Next</span><span className="hidden sm:inline">Save & next</span> <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => window.confirm('Submit the test?') && submit()} className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white">
              <Send className="h-4 w-4" /> Submit
            </button>
          )}
        </div>
      </div>

      {/* Palette sheet (phones) */}
      {palette && (
        <div className="lg:hidden fixed inset-0 z-[61] flex items-end bg-slate-900/40" onClick={() => setPalette(false)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display font-bold text-[#0b1f33]">Questions</span>
              <button onClick={() => setPalette(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            {Palette}
            <button onClick={() => window.confirm('Submit the test?') && submit()} className="mt-5 w-full rounded-full bg-emerald-500 py-3 text-sm font-bold text-white">
              Submit test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Result({ title, paper, answers, result, onClose, onRetake }: {
  title: string; paper: Question[]; answers: (number | null)[]; result: AttemptResult; onClose: () => void; onRetake: () => void;
}) {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'skipped'>('all');
  const accuracy = result.correct + result.wrong ? Math.round((result.correct / (result.correct + result.wrong)) * 100) : 0;
  const shown = paper
    .map((q, i) => ({ q, i, a: answers[i] }))
    .filter(({ q, a }) => filter === 'all' || (filter === 'skipped' ? a === null : a !== null && a !== q.answer));

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-50">
      <div className="bg-gradient-to-br from-[#0b1f33] to-[#0369a1] px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-16 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70"><Trophy className="h-4 w-4" /> Result</span>
            <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-black">{title}</h1>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-5xl sm:text-6xl font-black">{result.score}</span>
            <span className="pb-2 text-lg text-white/70">/ {result.max}</span>
          </div>
          <p className="text-sm text-white/70">Time taken {Math.floor(result.durationSec / 60)}m {result.durationSec % 60}s · Accuracy {accuracy}%</p>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-4xl px-4 sm:px-6 pb-16 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Correct', v: result.correct, icon: CheckCircle2, c: 'text-emerald-600 bg-emerald-50' },
            { label: 'Wrong', v: result.wrong, icon: XCircle, c: 'text-rose-600 bg-rose-50' },
            { label: 'Skipped', v: result.skipped, icon: MinusCircle, c: 'text-slate-600 bg-slate-100' },
          ].map(({ label, v, icon: Icon, c }) => (
            <div key={label} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c}`}><Icon className="h-5 w-5" /></span>
              <div className="mt-2 font-display text-2xl font-black text-[#0b1f33]">{v}</div>
              <div className="text-xs font-semibold text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-display font-bold text-[#0b1f33]">Subject-wise</h2>
          <div className="mt-3 space-y-3">
            {Object.entries(result.perSubject).map(([s, v]) => {
              const marks = v.correct * MARKS.correct + v.wrong * MARKS.wrong;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm font-semibold"><span className="text-slate-700">{s as Subject}</span><span className="text-[#0b1f33]">{marks} / {v.total * 4}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${Math.max(0, (marks / (v.total * 4)) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button onClick={onRetake} className="btn-primary px-5"><RotateCcw className="h-4 w-4" /> Retake (new shuffle)</button>
          <button onClick={onClose} className="btn-outline px-5">Back to tests</button>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold text-[#0b1f33]">Solutions</h2>
            <div className="flex gap-1.5">
              {(['all', 'wrong', 'skipped'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${filter === f ? 'bg-[#0b1f33] text-white' : 'bg-white ring-1 ring-slate-200 text-slate-600'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {shown.map(({ q, i, a }) => (
              <div key={q.id + i} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-2 text-xs font-bold">
                  <span className="text-slate-500">Q{i + 1} · {q.subject}</span>
                  {a === null ? <span className="text-slate-500">Skipped (0)</span> : a === q.answer ? <span className="text-emerald-600">Correct (+4)</span> : <span className="text-rose-600">Wrong (−1)</span>}
                </div>
                <p className="mt-2 font-semibold text-[#0b1f33]">{q.text}</p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm ${
                        j === q.answer ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 font-semibold' : j === a ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'text-slate-600'
                      }`}
                    >
                      <span className="font-bold">{j + 1}.</span> {opt}
                      {j === q.answer && <CheckCircle2 className="ml-auto h-4 w-4" />}
                      {j === a && j !== q.answer && <XCircle className="ml-auto h-4 w-4" />}
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#0284c7]"><Sparkles className="h-3.5 w-3.5" /> Solution</span>
                  {q.explanation}
                </div>
              </div>
            ))}
            {shown.length === 0 && <p className="text-center text-sm text-slate-500">Nothing here — great job!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
