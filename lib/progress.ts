"use client";

import { useSyncExternalStore } from "react";

type Done = Record<string, number>; // lesson id -> completed at (ms)
type Notes = Record<string, string>;

const DONE_KEY = "roadmap.done.v1";
const NOTES_KEY = "roadmap.notes.v1";
const LAST_KEY = "roadmap.last.v1";

const EMPTY: Done = {};
const listeners = new Set<() => void>();
let cache: Done | null = null;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked; progress stays in memory for this tab */
  }
}

function getDone(): Done {
  if (cache === null) cache = read<Done>(DONE_KEY, {});
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === DONE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDone(): Done {
  return useSyncExternalStore(subscribe, getDone, () => EMPTY);
}

export function setDone(id: string, value: boolean) {
  const next = { ...getDone() };
  if (value) next[id] = Date.now();
  else delete next[id];
  cache = next;
  write(DONE_KEY, next);
  emit();
}

export function toggleDone(id: string) {
  setDone(id, !getDone()[id]);
}

export function setMany(ids: string[], value: boolean) {
  const next = { ...getDone() };
  for (const id of ids) {
    if (value) next[id] = next[id] ?? Date.now();
    else delete next[id];
  }
  cache = next;
  write(DONE_KEY, next);
  emit();
}

export function getNote(id: string) {
  return read<Notes>(NOTES_KEY, {})[id] ?? "";
}

export function saveNote(id: string, text: string) {
  const notes = read<Notes>(NOTES_KEY, {});
  if (text.trim()) notes[id] = text;
  else delete notes[id];
  write(NOTES_KEY, notes);
}

export function setLast(courseSlug: string, lessonSlug: string) {
  const last = read<Record<string, string>>(LAST_KEY, {});
  last[courseSlug] = lessonSlug;
  write(LAST_KEY, last);
}

export function getLast(courseSlug: string): string | undefined {
  return read<Record<string, string>>(LAST_KEY, {})[courseSlug];
}

export function exportProgress() {
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), done: getDone(), notes: read<Notes>(NOTES_KEY, {}) },
    null,
    2,
  );
}

export function importProgress(json: string) {
  const data = JSON.parse(json) as { done?: Done; notes?: Notes };
  if (!data || typeof data !== "object" || typeof data.done !== "object") throw new Error("Not a progress file");
  cache = { ...getDone(), ...data.done };
  write(DONE_KEY, cache);
  if (data.notes) write(NOTES_KEY, { ...read<Notes>(NOTES_KEY, {}), ...data.notes });
  emit();
}

/** Days with at least one completion, counting back from today. */
export function streak(done: Done) {
  const days = new Set(Object.values(done).map((t) => new Date(t).toDateString()));
  let n = 0;
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
