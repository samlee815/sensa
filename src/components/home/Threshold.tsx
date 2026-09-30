"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function Threshold() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const split = SplitText.create(".threshold-text .h-xl", { type: "chars,words", mask: "chars" });
      let light = false;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (s) => {
            const isLight = s.progress > 0.9;
            if (isLight !== light) {
              light = isLight;
              window.dispatchEvent(new CustomEvent("sensa:navtheme", { detail: isLight ? "light" : "dark" }));
            }
          },
        },
      });
      tl.fromTo(
        ".threshold-media",
        { clipPath: "inset(32% 36% 32% 36% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 }
      )
        .fromTo(".threshold-media img", { scale: 1.35 }, { scale: 1, duration: 1.3 }, 0)
        .fromTo(".threshold-side.l", { x: 0 }, { x: -60, autoAlpha: 0, duration: 0.6 }, 0)
        .fromTo(".threshold-side.r", { x: 0 }, { x: 60, autoAlpha: 0, duration: 0.6 }, 0)
        .from(split.chars, { yPercent: 110, stagger: 0.02, duration: 0.4 }, 0.45)
        .from(".threshold-text .mono", { autoAlpha: 0, y: 20, duration: 0.3 }, 0.8)
        .to({}, { duration: 0.35 })
        .to(".threshold-text", { autoAlpha: 0, y: -40, duration: 0.3 })
        .to(".threshold-wash", { opacity: 1, duration: 0.45 }, "<");
      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section className="threshold" data-theme="dark" ref={root}>
      <div className="threshold-sticky">
        <div className="threshold-media">
          <Image src="/img/petals.webp" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <span className="threshold-side l">Restless</span>
        <span className="threshold-side r">In tune</span>
        <div className="threshold-text">
          <h2 className="h-xl is-serif">
            Help your body meet the moment.
          </h2>
          <p className="mono" style={{ marginTop: 28, color: "rgba(239,236,231,.7)" }}>
            One body. A different state.
          </p>
        </div>
        <div className="threshold-wash" />
      </div>
    </section>
  );
}
