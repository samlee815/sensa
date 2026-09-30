"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Cross } from "../Icons";

const NOTS = [
  "A daily breathing or meditation practice",
  "Over-the-counter sleep or focus aids",
  "A quiet room or special setting",
];

export default function Easier() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".not s").forEach((el, i) => {
        gsap.fromTo(
          el,
          { "--strike": "0%" },
          {
            "--strike": "100%",
            duration: 1.2,
            delay: 0.3 + i * 0.18,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section className="s-light section-pad" data-theme="light" ref={root} style={{ paddingTop: 0 }}>
      <div className="wrap">
        <hr className="rule" data-reveal="line" style={{ marginBottom: "clamp(80px, 10vw, 160px)" }} />
        <div className="easier-grid">
          <div>
            <span className="eyebrow" data-reveal="fade">
              An easier way to begin
            </span>
            <p className="big-min" data-reveal="fade" data-delay="0.1" style={{ marginTop: 32 }}>
              5–10<small>min</small>
            </p>
            <p className="lede" data-reveal="fade" data-delay="0.2" style={{ marginTop: 24 }}>
              One simple choice. A better state of you — designed to fit between the meeting and the moment that
              matters.
            </p>
          </div>
          <div>
            <h2 className="h-m" data-reveal="lines">
              What you won’t need<span className="pd">.</span>
            </h2>
            <div className="nots">
              {NOTS.map((n) => (
                <div className="not" key={n} data-reveal="fade">
                  <Cross />
                  <s>{n}</s>
                </div>
              ))}
            </div>
            <p className="fine" style={{ marginTop: 20 }}>
              Planned interaction and duration, not established effects. AI conversation is always optional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
