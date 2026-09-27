"use client";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

const Ctx = createContext<{ navigate: (href: string) => void; prefetch: (href: string) => void }>({
  navigate: () => {},
  prefetch: () => {},
});
export const useTransition = () => useContext(Ctx);

const offsetOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

/** Land so the section's heading ([data-anchor]) sits just under the nav; sections without one land at their top. */
function targetY(section: HTMLElement) {
  const anchor = section.querySelector<HTMLElement>("[data-anchor]");
  if (!anchor) return offsetOf(section);
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 76;
  const gap = Math.min(40, window.innerHeight * 0.035);
  return Math.max(offsetOf(section), offsetOf(anchor) - navH - gap);
}

/** Jump (immediate) or glide to a section. Always ends exactly on target, with or without Lenis. */
function scrollToHash(hash: string, immediate = false) {
  const el = document.getElementById(hash);
  if (!el) return;
  window.dispatchEvent(new CustomEvent("sensa:navlock"));
  const lenis = getLenis();
  const y = targetY(el);
  if (immediate || !lenis) {
    lenis?.scrollTo(y, { immediate: true, force: true });
    window.scrollTo(0, y);
    ScrollTrigger.update();
    return;
  }
  lenis.start();
  lenis.scrollTo(y, {
    duration: 1.6,
    force: true,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    // Sticky/pinned sections can shift layout during the glide — correct the landing if needed.
    onComplete: () => {
      const fix = targetY(el);
      if (Math.abs(fix - window.scrollY) > 2) lenis.scrollTo(fix, { immediate: true, force: true });
    },
  });
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const first = useRef(true);
  const pendingHash = useRef<string | null>(null);

  // Curtain rises over the page, the wordmark settles in.
  const cover = useCallback(() => {
    const c = curtain.current!;
    const mark = c.querySelector(".wordmark");
    gsap.killTweensOf([c, mark]);
    return gsap
      .timeline()
      .set(c, { clipPath: "inset(100% 0% 0% 0%)" })
      .to(c, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "sensaIO" })
      .fromTo(mark, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, "-=0.35");
  }, []);

  // Wordmark lifts away and the curtain opens upward onto the new position.
  const uncover = useCallback(() => {
    const c = curtain.current!;
    const mark = c.querySelector(".wordmark");
    busy.current = false; // content is in place; allow the next navigation right away
    return gsap
      .timeline()
      .to(mark, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
      .to(c, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "sensaIO" }, "-=0.1");
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const [path, hash] = href.split("#");
      const target = path || pathname;
      if (busy.current || !curtain.current) return;
      busy.current = true;
      window.setTimeout(() => (busy.current = false), 4000);

      if (target === pathname) {
        // Same page: jump under the curtain instead of gliding past every section in between.
        cover().add(() => {
          if (hash) scrollToHash(hash, true);
          else {
            getLenis()?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
          }
          ScrollTrigger.update();
          uncover();
        });
        return;
      }

      pendingHash.current = hash || null;
      cover().add(() => router.push(target, { scroll: false }));
    },
    [pathname, router, cover, uncover]
  );

  const prefetch = useCallback((href: string) => router.prefetch(href.split("#")[0] || "/"), [router]);

  // Deep link on first load (e.g. /#science): land directly once layout settles.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToHash(hash, true);
    }, 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!curtain.current) return;
    let raf2 = 0;
    // Wait two frames so the new page has laid out, then position it under the curtain.
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const hash = pendingHash.current;
        pendingHash.current = null;
        if (hash) scrollToHash(hash, true);
        else {
          getLenis()?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo(0, 0);
        }
        uncover();
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname, uncover]);

  return (
    <Ctx.Provider value={{ navigate, prefetch }}>
      {children}
      <div className="curtain" ref={curtain} aria-hidden>
        <div className="wordmark">Sensa</div>
      </div>
    </Ctx.Provider>
  );
}

export function TLink({
  href,
  children,
  className,
  cursor,
  ...rest
}: { href: string; children: React.ReactNode; className?: string; cursor?: string } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const { navigate, prefetch } = useTransition();
  return (
    <a
      href={href}
      className={className}
      data-cursor={cursor}
      onMouseEnter={() => prefetch(href)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
