"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ArrowUR } from "../Icons";

const PAPERS = [
  { h: "Anatomical basis", src: "Butt et al. · Journal of Anatomy · 2020", p: "The auricular branch provides sensory input to the ear; its distribution varies between individuals.", url: "https://doi.org/10.1111/joa.13122" },
  { h: "Brain pathways", src: "Frangos et al. · Brain Stimulation · 2015", p: "fMRI studies of ear stimulation provide indirect evidence of central pathways.", url: "https://pubmed.ncbi.nlm.nih.gov/25573069/" },
  { h: "Safety review", src: "Kim et al. · Scientific Reports · 2022", p: "177 studies, 6,322 participants. Ear pain, headache and tingling require attention.", url: "https://doi.org/10.1038/s41598-022-25864-1" },
  { h: "Effects & evidence quality", src: "Verma et al. · Frontiers in Neuroscience · 2021", p: "Clinical outcomes and study quality vary. Stronger controls and blinding are needed.", url: "https://doi.org/10.3389/fnins.2021.664740" },
  { h: "Limits of HRV", src: "Wolf et al. · Psychophysiology · 2021", p: "A meta-analysis does not support HRV as a reliable sole marker of acute taVNS.", url: "https://pubmed.ncbi.nlm.nih.gov/34473846/" },
];

const ROAD = [
  { h: "Fit and sensing", p: "Planned 50-person study: contact, artifacts, comfort and completion." },
  { h: "Controlled comparison", p: "Active or sham stimulation plus sound, versus sound alone." },
  { h: "Goal attainment", p: "Before/after readiness, relevant tasks and discomfort feedback." },
  { h: "Repeat use", p: "Planned four-week study: usage, drop-off and willingness to pay." },
];

export default function Science() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.to(".road-line i", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: ".road", start: "top 80%", end: "bottom 50%", scrub: 1 },
      });
      gsap.from(".road-step", {
        autoAlpha: 0,
        y: 30,
        stagger: 0.15,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".road", start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section className="s-dark section-pad" data-theme="dark" id="science" ref={root}>
      <div className="wrap">
        <div className="need-head" style={{ marginBottom: 0 }} data-anchor>
          <div className="section-head">
            <span className="eyebrow" data-reveal="fade">
              Feasibility & validation
            </span>
            <h2 className="h-l" data-reveal="lines">
              Science provides a foundation<span className="pd">.</span> <em>Sensa must prove the rest.</em>
            </h2>
          </div>
          <p className="lede" data-reveal="fade" style={{ justifySelf: "end" }}>
            Research supports ear sensing and ear stimulation separately. The direct test is whether stimulation plus sound
            outperforms sound alone — and whether personalization adds value.
          </p>
        </div>

        <div className="stats" style={{ marginTop: "clamp(36px, 4vw, 64px)" }}>
          {[
            { v: "177", s: "", t: "studies in a taVNS safety review", f: "Kim et al., 2022" },
            { v: "6322", s: "", t: "participants across those studies", f: "Reporting gaps remain" },
            { v: "50", s: "", t: "people in our planned fit & sensing study", f: "Sensa validation plan" },
            { v: "4", s: "wk", t: "planned repeat-use study", f: "Usage, drop-off, willingness to pay" },
          ].map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-num">
                <span data-count={s.v}>{s.v}</span>
                {s.s && <sup>{s.s}</sup>}
              </div>
              <div data-reveal="fade" data-delay={String(i * 0.08)} style={{ display: "grid", gap: 10 }}>
                <h4>{s.t}</h4>
                <p className="fine">{s.f}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="papers" id="research">
          {PAPERS.map((p, i) => (
            <a className="paper" key={p.h} href={p.url} target="_blank" rel="noreferrer" data-reveal="fade" data-cursor="Read">
              <span className="num">0{i + 1}</span>
              <div>
                <h4>{p.h}</h4>
                <div className="src">{p.src}</div>
              </div>
              <p>{p.p}</p>
              <span className="go">
                View paper <ArrowUR width={12} />
              </span>
            </a>
          ))}
          <p className="fine" style={{ marginTop: 16 }}>
            These studies do not establish Sensa’s efficacy. Research direction: validate comfort and real experience first,
            then examine neural targets and mechanisms.
          </p>
        </div>

        <div className="roadmap" id="validation">
          <div className="section-head" data-anchor>
            <span className="eyebrow" data-reveal="fade">
              Sensa validation plan
            </span>
            <h3 className="h-m" data-reveal="lines">
              Usability first, then measurable added value<span className="pd">.</span>
            </h3>
          </div>
          <div className="road">
            <div className="road-line">
              <i />
            </div>
            {ROAD.map((r, i) => (
              <div className="road-step" key={r.h}>
                <span className="num">0{i + 1}</span>
                <h4>{r.h}</h4>
                <p>{r.p}</p>
              </div>
            ))}
          </div>
          <div className="gate" data-reveal="fade">
            <p>
              <span className="mono" style={{ color: "var(--muted)", display: "block", marginBottom: 10 }}>
                Gate for expansion
              </span>
              Scale only after preset efficacy and usability criteria are met.
            </p>
            <span className="mono" style={{ color: "var(--faint)" }}>
              FDA General Wellness pathway
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
