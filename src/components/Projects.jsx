import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, FileCode2, Github, X } from 'lucide-react';
import { Reveal, SectionIntro } from './ui';

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Animated cover used until a real screenshot is added:
 * the project's pipeline as glowing nodes, with packets travelling along the path.
 */
function ProjectCover({ p, index }) {
  const reduce = useReducedMotion();
  const nodes = p.cover;
  const n = nodes.length;
  const top = Math.ceil(n / 2);
  const pts = nodes.map((label, i) => {
    const row = i < top ? 0 : 1;
    const k = row === 0 ? i : i - top;
    const count = row === 0 ? top : n - top;
    const span = 460;
    const x0 = 90;
    const t = count === 1 ? 0.5 : k / (count - 1);
    const x = row === 0 ? x0 + t * span : x0 + span - t * span;
    return { label, x, y: row === 0 ? 105 : 225 };
  });
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (a.y === b.y) d += ` L ${b.x} ${b.y}`;
    else d += ` C ${a.x + 90} ${a.y} ${b.x + 90} ${b.y} ${b.x} ${b.y}`;
  }
  const id = `cv-${p.id}`;
  const glows = [['78%', '20%'], ['20%', '25%'], ['70%', '70%'], ['30%', '65%']];
  const [gx, gy] = glows[index % glows.length];

  return (
    <div className="relative h-full w-full bg-[#09090a]" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `radial-gradient(60% 55% at ${gx} ${gy}, rgba(142,91,168,0.45), transparent 70%)` }} />
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-screen" style={{ backgroundImage: NOISE }} />
    <svg viewBox="0 0 640 330" preserveAspectRatio="xMidYMid meet" className="absolute inset-x-0 top-[6%] h-[62%] w-full">
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <path d={d} fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="#E5A8F5" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="3 37" style={{ animation: reduce ? 'none' : 'dash 2.4s linear infinite' }} />

      {!reduce &&
        [0, 3].map((delay) => (
          <g key={delay}>
            <circle r="7" fill="#E5A8F5" opacity="0.5" filter={`url(#${id}-blur)`}>
              <animateMotion dur="6s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
            </circle>
            <circle r="3" fill="#fff">
              <animateMotion dur="6s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        ))}

      {pts.map((pt, i) => {
        const w = pt.label.length * 9.2 + 34;
        const last = i === pts.length - 1;
        return (
          <g key={pt.label} transform={`translate(${pt.x - w / 2} ${pt.y - 19})`}>
            <rect width={w} height="38" rx="19" fill={last ? '#E5A8F5' : '#141416'} stroke={last ? 'none' : '#fff'} strokeOpacity="0.16" />
            <text x={w / 2} y="24.5" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="15.5" fontWeight="500" fill={last ? '#000' : '#E7E7EA'}>
              {pt.label}
            </text>
          </g>
        );
      })}
    </svg>
    </div>
  );
}

/** Project detail dialog: problem, what I built, highlights with source links. */
function ProjectDialog({ p, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (p && d && !d.open) d.showModal();
    if (!p && d?.open) d.close();
  }, [p]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      data-lenis-prevent
      aria-labelledby="pd-title"
      className="m-auto max-h-[88vh] w-[min(52rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0B0B0C] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-[dialog-in_0.5s_cubic-bezier(0.22,1,0.36,1)]"
    >
      {p && (
        <div className="p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-sm text-muted">
                <FileCode2 className="h-4 w-4" aria-hidden="true" />
                {p.file}
              </p>
              <h3 id="pd-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {p.name}
              </h3>
              <p className="mt-1 font-serif text-xl italic text-lavender">{p.kind}</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] hover:bg-white/[0.12]" aria-label="Close project details">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h4 className="text-sm font-semibold text-muted">The problem</h4>
              <p className="mt-2 text-white/90">{p.problem}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h4 className="text-sm font-semibold text-muted">What I built</h4>
              <p className="mt-2 text-white/90">{p.solution}</p>
            </div>
          </div>

          <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm" aria-label="How it works">
            {p.flow.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 ${i === p.flow.length - 1 ? 'bg-lavender text-black' : 'border border-white/15 text-white/85'}`}>{s}</span>
                {i < p.flow.length - 1 && <span className="text-white/35" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>

          <ul className="mt-8 space-y-3">
            {p.highlights.map((h, i) => {
              const src = h.cite && p.sources[h.cite - 1];
              return (
                <li key={i} className="flex gap-3 text-white/90">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" aria-hidden="true" />
                  <span>
                    {h.text}
                    {src && (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="ml-1 align-super text-xs font-semibold text-lavender hover:underline" aria-label={`Source: ${src.label} (opens in a new tab)`}>
                        [{h.cite}]
                      </a>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
            <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
              {p.stack.map((t) => (
                <li key={t} className="rounded-full bg-white/[0.06] px-3 py-1 text-sm text-white/85">{t}</li>
              ))}
            </ul>
            <div className="flex gap-3">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="pill-outline !px-5">Live demo</a>
              )}
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="pill-outline !px-5">
                <Github className="h-4 w-4" aria-hidden="true" /> Code on GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function ProjectCard({ p, index, onOpen }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <Reveal delay={(index % 2) * 0.12}>
      <button
        type="button"
        onClick={() => onOpen(p)}
        onMouseMove={onMove}
        className="card group relative block h-[25rem] w-full overflow-hidden rounded-[2.25rem] text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 sm:h-[33rem]"
        aria-label={`${p.name}: ${p.outcome} Open details`}
      >
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          {p.image ? <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ProjectCover p={p} index={index} />}
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(520px circle at var(--mx) var(--my), rgba(229,168,245,0.14), transparent 45%)' }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white/80">
            <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
            {p.file}
          </span>
          <span className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-medium tracking-tight sm:text-[2rem]">{p.name}</span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </span>
          <span className="mt-2 block max-w-xl text-[0.98rem] text-muted sm:text-lg">{p.outcome}</span>
        </div>
      </button>
    </Reveal>
  );
}

export default function Projects({ profile }) {
  const [open, setOpen] = useState(null);
  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <div className="wrap">
        <SectionIntro tag="Projects" a="Things I’ve," b="Built" id="projects-title" line="Agent and retrieval systems, each with a public repo and the architecture behind it." />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
          {profile.projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>
      <ProjectDialog p={open} onClose={() => setOpen(null)} />
    </section>
  );
}
