import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import { profile } from './data/profile';
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import MoreBuilds from './components/MoreBuilds';
import Journey from './components/Journey';
import Expertise from './components/Expertise';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CriticModal from './components/CriticModal';

export default function App() {
  // Lenis smooth scrolling + smooth in-page anchor links.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;
    let raf = 0;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      const loop = (t) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: id === '#about' ? -200 : -96, duration: 1.4 });
      else el.scrollIntoView();
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Starfield />
      <a href="#projects" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to projects
      </a>
      <Navbar profile={profile} />
      <main className="relative z-10">
        <Hero profile={profile} />
        <Projects profile={profile} />
        <MoreBuilds profile={profile} />
        <Journey profile={profile} />
        <Expertise profile={profile} />
        <Testimonials profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <CriticModal />
    </MotionConfig>
  );
}
