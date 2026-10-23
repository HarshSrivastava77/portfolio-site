import { useEffect, useRef, useState } from 'react';

/** Easter egg: type "/critic" anywhere (outside form fields). No model involved. */
export default function CriticModal() {
  const ref = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let buf = '';
    let timer;
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag) || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-7);
      if (buf === '/critic') {
        buf = '';
        ref.current?.showModal();
        setScore(0);
        let n = 0;
        clearInterval(timer);
        timer = setInterval(() => {
          n += 1;
          setScore(n);
          if (n >= 9) clearInterval(timer);
        }, 90);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(timer);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      aria-labelledby="critic-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-[#0B0B0C] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-[dialog-in_0.5s_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="p-8">
        <p className="text-sm text-muted">Lens, the critic chain from Atlas. Hand-written here, no model involved.</p>
        <h2 id="critic-title" className="mt-3 text-3xl font-semibold tracking-tight">
          Review of this <span className="h-accent">portfolio</span>
        </h2>
        <p className="mt-4 text-6xl font-bold tabular-nums">
          {score}
          <span className="text-2xl text-muted">/10</span>
        </p>
        <h3 className="mt-6 text-sm font-semibold text-muted">Strengths</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-white/90">
          <li>Every project links to the code behind it.</li>
          <li>Even the contact form asks for approval before it acts.</li>
          <li>Twinkling stars, zero trackers.</li>
        </ul>
        <h3 className="mt-5 text-sm font-semibold text-muted">Improvements</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-white/90">
          <li>Needs more live demos. He knows.</li>
          <li>The missing point is saved for the interview.</li>
        </ul>
        <button type="button" onClick={() => ref.current.close()} className="pill-outline mt-8" autoFocus>
          Close review
        </button>
      </div>
    </dialog>
  );
}
