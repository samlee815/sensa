"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TLink } from "./Transition";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from(".footer-mark span", {
        yPercent: 100,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: { trigger: ".footer-mark", start: "top bottom", end: "bottom bottom", scrub: 1 },
      });
    },
    { scope: ref }
  );
  return (
    <footer className="footer s-dark" data-theme="dark" ref={ref}>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-col" style={{ gap: 20 }}>
            <p className="h-s" style={{ maxWidth: "16em" }}>
              Help your body <em>meet the moment.</em>
            </p>
            <p className="body" style={{ maxWidth: "28em" }}>
              Sensa is building personal state intelligence — sensing, stimulation and sound in one ear-worn system.
            </p>
          </div>
          <div className="footer-col">
            <span className="mono">Product</span>
            <TLink href="/#product">C / Connected</TLink>
            <TLink href="/#session">How a session works</TLink>
            <TLink href="/#system">System architecture</TLink>
            <TLink href="/#states">States</TLink>
          </div>
          <div className="footer-col">
            <span className="mono">Science</span>
            <TLink href="/#science">Research foundation</TLink>
            <TLink href="/#validation">Validation plan</TLink>
            <TLink href="/#control">Safety & control</TLink>
          </div>
          <div className="footer-col">
            <span className="mono">Company</span>
            <TLink href="/#waitlist">Join the waitlist</TLink>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Sensa — investor inquiry")}`}>Investors & partners</a>
          </div>
        </div>
      </div>
      <div className="footer-mark" aria-hidden>
        {"Sensa".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="wrap">
        <div className="footer-bottom">
          <p className="fine footer-legal">
            Sensa is in development and not available for sale. Capabilities described are planned and subject to
            prototype and user validation. Sensa is a general wellness product and is not intended to diagnose, treat,
            cure or prevent any disease.
          </p>
          <p className="fine">© 2026 Sensa. Abide in me.</p>
        </div>
      </div>
    </footer>
  );
}
