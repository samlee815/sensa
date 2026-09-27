import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import AppShell from "@/components/AppShell";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--f-serif",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sensa.ai"), // TODO: set the production domain
  title: "Sensa — Personal State Intelligence",
  description:
    "Sensa is an ear-worn system that senses your state and helps you shift it — calm, sleep, focus, connection and recovery. Join the waitlist.",
  openGraph: {
    title: "Sensa — Personal State Intelligence",
    description: "Feel the way you want. Anytime, anywhere.",
    images: ["/img/stones.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
