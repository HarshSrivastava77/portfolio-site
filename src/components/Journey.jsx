import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { EASE } from '../lib/motion';
import { Reveal, SectionIntro } from './ui';

const DURATION = 6; // seconds per tab when auto-advancing

/** Milestone tabs that auto-advance with a progress bar and pause on hover or focus. */
export default function Journey({ profile }) {
  const items = [...profile.experience, ...profile.journey];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = items[active];

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
      setActive(next);
      document.getElementById(`tab-${items[next].id}`)?.focus();
    }
  };

  return (
    <section id="journey" aria-labelledby="journey-title" className="section">
      <div className="wrap">
        <SectionIntro tag="Journey" a="How I Got," b="Here" id="journey-title" line="Education, competitions and practice that shaped how I build." />

        <Reveal
          className="card mx-auto mt-14 max-w-5xl rounded-[2rem] p-3 sm:p-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div role="tablist" aria-label="Milestones" className="grid gap-3 sm:grid-cols-3" onKeyDown={onKey}>
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.id}
                  id={`tab-${it.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="journey-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors duration-500 ${on ? 'border-lavender/50 bg-gradient-to-br from-lavender/[0.14] to-transparent' : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'}`}
                >
                  <span className="min-w-0">
                    <span className={`flex items-center gap-1.5 font-medium ${on ? 'text-lavender' : 'text-white'}`}>
                      {it.name}
                      <BadgeCheck className="h-4 w-4 shrink-0 fill-verified text-black" aria-hidden="true" />
                    </span>
                    <span className="block text-sm text-muted">{it.period}</span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-black text-xs font-semibold text-white/85">{it.mark}</span>
                  {on && !reduce && (
                    <span
                      key={active}
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-lavender"
                      style={{ animation: `progress ${DURATION}s linear forwards`, animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={() => setActive((a) => (a + 1) % items.length)}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div id="journey-panel" role="tabpanel" aria-labelledby={`tab-${cur.id}`} className="relative min-h-[13rem] px-3 pb-4 pt-8 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.id}
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{cur.title}</h3>
                <p className="mt-3 max-w-2xl text-muted">{cur.text}</p>
                {cur.points?.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cur.points.map((pt) => (
                      <li key={pt} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-white/85">{pt}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
