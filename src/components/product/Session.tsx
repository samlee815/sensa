"use client";
import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    h: (
      <>
        Choose a <em>goal.</em>
      </>
    ),
    p: "Tap to choose. Add a few words only if you want to.",
    q: "“That meeting was stressful. I need a break.”",
  },
  {
    h: (
      <>
        Check <em>in.</em>
      </>
    ),
    p: "A short self-report combines with physiological signals. When signals are weak, Sensa says so — and offers a fixed program instead.",
  },
  {
    h: (
      <>
        <em>Begin.</em>
      </>
    ),
    p: "Confirm the duration and a comfortable intensity. Reduce, pause or stop at any time — one tap, always.",
  },
  {
    h: (
      <>
        Say whether it <em>helped.</em>
      </>
    ),
    p: "Did you feel closer to your goal? Was it comfortable? Your history informs the next session as adaptation is validated.",
  },
];

const GOALS = [
  { l: "Calm", c: "#9db4bf" },
  { l: "Sleep", c: "#8e88b8" },
  { l: "Focus", c: "#d9b77e" },
  { l: "Energy", c: "#e0a07c" },
  { l: "Recovery", c: "#9eb09a" },
  { l: "Custom", c: "#efece7" },
];

function Spark({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 200 36" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="#efece7" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Phone({ step }: { step: number }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>●●● ◔</span>
        </div>

        {/* 01 — goal */}
        <div className={`pscreen ${step === 0 ? "is-on" : ""}`}>
          <span className="plabel">New session</span>
          <p className="ptitle">
            How do you want to <em>feel?</em>
          </p>
          <div className="pbubble">That meeting was stressful. I need a break.</div>
          <div className="pgoals">
            {GOALS.map((g, i) => (
              <div className={`pgoal ${i === 0 ? "sel" : ""}`} key={g.l}>
                <i style={{ background: g.c }} />
                {g.l}
              </div>
            ))}
          </div>
          <div className="pcta">Continue</div>
        </div>

        {/* 02 — check in */}
        <div className={`pscreen ${step === 1 ? "is-on" : ""}`}>
          <span className="plabel">Check in · 00:20</span>
          <p className="ptitle">
            Reading your <em>signals</em>
          </p>
          <div className="pmetrics">
            <div className="pmetric">
              <div className="row">
                <span>HRV</span>
                <b>48 ms ↓</b>
              </div>
              <Spark d="M0 18 L20 20 L40 14 L60 22 L80 26 L100 19 L120 24 L140 28 L160 23 L180 27 L200 25" />
            </div>
            <div className="pmetric">
              <div className="row">
                <span>EEG · α / β</span>
                <b>0.62</b>
              </div>
              <Spark d="M0 18 L8 10 L16 26 L24 14 L32 22 L40 8 L48 28 L56 16 L64 20 L72 9 L80 27 L88 15 L96 21 L104 11 L112 25 L120 17 L128 23 L136 12 L144 26 L152 18 L160 20 L168 13 L176 24 L184 16 L192 22 L200 18" />
            </div>
            <div className="pmetric">
              <div className="row">
                <span>Signal quality</span>
                <b>Good contact</b>
              </div>
              <div className="pqual">
                <i />
              </div>
            </div>
          </div>
          <div className="pcta" style={{ marginTop: "auto" }}>
            Suggested · Calm · 8 min
          </div>
        </div>

        {/* 03 — begin */}
        <div className={`pscreen ${step === 2 ? "is-on" : ""}`}>
          <span className="plabel">Calm · in session</span>
          <div className="pring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#9db4bf"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={step === 2 ? 70 : 283}
                style={{ transition: "stroke-dashoffset 2.4s cubic-bezier(.16,1,.3,1)" }}
              />
            </svg>
            <div className="t">
              <div>
                <b>06:12</b>
                <span className="plabel">remaining</span>
              </div>
            </div>
          </div>
          <div className="pslider">
            <div className="row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(239,236,231,.6)" }}>
              <span>Intensity</span>
              <span>2 / 5 · comfortable</span>
            </div>
            <div className="track">
              <i />
            </div>
          </div>
          <div className="pslider">
            <div className="row" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(239,236,231,.6)" }}>
              <span>Sound</span>
              <span>Low tide</span>
            </div>
            <div className="track">
              <i style={{ width: "62%" }} />
            </div>
          </div>
          <div className="pbtns">
            <div>Pause</div>
            <div className="stop">Stop</div>
          </div>
        </div>

        {/* 04 — feedback */}
        <div className={`pscreen ${step === 3 ? "is-on" : ""}`}>
          <span className="plabel">Session complete</span>
          <p className="ptitle">
            Closer to <em>calm?</em>
          </p>
          <div className="pscale">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className={n === 4 ? "sel" : ""}>
                {n}
              </div>
            ))}
          </div>
          <div className="pbeforeafter">
            <div>
              Tension
              <b>7 → 3</b>
            </div>
            <div>
              HRV
              <b>48 → 61</b>
            </div>
          </div>
          <div className="pmetric" style={{ marginBottom: 14 }}>
            <div className="row">
              <span>Comfortable?</span>
              <b>Yes</b>
            </div>
          </div>
          <div className="pcta" style={{ marginTop: "auto" }}>
            Save to history
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Session() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const els = queryAll(root.current!, ".sess-step");
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (s) => {
            if (s.isActive) setStep(i);
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="s-light section-pad" data-theme="light" id="session" ref={root}>
      <div className="wrap">
        <div className="section-head" data-anchor>
          <span className="eyebrow" data-reveal="fade">
            How a session works
          </span>
          <h2 className="h-l" data-reveal="lines">
            One simple choice. <em>A better state of you.</em>
          </h2>
          <p className="lede" data-reveal="fade">
            From choosing a goal to sharing feedback, every step is designed to reduce effort. AI conversation is optional —
            a tap is always enough.
          </p>
        </div>
        <div className="session-grid">
          <div className="phone-col">
            <div className="phone-sticky">
              <Phone step={step} />
            </div>
          </div>
          <div className="session-steps">
            {STEPS.map((s, i) => (
              <div className={`sess-step ${i === step ? "is-on" : ""}`} key={i}>
                <span className="num">0{i + 1}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                {s.q && <blockquote>{s.q}</blockquote>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function queryAll(root: HTMLElement, sel: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(sel));
}
