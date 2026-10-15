import { useState } from 'react';
import { Briefcase, Search, UserPlus, Users } from 'lucide-react';
import { useSession, openLogin } from '@/lib/auth';
import { useCollection, txt } from '@/lib/store';
import { PageHero, Tabs, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, EnquiryButton, EnquiryInbox } from '@/components/ui';
import { JobCard, TeacherCard, MyPosts, grid } from '@/components/listings';
import { TeachersForSchools } from './SchoolsPage';
import { districts } from '@/data/districts';
import { teacherProfileFields, jobTypes } from '@/data/forms';

type Tab = 'vacancies' | 'post' | 'profiles';

export function TeachersPage() {
  const [tab, setTab] = useState<Tab>('vacancies');
  return (
    <>
      <PageHero
        icon={Briefcase}
        eyebrow="Teacher Job Posting"
        title={<>Teachers post requirements, <span className="text-[#0284c7]">schools hire</span></>}
        subtitle="Teachers post job requirements; schools view profiles and hire."
      />
      <div className="container-page pb-16">
        <Tabs<Tab>
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'vacancies', label: 'School Vacancies', icon: Search },
            { id: 'post', label: 'Post Your Job Requirement', icon: UserPlus },
            { id: 'profiles', label: 'Teacher Profiles (Schools)', icon: Users },
          ]}
        />
        <div className="mt-6">
          {tab === 'vacancies' && <Vacancies />}
          {tab === 'post' && (
            <RequireRole allow={['teacher']} reason="Login as a teacher to post your job requirement">
              <PostProfile />
            </RequireRole>
          )}
          {tab === 'profiles' && (
            <RequireRole allow={['school']} reason="Teacher profiles are visible only to registered schools">
              <TeachersForSchools />
            </RequireRole>
          )}
        </div>
      </div>
    </>
  );
}

function Vacancies() {
  const session = useSession();
  const { items } = useCollection('jobs');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const list = items.filter(
    (j) =>
      (!district || j.district === district) &&
      (!type || j.jobType === type) &&
      (!q || `${txt(j.title)} ${txt(j.subject)} ${j.ownerName}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subject, role or school…" className="input pl-11 py-2.5" />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2.5">
          <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
          <FilterSelect label="All job types" value={type} onChange={setType} options={jobTypes} />
        </div>
      </div>
      {list.length === 0 ? <EmptyState title="No vacancies match" /> : (
        <div className={grid}>
          {list.map((j) => (
            <JobCard
              key={j.id}
              post={j}
              action={
                session?.role === 'teacher' ? (
                  <EnquiryButton to={j.ownerId} toName={j.ownerName} about={`Application: ${txt(j.title)}`} label="Apply now" />
                ) : (
                  <button onClick={() => openLogin('teacher')} className="btn-primary text-sm px-4 py-2">Apply now</button>
                )
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function PostProfile() {
  const session = useSession()!;
  const store = useCollection('teacherProfiles');
  return (
    <div className="space-y-8">
      <Card className="p-5 sm:p-6">
        <p className="mb-5 text-sm text-slate-500">Your profile is shown only to registered schools. They can call you or send an enquiry, which appears below.</p>
        <DynamicForm fields={teacherProfileFields} initial={{ name: session.name }} submitLabel="Post requirement" onSubmit={(v) => store.add(v, session)} />
      </Card>
      <MyPosts collection="teacherProfiles" render={(p) => <TeacherCard post={p} />} title="Your posted requirements" />
      <EnquiryInbox title="Enquiries from schools" />
    </div>
  );
}
