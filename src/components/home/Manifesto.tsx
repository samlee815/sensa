"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SEGMENTS: { t: string; em?: boolean }[] = [
  { t: "Your mind is ready." },
  { t: "But your body is still stuck in the past.", em: true },
  { t: "Stress, brain fog, burnout and poor recovery come down to one thing — you’re not in the right state. Sensa is an easier way to get there." },
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.to(".manifesto-text .w", {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: ".manifesto-text", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
      });
    },
    { scope: root }
  );

  return (
    <section className="manifesto s-dark" data-theme="dark" ref={root}>
      <div className="wrap">
        <span className="eyebrow" data-reveal="fade" style={{ marginBottom: 40, display: "inline-flex" }}>
          Brand promise
        </span>
        <p className="manifesto-text">
          {SEGMENTS.map((s, i) => {
            const words = s.t.split(" ").map((w, j) => (
              <span className="w" key={j}>
                {w}&nbsp;
              </span>
            ));
            return s.em ? <em key={i}>{words}</em> : <span key={i}>{words}</span>;
          })}
        </p>
        <div className="manifesto-meta" data-reveal="stagger">
          <span className="mono" style={{ color: "var(--muted)" }}>Calm</span>
          <span className="mono" style={{ color: "var(--muted)" }}>Sleep</span>
          <span className="mono" style={{ color: "var(--muted)" }}>Focus</span>
          <span className="mono" style={{ color: "var(--muted)" }}>Connection</span>
          <span className="mono" style={{ color: "var(--muted)" }}>Recovery</span>
        </div>
      </div>
    </section>
  );
}
