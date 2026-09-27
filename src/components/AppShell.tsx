"use client";
import SmoothScroll from "./SmoothScroll";
import Nav from "./Nav";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import { TransitionProvider } from "./Transition";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <SmoothScroll />
      <Preloader />
      <Nav />
      <main>{children}</main>
      <Cursor />
      <div className="grain" aria-hidden />
    </TransitionProvider>
  );
}
