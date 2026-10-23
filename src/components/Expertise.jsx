import { lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Binary, Bot, Container, Cpu, Search, Server } from 'lucide-react';
import { toolkit } from '../data/icons';
import { Marquee, Reveal, SectionIntro, TwoPartHeading } from './ui';
import { ToolTile } from './ToolTile';

const PhysicsToolkit = lazy(() => import('./PhysicsToolkit'));
const GROUP_ICONS = [Bot, Search, Cpu, Server, Container, Binary];

/** Static toolkit grid: used for reduced motion and while physics loads. */
function StaticToolkit() {
  return (
    <ul className="flex flex-wrap justify-center gap-4 p-8 pt-24" aria-label="My toolkit">
      {toolkit.map((t) => (
        <li key={t.label}>
          <ToolTile tool={t} />
        </li>
      ))}
    </ul>
  );
}

function HandNote() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 z-10 flex flex-col items-center px-6 text-center">
      <p className="font-hand text-[1.45rem] leading-tight text-white/85">Drag the icons around. The toolkit keeps growing with every build.</p>
      <svg width="40" height="54" viewBox="0 0 40 54" fill="none" className="mt-1" aria-hidden="true">
        <path d="M14 2c12 10 16 26 6 44" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="120" style={{ animation: 'draw 1.4s 0.3s ease-out both' }} />
        <path d="M12 38l8 9 7-10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Expertise({ profile }) {
  const reduce = useReducedMotion();
  const pills = profile.skills.flatMap((g, gi) => g.items.map((label) => ({ label, Icon: GROUP_ICONS[gi % GROUP_ICONS.length] })));
  const half = Math.ceil(pills.length / 2);
  const Pill = ({ label, Icon }) => (
    <span className="card inline-flex items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-3 text-[0.98rem] text-white/90">
      <Icon className="h-[1.1rem] w-[1.1rem] text-white/70" strokeWidth={1.7} aria-hidden="true" />
      {label}
    </span>
  );

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="section">
      <div className="wrap">
        <SectionIntro tag="Expertise" a="The Stack I," b="Trust" id="expertise-title" line="Tools, patterns and practices from real builds, not tutorials." />
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <TwoPartHeading a="How I" b="Build" as="h3" size="!text-[clamp(2rem,4.6vw,3.6rem)]" />
          <Reveal as="p" delay={0.1} className="mt-4 text-white/85 sm:text-lg">
            Guardrails first, a human in the loop before side effects, and citations on every answer.
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-10 space-y-2">
        <h3 className="sr-only">Skills</h3>
        <Marquee items={pills.slice(0, half)} duration={55} render={(it) => <Pill {...it} />} />
        <Marquee items={pills.slice(half)} duration={60} reverse render={(it) => <Pill {...it} />} />
      </Reveal>

      <div className="wrap mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <TwoPartHeading a="My" b="Toolkit" as="h3" size="!text-[clamp(2rem,4.6vw,3.6rem)]" />
          <Reveal as="p" delay={0.1} className="mt-4 text-white/85 sm:text-lg">
            The tools I reach for to turn an idea into a working system.
          </Reveal>
        </div>
        <Reveal id="toolkit" className="card relative mx-auto mt-10 h-[24rem] max-w-5xl overflow-hidden rounded-[2rem] sm:h-[26rem]">
          <HandNote />
          {reduce ? (
            <StaticToolkit />
          ) : (
            <Suspense fallback={<StaticToolkit />}>
              <PhysicsToolkit tools={toolkit} />
            </Suspense>
          )}
        </Reveal>
      </div>
    </section>
  );
}
