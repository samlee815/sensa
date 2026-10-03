"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const PARTS = [
  {
    code: "E1",
    h: "Ear stimulation + sound",
    p: "Skin-contact electrodes at the concha deliver gentle electrical stimulation to the auricular branch of the vagus nerve, while sound supports regulation. Each runs on its own control logic.",
    tags: ["Concha electrode", "taVNS", "Adaptive audio"],
    label: "Concha electrode",
    spot: { x: 62, y: 50 },
    left: false,
  },
  {
    code: "E2",
    h: "EEG / PPG sensing",
    p: "The ear tip carries the sensing: brain-activity references (EEG) and pulse variability (PPG) are read inside the ear canal. Contact and motion are checked continuously — Sensa reports confidence, never forced conclusions.",
    tags: ["In-ear EEG", "PPG · HRV", "Contact quality"],
    label: "Ear-tip sensors",
    spot: { x: 23, y: 56 },
    left: false,
  },
  {
    code: "E3",
    h: "One sculpted form",
    p: "A single sculpted earpiece, with a soft fin that settles against the ridge of the ear to hold it steady. Weight and battery are designed for all-day wear — comfort and stable contact come first.",
    tags: ["Stabilizer fin", "Everyday wear", "One piece"],
    label: "Stabilizer fin",
    spot: { x: 75, y: 25 },
    left: true,
  },
];

export default function Anatomy() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const img = root.current!.querySelector<HTMLElement>(".anatomy-visual .frame img");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (s) => {
          const i = Math.min(PARTS.length - 1, Math.floor(s.progress * PARTS.length * 0.999));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
      gsap.fromTo(
        ".anatomy-visual",
        { scale: 0.92 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      );
      if (img) img.style.transformOrigin = `${PARTS[0].spot.x}% ${PARTS[0].spot.y}%`;
    },
    { scope: root }
  );

  const spot = PARTS[active].spot;

  return (
    <section className="anatomy s-dark" data-theme="dark" id="anatomy" ref={root}>
      <div className="anatomy-sticky">
        <div className="anatomy-meta">
          <div className="wrap mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--faint)" }}>
            <span>Device concept</span>
            <span>
              0{active + 1} / 0{PARTS.length}
            </span>
          </div>
        </div>
        <div className="wrap">
          <div className="anatomy-grid">
            <div style={{ display: "grid", gap: 40 }}>
              <div className="section-head" style={{ gap: 20 }}>
                <span className="eyebrow" data-reveal="fade">
                  Anatomy
                </span>
                <h2 className="h-m" data-reveal="lines">
                  Everything in <em>one earpiece.</em>
                </h2>
              </div>
              <div className="anatomy-list">
                {PARTS.map((p, i) => (
                  <div className={`aitem ${i === active ? "is-on" : ""}`} key={p.code}>
                    <div className="top">
                      <span className="num">{p.code}</span>
                      <h3>{p.h}</h3>
                    </div>
                    <div className="body-wrap">
                      <div>
                        <p>{p.p}</p>
                        <div className="tags">
                          {p.tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="anatomy-visual">
              <div className="frame">
                <Image
                  src="/img/product-bud-c.webp"
                  alt="Sensa C / Connected earpiece"
                  fill
                  sizes="(max-width: 960px) 80vw, 40vw"
                  style={{ objectFit: "contain", transformOrigin: `${spot.x}% ${spot.y}%`, transform: `scale(${1.08 + active * 0.04})` }}
                />
              </div>
              {PARTS.map((p, i) => (
                <div
                  key={p.code}
                  className={`hotspot ${i === active ? "is-on" : ""} ${p.left ? "left" : ""}`}
                  style={{ left: `${p.spot.x}%`, top: `${p.spot.y}%` }}
                >
                  <span className="dot" />
                  <span className="tag">
                    {p.code} · {p.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
