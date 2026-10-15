import { useState } from 'react';
import { Database, Upload, Trash2, FileSpreadsheet } from 'lucide-react';
import { useSession } from '@/lib/auth';
import { useCollection, txt } from '@/lib/store';
import { PageHero, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, Chip, SectionTitle } from '@/components/ui';
import { subjects, sampleQuestions } from '@/data/questions';

export function AdminPage() {
  return (
    <>
      <PageHero
        icon={Database}
        eyebrow="Admin · Question Bank"
        title="Upload NEET questions & previous-year papers"
        subtitle="Questions added here appear in student mock tests."
      />
      <div className="container-page pb-16">
        <RequireRole allow={['admin']} reason="Only the Padasala admin can manage the question bank">
          <QuestionBank />
        </RequireRole>
      </div>
    </>
  );
}

const LETTERS = ['A', 'B', 'C', 'D'];

function QuestionBank() {
  const session = useSession()!;
  const store = useCollection('questions');
  const [subject, setSubject] = useState('');
  const [csvMsg, setCsvMsg] = useState('');

  const importCsv = async (file: File) => {
    const rows = parseCsv(await file.text());
    const [header, ...data] = rows;
    const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
    const idx = { subject: col('subject'), question: col('question'), a: col('a'), b: col('b'), c: col('c'), d: col('d'), answer: col('answer'), explanation: col('explanation'), source: col('source') };
    if (Object.entries(idx).some(([k, v]) => v < 0 && k !== 'explanation' && k !== 'source')) {
      setCsvMsg('Header must include: subject, question, a, b, c, d, answer (explanation and source are optional).');
      return;
    }
    let added = 0;
    for (const r of data) {
      const subj = subjects.find((s) => s.toLowerCase() === r[idx.subject]?.trim().toLowerCase());
      const ans = LETTERS.indexOf(r[idx.answer]?.trim().toUpperCase());
      if (!subj || ans < 0 || !r[idx.question]) continue;
      store.add({
        subject: subj,
        text: r[idx.question].trim(),
        options: [r[idx.a], r[idx.b], r[idx.c], r[idx.d]].map((o) => (o ?? '').trim()),
        answer: ans,
        explanation: idx.explanation >= 0 ? (r[idx.explanation] ?? '').trim() : '',
        source: idx.source >= 0 && r[idx.source]?.trim() ? r[idx.source].trim() : 'practice',
      }, session);
      added++;
    }
    setCsvMsg(`Imported ${added} of ${data.length} rows.${added < data.length ? ' Rows with an unknown subject or answer letter were skipped.' : ''}`);
  };

  const list = store.items.filter((q) => !subject || q.subject === subject);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4"><div className="text-xs font-semibold text-slate-500">Built-in</div><div className="font-display text-2xl font-black">{sampleQuestions.length}</div></Card>
        {subjects.map((s) => (
          <Card key={s} className="p-4"><div className="text-xs font-semibold text-slate-500">Uploaded · {s}</div><div className="font-display text-2xl font-black">{store.items.filter((q) => q.subject === s).length}</div></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-start">
        <Card className="p-5 sm:p-6">
          <SectionTitle title="Add a question" />
          <DynamicForm
            submitLabel="Add question"
            fields={[
              { name: 'subject', label: 'Subject', type: 'select', options: subjects, required: true },
              { name: 'source', label: 'Source', placeholder: 'practice, or e.g. NEET 2024' },
              { name: 'text', label: 'Question', type: 'textarea', required: true },
              { name: 'a', label: 'Option 1', required: true },
              { name: 'b', label: 'Option 2', required: true },
              { name: 'c', label: 'Option 3', required: true },
              { name: 'd', label: 'Option 4', required: true },
              { name: 'answer', label: 'Correct option', type: 'select', options: ['1', '2', '3', '4'], required: true },
              { name: 'explanation', label: 'Solution / explanation', type: 'textarea' },
            ]}
            onSubmit={(v) =>
              store.add({
                subject: v.subject,
                source: txt(v.source).trim() || 'practice',
                text: v.text,
                options: [txt(v.a), txt(v.b), txt(v.c), txt(v.d)],
                answer: Number(v.answer) - 1,
                explanation: v.explanation,
              }, session)
            }
          />
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionTitle title="Bulk upload (CSV)" />
          <p className="text-sm text-slate-600">Export from Excel / Google Sheets as CSV with these columns:</p>
          <code className="mt-2 block rounded-xl bg-slate-50 p-3 text-xs text-slate-700 break-all">subject,question,a,b,c,d,answer,explanation,source</code>
          <p className="mt-2 text-xs text-slate-500">subject = Physics / Chemistry / Botany / Zoology · answer = A, B, C or D · source = practice or a paper name like NEET 2024</p>
          <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-4 py-6 text-center hover:bg-sky-50">
            <FileSpreadsheet className="h-8 w-8 text-[#0284c7]" />
            <span className="text-sm font-bold text-[#0284c7]"><Upload className="mr-1 inline h-4 w-4" />Choose CSV file</span>
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </label>
          {csvMsg && <p className="mt-3 text-sm font-semibold text-emerald-700">{csvMsg}</p>}
        </Card>
      </div>

      <div>
        <SectionTitle title={`Uploaded questions (${list.length})`} action={<FilterSelect label="All subjects" value={subject} onChange={setSubject} options={subjects} />} />
        {list.length === 0 ? <EmptyState title="No uploaded questions yet" text="The 40 built-in practice questions are always available." /> : (
          <div className="grid gap-3">
            {list.map((q) => (
              <Card key={q.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5"><Chip>{txt(q.subject)}</Chip><Chip tone={q.source === 'practice' ? 'slate' : 'violet'}>{txt(q.source)}</Chip></div>
                  <button aria-label="Delete question" onClick={() => window.confirm('Delete this question?') && store.remove(q.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-2 font-semibold text-[#0b1f33]">{txt(q.text)}</p>
                <ol className="mt-2 grid sm:grid-cols-2 gap-1 text-sm">
                  {(q.options as string[]).map((o, i) => (
                    <li key={i} className={i === Number(q.answer) ? 'font-bold text-emerald-700' : 'text-slate-600'}>{i + 1}. {o}</li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
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
