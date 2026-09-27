"use client";
import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { getLenis } from "@/lib/lenis";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const seen = sessionStorage.getItem("sensa:seen") === "1";
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      sessionStorage.setItem("sensa:seen", "1");
      setGone(true);
    };

    if (seen || prefersReducedMotion()) {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.out",
        onStart: markReady,
        onComplete: finish,
      });
      return;
    }

    const counter = { v: 0 };
    const num = q(".pl-num")[0];
    const tl = gsap.timeline({ onComplete: finish });
    tl.from(q(".preloader-mark span"), { yPercent: 120, duration: 1.4, ease: "expo.out", stagger: 0.07 })
      .from(q(".preloader-tag"), { opacity: 0, y: 12, letterSpacing: "0.5em", duration: 1.4, ease: "expo.out" }, 0.4)
      .from(q(".preloader-bar"), { opacity: 0, duration: 0.6 }, 0.2)
      .to(q(".preloader-line i"), { scaleX: 1, duration: 2, ease: "sensaIO" }, 0.2)
      .to(
        counter,
        {
          v: 100,
          duration: 2,
          ease: "sensaIO",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.2
      )
      .to(q(".preloader-mark span"), { yPercent: -120, duration: 0.9, ease: "expo.in", stagger: 0.04 }, 2.35)
      .to(q(".preloader-tag, .preloader-bar"), { opacity: 0, duration: 0.4 }, 2.35)
      .add(markReady, 3.0)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "sensaIO" }, 2.95);

  }, { scope: root });

  if (gone) return null;
  return (
    <div className="preloader" ref={root} aria-hidden>
      <div className="preloader-mark wordmark">
        {"Sensa".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="preloader-tag">abide in me</div>
      <div className="preloader-bar">
        <span>PERSONAL STATE INTELLIGENCE</span>
        <span className="preloader-line">
          <i />
        </span>
        <span>
          <span className="pl-num">000</span>
        </span>
      </div>
    </div>
  );
}
