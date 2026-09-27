"use client";
import { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "./gsap";

/**
 * Declarative scroll reveals. Inside `scope`, any element with:
 *   data-reveal="lines"   → masked line-by-line rise (SplitText)
 *   data-reveal="chars"   → masked char rise
 *   data-reveal="fade"    → soft rise + fade
 *   data-reveal="stagger" → children rise in sequence
 *   data-reveal="img"     → clip-path wipe + inner image settle
 *   data-reveal="line"    → horizontal rule draws in
 *   data-parallax="0.2"   → scrubbed vertical drift (fraction of own height)
 *   data-count="50"       → number counts up (keeps decimals of the target)
 * Optional data-delay="0.2" on any reveal.
 */
export function useReveals(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const q = <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T & HTMLElement>(s));
      const reduce = prefersReducedMotion();

      if (reduce) {
        q("[data-reveal]").forEach((el) => gsap.set(el, { visibility: "visible" }));
        q("[data-count]").forEach((el) => (el.textContent = el.dataset.count || ""));
        return;
      }

      const trig = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });
      const delay = (el: HTMLElement) => parseFloat(el.dataset.delay || "0");

      q("[data-reveal='lines']").forEach((el) => {
        gsap.set(el, { visibility: "visible" });
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 0%",
              duration: 1.35,
              ease: "expo.out",
              stagger: 0.09,
              delay: delay(el),
              scrollTrigger: trig(el),
            });
          },
        });
      });

      q("[data-reveal='chars']").forEach((el) => {
        gsap.set(el, { visibility: "visible" });
        SplitText.create(el, {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 120,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.03,
              delay: delay(el),
              scrollTrigger: trig(el, "top 95%"),
            });
          },
        });
      });

      q("[data-reveal='fade']").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out", delay: delay(el), scrollTrigger: trig(el, "top 92%") }
        );
      });

      q("[data-reveal='stagger']").forEach((el) => {
        gsap.set(el, { visibility: "visible" });
        gsap.fromTo(
          el.children,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            delay: delay(el),
            scrollTrigger: trig(el),
          }
        );
      });

      q("[data-reveal='img']").forEach((el) => {
        const img = el.querySelector("img");
        gsap.set(el, { visibility: "visible" });
        const tl = gsap.timeline({ scrollTrigger: trig(el, "top 90%"), delay: delay(el) });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "expo.inOut" }
        );
        if (img) tl.fromTo(img, { scale: 1.4 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0.15);
        tl.set(el, { clearProps: "clipPath" });
      });

      q("[data-reveal='line']").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "0% 50%", autoAlpha: 1 },
          { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: delay(el), scrollTrigger: trig(el, "top 95%") }
        );
      });

      q("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -amt * 50 },
          {
            yPercent: amt * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      q("[data-count]").forEach((el) => {
        const raw = el.dataset.count || "0";
        const end = parseFloat(raw);
        const dec = (raw.split(".")[1] || "").length;
        const o = { v: 0 };
        const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
        el.textContent = fmt(0);
        gsap.to(o, {
          v: end,
          duration: 2.4,
          ease: "expo.out",
          delay: delay(el),
          scrollTrigger: trig(el),
          onUpdate: () => {
            el.textContent = fmt(o.v);
          },
        });
      });

      // Layout can shift after fonts load; keep triggers accurate.
      if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope, dependencies: deps }
  );
}
