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

// Home sections that are kept in the code but not shown right now. Set to true to bring one back.
const showOnHome = {
  courses: false, // "Courses for NEET, JEE, Board & beyond" — courses live on the Coaching page
  teacherJobs: false, // "Teachers, find your next school" — teacher content is for teacher logins (Teacher Job Posting page)
};

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Schools />
      <TrustStrip />
      {showOnHome.courses && <Courses />}
      {showOnHome.teacherJobs && <Jobs />}
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
