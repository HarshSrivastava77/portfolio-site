import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, FolderOpen, ScanFace } from 'lucide-react';
import { EASE } from '../lib/motion';
import { GlowButton } from './ui';
import { bookHref } from './Navbar';

/** Types and erases each role in turn. Width is reserved by the longest role, so nothing shifts. */
function RoleTyper({ roles }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState(reduce ? roles[0] : '');
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), '');

  useEffect(() => {
    if (reduce) return;
    let t;
    const full = roles[i];
    let n = 0;
    let erasing = false;
    const tick = () => {
      if (!erasing) {
        n += 1;
        setText(full.slice(0, n));
        if (n === full.length) {
          erasing = true;
          t = setTimeout(tick, 2000);
          return;
        }
        t = setTimeout(tick, 75);
      } else {
        n -= 1;
        setText(full.slice(0, n));
        if (n === 0) {
          setI((x) => (x + 1) % roles.length);
          return;
        }
        t = setTimeout(tick, 38);
      }
    };
    t = setTimeout(tick, i === 0 ? 700 : 250);
    return () => clearTimeout(t);
  }, [i, reduce, roles]);

  return (
    <span className="relative inline-grid text-left align-baseline">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">{longest}</span>
      <span className="col-start-1 row-start-1 whitespace-nowrap bg-gradient-to-r from-[#8E5BA8] via-[#A979C2] to-[#B98BD0] bg-clip-text text-transparent" aria-hidden="true">
        {text}
        <span className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.08em] rounded-full bg-lavender align-baseline" style={{ animation: 'caret 1s steps(1) infinite' }} />
      </span>
      <span className="sr-only">{roles.join(', ')}</span>
    </span>
  );
}

/**
 * Wireframe dome over the head. Meridians are redrawn each frame with a
 * changing x-radius, which reads as a slow 3D rotation.
 */
function Visor() {
  const reduce = useReducedMotion();
  const refs = useRef([]);
  const M = 9;
  useEffect(() => {
    let raf;
    const draw = (t) => {
      const a = (t || 0) * 0.00025;
      refs.current.forEach((el, k) => {
        if (!el) return;
        const th = a + (k * Math.PI) / M;
        const rx = Math.abs(Math.cos(th)) * 104;
        el.setAttribute('rx', rx.toFixed(2));
        el.setAttribute('stroke-opacity', (0.12 + 0.28 * Math.abs(Math.sin(th))).toFixed(2));
      });
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(0);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const lats = [0.28, 0.52, 0.72, 0.88];
  return (
    <svg viewBox="0 0 220 110" className="pointer-events-none absolute left-[8%] top-[-1.5%] w-[79%] opacity-80" aria-hidden="true">
      <defs>
        <clipPath id="dome-clip"><rect x="0" y="0" width="220" height="100" /></clipPath>
        <linearGradient id="dome-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="dome-mask"><rect width="220" height="110" fill="url(#dome-fade)" /></mask>
      </defs>
      <g clipPath="url(#dome-clip)" mask="url(#dome-mask)" fill="none" stroke="#fff" strokeWidth="0.55">
        {Array.from({ length: M }, (_, k) => (
          <ellipse key={k} ref={(el) => (refs.current[k] = el)} cx="110" cy="100" rx="60" ry="96" />
        ))}
        {lats.map((k) => {
          const rx = 104 * Math.sqrt(1 - k * k);
          return <ellipse key={k} cx="110" cy={100 - 96 * k} rx={rx} ry={rx * 0.16} strokeOpacity="0.32" />;
        })}
        <ellipse cx="110" cy="100" rx="104" ry="17" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

// Face landmarks in the portrait's own pixel space (1024 × 1476 source image).
const LM = {
  eyes: [[360, 470], [615, 470]],
  brows: [[280, 400], [430, 395], [550, 395], [700, 400]],
  nose: [[490, 470], [487, 560], [450, 610], [525, 610]],
  mouth: [[400, 690], [487, 675], [575, 690], [487, 715]],
  jaw: [[225, 520], [240, 660], [300, 790], [390, 875], [487, 900], [585, 875], [675, 790], [735, 660], [752, 520]],
};

/** "Hover to scan": a scan line sweeps down, then a face mesh and detection box fade in. */
function ScanOverlay({ on, name }) {
  const pts = [...LM.eyes, ...LM.brows, ...LM.nose, ...LM.mouth, ...LM.jaw];
  const lines = [
    ...LM.jaw.slice(0, -1).map((p, i) => [p, LM.jaw[i + 1]]),
    [LM.brows[0], LM.brows[1]], [LM.brows[2], LM.brows[3]],
    [LM.nose[0], LM.nose[1]], [LM.nose[1], LM.nose[2]], [LM.nose[1], LM.nose[3]],
    [LM.mouth[0], LM.mouth[1]], [LM.mouth[1], LM.mouth[2]], [LM.mouth[2], LM.mouth[3]], [LM.mouth[3], LM.mouth[0]],
    [LM.eyes[0], LM.nose[0]], [LM.eyes[1], LM.nose[0]], [LM.eyes[0], LM.nose[2]], [LM.eyes[1], LM.nose[3]],
    [LM.nose[2], LM.mouth[0]], [LM.nose[3], LM.mouth[2]], [LM.mouth[0], LM.jaw[2]], [LM.mouth[2], LM.jaw[6]],
    [LM.mouth[3], LM.jaw[4]], [LM.brows[0], LM.jaw[0]], [LM.brows[3], LM.jaw[8]], [LM.eyes[0], LM.jaw[1]], [LM.eyes[1], LM.jaw[7]],
  ];
  return (
    <AnimatePresence>
      {on && (
        <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {/* scan line */}
          <motion.div
            className="absolute inset-x-[14%] h-[2px] rounded-full bg-lavender shadow-[0_0_24px_6px_rgba(229,168,245,0.55)]"
            initial={{ top: '8%', opacity: 0 }}
            animate={{ top: ['8%', '64%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.3, ease: EASE }}
          />
          <motion.svg viewBox="0 0 1024 1476" className="absolute inset-0 h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.6 }}>
            <g stroke="#E5A8F5" strokeOpacity="0.55" strokeWidth="2" fill="none">
              {lines.map(([p, q], i) => (
                <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />
              ))}
            </g>
            <g fill="#fff">
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" />
              ))}
            </g>
            {/* detection box corners */}
            <g stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round">
              <path d="M200 260 v-60 h60 M720 200 h60 v60 M780 880 v60 h-60 M260 940 h-60 v-60" />
            </g>
            <g transform="translate(200 150)">
              <rect width={name.length * 21 + 40} height="40" rx="8" fill="#E5A8F5" />
              <text x="20" y="28" fontFamily="Poppins, sans-serif" fontSize="24" fontWeight="600" fill="#000">
                {name}
              </text>
            </g>
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Fade the bottom and both sides so the shoulders melt into the black page.
const PHOTO_MASK = {
  WebkitMaskImage: 'linear-gradient(to bottom, #000 58%, transparent 94%), linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
  maskImage: 'linear-gradient(to bottom, #000 58%, transparent 94%), linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%)',
  maskComposite: 'intersect',
};

export default function Hero({ profile }) {
  const [scan, setScan] = useState(false);
  const d = (s) => ({ duration: 1, ease: EASE, delay: s });
  const blurIn = { opacity: 0, y: 24, filter: 'blur(12px)' };
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <section id="about" aria-labelledby="hero-title" className="relative pb-10 pt-32 text-center sm:pt-40">
      <div className="wrap">
        <h1 id="hero-title" className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 leading-[1.05]">
          <span className="sr-only">{profile.name}, </span>
          <motion.span className="font-serif text-[clamp(2.7rem,6.6vw,5.4rem)] italic text-white" initial={blurIn} animate={shown} transition={d(0.2)}>
            {profile.greeting}
          </motion.span>
          <motion.span className="font-sans text-[clamp(2.3rem,6vw,4.9rem)] font-medium tracking-[-0.03em]" initial={blurIn} animate={shown} transition={d(0.32)}>
            <RoleTyper roles={profile.roles} />
          </motion.span>
        </h1>

        {/* Portrait */}
        <motion.div
          className="relative mx-auto mt-4 w-[min(27rem,80vw)]"
          initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
          onMouseEnter={() => setScan(true)}
          onMouseLeave={() => setScan(false)}
        >
          <div className="absolute left-1/2 top-[22%] h-[55%] w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(142,91,168,0.35),transparent)] blur-2xl" aria-hidden="true" />
          <div className="relative" style={{ animation: 'float-y 6s ease-in-out infinite' }}>
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width="900"
              height="1297"
              fetchpriority="high"
              className="relative block h-auto w-full select-none"
              style={PHOTO_MASK}
              draggable="false"
            />
            <Visor />
            <ScanOverlay on={scan} name={profile.name} />
          </div>

          <button
            type="button"
            onFocus={() => setScan(true)}
            onBlur={() => setScan(false)}
            onClick={() => setScan((s) => !s)}
            aria-pressed={scan}
            className="glass absolute left-[-6%] top-[62%] sm:top-[36%] inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 font-serif text-lg italic text-white sm:left-[-22%] sm:text-xl"
          >
            <ScanFace className="h-5 w-5 not-italic" strokeWidth={1.6} aria-hidden="true" />
            {scan ? 'Scanning…' : (<><span className="sm:hidden">Tap to scan</span><span className="hidden sm:inline">Hover to scan</span></>)}
          </button>
        </motion.div>

        <div className="mx-auto -mt-16 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/25 to-transparent sm:-mt-24" aria-hidden="true" />

        <motion.div initial={blurIn} animate={shown} transition={d(0.8)} className="mx-auto mt-7 max-w-3xl space-y-1 text-[1.02rem] text-white/90 sm:text-[1.12rem]">
          {profile.statement.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </motion.div>

        <motion.div initial={blurIn} animate={shown} transition={d(0.95)} className="mt-8 flex flex-wrap justify-center gap-3">
          <GlowButton href={profile.resumeUrl} icon={FolderOpen} download="Harsh-Srivastava-Resume.pdf">
            View résumé
          </GlowButton>
          <GlowButton href={bookHref(profile)} icon={CalendarDays} external={!!profile.calendlyUrl}>
            Book a call
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
