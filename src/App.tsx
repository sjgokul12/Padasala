import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { LoginModal } from '@/components/LoginModal';
import { OtpDialog } from '@/components/OtpDialog';
import { useRoute } from '@/lib/router';
import { useScrollReveal } from '@/lib/reveal';
import { verifySession } from '@/lib/auth';
import { useDistrictsFromDatabase } from '@/lib/districts';
import { HomePage, AboutPage } from '@/pages/HomePage';
import { SchoolsPage } from '@/pages/SchoolsPage';
import { CoachingPage } from '@/pages/CoachingPage';
import { StudentsPage } from '@/pages/StudentsPage';
import { EventsPage } from '@/pages/EventsPage';
import { TeachersPage } from '@/pages/TeachersPage';
import { VendorsPage } from '@/pages/VendorsPage';
import { AdminPage } from '@/pages/AdminPage';

const pages: Record<string, () => JSX.Element> = {
  schools: SchoolsPage,
  coaching: CoachingPage,
  students: StudentsPage,
  events: EventsPage,
  teachers: TeachersPage,
  vendors: VendorsPage,
  about: AboutPage,
  admin: AdminPage,
};

function App() {
  useScrollReveal();
  useDistrictsFromDatabase();
  // Confirm the saved login with the backend once at start-up.
  useEffect(() => {
    verifySession();
  }, []);
  const { path, segments, anchor } = useRoute();
  const Page = pages[segments[0]] ?? HomePage;

  // New page: start at the top. Home-page anchors (#contact): scroll to that section once it is rendered.
  useEffect(() => {
    if (path === '/' && anchor) document.getElementById(anchor)?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path, anchor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 via-white to-white text-ink-900 antialiased">
      <Header />
      <main>
        <Page />
      </main>
      <Footer />
      <MobileNav />
      <WhatsAppButton />
      <LoginModal />
      <OtpDialog />
    </div>
  );
}

export default App;
