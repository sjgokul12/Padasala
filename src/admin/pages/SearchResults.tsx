import { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRoute } from '@/lib/router';
import { adminApi, errorText, listingTypes, itemTitle, itemSubtitle, itemDistrict, type ListingType, type Item } from '../lib';
import { Card, CardHeader, PageHeader, Spinner, ErrorNote, EmptyState, StatusPill } from '../ui';

/** Results of the top search bar across schools, coaching, events, teachers and vendors. */
export function SearchResults() {
  const { query } = useRoute();
  const q = query.get('q') ?? '';
  const [results, setResults] = useState<{ type: ListingType; items: Item[] }[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setResults(null);
    setError('');
    const types = Object.keys(listingTypes) as ListingType[];
    Promise.all(types.map((t) => adminApi<{ items: Item[] }>(`/api/admin/listings.php?${new URLSearchParams({ c: t, status: 'all', q })}`).then((d) => ({ type: t, items: d.items }))))
      .then(setResults)
      .catch((e) => setError(errorText(e)));
  }, [q]);

  const total = results?.reduce((n, r) => n + r.items.length, 0) ?? 0;

  return (
    <>
      <PageHeader title="Search" subtitle={<>Results for “<span className="text-[#1e88e5]">{q}</span>” across all listings.</>} />
      {error ? <ErrorNote text={error} /> : !results ? <Spinner /> : total === 0 ? (
        <Card><EmptyState icon={Search} title="No matches" text="Try a name, owner, phone number or district." /></Card>
      ) : (
        <div className="space-y-6">
          {results.filter((r) => r.items.length).map(({ type, items }) => (
            <Card key={type}>
              <CardHeader title={`${listingTypes[type].label} (${items.length})`} />
              <ul className="divide-y divide-blue-50 px-2 pb-3">
                {items.slice(0, 20).map((item) => (
                  <li key={item.id}>
                    <a href={`#/${listingTypes[type].slug}?open=${item.id}`} className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-blue-50/60">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-[#0b2545]">{itemTitle(item)}</span>
                        <span className="block truncate text-xs text-slate-500">{[itemSubtitle(type, item), item.ownerName, itemDistrict(item)].filter(Boolean).join(' · ')}</span>
                      </span>
                      <StatusPill status={item.status} />
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
