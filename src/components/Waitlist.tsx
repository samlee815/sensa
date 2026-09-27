"use client";
import { useState } from "react";
import { STATES } from "@/lib/states";
import Button from "./Button";
import { Check } from "./Icons";
import { CONTACT_EMAIL, WAITLIST_ENDPOINT } from "@/lib/site";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState<string[]>(["calm"]);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [honey, setHoney] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    setSending(true);
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          states: picked.map((k) => STATES.find((s) => s.key === k)?.label ?? k).join(", ") || "—",
          page: window.location.href,
          _subject: `Sensa waitlist: ${email}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
          _honey: honey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || res.statusText);
      setDone(true);
    } catch {
      setErr(`Something went wrong. Please try again, or email us at ${CONTACT_EMAIL}.`);
    } finally {
      setSending(false);
    }
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
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* spam trap: hidden from people, filled in by bots */}
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
            style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
          />
          <Button type="submit" magnetic={false} disabled={sending}>
            {sending ? "Joining…" : "Join the waitlist"}
          </Button>
        </div>
      )}
      <p className="fine" aria-live="polite">
        {err || "Expected $599 · Optional Sensa+ membership. No spam — launch news only."}
      </p>
    </form>
  );
}
