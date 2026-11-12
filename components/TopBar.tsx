"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { courses } from "@/lib/courses";
import { useDone } from "@/lib/progress";
import { ChevronDown, Chevron, Mark, Menu, Moon, Sun } from "./Icons";

function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setDark(t === "dark");
  }, []);
  const flip = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("roadmap.theme", next);
    } catch {}
    setDark(!dark);
  };
  return (
    <button className="icon-btn" onClick={flip} aria-label="Toggle dark mode" title="Toggle theme">
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}

function ProgressLink() {
  const done = useDone();
  const total = courses.reduce((n, c) => n + c.lessons.length, 0);
  const n = courses.reduce((k, c) => k + c.lessons.filter((l) => done[l.id]).length, 0);
  const p = total ? Math.round((n / total) * 100) : 0;
  return (
    <Link href="/progress" className="btn small" title="See your progress">
      <svg width="16" height="16" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="14" fill="none" stroke="var(--line-strong)" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="var(--done)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * 88} 88`}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="mono">{p}%</span>
      <span className="hide-sm">Progress</span>
    </Link>
  );
}

export function CourseSwitcher({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const done = useDone();
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const cur = courses.find((c) => c.slug === current);
  return (
    <div className="switcher" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu">
        {cur ? cur.short : "All roadmaps"} <ChevronDown />
      </button>
      {open && (
        <div className="menu" role="menu">
          <Link href="/" onClick={() => setOpen(false)} role="menuitem">
            All roadmaps
          </Link>
          {courses.map((c) => {
            const n = c.lessons.filter((l) => done[l.id]).length;
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                role="menuitem"
                aria-current={c.slug === current}
                onClick={() => setOpen(false)}
              >
                <span>
                  {c.title}
                  {c.priority === 2 && <span className="pct"> · P2</span>}
                </span>
                <span className="pct mono">
                  {n}/{c.lessons.length}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TopBar({
  course,
  crumbs = [],
  onMenu,
}: {
  course?: string;
  crumbs?: { label: string; href?: string }[];
  onMenu?: () => void;
}) {
  return (
    <header className="top">
      {onMenu && (
        <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open curriculum">
          <Menu />
        </button>
      )}
      <Link href="/" className="brand">
        <Mark /> Roadmap
      </Link>
      <span className="top-sep" />
      <CourseSwitcher current={course} />
      {crumbs.length > 0 && (
        <nav className="crumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} className={i < crumbs.length - 1 ? "hide-sm" : "cur"} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <Chevron size={12} />
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span className="cur">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="top-right">
        <ProgressLink />
        <ThemeToggle />
      </div>
    </header>
  );
}
