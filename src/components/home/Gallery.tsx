"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const ITEMS: { img: string; tag: string; n: string; pos?: string }[] = [
  { img: "/img/shoulder.webp", tag: "abide in me", n: "01" },
  { img: "/img/glass.webp", tag: "a more present me", n: "02" },
  { img: "/img/skin.webp", tag: "grounded beauty", n: "03" },
  { img: "/img/petals.webp", tag: "breathe deeper", n: "04" },
  { img: "/img/sphere.webp", tag: "wellness looks good on you", n: "05", pos: "82% 50%" },
];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>(".gallery-track")!;
      const dist = () => track.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
      tl.to(track, { x: () => -dist(), duration: 1 }, 0).to(".gallery-progress i", { scaleX: 1, duration: 1 }, 0);
      gsap.utils.toArray<HTMLElement>(".gcard .frame img").forEach((img) => {
        tl.fromTo(img, { xPercent: -6 }, { xPercent: 6, duration: 1 }, 0);
      });
    },
    { scope: root }
  );

  return (
    <section className="gallery s-light" data-theme="light" ref={root}>
      <div className="gallery-sticky">
        <div className="gallery-head">
          <div className="wrap">
            <h2 className="h-m is-serif" data-reveal="lines">
              The Sensa state of mind.
            </h2>
            <span className="mono" style={{ color: "var(--muted)" }}>
              Wellness looks good on you
            </span>
          </div>
        </div>
        <div className="gallery-track">
          {ITEMS.map((it) => (
            <figure className="gcard" key={it.n} style={{ margin: 0 }}>
              <div className="frame">
                <Image src={it.img} alt="" fill sizes="(max-width: 860px) 70vw, 32vw" style={{ objectFit: "cover", objectPosition: it.pos || "50% 50%" }} />
                <span className="wm wordmark">Sensa</span>
              </div>
              <figcaption className="gcard-cap">
                <span className="serif-i">{it.tag}</span>
                <span className="mono" style={{ color: "var(--faint)" }}>
                  {it.n}
                </span>
              </figcaption>
            </figure>
          ))}
          <div className="gallery-end">
            <p className="h-m is-serif">
              Get closer to who you want to be.
            </p>
          </div>
        </div>
        <div className="gallery-progress">
          <i />
        </div>
      </div>
    </section>
  );
}
