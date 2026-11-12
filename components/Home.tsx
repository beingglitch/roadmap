"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { courses, totalLessons } from "@/lib/courses";
import { exportProgress, importProgress, streak, useDone } from "@/lib/progress";
import { Arrow, Book, Video } from "./Icons";
import { TopBar } from "./TopBar";

export function Home() {
  const done = useDone();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const doneCount = courses.reduce((n, c) => n + c.lessons.filter((l) => done[l.id]).length, 0);
  const days = streak(done);
  const today = Object.values(done).filter((t) => new Date(t).toDateString() === new Date().toDateString()).length;

  const download = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (f: File) => {
    try {
      importProgress(await f.text());
      setMsg("Progress imported.");
    } catch {
      setMsg("That file is not a progress export.");
    }
  };

  const groups: { title: string; note: string; items: typeof courses }[] = [
    { title: "Priority 1", note: "System design, AI, inference, cloud and cost", items: courses.filter((c) => c.priority === 1) },
    { title: "Priority 2", note: "After the core is moving", items: courses.filter((c) => c.priority === 2) },
  ];

  return (
    <>
      <TopBar />
      <main className="main">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <section className="hero">
            <div className="eyebrow mono" style={{ marginBottom: 10 }}>
              All roadmaps
            </div>
            <h1>
              Learn it in order, <em>check it off.</em>
            </h1>
            <p>
              Six tracks, one lesson at a time. Every lesson has a video first, then diagrams and text. Sign in with GitHub and
              your progress syncs to your account on every device.
            </p>
            <div className="stats">
              <div className="card stat">
                <b className="mono">
                  {doneCount}/{totalLessons}
                </b>
                <span>items done</span>
              </div>
              <div className="card stat">
                <b className="mono">{days}</b>
                <span>day streak</span>
              </div>
              <div className="card stat">
                <b className="mono">{today}</b>
                <span>done today</span>
              </div>
              <Link href="/progress" className="card stat" style={{ display: "grid", alignContent: "center" }}>
                <b className="mono">{Math.round((doneCount / totalLessons) * 100)}%</b>
                <span>covered · see tracking →</span>
              </Link>
            </div>
          </section>

          {groups.map((g) => (
            <div key={g.title}>
              <div className="section-title">
                <h2>{g.title}</h2>
                <span>{g.note}</span>
              </div>
              <div className="grid">
                {g.items.map((c) => {
                  const n = c.lessons.filter((l) => done[l.id]).length;
                  const pct = Math.round((n / c.lessons.length) * 100);
                  const next = c.lessons.find((l) => !done[l.id]);
                  return (
                    <Link key={c.slug} href={`/${c.slug}`} className="card course-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className={`chip ${c.priority === 1 ? "p1" : "p2"}`}>P{c.priority}</span>
                        <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                          {c.chapters.length} ch · {c.lessons.length} {c.unitLabel}
                        </span>
                      </div>
                      <h3>{c.title}</h3>
                      <p>{c.tagline}</p>
                      <div className="bar">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                      <div className="course-meta">
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
                          {next ? `Next: ${next.title}` : "Complete"}
                        </span>
                        <span className="mono">{pct}%</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="section-title">
            <h2>Where to study</h2>
            <span>Video first, then diagrams and text</span>
          </div>
          <div className="grid">
            {courses.map((c) => (
              <section key={c.slug} className="card where">
                <h3>{c.title}</h3>
                <div className="eyebrow mono" style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8 }}>
                  <Video size={13} /> Watch
                </div>
                <ol>
                  {c.bestVideo.slice(0, 2).map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="eyebrow mono" style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 10 }}>
                  <Book size={13} /> Read
                </div>
                <ol>
                  {c.bestRead.slice(0, 2).map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <div className="section-title">
            <h2>Progress backup</h2>
            <span>Download a copy of your progress, or import an old export</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn small" onClick={download}>
              Export progress
            </button>
            <button className="btn small" onClick={() => fileRef.current?.click()}>
              Import progress
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
            {msg && <span style={{ color: "var(--muted)", fontSize: 13 }}>{msg}</span>}
            <Link className="btn small" href="/system-design" style={{ marginLeft: "auto" }}>
              Start with System Design <Arrow size={14} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
