import { motion } from 'framer-motion';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';
import { EASE } from '../lib/motion';
import { Monogram } from './ui';

export default function Footer({ profile }) {
  const icons = [
    ['Email', `mailto:${profile.email}`, Mail],
    ['GitHub', profile.socials.github, Github],
    ['LinkedIn', profile.socials.linkedin, Linkedin],
    ['Résumé', profile.resumeUrl, FileText],
  ];
  return (
    <footer className="wrap relative z-10 pb-8">
      <div className="card relative overflow-hidden rounded-[2rem] px-6 pb-40 pt-10 sm:px-12 sm:pb-56">
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-sans text-[clamp(7rem,27vw,21rem)] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.045]"
          initial={{ y: '45%', opacity: 0 }}
          whileInView={{ y: '22%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          aria-hidden="true"
        >
          {profile.firstName.toLowerCase()}
        </motion.p>
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Monogram className="h-12 w-12" />
            <span className="h-12 w-px bg-white/15" aria-hidden="true" />
            <p className="text-[0.98rem] leading-snug text-white/85">
              © {new Date().getFullYear()} {profile.name}.<br />
              <span className="text-muted">Agents that check their work. Retrieval that cites its sources.</span>
            </p>
          </div>
          <ul className="flex gap-3">
            {icons.map(([label, url, Icon]) => (
              <li key={label}>
                <a href={url} target={url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/[0.1]" aria-label={label}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
