"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useInView } from "@/lib/useInView";

const SignalField = dynamic(() => import("../three/SignalField"), { ssr: false });

const STEPS = [
  { h: "Sense", p: "Ear-worn EEG and PPG read brain and pulse signals, combined with a quick note on how you feel." },
  { h: "Choose", p: "Pick a target state. Sensa offers an informed suggestion — the choice is always yours." },
  { h: "Shift", p: "Gentle ear stimulation and adaptive sound begin, with the change shown in real time." },
  { h: "Learn", p: "Before-and-after signals and your feedback shape the next session." },
];
const MODES = ["Sensing", "Choosing", "Shifting", "Learning"];

export default function Signal() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const active = useInView(root, "0px");
  const cohRef = useRef<HTMLElement>(null);
  const qRef = useRef<HTMLElement>(null);
  const modeRef = useRef<HTMLElement>(null);
  const hzRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>(".sstep");
      const bars = gsap.utils.toArray<HTMLElement>(".sstep .prog");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (s) => {
          const p = s.progress;
          const sweep = gsap.utils.clamp(0, 1, (p - 0.06) / 0.84);
          progress.current = sweep;
          const idx = Math.min(3, Math.floor(p * 4));
          steps.forEach((el, i) => el.classList.toggle("is-on", i <= idx));
          bars.forEach((b, i) => {
            const local = gsap.utils.clamp(0, 1, p * 4 - i);
            b.style.transform = `scaleX(${local})`;
          });
          if (cohRef.current) cohRef.current.textContent = `${Math.round(12 + sweep * 79)}%`;
          if (qRef.current) qRef.current.textContent = (0.71 + Math.min(p * 1.6, 1) * 0.23).toFixed(2);
          if (modeRef.current && modeRef.current.textContent !== MODES[idx]) modeRef.current.textContent = MODES[idx];
          if (hzRef.current) hzRef.current.textContent = `${(19.4 - sweep * 9.2).toFixed(1)} Hz`;
        },
      });
    },
    { scope: root }
  );

  return (
    <section className="signal s-dark" data-theme="dark" ref={root}>
      <div className="signal-sticky">
        <div className="signal-canvas">
          <SignalField progress={progress} active={active} />
        </div>
        <div className="signal-vignette" />
        <div className="signal-top">
          <div className="wrap">
            <div style={{ display: "grid", gap: 24 }}>
              <span className="eyebrow" data-reveal="fade">
                From data to change
              </span>
              <h2 className="h-l" data-reveal="lines">
                Wearables show you the data. <em>Sensa helps you act on it.</em>
              </h2>
            </div>
            <div className="signal-hud" data-reveal="stagger">
              <div className="hud-row">
                Mode <b ref={modeRef}>Sensing</b>
              </div>
              <div className="hud-row">
                Coherence <b ref={cohRef}>12%</b>
              </div>
              <div className="hud-row">
                Dominant band <b ref={hzRef}>19.4 Hz</b>
              </div>
              <div className="hud-row">
                Signal quality <b ref={qRef}>0.71</b>
              </div>
            </div>
          </div>
        </div>
        <div className="signal-steps">
          <div className="wrap">
            {STEPS.map((s, i) => (
              <div className={`sstep ${i === 0 ? "is-on" : ""}`} key={s.h}>
                <i className="prog" />
                <span className="num">0{i + 1}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
