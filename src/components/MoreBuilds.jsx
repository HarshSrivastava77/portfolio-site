import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, FileCode2, Github } from 'lucide-react';
import { GlowButton, Reveal, SectionIntro } from './ui';

const COPIES = 3;

/**
 * Infinite 3D carousel: cards sit on the inside of a cylinder, so edge cards
 * lean in and fade, like the reference. Auto-rotates; drag/swipe with inertia.
 */
function Carousel3D({ items }) {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const cards = useRef([]);
  const renderRef = useRef(null);
  const state = useRef({ angle: 0, vel: 0, drag: false, lastX: 0, moved: 0, hover: false, visible: false });
  const all = Array.from({ length: COPIES }, (_, c) => items.map((it) => ({ ...it, copy: c }))).flat();
  const N = all.length;
  const STEP = 360 / N;

  useEffect(() => {
    const el = stage.current;
    const s = state.current;
    let raf, last = performance.now(), cw = 360, R = 760, P = 1300, D = 420;

    const size = () => {
      const w = el.clientWidth;
      cw = Math.max(230, Math.min(380, w * 0.6));
      R = cw * 2.05;
      P = cw * 3.6;
      D = R * 0.6;
      el.style.perspective = `${P}px`;
      el.style.height = `${cw * 0.78 + 60}px`;
      cards.current.forEach((c) => c && (c.style.width = `${cw}px`, c.style.height = `${cw * 0.72}px`));
    };

    const render = () => {
      cards.current.forEach((c, i) => {
        if (!c) return;
        let phi = ((s.angle + i * STEP) % 360 + 540) % 360 - 180;
        const a = Math.abs(phi);
        const vis = a < 78;
        c.style.visibility = vis ? 'visible' : 'hidden';
        if (!vis) return;
        c.style.opacity = a < 50 ? 1 : Math.max(0, 1 - (a - 50) / 28);
        c.style.transform = `translate(-50%, -50%) translateZ(${D}px) rotateY(${phi}deg) translateZ(${-R}px)`;
      });
    };

    const tick = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!s.drag) {
        const target = reduce || s.hover ? 0 : -5; // degrees per second
        s.vel += (target - s.vel) * Math.min(1, dt * 2.2);
        s.angle += s.vel * dt;
      }
      render();
      if (s.visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else cancelAnimationFrame(raf);
    });
    renderRef.current = render;
    io.observe(el);
    const ro = new ResizeObserver(() => { size(); render(); });
    ro.observe(el);
    size();
    render();

    const down = (e) => {
      s.drag = true;
      s.moved = 0;
      s.lastX = e.clientX;
      s.vel = 0;
    };
    const move = (e) => {
      if (!s.drag) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      const deg = dx * 0.12;
      s.angle += deg;
      s.vel = deg * 60; // carry the throw as inertia
      if (reduce) render();
    };
    const up = () => (s.drag = false);
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [N, STEP, reduce]);

  const nudge = (dir) => {
    const s = state.current;
    if (reduce) {
      s.angle += dir * STEP;
      renderRef.current?.();
    } else s.vel += dir * 70;
  };

  return (
    <div className="relative">
      <div
        ref={stage}
        className="marquee relative w-full cursor-grab select-none active:cursor-grabbing"
        style={{ transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
        onMouseEnter={() => (state.current.hover = true)}
        onMouseLeave={() => (state.current.hover = false)}
        onClickCapture={(e) => state.current.moved > 6 && (e.preventDefault(), e.stopPropagation())}
      >
        {all.map((b, i) => {
          const dup = b.copy > 0;
          return (
            <a
              key={i}
              ref={(el) => (cards.current[i] = el)}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={dup ? -1 : 0}
              aria-hidden={dup || undefined}
              draggable="false"
              className="card group absolute left-1/2 top-1/2 block overflow-hidden rounded-[1.75rem] will-change-transform"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(142,91,168,0.35),transparent_60%)]" aria-hidden="true" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.035)_0_2px,transparent_2px_14px)]" aria-hidden="true" />
              {b.github ? (
                <Github className="absolute right-6 top-6 h-24 w-24 text-white/10" aria-hidden="true" />
              ) : (
                <FileCode2 className="absolute right-6 top-6 h-24 w-24 text-white/[0.07]" aria-hidden="true" />
              )}
              <span className="glass absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white/80">{b.file}</span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-16">
                <p className="flex items-center gap-2 text-2xl font-medium tracking-tight">
                  {b.name}
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                </p>
                <p className="mt-1 line-clamp-2 text-[0.95rem] text-muted">{b.text}</p>
              </div>
            </a>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center gap-3">
        <button type="button" onClick={() => nudge(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-surface hover:bg-white/10" aria-label="Spin carousel left">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => nudge(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-surface hover:bg-white/10" aria-label="Spin carousel right">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function MoreBuilds({ profile }) {
  const items = [
    ...profile.otherBuilds,
    { file: 'github.com', name: 'More on GitHub', text: 'Every repo, including experiments and coursework.', url: profile.socials.github, github: true },
  ];
  return (
    <section aria-labelledby="builds-title" className="section overflow-hidden">
      <div className="wrap">
        <SectionIntro tag="Builds" a="Smaller," b="Experiments" id="builds-title" line="Focused repos where I tried one idea at a time. Drag to spin." />
      </div>
      <Reveal className="mt-10">
        <Carousel3D items={items} />
      </Reveal>
      <Reveal className="mt-8 flex justify-center" delay={0.1}>
        <GlowButton href={profile.socials.github} icon={Github} external>
          Explore my GitHub
        </GlowButton>
      </Reveal>
    </section>
  );
}
