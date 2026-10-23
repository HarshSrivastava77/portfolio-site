// One motion language for the whole site.
export const EASE = [0.22, 1, 0.36, 1];

// Blur + fade + rise, used by every scroll reveal.
export const rise = {
  hidden: { opacity: 0, y: 28, filter: 'blur(12px)' },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const word = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};
