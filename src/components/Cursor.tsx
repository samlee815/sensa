"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = root.current!;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    r.classList.add("is-hidden");

    const move = (e: MouseEvent) => {
      r.classList.remove("is-hidden");
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const lab = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button, [role='button'], input, .state-tab, .layer-item, .plane");
      if (lab && lab.dataset.cursor) {
        setLabel(lab.dataset.cursor);
        r.classList.add("is-label");
        r.classList.remove("is-link");
      } else {
        r.classList.remove("is-label");
        r.classList.toggle("is-link", !!link);
      }
    };
    const leave = () => r.classList.add("is-hidden");
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden>
      <div className="cursor-ring" ref={ring}>
        <span>{label}</span>
      </div>
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
