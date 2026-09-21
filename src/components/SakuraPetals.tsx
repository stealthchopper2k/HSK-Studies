import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  s: number;
  r: number;
  spin: number;
  drift: number;
  speed: number;
  hue: number;
};

export function SakuraPetals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    const petals: Petal[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const spawn = (y = Math.random() * h) => {
      petals.push({
        x: Math.random() * w,
        y,
        s: (8 + Math.random() * 12) * devicePixelRatio,
        r: Math.random() * Math.PI * 2,
        spin: 0.008 + Math.random() * 0.02,
        drift: 0.4 + Math.random() * 0.9,
        speed: 0.35 + Math.random() * 0.85,
        hue: 340 + Math.random() * 18,
      });
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(p.s / 10, p.s / 14);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(6, -8, 14, -4, 0, 16);
      ctx.bezierCurveTo(-14, -4, -6, -8, 0, 0);
      const g = ctx.createLinearGradient(0, -8, 0, 16);
      g.addColorStop(0, `hsla(${p.hue}, 80%, 92%, 0.95)`);
      g.addColorStop(0.55, `hsla(${p.hue}, 72%, 78%, 0.85)`);
      g.addColorStop(1, `hsla(${p.hue}, 60%, 70%, 0.55)`);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    };

    resize();
    const count = Math.min(56, Math.floor((window.innerWidth * window.innerHeight) / 18000) + 22);
    for (let i = 0; i < count; i++) spawn(Math.random() * h);

    let raf = 0;
    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.y += p.speed * devicePixelRatio;
        p.x += Math.sin(frame * 0.01 + p.drift * 4) * p.drift * devicePixelRatio;
        p.r += p.spin;
        if (p.y > h + 40) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        drawPetal(p);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="petals" ref={ref} aria-hidden="true" />;
}
