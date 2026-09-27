"use client";
import { useState } from "react";
import { STATES } from "@/lib/states";
import Button from "./Button";
import { Check } from "./Icons";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState<string[]>(["calm"]);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    // TODO: connect to your waitlist backend (e.g. Resend, Loops, Airtable, HubSpot).
    setDone(true);
  };

  return (
    <form className="waitlist" onSubmit={submit} noValidate>
      <span className="mono" style={{ color: "var(--muted)" }}>
        Which states matter most to you?
      </span>
      <div className="waitlist-states">
        {STATES.map((s) => {
          const on = picked.includes(s.key);
          return (
            <button
              type="button"
              key={s.key}
              className={`chip ${on ? "on" : ""}`}
              onClick={() => setPicked((p) => (on ? p.filter((k) => k !== s.key) : [...p, s.key]))}
              aria-pressed={on}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {done ? (
        <div className="waitlist-done" role="status">
          <i>
            <Check width={18} />
          </i>
          You’re on the list. We’ll be in touch before launch.
        </div>
      ) : (
        <div className="waitlist-field">
          <input
            type="email"
            placeholder="Your email address"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" magnetic={false}>
            Join the waitlist
          </Button>
        </div>
      )}
      <p className="fine" aria-live="polite">
        {err || "Expected $299 · Optional Sensa+ membership. No spam — launch news only."}
      </p>
    </form>
  );
}
