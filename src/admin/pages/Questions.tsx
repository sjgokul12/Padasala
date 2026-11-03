import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Upload, FileSpreadsheet, Trash2, Search } from 'lucide-react';
import { subjects } from '@/data/questions';
import booksCap from '../assets/books-cap.webp';
import { adminApi, errorText, toast } from '../lib';
import { Card, CardHeader, PageHeader, Spinner, ErrorNote, EmptyState, Segmented, Button, ConfirmDialog, Field, inputCls, Badge } from '../ui';

interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  answer: number;
  explanation?: string;
  source?: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export function Questions() {
  const [items, setItems] = useState<Question[] | null>(null);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<Question | null>(null);
  const [csvMsg, setCsvMsg] = useState('');
  const [importing, setImporting] = useState(false);

  const load = () => {
    setError('');
    adminApi<{ items: Question[] }>('/api/data.php?c=questions').then((d) => setItems(d.items)).catch((e) => setError(errorText(e)));
  };
  useEffect(load, []);

  const create = (q: Omit<Question, 'id'>) => adminApi<{ item: Question }>('/api/data.php?c=questions&action=create', { method: 'POST', body: q });

  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    try {
      const { item } = await create({
        subject: String(f.get('subject')),
        source: String(f.get('source') ?? '').trim() || 'practice',
        text: String(f.get('text')),
        options: ['a', 'b', 'c', 'd'].map((k) => String(f.get(k) ?? '')),
        answer: Number(f.get('answer')),
        explanation: String(f.get('explanation') ?? ''),
      });
      setItems((list) => [item, ...(list ?? [])]);
      formEl.reset();
      toast('Question added');
    } catch (err) {
      toast(errorText(err), 'error');
    }
  };

  const importCsv = async (file: File) => {
    setImporting(true);
    setCsvMsg('');
    const [header = [], ...rows] = parseCsv(await file.text());
    const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
    const idx = { subject: col('subject'), question: col('question'), a: col('a'), b: col('b'), c: col('c'), d: col('d'), answer: col('answer'), explanation: col('explanation'), source: col('source') };
    if (Object.entries(idx).some(([k, v]) => v < 0 && k !== 'explanation' && k !== 'source')) {
      setCsvMsg('The first row must include: subject, question, a, b, c, d, answer (explanation and source are optional).');
      setImporting(false);
      return;
    }
    let added = 0;
    for (const r of rows) {
      const subj = subjects.find((s) => s.toLowerCase() === r[idx.subject]?.trim().toLowerCase());
      const ans = LETTERS.indexOf(r[idx.answer]?.trim().toUpperCase());
      if (!subj || ans < 0 || !r[idx.question]?.trim()) continue;
      try {
        await create({
          subject: subj,
          text: r[idx.question].trim(),
          options: [r[idx.a], r[idx.b], r[idx.c], r[idx.d]].map((o) => (o ?? '').trim()),
          answer: ans,
          explanation: idx.explanation >= 0 ? (r[idx.explanation] ?? '').trim() : '',
          source: idx.source >= 0 && r[idx.source]?.trim() ? r[idx.source].trim() : 'practice',
        });
        added++;
      } catch {
        // Skipped row (e.g. an empty option).
      }
    }
    setCsvMsg(`Imported ${added} of ${rows.length} rows.${added < rows.length ? ' Rows with an unknown subject, answer letter or a missing option were skipped.' : ''}`);
    setImporting(false);
    load();
  };

  const remove = async (q: Question) => {
    try {
      await adminApi(`/api/data.php?c=questions&action=delete&id=${q.id}`, { method: 'POST' });
      setItems((list) => list?.filter((x) => x.id !== q.id) ?? null);
      setDeleting(null);
      toast('Question deleted');
    } catch (e) {
      toast(errorText(e), 'error');
    }
  };

  const term = search.trim().toLowerCase();
  const list = (items ?? []).filter((q) => (!subject || q.subject === subject) && (!term || q.text.toLowerCase().includes(term)));

  return (
    <>
      <PageHeader title="Question bank" subtitle="NEET questions used in student mock tests." art={<img src={booksCap} alt="" className="mb-1 mr-10 h-[92%] drop-shadow-xl" />} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card className="p-4"><div className="text-xs font-semibold text-slate-500">Total</div><div className="font-display text-2xl font-extrabold">{items?.length ?? '—'}</div></Card>
        {subjects.map((s) => (
          <Card key={s} className="p-4"><div className="text-xs font-semibold text-slate-500">{s}</div><div className="font-display text-2xl font-extrabold">{items ? items.filter((q) => q.subject === s).length : '—'}</div></Card>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Add a question" />
          <form onSubmit={add} className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Subject" htmlFor="q-subject">
              <select id="q-subject" name="subject" required className={inputCls}>{subjects.map((s) => <option key={s}>{s}</option>)}</select>
            </Field>
            <Field label="Source" htmlFor="q-source" hint="practice, or a paper name like NEET 2024">
              <input id="q-source" name="source" className={inputCls} placeholder="practice" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Question" htmlFor="q-text"><textarea id="q-text" name="text" required rows={3} className={inputCls} /></Field>
            </div>
            {['a', 'b', 'c', 'd'].map((k, i) => (
              <Field key={k} label={`Option ${LETTERS[i]}`} htmlFor={`q-${k}`}><input id={`q-${k}`} name={k} required className={inputCls} /></Field>
            ))}
            <Field label="Correct option" htmlFor="q-answer">
              <select id="q-answer" name="answer" required className={inputCls}>{LETTERS.map((l, i) => <option key={l} value={i}>{l}</option>)}</select>
            </Field>
            <div className="sm:col-span-2">
              <Field label={<>Solution / explanation <span className="font-normal text-slate-400">(optional)</span></>} htmlFor="q-exp"><textarea id="q-exp" name="explanation" rows={2} className={inputCls} /></Field>
            </div>
            <div className="sm:col-span-2"><Button type="submit"><Plus className="h-4 w-4" /> Add question</Button></div>
          </form>
        </Card>

        <Card>
          <CardHeader title="Bulk upload (CSV)" />
          <div className="p-5">
            <p className="text-sm text-slate-600">Export from Excel or Google Sheets as CSV with these columns:</p>
            <code className="mt-2 block break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700 ring-1 ring-slate-100">subject,question,a,b,c,d,answer,explanation,source</code>
            <p className="mt-2 text-xs text-slate-500">subject = Physics / Chemistry / Botany / Zoology · answer = A, B, C or D</p>
            <label className={`mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/40 px-4 py-6 text-center hover:bg-sky-50 ${importing ? 'pointer-events-none opacity-60' : ''}`}>
              <FileSpreadsheet className="h-8 w-8 text-[#0284c7]" />
              <span className="text-sm font-bold text-[#0284c7]"><Upload className="mr-1 inline h-4 w-4" />{importing ? 'Importing…' : 'Choose CSV file'}</span>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) importCsv(f); }} />
            </label>
            {csvMsg && <p className="mt-3 text-sm font-semibold text-emerald-700">{csvMsg}</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Segmented value={subject} onChange={setSubject} options={[{ id: '', label: 'All' }, ...subjects.map((s) => ({ id: s, label: s }))]} />
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions…" className={`${inputCls} pl-9 lg:w-72`} />
          </div>
        </div>
        {error ? (
          <div className="p-4"><ErrorNote text={error} onRetry={load} /></div>
        ) : !items ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No questions" text="Add questions above or upload a CSV file." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.slice(0, 300).map((q) => (
              <li key={q.id} className="p-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5"><Badge tone="sky">{q.subject}</Badge><Badge>{q.source || 'practice'}</Badge></div>
                  <button onClick={() => setDeleting(q)} aria-label="Delete question" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{q.text}</p>
                <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                  {q.options.map((o, i) => (
                    <li key={i} className={i === q.answer ? 'font-bold text-emerald-700' : 'text-slate-600'}>{LETTERS[i]}. {o}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        )}
        {list.length > 300 && <p className="border-t border-slate-100 p-3 text-center text-xs text-slate-500">Showing 300 of {list.length}. Filter by subject or search to narrow down.</p>}
      </Card>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this question?"
        text="It will be removed from all future mock tests."
        confirmLabel="Delete"
        onConfirm={() => remove(deleting!)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

/** Minimal CSV parser supporting quoted fields with commas and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}
