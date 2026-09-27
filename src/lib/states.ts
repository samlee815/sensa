export type StateKey = "calm" | "sleep" | "focus" | "energy" | "recovery";

export interface SensaState {
  key: StateKey;
  label: string;
  color: string;
  line: string;
  prompt: string;
  detail: string;
  minutes: number;
  intensity: number; // 1–5
  band: string;
  image: string;
  wave: { freq: number; amp: number; speed: number; harmonic: number; breathe: number };
}

export const STATES: SensaState[] = [
  {
    key: "calm",
    label: "Calm",
    color: "#9db4bf",
    line: "More composure when it matters.",
    prompt: "“That meeting was stressful. I need a break.”",
    detail: "A short reset between high-pressure moments. Slower rhythms and softer sound help your body settle before the next thing.",
    minutes: 8,
    intensity: 2,
    band: "α 8–12 Hz",
    image: "/img/shoulder.webp",
    wave: { freq: 1.1, amp: 0.46, speed: 0.9, harmonic: 0.18, breathe: 0.25 },
  },
  {
    key: "sleep",
    label: "Sleep",
    color: "#8e88b8",
    line: "Start tomorrow feeling ready.",
    prompt: "“My mind won’t switch off tonight.”",
    detail: "Wind down before bed with a low-intensity program and a soundscape that fades as you do.",
    minutes: 10,
    intensity: 1,
    band: "θ–δ 1–7 Hz",
    image: "/img/petals.webp",
    wave: { freq: 0.55, amp: 0.62, speed: 0.45, harmonic: 0.08, breathe: 0.4 },
  },
  {
    key: "focus",
    label: "Focus",
    color: "#d9b77e",
    line: "Feel ready to engage.",
    prompt: "“I want to focus for the next two hours.”",
    detail: "Clear the fog before deep work, a pitch or a decision. Brighter sound, a crisper rhythm.",
    minutes: 6,
    intensity: 3,
    band: "β 13–20 Hz",
    image: "/img/glass.webp",
    wave: { freq: 2.6, amp: 0.3, speed: 1.8, harmonic: 0.35, breathe: 0.05 },
  },
  {
    key: "energy",
    label: "Energy",
    color: "#e0a07c",
    line: "Lift yourself when the day drags.",
    prompt: "“It’s 3 p.m. and I’m running on empty.”",
    detail: "A short, brighter session for the afternoon slump or before a workout. Upbeat sound and a livelier rhythm help you feel switched on.",
    minutes: 5,
    intensity: 3,
    band: "β 15–25 Hz",
    image: "/img/skin.webp",
    wave: { freq: 3.1, amp: 0.38, speed: 2.3, harmonic: 0.42, breathe: 0.05 },
  },
  {
    key: "recovery",
    label: "Recovery",
    color: "#9eb09a",
    line: "Let go when the work is done.",
    prompt: "“Training’s done. Help me come down.”",
    detail: "After a workout, a flight or a long day, help your body catch up with where you are.",
    minutes: 10,
    intensity: 2,
    band: "HRV ↑ α 8–10 Hz",
    image: "/img/sphere.webp",
    wave: { freq: 0.85, amp: 0.5, speed: 0.7, harmonic: 0.22, breathe: 0.55 },
  },
];
