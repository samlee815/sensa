"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const TILES = [
  {
    h: "One-tap stop",
    p: "Reduce, pause or stop at any moment. Exiting is always a single tap — no confirmation, no delay.",
    icon: (
      <svg className="icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="28" cy="28" r="26" />
        <rect x="20" y="20" width="16" height="16" rx="3" />
      </svg>
    ),
  },
  {
    h: "Hard limits",
    p: "A local controller caps intensity, duration and how fast anything can change — independent of software above it.",
    icon: (
      <svg className="icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 40 C14 40 14 16 24 16 S34 40 44 40" />
        <path d="M4 12 H52" strokeDasharray="3 3" />
        <path d="M4 48 H52" />
      </svg>
    ),
  },
  {
    h: "Weak-signal fallback",
    p: "If contact or signal quality drops, Sensa tells you — and switches to a fixed, well-understood program.",
    icon: (
      <svg className="icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 28 L12 28 L16 18 L22 38 L26 28 L30 28" />
        <path d="M30 28 C36 22 40 22 44 28 S50 34 52 28" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    h: "Your data, your consent",
    p: "Memory is consent-based and deletable. Health and state information is shared only if you choose to share it.",
    icon: (
      <svg className="icon" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="12" y="24" width="32" height="26" rx="6" />
        <path d="M19 24 V17 a9 9 0 0 1 18 0 V24" />
        <circle cx="28" cy="37" r="3" />
      </svg>
    ),
  },
];

export default function Control() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<SVGElement>(".ctile svg.icon").forEach((svg) => {
        const parts = svg.querySelectorAll<SVGGeometryElement>("path, circle, rect");
        parts.forEach((el) => {
          const len = el.getTotalLength();
          gsap.fromTo(
            el,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 2,
              ease: "expo.inOut",
              scrollTrigger: { trigger: svg, start: "top 90%", once: true },
              onComplete: () => {
                el.style.strokeDasharray = el.getAttribute("stroke-dasharray") || "";
              },
            }
          );
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="s-dark section-pad" data-theme="dark" id="control" ref={root} style={{ paddingTop: 0 }}>
      <div className="wrap">
        <hr className="rule" data-reveal="line" style={{ marginBottom: "clamp(80px, 10vw, 160px)" }} />
        <div className="section-head" data-anchor>
          <span className="eyebrow" data-reveal="fade">
            Safety & control
          </span>
          <h2 className="h-l" data-reveal="lines">
            You are always <em>in control.</em>
          </h2>
          <p className="lede" data-reveal="fade">
            Stimulation limits, EEG measurement and study protocols are reviewed with clinical advisors in neurology.
            Comfort and safety come before everything else.
          </p>
        </div>
        <div className="control-grid" data-reveal="stagger">
          {TILES.map((t) => (
            <div className="ctile" key={t.h}>
              {t.icon}
              <div>
                <h4>{t.h}</h4>
                <p>{t.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
