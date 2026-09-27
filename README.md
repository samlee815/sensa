# Sensa — website

Single-page site for Sensa, Personal State Intelligence. Everything lives on `/`, in three chapters:

1. **The problem** (dark): hero, brand promise, stats, signal field
2. **Product & experience** (light): `#product`, `#states`, `#session`, 5–10 min, category comparison
3. **Technology & science** (dark): `#technology`, `#anatomy`, `#system`, `#science` / `#validation`, `#control`

The page closes with the gallery, `#waitlist` and the footer. The old `/product` URL redirects to `/#product`.

**Stack:** Next.js 16 (App Router) · React 19 · React Three Fiber / Three.js · GSAP (ScrollTrigger, SplitText) · Lenis smooth scroll.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
```

## Deploy (GitHub Pages)

Every push to `main` builds the static export and publishes it via `.github/workflows/pages.yml`.
One-time setup in the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

- On a project page (`<user>.github.io/<repo>`) the workflow sets the base path automatically.
- For a custom domain, add it under Settings → Pages; the base path then becomes empty.
- `public/product/index.html` keeps the old `/product` URL working (redirects to `/#product`).
- This clone pushes with a dedicated SSH key (`git config --local core.sshCommand`), independent of any other GitHub login on the machine.

## Structure

```
src/app/                 layout (fonts, metadata), globals.css (all design tokens + styles)
src/components/          AppShell, Nav, Preloader, Cursor, page-transition curtain, Button, Waitlist, CTA, Footer
src/components/three/    LiquidChrome (hero shader blob), SignalField (EEG particle terrain)
src/components/home/     chapter I–II sections + HomeView (page order)
src/components/product/  chapter II–III sections (session, compare, technology, anatomy, system, science, control)
src/lib/                 gsap setup, useReveals (declarative scroll reveals), state data, GLSL noise
public/img/              images from the pitch deck (WebP)
```

Nav links jump to sections and land with the section heading (`[data-anchor]`) just under the nav. Each anchored section is sized so its heading + main module fit one desktop screen.

Scroll reveals are declarative. Add `data-reveal="lines" | "fade" | "stagger" | "img" | "line"`, `data-parallax="0.2"` or `data-count="50"` to any element inside a page view.

The five states (copy, colours, waveform parameters, images) live in `src/lib/states.ts`.

## Before launch

- **Waitlist:** `src/components/Waitlist.tsx` validates the email, then only shows a success state. Wire it to a backend (Resend, Loops, HubSpot, Airtable…).
- **Domain:** `metadataBase` in `src/app/layout.tsx` is set to `https://sensa.ai`, a placeholder.
- **Footer links:** the contact email and social links in `src/components/Footer.tsx` are placeholders.
- **Claims review:** copy follows the deck's cautious framing ("planned", "in development", general-wellness disclaimer). Have it reviewed against FDA General Wellness guidance before going live.
