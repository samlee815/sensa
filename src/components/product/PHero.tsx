"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import Button from "../Button";

const TICKS = Array.from({ length: 120 }, (_, i) => i);

export default function PHero() {
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set("[data-reveal='intro']", { visibility: "visible" });
      const split = SplitText.create(".phero-bottom .h-xl", { type: "lines", mask: "lines", linesClass: "split-line" });
      // Chapter opener: plays as the section scrolls into view
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } })
          .from(".phero-product", { autoAlpha: 0, scale: 0.86, y: 40, duration: 2.4, ease: "expo.out" }, 0)
          .from(".phero-letter", { autoAlpha: 0, scale: 1.15, duration: 2.6, ease: "expo.out" }, 0)
          .from(".phero-rings circle, .phero-rings g", { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%", duration: 2, ease: "expo.out", stagger: 0.08 }, 0.1)
          .from(split.lines, { yPercent: 115, duration: 1.5, ease: "expo.out", stagger: 0.1 }, 0.4)
          .from(".phero-top .mono, .phero-side > *", { autoAlpha: 0, y: 20, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.6);

      // Scroll: product drifts up and recedes, rings spread
      gsap.to(".phero-product", {
        yPercent: -30,
        scale: 0.9,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".phero-rings", {
        scale: 1.35,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".phero-letter", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => split.revert();
    },
    { scope: root }
  );

  useEffect(() => {
    const el = tilt.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 1.2, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 1.2, ease: "power3" });
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      ry(x * 18);
      rx(-y * 14);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section className="phero s-dark" data-theme="dark" id="technology" ref={root}>
      <div className="phero-bg" />
      <div className="phero-glow" aria-hidden />
      <div className="phero-letter" aria-hidden>
        C
      </div>
      <div className="phero-rings" aria-hidden>
        <svg viewBox="-100 -100 200 200">
          <circle r="96" fill="none" stroke="rgba(239,236,231,.1)" strokeWidth="0.15" />
          <circle r="74" fill="none" stroke="rgba(239,236,231,.14)" strokeWidth="0.15" strokeDasharray="0.6 1.4" />
          <g className="phero-tickring">
            {TICKS.map((i) => (
              <line
                key={i}
                x1="0"
                y1={-86}
                x2="0"
                y2={i % 10 === 0 ? -83 : -84.8}
                stroke={i % 10 === 0 ? "rgba(239,236,231,.45)" : "rgba(239,236,231,.16)"}
                strokeWidth="0.2"
                transform={`rotate(${i * 3})`}
              />
            ))}
          </g>
          <circle r="86" fill="none" stroke="rgba(157,180,191,.5)" strokeWidth="0.25" strokeDasharray="18 522" className="phero-arc" />
        </svg>
      </div>
      <div className="phero-product">
        <div className="tilt" ref={tilt}>
          <Image src="/img/product-assembly.webp" alt="Sensa C / Connected ear cuff" fill sizes="46vh" />
          <div className="phero-sheen" />
        </div>
      </div>

      <div className="phero-top">
        <div className="wrap mono" style={{ color: "var(--muted)" }}>
          <span data-reveal="intro">Technology</span>
          <span data-reveal="intro">Ear-worn · EEG · PPG · taVNS · Sound</span>
        </div>
      </div>

      <div className="phero-bottom">
        <div className="wrap">
          <h2 className="h-xl" data-reveal="intro">
            The ear is the <em>interface.</em>
          </h2>
          <div className="phero-side" data-reveal="intro">
            <p className="lede">
              One continuous cuff brings sensing, gentle stimulation and sound together — so shifting state takes minutes,
              not months of practice.
            </p>
            <div className="phero-specs">
              <div>
                <b>3-in-1</b>
                <span>Sense · Stimulate · Sound</span>
              </div>
              <div>
                <b>5–10 min</b>
                <span>Planned session</span>
              </div>
              <div>
                <b>$299</b>
                <span>Expected price</span>
              </div>
            </div>
            <Button href="#waitlist">Join the waitlist</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
