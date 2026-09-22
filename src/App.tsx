import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { Features } from '@/components/Features';
import { Schools } from '@/components/Schools';
import { Courses } from '@/components/Courses';
import { Jobs } from '@/components/Jobs';
import { Tuition } from '@/components/Tuition';
import { Events } from '@/components/Events';
import { Register } from '@/components/Register';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/40 via-white to-white text-ink-900 antialiased">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <Schools />
        <Courses />
        <Jobs />
        <Tuition />
        <Events />
        <Register />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
