import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

/** The admin panel is a separate app at /admin/. Old "#/admin" links are sent there. */
export const ADMIN_PANEL_URL = '/admin/';

export function AdminPage() {
  useEffect(() => {
    window.location.replace(ADMIN_PANEL_URL);
  }, []);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 pt-32 text-center">
      <ShieldCheck className="h-10 w-10 text-[#0284c7]" />
      <p className="font-semibold text-slate-600">Opening the admin panel…</p>
      <a href={ADMIN_PANEL_URL} className="text-sm font-bold text-[#0284c7]">Open admin panel</a>
    </div>
  );
}
