import { useEffect } from 'react';
import { districts } from '@/data/districts';
import { api, backendEnabled } from './api';
import { useStored } from './store';

/**
 * With the backend connected, the district list comes from the database (table "districts").
 * The built-in list in src/data/districts.ts is used until it loads, and in demo mode.
 * The shared array is updated in place, so every dropdown that uses it shows the database list.
 */
export function useDistrictsFromDatabase() {
  const [, setVersion] = useStored<number>('ui:districts-version', 0);

  useEffect(() => {
    if (!backendEnabled) return;
    api<{ districts: { id: number; name: string }[] }>('/api/districts.php')
      .then(({ districts: rows }) => {
        if (!rows.length) return;
        districts.splice(0, districts.length, ...rows.map((r) => r.name));
        setVersion(Date.now()); // re-render so open forms pick up the new list
      })
      .catch(() => {
        // Keep the built-in list if the server is unreachable.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
