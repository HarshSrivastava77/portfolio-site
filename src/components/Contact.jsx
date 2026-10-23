import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Plus } from 'lucide-react';
import { EASE } from '../lib/motion';
import { Reveal, SectionIntro, TwoPartHeading } from './ui';

const STICKERS = { 0: ['❤️', '-right-2 -top-3'], 1: ['⭐', '-left-4 top-1/2 -translate-y-1/2'], 3: ['❤️', '-right-2 -top-3'], 4: ['⭐', '-left-4 top-1/2 -translate-y-1/2'] };

/** FAQ as a live chat: question, a typing indicator, then the answer springs in. */
function ChatFAQ({ faqs }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [shown, setShown] = useState(reduce ? faqs.length : 0); // questions visible
  const [answered, setAnswered] = useState(reduce ? faqs.length : 0); // answers visible
  const [open, setOpen] = useState(() => faqs.map(() => true));

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = [];
    let t = 200;
    faqs.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), t));
      t += 550; // typing indicator
      timers.push(setTimeout(() => setAnswered(i + 1), t + 600));
      t += 900;
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, faqs]);

  return (
    <ol ref={ref} className="flex flex-col gap-3" aria-label="Frequently asked questions">
      {faqs.map((f, i) => {
        const hidden = i >= shown;
        const sticker = STICKERS[i];
        const isOpen = open[i];
        return (
          <li key={f.q} className={`flex flex-col gap-3 ${hidden ? 'invisible' : ''}`} aria-hidden={hidden || undefined}>
            <motion.div className="flex items-center gap-3 self-start" initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={hidden ? { opacity: 0 } : { opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
              <h3 className="relative max-w-md rounded-[1.4rem] bg-[#1c1c1f] px-5 py-3.5 text-[0.98rem] font-normal text-white">
                {f.q}
                {sticker && (
                  <span className={`absolute text-xl ${sticker[1]}`} style={{ animation: 'wobble 3.2s ease-in-out infinite' }} aria-hidden="true">
                    {sticker[0]}
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setOpen((o) => o.map((v, k) => (k === i ? !v : v)))}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                aria-label={isOpen ? `Hide answer: ${f.q}` : `Show answer: ${f.q}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
              >
                <span className={`grid h-7 w-7 place-items-center rounded-full border border-white/70 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </motion.div>

            <div className="relative self-end">
              {i >= answered && (
                <motion.div className="absolute right-2 top-0 rounded-[1.4rem] bg-plum px-5 py-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} aria-label="Typing">
                  <span className="flex gap-1.5" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full bg-white" style={{ animation: `typing 1s ${d * 0.15}s infinite` }} />
                    ))}
                  </span>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-a-${i}`}
                    className={i >= answered ? 'invisible' : ''}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <motion.p
                      key={i < answered ? 'in' : 'wait'}
                      className="bubble-me mr-2 max-w-md origin-bottom-right rounded-[1.4rem] rounded-br-md bg-plum px-5 py-3.5 text-[0.98rem] text-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    >
                      {f.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact form with a human-in-the-loop review step before anything is sent. */
function ContactForm({ profile }) {
  const [f, setF] = useState({ name: '', email: '', message: '', _gotcha: '' });
  const [err, setErr] = useState({});
  const [stage, setStage] = useState('draft');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const review = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Enter your name.';
    if (!EMAIL_RE.test(f.email.trim())) x.email = 'Enter an email like name@example.com.';
    if (f.message.trim().length < 10) x.message = 'Write at least 10 characters.';
    setErr(x);
    if (!Object.keys(x).length) setStage('review');
  };

  const send = async () => {
    if (f._gotcha) return setStage('sent');
    if (!profile.formspreeId) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${f.name}`)}&body=${encodeURIComponent(`${f.message}\n\n${f.name}\n${f.email}`)}`;
      return setStage('mailto');
    }
    setStage('sending');
    try {
      const r = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, message: f.message }),
      });
      setStage(r.ok ? 'sent' : 'error');
    } catch {
      setStage('error');
    }
  };

  const input = 'mt-1.5 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 focus:border-lavender/60 focus:outline-none';
  const panel = { initial: { opacity: 0, y: 12, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.45, ease: EASE } };

  return (
    <div className="card mx-auto mt-12 max-w-xl rounded-[2rem] p-6 text-left sm:p-8" aria-live="polite">
      <AnimatePresence mode="wait">
        {stage === 'draft' && (
          <motion.form key="draft" {...panel} onSubmit={review} noValidate className="space-y-4">
            {[
              ['name', 'Your name', 'text', 'name'],
              ['email', 'Your email', 'email', 'email'],
            ].map(([k, label, type, ac]) => (
              <div key={k}>
                <label htmlFor={`c-${k}`} className="text-sm font-medium text-white/85">{label}</label>
                <input id={`c-${k}`} type={type} autoComplete={ac} value={f[k]} onChange={set(k)} className={input} aria-invalid={!!err[k]} aria-describedby={err[k] ? `c-${k}-e` : undefined} />
                {err[k] && <p id={`c-${k}-e`} className="mt-1 text-sm text-lavender">{err[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="c-message" className="text-sm font-medium text-white/85">Message</label>
              <textarea id="c-message" rows={4} value={f.message} onChange={set('message')} className={input} aria-invalid={!!err.message} aria-describedby={err.message ? 'c-message-e' : undefined} />
              {err.message && <p id="c-message-e" className="mt-1 text-sm text-lavender">{err.message}</p>}
            </div>
            <input type="text" tabIndex={-1} autoComplete="off" value={f._gotcha} onChange={set('_gotcha')} className="hidden" aria-hidden="true" />
            <button type="submit" className="pill-outline w-full">Review message</button>
          </motion.form>
        )}
        {stage === 'review' && (
          <motion.div key="review" {...panel}>
            <p className="inline-flex items-center gap-2 rounded-full bg-plum px-3 py-1 text-sm font-medium">Waiting for your approval</p>
            <p className="mt-3 text-sm text-muted">Like the approval step in TripMate AI, nothing is sent until you approve it.</p>
            <p className="mt-4 text-sm text-muted">From {f.name}, {f.email}</p>
            <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-white/[0.04] p-4 text-white/90">{f.message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={send} className="pill-outline !border-lavender !bg-lavender !text-black">Approve and send</button>
              <button type="button" onClick={() => setStage('draft')} className="pill-outline">Edit message</button>
            </div>
          </motion.div>
        )}
        {stage === 'sending' && <motion.p key="sending" {...panel}>Sending your message…</motion.p>}
        {stage === 'sent' && (
          <motion.div key="sent" {...panel}>
            <h3 className="text-2xl font-semibold">Message sent</h3>
            <p className="mt-2 text-muted">Thanks, {f.name.split(' ')[0]}. I’ll get back to you at {f.email}.</p>
          </motion.div>
        )}
        {stage === 'mailto' && (
          <motion.div key="mailto" {...panel}>
            <h3 className="text-2xl font-semibold">Your email app should be open</h3>
            <p className="mt-2 text-muted">The message is filled in. If nothing opened, email <a className="text-lavender underline" href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
            <button type="button" onClick={() => setStage('review')} className="pill-outline mt-5">Back to review</button>
          </motion.div>
        )}
        {stage === 'error' && (
          <motion.div key="error" {...panel}>
            <h3 className="text-2xl font-semibold">The form couldn’t send your message</h3>
            <p className="mt-2 text-muted">Your text is still here. Try again, or email <a className="text-lavender underline" href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
            <button type="button" onClick={() => setStage('review')} className="pill-outline mt-5">Try again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact({ profile }) {
  const faqs = profile.faqs.filter((f) => f.q && f.a);
  const links = [
    ['LinkedIn', profile.socials.linkedin, Linkedin],
    ['GitHub', profile.socials.github, Github],
    ['Email', `mailto:${profile.email}`, Mail],
    ['LeetCode', profile.socials.leetcode, null],
  ].filter(([, url]) => url);

  return (
    <>
      <section id="faq" aria-labelledby="faq-intro" className="relative pt-16 sm:pt-24">
        <div className="wrap">
          <SectionIntro tag="FAQ" a="Ask Me," b="Anything" id="faq-intro" line="Reach out, or start with the answers below." />
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="relative pb-24 pt-20 sm:pb-36 sm:pt-28">
        <div className="wrap text-center">
          <TwoPartHeading a="Let’s" b="Talk?" id="contact-title" size="!text-[clamp(2.4rem,5.4vw,4.4rem)]" />
          <Reveal as="p" delay={0.1} className="mt-4 text-white/85 sm:text-lg">
            Have a role, a project or a question? Send it my way.
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-4">
            {links.map(([label, url, Icon]) => (
              <a key={label} href={url} target={url.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" className="pill-outline min-w-[10rem]">
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />} {label}
              </a>
            ))}
          </Reveal>
          <ContactForm profile={profile} />
        </div>

        <div className="wrap mt-28 grid gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <TwoPartHeading a="Frequently Asked" b="Questions" as="h2" size="!text-[clamp(2.3rem,4.8vw,4rem)]" className="text-left" />
            <Reveal as="p" delay={0.1} className="mt-4 text-white/85 sm:text-lg">
              Quick answers about my work and what I’m looking for.
            </Reveal>
          </div>
          <ChatFAQ faqs={faqs} />
        </div>
      </section>
    </>
  );
}
