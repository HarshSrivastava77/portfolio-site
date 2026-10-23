import { motion } from 'framer-motion';
import { rise, stagger, word } from '../lib/motion';

const VIEW = { once: true, amount: 0.4 };

/** Scroll reveal wrapper: blur + fade + rise, once. */
export function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const M = motion[as];
  return (
    <M className={className} variants={rise} initial="hidden" whileInView="show" viewport={VIEW} custom={delay} {...rest}>
      {children}
    </M>
  );
}

/** Small dark pill with a pulsing green dot, shown above each heading. */
export function SectionTag({ children, className = '' }) {
  return (
    <Reveal className={`inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-surface px-4 py-1.5 text-[0.95rem] text-white/90 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-live" style={{ animation: 'pulse-dot 2s infinite' }} aria-hidden="true" />
      {children}
    </Reveal>
  );
}

/** Two-part heading: bold sans words + an italic serif lavender accent, revealed word by word. */
export function TwoPartHeading({ a, b, as = 'h2', id, className = '', size = '' }) {
  const M = motion[as];
  const words = a.split(' ');
  return (
    <M id={id} className={`h-display ${size} ${className}`} variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
      {words.map((w, i) => (
        <span key={i}>
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>{' '}
        </span>
      ))}
      <motion.span className="h-accent inline-block pr-[0.08em]" variants={word}>
        {b}
      </motion.span>
    </M>
  );
}

/** Section intro block: tag, heading, one supporting line. */
export function SectionIntro({ tag, a, b, line, id, align = 'center' }) {
  const center = align === 'center';
  return (
    <div className={center ? 'mx-auto max-w-4xl text-center' : ''}>
      {tag && <SectionTag>{tag}</SectionTag>}
      <TwoPartHeading a={a} b={b} id={id} className="mt-6" />
      {line && (
        <Reveal as="p" delay={0.15} className={`mt-5 text-[1.05rem] text-white/85 sm:text-lg ${center ? 'mx-auto max-w-2xl' : 'max-w-md'}`}>
          {line}
        </Reveal>
      )}
    </div>
  );
}

// Fixed sparkle positions so every button twinkles a little differently.
const SPARKS = [
  [14, 28, 0], [32, 70, 0.8], [58, 22, 1.6], [76, 64, 0.4], [90, 36, 2.2],
];

/** Pill button with a light beam running around its border and tiny drifting sparkles. */
export function GlowButton({ href, onClick, icon: Icon, children, className = '', external, ...rest }) {
  const inner = (
    <>
      {SPARKS.map(([x, y, d], i) => (
        <span key={i} className="spark" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} aria-hidden="true" />
      ))}
      {Icon && <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.8} aria-hidden="true" />}
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </>
  );
  const cls = `glow-btn group ${className}`;
  if (href) {
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** Infinite marquee. The second copy is decorative and disappears with reduced motion. */
export function Marquee({ items, render, reverse = false, duration = 40, className = '' }) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <ul className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ '--dur': `${duration}s` }}>
        {[...items, ...items].map((it, i) => (
          <li key={i} className={`pr-4 py-2 ${i >= items.length ? 'motion-reduce:hidden' : ''}`} aria-hidden={i >= items.length || undefined}>
            {render(it, i % items.length)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Square monogram mark used in the navbar and footer. */
export function Monogram({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mono-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2e" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#mono-g)" />
      <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="#fff" strokeOpacity=".12" />
      <path d="M20 16v32M44 16v32M20 33c8-5 16-5 24 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="48" cy="18" r="4" fill="#E5A8F5" />
    </svg>
  );
}

/** Signature-style wordmark. */
export function Wordmark({ name, className = '' }) {
  return <span className={`font-sig text-[1.9rem] leading-none text-white ${className}`}>{name}</span>;
}
