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

## Deploy (Cloudflare Pages — wearsensa.com)

```bash
npx wrangler login     # once, with the Sensa Cloudflare account
npm run deploy:cf      # builds the static export and uploads out/ to the "wearsensa" Pages project
```

The custom domain `wearsensa.com` is attached to the Pages project in the Cloudflare dashboard (Workers & Pages → wearsensa → Custom domains).

## Old GitHub Pages address

`.github/workflows/pages.yml` now only publishes a redirect: `samlee815.github.io/sensa/*` → `wearsensa.com/*`.

## Contact & waitlist

`src/lib/site.ts` holds the contact email and the waitlist endpoint. Signups are emailed to that address through [FormSubmit](https://formsubmit.co) (no server needed on static hosting):

1. The first signup triggers an activation email from FormSubmit — click **Activate Form** once.
2. FormSubmit then sends a random alias for the address; replace the address in `WAITLIST_ENDPOINT` with it so the email isn't in the page source.

## Before launch

- **Domain:** set a custom domain in GitHub → Settings → Pages; the workflow updates paths and `metadataBase` automatically.
- **Claims review:** copy follows the deck's cautious framing ("planned", "in development", general-wellness disclaimer). Have it reviewed against FDA General Wellness guidance before going live.
