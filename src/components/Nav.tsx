"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { TLink } from "./Transition";
import Button from "./Button";

const LINKS = [
  { id: "product", label: "Product" },
  { id: "states", label: "States" },
  { id: "system", label: "System" },
  { id: "science", label: "Science" },
];

export default function Nav() {
  const pathname = usePathname();
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Scroll-spy: highlight the link whose section is under the nav.
  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const id = window.setTimeout(() => {
      triggers = LINKS.map((l) => document.getElementById(l.id))
        .filter((el): el is HTMLElement => !!el)
        .map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => setActive((cur) => (self.isActive ? el.id : cur === el.id ? null : cur)),
          })
        );
    }, 120);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const setup = () => {
      triggers.forEach((t) => t.kill());
      triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]")).map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 38px",
          end: "bottom 38px",
          onToggle: (self) => {
            if (self.isActive) setLight(el.dataset.theme === "light");
          },
        })
      );
      setLight(false);
      ScrollTrigger.refresh();
    };
    const id = window.setTimeout(setup, 80);
    const onTheme = (e: Event) => setLight((e as CustomEvent<string>).detail === "light");
    window.addEventListener("sensa:navtheme", onTheme);
    return () => {
      window.clearTimeout(id);
      triggers.forEach((t) => t.kill());
      window.removeEventListener("sensa:navtheme", onTheme);
    };
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    let lockUntil = 0;
    const lock = () => {
      lockUntil = performance.now() + 2200;
      setHidden(false);
    };
    window.addEventListener("sensa:navlock", lock);
    const on = () => {
      const y = window.scrollY;
      if (performance.now() < lockUntil) {
        last = y;
        return;
      }
      if (y < 160) setHidden(false);
      else if (Math.abs(y - last) > 8) setHidden(y > last);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("sensa:navlock", lock);
    };
  }, []);

  return (
    <header className={`nav ${light ? "is-light" : ""} ${hidden ? "is-hidden" : ""}`}>
      <div className="nav-inner">
        <TLink href="/" className="nav-logo wordmark" aria-label="Sensa home">
          Sensa <small>Personal State Intelligence</small>
        </TLink>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <TLink key={l.id} href={`/#${l.id}`} className={active === l.id ? "is-active" : ""}>
              {l.label}
            </TLink>
          ))}
        </nav>
        <div className="nav-cta">
          <Button href="/#waitlist">Join waitlist</Button>
        </div>
      </div>
    </header>
  );
}
