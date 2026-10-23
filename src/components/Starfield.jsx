import { useEffect, useRef } from 'react';

/**
 * Full-screen starfield on one <canvas>: twinkling, slowly drifting stars with
 * cursor + scroll parallax and an occasional shooting star.
 * Pauses when the tab is hidden; draws a single still frame with reduced motion.
 */
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1, stars = [], raf = 0, running = true;
    let mx = 0, my = 0, px = 0, py = 0;
    let shoot = null, nextShoot = performance.now() + 3000 + Math.random() * 4000;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(260, Math.round((w * h) / 6500));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.85 ? 0.4 + Math.random() * 0.8 : 1.1 + Math.random() * 0.9,
        a: 0.25 + Math.random() * 0.65,
        tw: 0.6 + Math.random() * 1.8, // twinkle speed
        ph: Math.random() * Math.PI * 2,
        z: 0.2 + Math.random() * 0.8, // depth for parallax
        vx: (Math.random() - 0.5) * 0.04,
        vy: 0.01 + Math.random() * 0.03,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      px += (mx - px) * 0.04;
      py += (my - py) * 0.04;
      const sy = window.scrollY * 0.04;
      for (const s of stars) {
        if (!reduce) {
          s.x += s.vx * s.z;
          s.y += s.vy * s.z;
        }
        const x = (((s.x + px * 14 * s.z) % w) + w) % w;
        const y = (((s.y - sy * s.z * 4 + py * 14 * s.z) % h) + h) % h;
        const alpha = reduce ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * 0.001 * s.tw + s.ph));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Shooting star
      if (!reduce) {
        if (!shoot && t > nextShoot) {
          shoot = { x: Math.random() * w * 0.7 + w * 0.15, y: Math.random() * h * 0.35, life: 0 };
        }
        if (shoot) {
          shoot.life += 1;
          const p = shoot.life / 55;
          const len = 120;
          const x = shoot.x + p * 420, y = shoot.y + p * 180;
          const g = ctx.createLinearGradient(x, y, x - len, y - len * 0.43);
          g.addColorStop(0, 'rgba(255,255,255,0.9)');
          g.addColorStop(1, 'rgba(229,168,245,0)');
          ctx.globalAlpha = Math.sin(Math.PI * Math.min(p, 1));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - len, y - len * 0.43);
          ctx.stroke();
          if (p >= 1) {
            shoot = null;
            nextShoot = t + 5000 + Math.random() * 7000;
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      mx = e.clientX / w - 0.5;
      my = e.clientY / h - 0.5;
    };
    const onVis = () => {
      running = !document.hidden && !reduce;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };
    const onResize = () => {
      build();
      if (reduce) draw(0);
    };

    build();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
