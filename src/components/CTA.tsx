"use client";
import Image from "next/image";
import Waitlist from "./Waitlist";

export default function CTA() {
  return (
    <section className="cta s-dark" data-theme="dark" id="waitlist">
      <div className="cta-bg">
        <div data-parallax="0.12" style={{ position: "absolute", inset: 0 }}>
          <Image src="/img/stones.webp" alt="Sensa — in tune always" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
      </div>
      <div className="wrap cta-inner">
        <div className="cta-row">
          <div style={{ display: "grid", gap: 24 }}>
            <span className="eyebrow" data-reveal="fade">
              Waitlist open · U.S.
            </span>
            <h2 className="h-xl" data-reveal="lines">
              Be first to feel it<span className="pd">.</span>
            </h2>
          </div>
          <div data-reveal="fade" data-delay="0.2">
            <Waitlist />
          </div>
        </div>
      </div>
    </section>
  );
}
