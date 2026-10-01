"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { STATES } from "@/lib/states";
import { useInView } from "@/lib/useInView";

const AUTO_MS = 7;

export default function StateSelector() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const inView = useInView(root, "0px");
  const waveTarget = useRef(STATES[0].wave);
  const first = useRef(true);
  const s = STATES[idx];

  // Content + image transition
  useGSAP(
    () => {
      waveTarget.current = s.wave;
      root.current!.style.setProperty("--accent", s.color);
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.fromTo(
        ".state-swap",
        { y: 28, autoAlpha: 0, filter: "blur(8px)" },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.06 }
      );
      const layers = gsap.utils.toArray<HTMLElement>(".state-visual .layer");
      layers.forEach((l, i) => {
        if (i === idx) {
          gsap.set(l, { zIndex: 1 });
          gsap.fromTo(l, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" });
        } else {
          gsap.set(l, { zIndex: 0 });
          gsap.to(l, { autoAlpha: 0, duration: 1.2, delay: 0.2, ease: "power2.out" });
        }
      });
      gsap.fromTo(".intensity i", { scaleY: 0.3 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.8, stagger: 0.04, ease: "expo.out" });
    },
    { scope: root, dependencies: [idx] }
  );

  // Auto-advance with a visible timer on the active tab
  useGSAP(
    () => {
      if (!auto || !inView) return;
      const bar = root.current!.querySelector<HTMLElement>(`.state-tab[data-i='${idx}'] .timer`);
      if (!bar) return;
      const tw = gsap.fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, duration: AUTO_MS, ease: "none", onComplete: () => setIdx((i) => (i + 1) % STATES.length) }
      );
      return () => {
        tw.kill();
        gsap.set(bar, { scaleX: 0 });
      };
    },
    { scope: root, dependencies: [idx, auto, inView] }
  );

  // Live waveform
  useEffect(() => {
    if (!inView) return;
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const cur = { ...waveTarget.current };
    let raf = 0;
    const t0 = performance.now();
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const tgt = waveTarget.current;
      (Object.keys(cur) as (keyof typeof cur)[]).forEach((k) => (cur[k] += (tgt[k] - cur[k]) * 0.04));
      const t = (performance.now() - t0) / 1000;
      const breathe = 1 - cur.breathe * 0.5 * (1 + Math.sin(t * 0.7));
      const mid = h * 0.55;
      const lines = [
        { a: 0.95, lw: 1.6, ph: 0 },
        { a: 0.35, lw: 1, ph: 0.6 },
        { a: 0.18, lw: 1, ph: 1.3 },
      ];
      lines.forEach((L, li) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const u = x / w;
          const env = Math.sin(Math.PI * u) ** 1.4;
          const base = Math.sin(u * Math.PI * 2 * cur.freq * 2 + t * cur.speed * 2 + L.ph);
          const harm = Math.sin(u * Math.PI * 2 * cur.freq * 6 + t * cur.speed * 3.1 + L.ph * 2) * cur.harmonic;
          const y = mid - (base + harm) * cur.amp * h * 0.42 * env * breathe * (1 - li * 0.12);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(239,236,231,${L.a})`;
        ctx.lineWidth = L.lw;
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const pick = (i: number) => {
    setAuto(false);
    setIdx(i);
  };

  return (
    <section className="states s-light section-pad" data-theme="light" id="states" ref={root}>
      <div className="states-glow" />
      <div className="wrap" style={{ position: "relative" }}>
        <div className="states-top" data-anchor>
          <div className="section-head tight">
            <span className="eyebrow" data-reveal="fade">
              Choose your state
            </span>
            <h2 className="h-l" data-reveal="lines">
              One body. <em>A different state.</em>
            </h2>
            <p className="lede" data-reveal="fade">
              Tell Sensa where you want to be. It responds within limits you control — and you can pause or stop at any
              moment.
            </p>
          </div>
          <div className="state-tabs" role="tablist" data-reveal="fade">
            {STATES.map((st, i) => (
              <button
                key={st.key}
                role="tab"
                aria-selected={i === idx}
                data-i={i}
                className={`state-tab ${i === idx ? "is-active" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="fill" />
                <span className="dot" style={{ background: st.color }} />
                {st.label}
                <span className="timer" />
              </button>
            ))}
          </div>
        </div>

        <div className="state-stage">
          <div className="frame state-visual" data-reveal="img">
            {STATES.map((st, i) => (
              <div className={`layer ${i === idx ? "is-active" : ""}`} key={st.key}>
                <Image src={st.image} alt="" fill sizes="(max-width: 960px) 100vw, 55vw" style={{ objectFit: "cover" }} />
              </div>
            ))}
            <canvas ref={canvas} className="state-wave" />
            <div className="state-hudtop mono">
              <span>Live preview</span>
              <span>{s.band}</span>
            </div>
            <div className="state-prompt state-swap">{s.prompt}</div>
          </div>

          <div className="state-info" data-reveal="fade">
            <div>
              <span className="mono state-swap" style={{ color: "var(--muted)", display: "block" }}>
                Target state · 0{idx + 1}/0{STATES.length}
              </span>
              <h3 className="state-name state-swap" style={{ marginTop: 20 }}>
                {s.label}
              </h3>
              <p className="state-line state-swap">{s.line}</p>
              <p className="state-detail state-swap">{s.detail}</p>
            </div>
            <div className="state-specs">
              <div className="state-swap">
                <b>{s.minutes} min</b>
                <span>Session</span>
              </div>
              <div className="state-swap">
                <div className="intensity" aria-label={`Intensity ${s.intensity} of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <i key={n} className={n <= s.intensity ? "on" : ""} style={{ height: 6 + n * 4 }} />
                  ))}
                </div>
                <span>Intensity</span>
              </div>
              <div className="state-swap">
                <b>1 tap</b>
                <span>Pause / stop</span>
              </div>
            </div>
          </div>
        </div>
        <p className="fine" style={{ marginTop: 20 }}>
          Illustrative programs. Session lengths and intensities are planned and will be refined through user testing.
        </p>
      </div>
    </section>
  );
}
