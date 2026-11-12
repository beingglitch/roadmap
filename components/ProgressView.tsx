"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { courses, totalLessons } from "@/lib/courses";
import { streak, useDone } from "@/lib/progress";
import { Chevron } from "./Icons";
import { TopBar } from "./TopBar";

const DAY = 86_400_000;
const WEEKS = 18;

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : 0);
const fmtPct = (p: number) => `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

type Tip = { x: number; y: number; text: string } | null;

function Bar({ value, label, onTip }: { value: number; label: string; onTip: (t: Tip) => void }) {
  return (
    <div
      className="bar big"
      onMouseMove={(e) => onTip({ x: e.clientX, y: e.clientY, text: label })}
      onMouseLeave={() => onTip(null)}
      role="img"
      aria-label={label}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function ProgressView() {
  const done = useDone();
  const [tip, setTip] = useState<Tip>(null);
  const [openCourse, setOpenCourse] = useState<string | null>(courses[0].slug);

  const lessonById = useMemo(() => {
    const m = new Map<string, { title: string; course: string; courseSlug: string; slug: string }>();
    for (const c of courses) for (const l of c.lessons) m.set(l.id, { title: l.title, course: c.title, courseSlug: c.slug, slug: l.slug });
    return m;
  }, []);

  // Only count completions that still exist in the curriculum.
  const entries = Object.entries(done).filter(([id]) => lessonById.has(id));
  const doneCount = entries.length;
  const overall = pct(doneCount, totalLessons);

  const byPriority = ([1, 2] as const).map((p) => {
    const cs = courses.filter((c) => c.priority === p);
    const total = cs.reduce((n, c) => n + c.lessons.length, 0);
    const n = cs.reduce((k, c) => k + c.lessons.filter((l) => done[l.id]).length, 0);
    return { p, n, total, pct: pct(n, total) };
  });

  // Daily counts
  const counts = new Map<string, number>();
  for (const [, t] of entries) {
    const k = dayKey(new Date(t));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const last = (days: number) => entries.filter(([, t]) => t >= today0 - (days - 1) * DAY).length;
  const week = last(7);
  const last14 = last(14);
  const perDay = last14 / 14;
  const remaining = totalLessons - doneCount;
  const etaDays = perDay > 0 ? Math.ceil(remaining / perDay) : null;
  const eta = etaDays !== null ? new Date(today0 + etaDays * DAY) : null;

  // Heatmap grid: columns = weeks (Mon start), rows = weekday
  const dow = (now.getDay() + 6) % 7; // 0 = Monday
  const start = today0 - (WEEKS * 7 - 1 - (6 - dow)) * DAY;
  const cells: { date: Date; n: number; future: boolean }[] = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const date = new Date(start + i * DAY);
    cells.push({ date, n: counts.get(dayKey(date)) ?? 0, future: date.getTime() > today0 });
  }
  const max = Math.max(1, ...cells.map((c) => c.n));
  const level = (n: number) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)));
  const monthLabels = Array.from({ length: WEEKS }, (_, w) => {
    const d = cells[w * 7].date;
    const prev = w > 0 ? cells[(w - 1) * 7].date : null;
    return !prev || prev.getMonth() !== d.getMonth() ? d.toLocaleString("en", { month: "short" }) : "";
  });

  const recent = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, t]) => ({ ...lessonById.get(id)!, t }));

  return (
    <>
      <TopBar crumbs={[{ label: "Progress" }]} />
      <main className="main">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <div className="eyebrow mono" style={{ marginBottom: 10 }}>
            Tracking
          </div>

          <section className="card prog-hero">
            <div>
              <div className="hero-num mono">{fmtPct(overall)}</div>
              <div className="hero-sub">
                of everything covered · {doneCount} of {totalLessons} items
              </div>
              <div style={{ marginTop: 14 }}>
                <Bar value={overall} label={`Overall: ${doneCount}/${totalLessons} (${fmtPct(overall)})`} onTip={setTip} />
              </div>
            </div>
            <div className="tiles">
              {byPriority.map((b) => (
                <div key={b.p} className="tile">
                  <span>Priority {b.p}</span>
                  <b className="mono">{fmtPct(b.pct)}</b>
                  <small className="mono">
                    {b.n}/{b.total}
                  </small>
                </div>
              ))}
              <div className="tile">
                <span>This week</span>
                <b className="mono">{week}</b>
                <small>items done</small>
              </div>
              <div className="tile">
                <span>Streak</span>
                <b className="mono">{streak(done)}</b>
                <small>days</small>
              </div>
              <div className="tile wide">
                <span>Finish estimate</span>
                <b className="mono" style={{ fontSize: 18 }}>
                  {eta ? eta.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }) : "No pace yet"}
                </b>
                <small>{perDay > 0 ? `at ${perDay.toFixed(1)} items/day (last 14 days)` : "finish a few items to get an estimate"}</small>
              </div>
            </div>
          </section>

          <div className="section-title">
            <h2>Coverage by track</h2>
            <span>Percent of items checked off</span>
          </div>
          <section className="card track-list">
            {courses.map((c) => {
              const n = c.lessons.filter((l) => done[l.id]).length;
              const p = pct(n, c.lessons.length);
              return (
                <Link key={c.slug} href={`/${c.slug}`} className="track-row">
                  <span className="track-name">
                    {c.title}
                    <span className={`chip ${c.priority === 1 ? "p1" : "p2"}`} style={{ marginLeft: 8 }}>
                      P{c.priority}
                    </span>
                  </span>
                  <Bar value={p} label={`${c.title}: ${n}/${c.lessons.length} ${c.unitLabel} (${fmtPct(p)})`} onTip={setTip} />
                  <span className="track-val mono">
                    <b>{fmtPct(p)}</b> {n}/{c.lessons.length}
                  </span>
                </Link>
              );
            })}
          </section>

          <div className="section-title">
            <h2>Activity</h2>
            <span>Items completed per day, last {WEEKS} weeks</span>
          </div>
          <section className="card heat-card">
            <div className="heat-scroll">
              <div className="heat-months mono" style={{ gridTemplateColumns: `28px repeat(${WEEKS}, 14px)` }}>
                <span />
                {monthLabels.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
              <div className="heat">
                <div className="heat-days mono">
                  <span>Mon</span>
                  <span />
                  <span>Wed</span>
                  <span />
                  <span>Fri</span>
                  <span />
                  <span />
                </div>
                <div className="heat-grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 14px)` }}>
                  {cells.map((c, i) => (
                    <span
                      key={i}
                      className={`cell l${level(c.n)} ${c.future ? "future" : ""}`}
                      onMouseMove={(e) =>
                        !c.future &&
                        setTip({
                          x: e.clientX,
                          y: e.clientY,
                          text: `${c.n} item${c.n === 1 ? "" : "s"} · ${c.date.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" })}`,
                        })
                      }
                      onMouseLeave={() => setTip(null)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="heat-legend mono">
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <span key={l} className={`cell l${l}`} />
              ))}
              More
            </div>
          </section>

          <div className="section-title">
            <h2>By chapter</h2>
            <span>Where you are inside each track</span>
          </div>
          {courses.map((c) => {
            const isOpen = openCourse === c.slug;
            const n = c.lessons.filter((l) => done[l.id]).length;
            return (
              <section key={c.slug} className="card chapter" style={{ marginBottom: 8 }}>
                <button className="ch-toggle" onClick={() => setOpenCourse(isOpen ? null : c.slug)} aria-expanded={isOpen}>
                  <Chevron size={13} className={`chev ${isOpen ? "open" : ""}`} />
                  <span style={{ fontWeight: 500 }}>{c.title}</span>
                  <span className="mono" style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 12 }}>
                    {fmtPct(pct(n, c.lessons.length))} · {n}/{c.lessons.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="ch-bars">
                    {c.chapters.map((ch) => {
                      const k = ch.lessons.filter((l) => done[l.id]).length;
                      const p = pct(k, ch.lessons.length);
                      return (
                        <div key={ch.index} className="ch-bar-row">
                          <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>
                            {ch.num}
                          </span>
                          <span className="ch-bar-name">{ch.title}</span>
                          <Bar value={p} label={`${ch.title}: ${k}/${ch.lessons.length} (${fmtPct(p)})`} onTip={setTip} />
                          <span className="mono track-val">
                            {k}/{ch.lessons.length}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          <div className="section-title">
            <h2>Recently completed</h2>
          </div>
          <section className="card" style={{ padding: recent.length ? "6px 0" : 18 }}>
            {recent.length === 0 ? (
              <span style={{ color: "var(--muted)" }}>Nothing yet. Tick your first lesson and it shows up here.</span>
            ) : (
              <ul className="rows">
                {recent.map((r) => (
                  <li key={r.courseSlug + r.slug} className="recent-row">
                    <Link href={`/${r.courseSlug}/${r.slug}`} className="t">
                      {r.title}
                    </Link>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{r.course}</span>
                    <span className="mono" style={{ color: "var(--muted)", fontSize: 12 }}>
                      {new Date(r.t).toLocaleDateString("en", { day: "numeric", month: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      {tip && (
        <div className="tip mono" style={{ left: tip.x + 12, top: tip.y + 12 }}>
          {tip.text}
        </div>
      )}
    </>
  );
}
