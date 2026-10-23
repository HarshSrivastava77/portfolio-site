import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Menu, X } from 'lucide-react';
import { EASE } from '../lib/motion';
import { GlowButton, Monogram, Wordmark } from './ui';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Let’s Talk' },
];

export function bookHref(profile) {
  return profile.calendlyUrl || `mailto:${profile.email}?subject=${encodeURIComponent('Let’s talk')}`;
}

/** Floating glass pill navbar with a gliding active-section highlight. */
export default function Navbar({ profile }) {
  const [active, setActive] = useState('about');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Highlight whichever section crosses the middle of the screen.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const external = !!profile.calendlyUrl;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}>
        <motion.nav
          aria-label="Main"
          initial={{ y: -40, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: scrolled ? 0.975 : 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className={`glass pointer-events-auto flex w-full max-w-[66rem] items-center justify-between rounded-full pl-3 pr-2 transition-[padding] duration-500 ${scrolled ? 'py-1.5' : 'py-2.5'}`}
        >
          <a href="#about" className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3" aria-label={`${profile.name}, back to top`}>
            <Monogram />
            <Wordmark name={profile.firstName} />
          </a>

          <ul className="hidden items-center lg:flex">
            {LINKS.map((l) => (
              <li key={l.id} className="relative">
                <a href={`#${l.id}`} className="group relative z-10 block px-4 py-2 text-[0.95rem] font-medium text-white/90 hover:text-white" aria-current={active === l.id ? 'true' : undefined}>
                  <span className="roll">
                    <span>{l.label}</span>
                    <span aria-hidden="true">{l.label}</span>
                  </span>
                </a>
                {active === l.id && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/[0.08]" transition={{ type: 'spring', stiffness: 260, damping: 28 }} aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <GlowButton href={bookHref(profile)} icon={CalendarDays} external={external} className="hidden !px-5 !py-2.5 sm:inline-flex">
              Book a call
            </GlowButton>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-black/80 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <motion.ul className="space-y-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
              {LINKS.map((l) => (
                <motion.li key={l.id} variants={{ hidden: { opacity: 0, y: 24, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } } }}>
                  <a href={`#${l.id}`} onClick={() => setOpen(false)} className="block py-2 text-4xl font-semibold tracking-tight">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-10">
              <GlowButton href={bookHref(profile)} icon={CalendarDays} external={external} onClick={() => setOpen(false)}>
                Book a call
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
