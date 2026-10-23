import { Quote } from 'lucide-react';
import { Marquee, SectionIntro } from './ui';

/** Hidden until profile.testimonials has real entries. */
export default function Testimonials({ profile }) {
  const items = profile.testimonials.filter((t) => t.quote && t.name);
  if (!items.length) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section">
      <div className="wrap">
        <SectionIntro tag="Testimonials" a="What People," b="Say" id="testimonials-title" line="Words from people I’ve built with." />
      </div>
      <Marquee
        className="mt-12"
        items={items}
        duration={70}
        render={(t) => (
          <figure className="card flex h-full w-[24rem] max-w-[85vw] flex-col overflow-hidden rounded-[1.75rem] whitespace-normal">
            <blockquote className="flex-1 p-7">
              <Quote className="h-6 w-6 text-white/40" aria-hidden="true" />
              <p className="mt-4 text-[0.98rem] text-white/90">{t.quote}</p>
            </blockquote>
            <figcaption className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.02] px-7 py-5">
              <span>
                <span className="block font-medium text-lavender">{t.name}</span>
                <span className="block text-sm text-muted">{t.role}</span>
              </span>
              {t.avatar && <img src={t.avatar} alt="" width="56" height="56" loading="lazy" className="h-14 w-14 rounded-xl object-cover" />}
            </figcaption>
          </figure>
        )}
      />
    </section>
  );
}
