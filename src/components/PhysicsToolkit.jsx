import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { RotateCcw } from 'lucide-react';
import { ToolTile } from './ToolTile';

const { Engine, Bodies, Body, Composite, Constraint } = Matter;

/**
 * Toolkit playground: icon tiles drop in with gravity when the box scrolls into view,
 * bounce off the walls, and can be dragged and thrown (mouse and touch).
 * Matter.js runs the physics; tiles are plain DOM elements moved with transforms.
 */
export default function PhysicsToolkit({ tools }) {
  const box = useRef(null);
  const tiles = useRef([]);
  const api = useRef({});

  useEffect(() => {
    const el = box.current;
    const engine = Engine.create({ gravity: { x: 0, y: 1 } });
    const small = el.clientWidth < 560;
    const S = small ? 48 : 64;
    let W = el.clientWidth, H = el.clientHeight;
    let walls = [];
    let raf = 0, running = false, started = false, last = 0;

    const makeWalls = () => {
      Composite.remove(engine.world, walls);
      const t = 200;
      walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2 - 1000, t, H + 4000, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2 - 1000, t, H + 4000, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);
    };

    const bodies = tools.map(() =>
      Bodies.rectangle(0, -9999, S, S, { chamfer: { radius: S * 0.26 }, restitution: 0.5, friction: 0.08, frictionAir: 0.012, density: 0.002 }),
    );

    const drop = () => {
      bodies.forEach((b, i) => {
        Body.setPosition(b, { x: S + Math.random() * (W - 2 * S), y: -80 - i * 55 - Math.random() * 80 });
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: 0 });
        Body.setAngle(b, (Math.random() - 0.5) * 1.2);
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.2);
      });
    };

    const paint = () => {
      bodies.forEach((b, i) => {
        const t = tiles.current[i];
        if (t) t.style.transform = `translate(${b.position.x - S / 2}px, ${b.position.y - S / 2}px) rotate(${b.angle}rad)`;
      });
    };

    const loop = (t) => {
      const dt = Math.min(1000 / 30, t - last || 16.7);
      last = t;
      Engine.update(engine, dt);
      paint();
      if (running) raf = requestAnimationFrame(loop);
    };

    makeWalls();
    Composite.add(engine.world, bodies);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!started) {
          started = true;
          drop();
        }
        if (!running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.35 });
    io.observe(el);

    const ro = new ResizeObserver(() => {
      W = el.clientWidth;
      H = el.clientHeight;
      makeWalls();
      bodies.forEach((b) => b.position.x > W - S / 2 && Body.setPosition(b, { x: W - S, y: b.position.y }));
    });
    ro.observe(el);

    // Dragging: attach a spring between the pointer and the grabbed tile.
    let grab = null;
    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    api.current.down = (i, e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const p = local(e);
      const b = bodies[i];
      grab = Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness: 0.18, damping: 0.08, length: 0 });
      Composite.add(engine.world, grab);
    };
    const move = (e) => grab && (grab.pointA = local(e));
    const up = () => {
      if (grab) Composite.remove(engine.world, grab);
      grab = null;
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    api.current.shake = drop;
    api.current.size = S;

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      Engine.clear(engine);
    };
  }, [tools]);

  const S = typeof window !== 'undefined' && window.innerWidth < 560 ? 48 : 64;

  return (
    <div ref={box} className="absolute inset-0" role="group" aria-label="My toolkit: draggable tool icons">
      <ul>
        {tools.map((t, i) => (
          <li
            key={t.label}
            ref={(n) => (tiles.current[i] = n)}
            className="absolute left-0 top-0 cursor-grab touch-none select-none will-change-transform active:cursor-grabbing"
            style={{ transform: 'translate(-200px,-200px)' }}
            onPointerDown={(e) => api.current.down?.(i, e)}
          >
            <ToolTile tool={t} size={S} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => api.current.shake?.()}
        className="absolute bottom-4 right-4 z-10 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 text-sm text-white/85 backdrop-blur hover:bg-white/10"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Shake
      </button>
    </div>
  );
}
