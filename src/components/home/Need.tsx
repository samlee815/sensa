"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS = [
  { v: "50", tag: "Stress & tension", text: "of U.S. employees report feeling stressed every day.", src: "Gallup, 3-yr average through 2025", answer: "More composure when it matters." },
  { v: "31", tag: "Emotional exhaustion", text: "of workers feel emotionally exhausted by work stress.", src: "APA Work in America, 2023", answer: "Let go when the work is done." },
  { v: "26", tag: "Engagement", text: "lacked the motivation to do their best because of work.", src: "APA, 2023", answer: "Feel ready to engage." },
  { v: "30.5", tag: "Rest & recovery", text: "of U.S. adults average less than seven hours of sleep.", src: "CDC / NCHS, 2026", answer: "Start the day feeling ready." },
];

export default function Need() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat-bar i").forEach((el) => {
        gsap.to(el, {
          scaleX: parseFloat(el.dataset.v || "0") / 100,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="s-dark section-pad" data-theme="dark" ref={root} style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="need-head">
          <h2 className="h-l" data-reveal="lines">
            Life moves forward<span className="pd">.</span> <em>Your body needs to catch up.</em>
          </h2>
          <p className="lede" data-reveal="fade" style={{ justifySelf: "end" }}>
            Different pressures, the same result. The moments that matter most arrive before your body is ready for
            them.
          </p>
        </div>
        <div className="stats">
          {STATS.map((s, i) => (
            <div className="stat" key={s.tag}>
              <span className="mono" style={{ color: "var(--muted)" }} data-reveal="fade" data-delay={String(i * 0.08)}>
                0{i + 1} — {s.tag}
              </span>
              <div className="stat-num">
                <span data-count={s.v} data-delay={String(i * 0.08)}>
                  {s.v}
                </span>
                <sup>%</sup>
              </div>
              <div className="stat-bar">
                <i data-v={s.v} />
              </div>
              <div data-reveal="fade" data-delay={String(0.2 + i * 0.08)} style={{ display: "grid", gap: 14 }}>
                <h4>{s.text}</h4>
                <p className="fine">{s.src}</p>
                <p className="answer">{s.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="need-close">
          <p className="need-quote" data-reveal="lines">
            “I am not in the right state.”
          </p>
          <p className="lede" data-reveal="fade">
            Stress, brain fog, burnout and poor recovery share one root. Sensa lets you move into the state you want —
            with less effort and no special setting.
          </p>
        </div>
      </div>
    </section>
  );
}
