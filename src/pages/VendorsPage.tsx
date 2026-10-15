import { useState } from 'react';
import { Truck, Building2, PackageSearch, Store } from 'lucide-react';
import { useSession, openLogin } from '@/lib/auth';
import { useCollection, txt } from '@/lib/store';
import { PageHero, Tabs, Card, DynamicForm, RequireRole, EmptyState, FilterSelect, EnquiryButton, EnquiryInbox } from '@/components/ui';
import { VendorCard, RequirementCard, MyPosts, grid } from '@/components/listings';
import { VendorsForSchools } from './SchoolsPage';
import { districts } from '@/data/districts';
import { vendorFields, requirementCategories } from '@/data/forms';

type Tab = 'requirements' | 'post' | 'directory';

export function VendorsPage() {
  const [tab, setTab] = useState<Tab>('requirements');
  return (
    <>
      <PageHero
        icon={Truck}
        eyebrow="Vendors Posting"
        title={<>Supply schools with <span className="text-[#7c3aed]">what they need</span></>}
        subtitle="Vendors list their company; schools post what they need."
      />
      <div className="container-page pb-16">
        <Tabs<Tab>
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'requirements', label: 'School Requirements', icon: PackageSearch },
            { id: 'post', label: 'Post Company Details', icon: Store },
            { id: 'directory', label: 'Vendor List (Schools)', icon: Building2 },
          ]}
        />
        <div className="mt-6">
          {tab === 'requirements' && <Requirements />}
          {tab === 'post' && (
            <RequireRole allow={['vendor']} reason="Login as a vendor to post your company details">
              <PostVendor />
            </RequireRole>
          )}
          {tab === 'directory' && (
            <RequireRole allow={['school']} reason="The vendor list is visible only to registered schools">
              <VendorsForSchools />
            </RequireRole>
          )}
        </div>
      </div>
    </>
  );
}

function Requirements() {
  const session = useSession();
  const { items } = useCollection('requirements');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const list = items.filter((r) => (!district || r.district === district) && (!category || r.category === category));

  return (
    <>
      <div className="mb-5 grid grid-cols-2 sm:flex gap-2.5">
        <FilterSelect label="All districts" value={district} onChange={setDistrict} options={districts} />
        <FilterSelect label="All categories" value={category} onChange={setCategory} options={requirementCategories} />
      </div>
      {list.length === 0 ? <EmptyState title="No requirements match" /> : (
        <div className={grid}>
          {list.map((r) => (
            <RequirementCard
              key={r.id}
              post={r}
              action={
                session?.role === 'vendor' ? (
                  <EnquiryButton to={r.ownerId} toName={r.ownerName} about={`Quotation: ${txt(r.item)}`} label="Send quotation" />
                ) : session?.role !== 'school' ? (
                  <button onClick={() => openLogin('vendor')} className="btn-outline text-sm px-4 py-2">Vendor? Send quotation</button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function PostVendor() {
  const session = useSession()!;
  const store = useCollection('vendors');
  return (
    <div className="space-y-8">
      <Card className="p-5 sm:p-6">
        <p className="mb-5 text-sm text-slate-500">Registered schools can see your details and send enquiries, which appear below.</p>
        <DynamicForm fields={vendorFields} initial={{ company: session.name }} submitLabel="Post company details" onSubmit={(v) => store.add(v, session)} />
      </Card>
      <MyPosts collection="vendors" render={(p) => <VendorCard post={p} />} title="Your company listings" />
      <EnquiryInbox title="Enquiries from schools" />
    </div>
  );
}
