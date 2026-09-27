"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const LAYERS = [
  {
    n: "03",
    t: "AI interface",
    badge: "Optional",
    p: "Understands natural language, captures context and explains your signals clearly. Short tap-to-answer questions collect the same information without it.",
  },
  {
    n: "02",
    t: "Personalization engine",
    badge: "Rules → learning",
    p: "Uses signals, history and self-reports to suggest when to start, which program to use and how to adjust — within preset limits. Clear, explainable rules first; individual learning as evidence grows.",
  },
  {
    n: "01",
    t: "Neuromodulation hardware",
    badge: "Core",
    p: "Ear-worn hardware delivers stimulation and sound. A local controller caps intensity, duration and rate of change, with weak-signal fallback and one-tap exit.",
  },
];

const FLOW = [
  {
    title: "Inputs & signal quality",
    nodes: [
      { h: "Physiological context", p: "EEG, PPG and personal baselines. Contact quality and movement." },
      { h: "User input", p: "Goal, time, feelings and preferences. Tap to respond; chat optional." },
    ],
  },
  {
    title: "Interpretation & decisions",
    nodes: [
      { h: "Signal processing & state estimation", p: "Manage artifacts. Report confidence, not forced conclusions.", hl: true },
      { h: "Personalization engine", p: "Fixed programs first, personal adaptation next.", hl: true },
      { h: "Local controller", p: "Limits intensity, duration and adjustment rate." },
    ],
  },
  {
    title: "User-controlled delivery",
    nodes: [
      { h: "Ear stimulation + sound", p: "Delivered within the controller’s limits." },
      { h: "Before / after feedback", p: "State and comfort feed the next session." },
    ],
  },
];

const EDGES: [number, number, number, number][] = [
  [0, 0, 1, 0],
  [0, 1, 1, 1],
  [0, 0, 1, 1],
  [1, 0, 2, 0],
  [1, 1, 2, 0],
  [1, 2, 2, 0],
  [1, 1, 2, 1],
];

function Flow() {
  const wrap = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const el = wrap.current!;
    const compute = () => {
      if (window.innerWidth < 860) return setPaths([]);
      const box = el.getBoundingClientRect();
      const cols = Array.from(el.querySelectorAll<HTMLElement>(".flow-col"));
      const node = (c: number, n: number) => cols[c]?.querySelectorAll<HTMLElement>(".flow-node")[n]?.getBoundingClientRect();
      const d = EDGES.map(([c1, n1, c2, n2]) => {
        const a = node(c1, n1);
        const b = node(c2, n2);
        if (!a || !b) return "";
        const x1 = a.right - box.left;
        const y1 = a.top + a.height / 2 - box.top;
        const x2 = b.left - box.left;
        const y2 = b.top + b.height / 2 - box.top;
        const mx = (x1 + x2) / 2;
        return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
      });
      setPaths(d);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flow" ref={wrap}>
      <svg className="flow-svg" width="100%" height="100%">
        {paths.map((d, i) =>
          d ? (
            <g key={i}>
              <path d={d} fill="none" stroke="var(--line)" strokeWidth="1" />
              <path d={d} fill="none" stroke="rgba(157,180,191,.7)" strokeWidth="1" strokeDasharray="4 10" className="flow-dash" />
              <circle r="3" fill="#9db4bf">
                <animateMotion dur={`${2.6 + (i % 3) * 0.6}s`} repeatCount="indefinite" path={d} begin={`${i * 0.35}s`} />
              </circle>
            </g>
          ) : null
        )}
      </svg>
      <div className="flow-cols">
        {FLOW.map((col) => (
          <div className="flow-col" key={col.title} data-reveal="stagger">
            <span className="mono">{col.title}</span>
            {col.nodes.map((n) => (
              <div className={`flow-node ${"hl" in n && n.hl ? "hl" : ""}`} key={n.h}>
                <h5>{n.h}</h5>
                <p>{n.p}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flow-guard" data-reveal="fade">
        <span className="mono" style={{ color: "var(--fg)" }}>
          Privacy & governance throughout
        </span>
        <span>Deletable, consent-based memory</span>
        <span>Contact and intensity limits</span>
        <span>One-tap stop</span>
        <span>Fallback for poor signals</span>
      </div>
    </div>
  );
}

export default function Architecture() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  const hovering = useRef(false);

  useGSAP(
    () => {
      const planes = gsap.utils.toArray<HTMLElement>(".plane");
      // Exploded view opens as the stack scrolls through the viewport
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".stack", start: "top 85%", end: "bottom 35%", scrub: 1 },
      });
      planes.forEach((p, i) => {
        tl.fromTo(p, { z: i * 18 }, { z: i * 120 }, 0);
      });
      tl.fromTo(".stack-inner", { rotateZ: -30 }, { rotateZ: -42 }, 0);
      ScrollTrigger.create({
        trigger: ".stack",
        start: "top 60%",
        end: "bottom 40%",
        onUpdate: (s) => {
          if (hovering.current) return;
          const idx = 2 - Math.min(2, Math.floor(s.progress * 3 * 0.999));
          setActive(idx);
        },
      });
    },
    { scope: root }
  );

  // planes are ordered bottom→top (hardware, engine, AI) but the list is top→bottom
  const planeIdx = (listIdx: number) => 2 - listIdx;

  return (
    <section className="arch s-dark section-pad" data-theme="dark" id="system" ref={root}>
      <div className="wrap">
        <div className="section-head tight" data-anchor>
          <span className="eyebrow" data-reveal="fade">
            System architecture
          </span>
          <h2 className="h-l" data-reveal="lines">
            Three layers. <em>One quiet system.</em>
          </h2>
          <p className="lede" data-reveal="fade">
            Hardware delivers the experience. A personal engine makes decisions. An optional AI conversation adds context.
          </p>
        </div>

        <div className="arch-grid">
          <div className="stack" data-reveal="fade">
            <div className="stack-inner">
              {[0, 1, 2].map((pi) => {
                const listIdx = 2 - pi;
                const on = active === listIdx;
                return (
                  <div
                    key={pi}
                    className={`plane p${pi + 1} ${on ? "is-on" : ""}`}
                    onMouseEnter={() => {
                      hovering.current = true;
                      setActive(listIdx);
                    }}
                    onMouseLeave={() => (hovering.current = false)}
                  >
                    <div className="pgrid" />
                    <span className="plabel3d">
                      {LAYERS[listIdx].n} · {LAYERS[listIdx].t}
                    </span>
                    {pi === 0 && (
                      <>
                        <span className="node" style={{ left: "14%", top: "36%" }} />
                        <span className="node" style={{ left: "44%", top: "52%", width: "30%" }} />
                        <span className="chipdot" style={{ left: "24%", top: "70%" }} />
                        <span className="chipdot" style={{ left: "70%", top: "30%" }} />
                        <span className="chipdot" style={{ left: "82%", top: "80%" }} />
                      </>
                    )}
                    {pi === 1 && (
                      <>
                        <span className="chipdot" style={{ left: "30%", top: "40%" }} />
                        <span className="chipdot" style={{ left: "55%", top: "55%" }} />
                        <span className="chipdot" style={{ left: "72%", top: "35%" }} />
                        <span className="chipdot" style={{ left: "40%", top: "72%" }} />
                        <span className="node" style={{ left: "52%", top: "46%", width: "10%", height: "18%", borderRadius: 999 }} />
                      </>
                    )}
                    {pi === 2 && (
                      <span
                        className="node"
                        style={{ left: "18%", top: "40%", width: "46%", height: "26%", borderRadius: "22px 22px 22px 6px" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="layers">
            {LAYERS.map((l, i) => (
              <div
                key={l.n}
                className={`layer-item ${active === i ? "is-on" : ""}`}
                onMouseEnter={() => {
                  hovering.current = true;
                  setActive(i);
                }}
                onMouseLeave={() => (hovering.current = false)}
                onClick={() => setActive(i)}
                data-plane={planeIdx(i)}
              >
                <div className="top">
                  <h3>
                    <span className="num">{l.n}</span>
                    <span className="t">{l.t}</span>
                  </h3>
                  <span className="badge">{l.badge}</span>
                </div>
                <div className="body-wrap">
                  <div>
                    <p>{l.p}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="arch-quote">
          <p data-reveal="lines">
            The AI talks. <em>The controller decides.</em>
          </p>
          <p className="fine" style={{ marginTop: 20 }} data-reveal="fade">
            Language models never directly control stimulation. The engine and local controller govern every parameter.
          </p>
        </div>

        <Flow />
      </div>
    </section>
  );
}
