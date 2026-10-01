"use client";
import { Fragment } from "react";
import { Check } from "../Icons";

type V = "y" | "p" | "n";
const ROWS: { l: string; v: [V, V, V] }[] = [
  { l: "Reads physiological signals", v: ["y", "n", "y"] },
  { l: "Interprets your state", v: ["y", "p", "y"] },
  { l: "Guides with audio or coaching", v: ["p", "y", "y"] },
  { l: "Acts physically, in the moment", v: ["n", "n", "y"] },
  { l: "Learns what works for you", v: ["p", "p", "y"] },
];

const Mark = ({ v }: { v: V }) => (v === "y" ? <Check /> : v === "p" ? <span className="partial" /> : <span className="dash" />);

export default function Compare() {
  return (
    <section className="s-light section-pad" data-theme="light">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow" data-reveal="fade">
            A new category
          </span>
          <h2 className="h-l" data-reveal="lines">
            From seeing your state <em>to shifting it.</em>
          </h2>
          <p className="lede" data-reveal="fade">
            Wearables help us see our body’s data. The next step is understanding it — and acting on it.
          </p>
        </div>
        <div className="compare" data-reveal="fade">
          <div className="hd" />
          <div className="hd c">Tracking wearables</div>
          <div className="hd c">Guidance apps</div>
          <div className="hd us us-col top">Sensa</div>
          {ROWS.map((r, i) => (
            <Fragment key={r.l}>
              <div className="rowh">{r.l}</div>
              <div className="c">
                <Mark v={r.v[0]} />
              </div>
              <div className="c">
                <Mark v={r.v[1]} />
              </div>
              <div className={`us-col ${i === ROWS.length - 1 ? "bot" : ""}`}>
                <Mark v={r.v[2]} />
              </div>
            </Fragment>
          ))}
        </div>
        <p className="fine" style={{ marginTop: 20 }}>
          Categories summarize typical products in each group. ◐ partial support or external device required. All Sensa
          capabilities shown are in development and require controlled testing.
        </p>
      </div>
    </section>
  );
}
