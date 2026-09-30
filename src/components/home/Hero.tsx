"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { useInView } from "@/lib/useInView";
import type { ChromeDrive } from "../three/LiquidChrome";
import Button from "../Button";

const LiquidChrome = dynamic(() => import("../three/LiquidChrome"), { ssr: false });

const STATES = ["Restless", "Unsettled", "Settling", "Steady", "Calm"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const drive = useRef<ChromeDrive>({ progress: 0, intro: 0 });
  const stateRef = useRef<HTMLElement>(null);
  const cohRef = useRef<HTMLElement>(null);
  const meterRef = useRef<HTMLElement>(null);
  const active = useInView(root, "0px");

  useGSAP(
    (_ctx, contextSafe) => {
      const title = root.current!.querySelector(".hero-title")!;
      let split: SplitText | null = null;

      // contextSafe: the callback fires from the preloader's timeline, so bind selectors/animations to this component's scope.
      const off = onReady(contextSafe!(() => {
        gsap.set("[data-reveal='intro']", { visibility: "visible" });
        split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line" });
        const tl = gsap.timeline({ delay: 0.05 });
        tl.to(drive.current, { intro: 1, duration: 3.2, ease: "expo.out" }, 0)
          .from(split.lines, { yPercent: 115, rotate: 3, transformOrigin: "0 0", duration: 1.6, ease: "expo.out", stagger: 0.12 }, 0.15)
          .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 1.2, ease: "expo.out" }, 0.1)
          .from(".hero-row > *", { autoAlpha: 0, y: 30, duration: 1.4, ease: "expo.out", stagger: 0.12 }, 0.55)
          .from(".hero-hud, .hero-readout", { autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0.9)
          .from(".hero-grid", { autoAlpha: 0, scale: 1.08, duration: 2.4, ease: "expo.out" }, 0);
      }));

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (s) => {
          const p = s.progress;
          drive.current.progress = p;
          const i = Math.min(STATES.length - 1, Math.floor(p * STATES.length * 0.999 + 0.0001));
          if (stateRef.current && stateRef.current.textContent !== STATES[i]) stateRef.current.textContent = STATES[i];
          if (cohRef.current) cohRef.current.textContent = String(Math.round(14 + p * 78)).padStart(2, "0") + "%";
          if (meterRef.current) meterRef.current.style.transform = `scaleX(${0.14 + p * 0.78})`;
        },
      });

      gsap.to(".hero-content .wrap", {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "45% top", scrub: true },
      });
      gsap.to(".hero-hud", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "5% top", end: "20% top", scrub: true },
      });
      gsap.fromTo(
        ".hero-after",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "40% top", end: "75% top", scrub: true },
        }
      );

      return () => {
        off();
        split?.revert();
      };
    },
    { scope: root }
  );

  return (
    <section className="hero s-dark" data-theme="dark" ref={root}>
      <div className="hero-sticky">
        <div className="hero-grid" />
        <div className="hero-canvas">
          <LiquidChrome drive={drive} active={active} />
        </div>

        <div className="hero-readout mono" data-reveal="intro">
          <span className="state-pill">
            State <b ref={stateRef}>Restless</b>
          </span>
          <span>
            Coherence <b ref={cohRef} style={{ fontWeight: 400, color: "var(--fg)" }}>14%</b>
          </span>
          <span className="meter">
            <i ref={meterRef} />
          </span>
        </div>

        <div className="hero-content">
          <div className="wrap">
            <span className="eyebrow hero-eyebrow" data-reveal="intro">
              Personal State Intelligence
            </span>
            <h1 className="h-xxl hero-title" data-reveal="intro">
              Feel the way
              <br />
              <span className="line-2">
                you <em>want.</em>
              </span>
            </h1>
            <div className="hero-row" data-reveal="intro">
              <p className="lede">
                Sensa is a fashion-forward BCI system designed to understand both your body and your life — reading
                your signals, learning your emotional patterns, and helping you shift into the state you want to be in.
              </p>
              <div className="hero-actions">
                <Button href="#waitlist">Join the waitlist</Button>
                <Button href="/#product" variant="ghost">
                  Meet C / Connected
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-after"
          style={{ position: "absolute", left: 0, right: 0, bottom: "14vh", textAlign: "center", zIndex: 2, pointerEvents: "none" }}
        >
          <p className="mono" style={{ color: "var(--muted)", margin: 0 }}>
            Restless → Calm · in minutes, not months of practice
          </p>
        </div>

        <div className="hero-hud" data-reveal="intro">
          <div className="wrap mono">
            <span className="hide-sm">EEG · PPG · Ear stimulation · Sound</span>
            <span className="scroll-cue">
              <i /> Scroll to shift
            </span>
            <span className="hide-sm">Waitlist open — U.S.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
