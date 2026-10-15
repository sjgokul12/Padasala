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

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Schools />
      <TrustStrip />
      <Courses />
      <Jobs />
      <Tuition />
      <Events />
      <Register />
      <About />
      <Contact />
    </>
  );
}

export function AboutPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <About />
      <Contact />
    </div>
  );
}
