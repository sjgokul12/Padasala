import { useEffect, useState } from 'react';
import { ServerCrash } from 'lucide-react';
import { api, backendEnabled, API_URL } from '@/lib/api';
import { useRoute } from '@/lib/router';
import { useDistrictsFromDatabase } from '@/lib/districts';
import { useAdminSession, setSession, adminApi, typeBySlug, errorText, type AdminUser } from './lib';
import { Shell } from './Shell';
import { Toasts, Spinner, Button } from './ui';
import { LoginScreen, SetupScreen } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Listings } from './pages/Listings';
import { Accounts } from './pages/Accounts';
import { Students } from './pages/Students';
import { Questions } from './pages/Questions';
import { Settings } from './pages/Settings';
import { SearchResults } from './pages/SearchResults';

function Page() {
  const { segments, query } = useRoute();
  const slug = segments[0] ?? '';
  const type = typeBySlug(slug);
  if (type) return <Listings key={type} type={type} />;
  if (slug === 'accounts') return <Accounts />;
  if (slug === 'students') return <Students />;
  if (slug === 'questions') return <Questions />;
  if (slug === 'settings') return <Settings />;
  if (slug === 'search') return <SearchResults key={query.get('q')} />;
  return <Dashboard />;
}

function Problem({ title, text, onRetry }: { title: string; text: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <ServerCrash className="mx-auto h-10 w-10 text-rose-500" />
        <h1 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
        {onRetry && <Button className="mt-5" onClick={onRetry}>Try again</Button>}
      </div>
    </div>
  );
}

export function AdminApp() {
  useDistrictsFromDatabase();
  const session = useAdminSession();
  const [setup, setSetup] = useState<{ needed: boolean; keyRequired: boolean } | null>(null);
  const [error, setError] = useState('');

  const check = () => {
    setError('');
    api<{ setup_needed: boolean; setup_key_required: boolean }>('/api/admin/setup-status.php')
      .then((s) => setSetup({ needed: s.setup_needed, keyRequired: s.setup_key_required }))
      .catch((e) => setError(errorText(e)));
  };
  useEffect(() => {
    if (backendEnabled) check();
  }, []);

  // Confirm the saved sign-in is still valid (a 401 clears it).
  useEffect(() => {
    if (!session) return;
    adminApi<{ user: AdminUser }>('/api/auth/me.php')
      .then(({ user }) => (user.role === 'admin' ? setSession({ ...session, user }) : setSession(null)))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  useEffect(() => {
    document.title = 'Padasala Admin';
  }, []);

  if (!backendEnabled) {
    return <Problem title="Backend not configured" text="The admin panel needs the Padasala server. Set VITE_API_URL (see .env.example) and rebuild." />;
  }
  if (error) return <Problem title="Cannot reach the server" text={`${error} (${API_URL})`} onRetry={check} />;
  if (!setup) return <div className="min-h-screen bg-slate-50"><Spinner label="Connecting…" /></div>;

  return (
    <>
      {setup.needed && !session ? (
        <SetupScreen keyRequired={setup.keyRequired} />
      ) : !session ? (
        <LoginScreen />
      ) : (
        <Shell><Page /></Shell>
      )}
      <Toasts />
    </>
  );
}
