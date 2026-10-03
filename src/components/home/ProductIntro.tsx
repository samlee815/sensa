"use client";
import Image from "next/image";
import Button from "../Button";
import { TLink } from "../Transition";

const FEATURES = [
  { h: "EEG / PPG sensing", p: "Sensors in the ear tip read brain-activity references and pulse variability — combined with how you say you feel." },
  { h: "Ear stimulation + sound", p: "Skin-contact electrodes at the concha deliver gentle stimulation, while sound supports regulation." },
  { h: "Made for everyday wear", p: "One sculpted earpiece. Comfort and stable contact come first, so it fits into real life." },
];

export default function ProductIntro() {
  return (
    <section className="s-light section-pad pintro" data-theme="light" id="product">
      <div className="wrap">
        <div className="pintro-grid" data-anchor>
          <div className="pintro-copy">
            <div className="section-head tight">
              <span className="eyebrow" data-reveal="fade">
                Introducing
              </span>
              <h2 className="h-l" data-reveal="lines">
                Sensa <em>C / Connected.</em>
              </h2>
              <p className="lede" data-reveal="fade" data-delay="0.15">
                One sculpted in-ear piece. Stimulation at the concha, sensing in the ear canal, sound throughout —
                designed to disappear into your day.
              </p>
            </div>
            <div className="features" data-reveal="stagger">
              {FEATURES.map((f, i) => (
                <div className="feature" key={f.h}>
                  <span className="num">0{i + 1}</span>
                  <div>
                    <h3>{f.h}</h3>
                    <p>{f.p}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pintro-price" data-reveal="fade">
              <Button href="/#technology">See the technology</Button>
              <div className="price">
                Expected price
                <b>$599</b>
              </div>
            </div>
          </div>

          <div className="pintro-media">
            <TLink href="/#anatomy" cursor="Explore">
              <div className="frame pintro-main" data-reveal="img">
                <Image src="/img/product-profile.webp" alt="Sensa C / Connected worn on the ear" fill sizes="(max-width: 960px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                <div className="pintro-label mono">
                  <span>C / 01</span>
                  <span style={{ opacity: 0.6 }}>Front</span>
                </div>
              </div>
            </TLink>
            <div className="frame pintro-float" data-parallax="0.35">
              <Image src="/img/product-ear.webp" alt="Sensa C / Connected in the ear" fill sizes="20vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
