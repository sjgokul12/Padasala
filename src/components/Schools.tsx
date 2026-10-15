import { useState } from 'react';
import { navigate } from '@/lib/router';
import { useCollection } from '@/lib/store';
import { SchoolHero, SchoolCarousel } from './SchoolShowcase';

export function Schools() {
  const { items } = useCollection('schoolProfiles');
  const [query, setQuery] = useState('');

  return (
    <section id="schools" className="relative bg-gradient-to-b from-white via-[#f3f9ff] to-white pb-14 sm:pb-20">
      <SchoolHero
        query={query}
        onQuery={setQuery}
        onSearch={() => navigate(`/schools${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)}
        onFilters={() => navigate('/schools')}
        viewAllHref="#/schools"
      />
      <div className="container-page mt-4 sm:mt-6">
        <SchoolCarousel schools={items} />
      </div>
    </section>
  );
}
