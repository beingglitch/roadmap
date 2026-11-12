"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCourse } from "@/lib/courses";
import { setMany, toggleDone, useDone } from "@/lib/progress";
import { Arrow, Book, Ext, Play, Video } from "./Icons";

export function CourseOverview({ slug }: { slug: string }) {
  const course = getCourse(slug)!;
  const done = useDone();
  const [q, setQ] = useState("");
  const [hideDone, setHideDone] = useState(false);

  const total = course.lessons.length;
  const n = course.lessons.filter((l) => done[l.id]).length;
  const next = course.lessons.find((l) => !done[l.id]);
  const pct = total ? Math.round((n / total) * 100) : 0;

  const chapters = useMemo(() => {
    const term = q.trim().toLowerCase();
    return course.chapters
      .map((ch) => ({
        ch,
        lessons: ch.lessons.filter(
          (l) => (!term || l.title.toLowerCase().includes(term) || ch.title.toLowerCase().includes(term)) && (!hideDone || !done[l.id]),
        ),
      }))
      .filter((x) => x.lessons.length > 0);
  }, [course, q, hideDone, done]);

  return (
    <div className="wrap">
      <section className="card ov-hero">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className={`chip ${course.priority === 1 ? "p1" : "p2"}`}>Priority {course.priority}</span>
          <span className="chip mono">
            {course.chapters.length} chapters · {total} {course.unitLabel}
          </span>
          {course.source && (
            <a className="chip" href={course.source.url} target="_blank" rel="noreferrer">
              {course.source.label} <Ext size={12} />
            </a>
          )}
        </div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div>
          <div className="course-meta" style={{ marginBottom: 6 }}>
            <span>
              {n} of {total} {course.unitLabel} done
            </span>
            <span className="mono">{pct}%</span>
          </div>
          <div className="bar">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="ov-actions">
          {next ? (
            <Link className="btn primary" href={`/${course.slug}/${next.slug}`}>
              {n === 0 ? "Start" : "Continue"}: {next.title} <Arrow />
            </Link>
          ) : (
            <span className="chip ok">Course complete</span>
          )}
        </div>
      </section>

      <div className="picks">
        <section className="card pick">
          <h3>
            <Video /> Best place to watch <span className="chip p1">1st</span>
          </h3>
          <ul>
            {course.bestVideo.map((r, i) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  <span className="rank mono">{i + 1}</span>
                  <span>{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="card pick">
          <h3>
            <Book /> Diagrams and text <span className="chip">2nd</span>
          </h3>
          <ul>
            {course.bestRead.map((r, i) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  <span className="rank mono">{i + 1}</span>
                  <span>{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Find a chapter or lesson"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Find a chapter or lesson"
        />
        <button className="btn small" onClick={() => setHideDone(!hideDone)} aria-pressed={hideDone}>
          {hideDone ? "Show done" : "Hide done"}
        </button>
      </div>

      {chapters.map(({ ch, lessons }) => {
        const cn = ch.lessons.filter((l) => done[l.id]).length;
        const cp = Math.round((cn / ch.lessons.length) * 100);
        const firstVideo = ch.video?.[0];
        return (
          <section key={ch.index} className="card chapter">
            <div className="chapter-head">
              <span className="num mono">{ch.num}</span>
              <div>
                <div className="group-label mono">{ch.group}</div>
                <h3>{ch.title}</h3>
                <p>{ch.blurb}</p>
              </div>
              <div className="chapter-side">
                <span className="mono" style={{ fontSize: 12, color: cn === ch.lessons.length ? "var(--done)" : "var(--muted)" }}>
                  {cn}/{ch.lessons.length}
                </span>
                <div className="bar">
                  <span style={{ width: `${cp}%` }} />
                </div>
              </div>
            </div>
            <ul className="rows">
              {lessons.map((l) => (
                <li key={l.id} className={`row ${done[l.id] ? "done" : ""}`}>
                  <input
                    type="checkbox"
                    className="check"
                    checked={!!done[l.id]}
                    onChange={() => toggleDone(l.id)}
                    aria-label={`Mark "${l.title}" done`}
                  />
                  <span className="code mono">{l.code}</span>
                  <Link className="t" href={`/${course.slug}/${l.slug}`}>
                    {l.title}
                  </Link>
                  <span className="acts">
                    <a className="mini" href={l.videos[0].url} target="_blank" rel="noreferrer" title="Watch (video first)">
                      <Play size={13} />
                    </a>
                    <a className="mini" href={l.reads[0]?.url} target="_blank" rel="noreferrer" title="Read (diagrams and text)">
                      <Book size={14} />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
            <div className="chapter-foot">
              {firstVideo && (
                <a className="btn small" href={firstVideo.url} target="_blank" rel="noreferrer">
                  <Video size={14} /> {firstVideo.label}
                </a>
              )}
              <a className="btn small" href={ch.read[0].url} target="_blank" rel="noreferrer">
                <Book size={14} /> {ch.read[0].label}
              </a>
              <button
                className="btn small"
                style={{ marginLeft: "auto" }}
                onClick={() => setMany(ch.lessons.map((l) => l.id), cn !== ch.lessons.length)}
              >
                {cn === ch.lessons.length ? "Clear chapter" : "Mark chapter done"}
              </button>
            </div>
          </section>
        );
      })}
      {chapters.length === 0 && <p style={{ color: "var(--muted)" }}>Nothing matches.</p>}
    </div>
  );
}
