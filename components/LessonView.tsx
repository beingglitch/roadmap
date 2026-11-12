"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourse } from "@/lib/courses";
import { saveNote, setDone, setLast, toggleDone, useProgress } from "@/lib/progress";
import { Arrow, Book, Check, ChevronLeft, Chevron, Diagram, Ext, Link2, Note, Play, Video } from "./Icons";

export function LessonView({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const course = getCourse(courseSlug)!;
  const lesson = course.lessons.find((l) => l.slug === lessonSlug)!;
  const chapter = course.chapters[lesson.chapterIndex];
  const prev = course.lessons[lesson.index - 1];
  const next = course.lessons[lesson.index + 1];
  const posInChapter = chapter.lessons.findIndex((l) => l.id === lesson.id) + 1;

  const { done, notes, status } = useProgress();
  const isDone = !!done[lesson.id];
  const router = useRouter();
  const [tab, setTab] = useState<"study" | "notes">("study");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const embed = lesson.videos.find((v) => v.embed);
  const firstVideo = lesson.videos[0];

  useEffect(() => {
    setLast(course.slug, lesson.slug);
  }, [course.slug, lesson.slug]);

  // Load the saved note when the lesson changes or once the account finishes loading.
  useEffect(() => {
    setNote(notes[lesson.id] ?? "");
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return;
      if (e.key === "ArrowRight" && next) router.push(`/${course.slug}/${next.slug}`);
      if (e.key === "ArrowLeft" && prev) router.push(`/${course.slug}/${prev.slug}`);
      if (e.key.toLowerCase() === "d") toggleDone(lesson.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, course.slug, next, prev, lesson.id]);

  const completeAndNext = () => {
    setDone(lesson.id, true);
    if (next) router.push(`/${course.slug}/${next.slug}`);
  };

  return (
    <div className="wrap">
      <section className="card lesson-head">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span className="eyebrow mono">
            Module {chapter.num} · Lesson {lesson.code}
          </span>
          <div className="tabs" role="tablist">
            <button className="tab" role="tab" aria-selected={tab === "study"} onClick={() => setTab("study")}>
              <Book size={14} /> Study
            </button>
            <button className="tab" role="tab" aria-selected={tab === "notes"} onClick={() => setTab("notes")}>
              <Note size={14} /> Notes
            </button>
          </div>
        </div>
        <h1>{lesson.title}</h1>
        <div className="lesson-meta">
          <span className="chip mono">{chapter.title}</span>
          {isDone && (
            <span className="chip ok">
              <Check size={12} /> Done
            </span>
          )}
        </div>
      </section>

      {tab === "study" ? (
        <>
          <div className="video">
            {embed ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${embed.embed}`}
                title={embed.label}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="video-empty">
                <div>
                  <div className="k mono">{course.title.toUpperCase()} · {lesson.code}</div>
                  <h2 className="mono">{lesson.title.toUpperCase()}</h2>
                  <a className="play" href={firstVideo.url} target="_blank" rel="noreferrer">
                    <Play size={14} /> Watch first
                  </a>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>Opens the best video search for this lesson</div>
                </div>
              </div>
            )}
          </div>

          <section className="card res">
            <h2>
              <Video /> 1. Watch <span className="chip p1">priority</span>
            </h2>
            <p className="hint">Start with a video. Pick one under 20 minutes, then come back and check it off.</p>
            <ul>
              {lesson.videos.map((v, i) => (
                <li key={v.url}>
                  <a href={v.url} target="_blank" rel="noreferrer">
                    <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
                    <span>{v.label}</span>
                    <Ext className="ext" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="card res">
            <h2>
              <Diagram /> 2. Diagrams and text
            </h2>
            <p className="hint">Then read one source with diagrams to lock it in.</p>
            <ul>
              {lesson.reads.map((r, i) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
                    <span>{r.label}</span>
                    <Ext className="ext" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {lesson.source && (
            <section className="card res">
              <h2>
                <Link2 /> 3. Course source
              </h2>
              <ul>
                <li>
                  <a href={lesson.source.url} target="_blank" rel="noreferrer">
                    <span className="n mono">→</span>
                    <span>{lesson.source.label}</span>
                    <Ext className="ext" />
                  </a>
                </li>
              </ul>
            </section>
          )}
        </>
      ) : (
        <section className="card res notes">
          <h2>
            <Note /> Notes
          </h2>
          <p className="hint">Saved to your account. Write the one diagram or number you want to remember.</p>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
            onBlur={() => {
              if (note === (notes[lesson.id] ?? "")) return;
              saveNote(lesson.id, note).then(setSaved);
            }}
            placeholder={status === "user" ? "Key idea, tradeoff, numbers, links…" : "Sign in to keep notes"}
          />
          <div className="saved">{saved ? "Saved to your account" : "Saves when you click away"}</div>
        </section>
      )}

      <div className="bottom">
        <span className="chip mono">{course.short}</span>
        <div className="mid">
          {prev ? (
            <Link className="mini" href={`/${course.slug}/${prev.slug}`} aria-label="Previous lesson">
              <ChevronLeft />
            </Link>
          ) : (
            <span className="mini" />
          )}
          <Link className="pill" href={`/${course.slug}`}>
            <span className="t">{chapter.title}</span>
            <span className="c mono">
              {posInChapter}/{chapter.lessons.length}
            </span>
          </Link>
          {next ? (
            <Link className="mini" href={`/${course.slug}/${next.slug}`} aria-label="Next lesson">
              <Chevron size={16} />
            </Link>
          ) : (
            <span className="mini" />
          )}
        </div>
        <div className="right-acts">
          <button className="done-btn" aria-pressed={isDone} onClick={() => toggleDone(lesson.id)} title="Toggle done (D)">
            <Check size={14} /> {isDone ? "Done" : "Mark done"}
          </button>
          {next ? (
            <button className="btn primary small" onClick={completeAndNext} title="Mark done and go to next">
              Next <Arrow size={14} />
            </button>
          ) : (
            <Link className="btn primary small" href={`/${course.slug}`}>
              Finish
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
