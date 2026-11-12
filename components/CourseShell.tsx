"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourse } from "@/lib/courses";
import { useDone } from "@/lib/progress";
import { Chevron, Home } from "./Icons";
import { TopBar } from "./TopBar";

export function CourseShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const course = getCourse(slug)!;
  const params = useParams<{ lesson?: string }>();
  const pathname = usePathname();
  const done = useDone();
  const [menu, setMenu] = useState(false);

  const active = course.lessons.find((l) => l.slug === params.lesson);
  const [open, setOpen] = useState<Set<number>>(() => new Set([active?.chapterIndex ?? 0]));

  useEffect(() => {
    setMenu(false);
    if (active) setOpen((s) => (s.has(active.chapterIndex) ? s : new Set(s).add(active.chapterIndex)));
  }, [pathname, active]);

  useEffect(() => {
    document.querySelector(".l-link.active")?.scrollIntoView({ block: "nearest" });
  }, [params.lesson]);

  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const crumbs = active
    ? [
        { label: course.title, href: `/${course.slug}` },
        { label: active.title },
      ]
    : [{ label: course.title }];

  return (
    <>
      <TopBar course={course.slug} crumbs={crumbs} onMenu={() => setMenu(!menu)} />
      <div className="shell">
        <aside className={`side ${menu ? "open" : ""}`} aria-label="Curriculum">
          <div className="side-progress">
            {(() => {
              const n = course.lessons.filter((l) => done[l.id]).length;
              const p = Math.round((n / course.lessons.length) * 100);
              return (
                <>
                  <div className="row-l">
                    <span>
                      {n}/{course.lessons.length} {course.unitLabel}
                    </span>
                    <span className="mono" style={{ color: "var(--fg)" }}>
                      {p}%
                    </span>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${p}%` }} />
                  </div>
                </>
              );
            })()}
          </div>
          <div className="side-label mono">Workspace</div>
          <Link href={`/${course.slug}`} className={`side-link ${!active ? "active" : ""}`}>
            <Home /> Overview
          </Link>
          <div className="side-label mono" style={{ marginTop: 10 }}>
            Curriculum
          </div>
          {course.chapters.map((ch) => {
            const n = ch.lessons.filter((l) => done[l.id]).length;
            const isOpen = open.has(ch.index);
            return (
              <div key={ch.index}>
                <button className="ch-head" onClick={() => toggle(ch.index)} aria-expanded={isOpen}>
                  <span className="ch-num mono">{ch.num}</span>
                  <Chevron size={12} className={`chev ${isOpen ? "open" : ""}`} />
                  <span className="ch-title">{ch.title}</span>
                  <span className={`ch-count mono ${n === ch.lessons.length ? "full" : ""}`}>
                    {n}/{ch.lessons.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="ch-lessons">
                    {ch.lessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/${course.slug}/${l.slug}`}
                        className={`l-link ${l.slug === params.lesson ? "active" : ""} ${done[l.id] ? "done" : ""}`}
                        title={l.title}
                      >
                        <span className="l-dot" />
                        <span className="l-text">{l.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>
        <div className={`overlay ${menu ? "open" : ""}`} onClick={() => setMenu(false)} />
        <main className="main">{children}</main>
      </div>
    </>
  );
}
