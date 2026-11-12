"use client";

import { useEffect, useRef, useState } from "react";
import { closePrompt, startSignIn, startSignOut, useProgress } from "@/lib/progress";

const GitHubMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export function AccountButton() {
  const { status, user } = useProgress();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (status === "loading") return <span className="icon-btn" aria-hidden="true" style={{ opacity: 0.4 }} />;

  if (status !== "user" || !user)
    return (
      <button className="btn small" onClick={startSignIn}>
        <GitHubMark /> <span className="hide-sm">Sign in</span>
      </button>
    );

  return (
    <div className="switcher" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen(!open)} aria-label="Account" aria-expanded={open} style={{ padding: 0, overflow: "hidden" }}>
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" width={34} height={34} style={{ display: "block" }} />
        ) : (
          <span className="mono">{(user.name ?? "?").slice(0, 1).toUpperCase()}</span>
        )}
      </button>
      {open && (
        <div className="menu" style={{ left: "auto", right: 0, minWidth: 200 }} role="menu">
          <div style={{ padding: "8px 10px", fontSize: 13 }}>
            <div style={{ fontWeight: 500 }}>{user.name ?? "Signed in"}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Progress syncs to this account</div>
          </div>
          <a href="/progress" role="menuitem">
            Progress
          </a>
          <a
            href="#"
            role="menuitem"
            onClick={(e) => {
              e.preventDefault();
              startSignOut();
            }}
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}

export function SignInPrompt() {
  const { prompt } = useProgress();
  useEffect(() => {
    if (!prompt) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePrompt();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prompt]);
  if (!prompt) return null;
  return (
    <div className="modal-bg" onClick={closePrompt}>
      <div className="card modal" role="dialog" aria-modal="true" aria-labelledby="signin-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="signin-title">Sign in to save your progress</h2>
        <p>Checkboxes, notes and tracking are saved to your account, so they follow you to any device. Only you can see them.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" onClick={startSignIn}>
            <GitHubMark /> Continue with GitHub
          </button>
          <button className="btn" onClick={closePrompt}>
            Keep browsing
          </button>
        </div>
      </div>
    </div>
  );
}
