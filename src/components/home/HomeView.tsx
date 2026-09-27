"use client";
import { useRef } from "react";
import { useReveals } from "@/lib/useReveals";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Need from "./Need";
import Signal from "./Signal";
import Threshold from "./Threshold";
import ProductIntro from "./ProductIntro";
import StateSelector from "./StateSelector";
import Easier from "./Easier";
import Gallery from "./Gallery";
import Session from "../product/Session";
import Compare from "../product/Compare";
import PHero from "../product/PHero";
import Anatomy from "../product/Anatomy";
import Architecture from "../product/Architecture";
import Science from "../product/Science";
import Control from "../product/Control";
import CTA from "../CTA";
import Footer from "../Footer";

/**
 * One continuous page in three chapters:
 * dark — the problem · light — the product & experience · dark — technology & science.
 */
export default function HomeView() {
  const ref = useRef<HTMLDivElement>(null);
  useReveals(ref);
  return (
    <div ref={ref}>
      {/* I — the problem */}
      <Hero />
      <Manifesto />
      <Need />
      <Signal />
      <Threshold />
      {/* II — product & experience */}
      <ProductIntro />
      <StateSelector />
      <Session />
      <Easier />
      <Compare />
      {/* III — technology & science */}
      <PHero />
      <Anatomy />
      <Architecture />
      <Science />
      <Control />
      {/* close */}
      <Gallery />
      <CTA />
      <Footer />
    </div>
  );
}
