"use client";

import { useSyncExternalStore } from "react";
import { signIn, signOut } from "next-auth/react";

type Done = Record<string, number>; // lesson id -> completed at (ms)
type Notes = Record<string, string>;
export type User = { name: string | null; image: string | null };

type State = {
  status: "loading" | "anon" | "user" | "error";
  user: User | null;
  done: Done;
  notes: Notes;
  prompt: boolean; // show the "sign in to save" dialog
};

// Pre-auth versions stored progress in the browser; it is merged into the account on first sign-in.
const LEGACY_DONE = "roadmap.done.v1";
const LEGACY_NOTES = "roadmap.notes.v1";
const LAST_KEY = "roadmap.last.v1";

const SERVER: State = { status: "loading", user: null, done: {}, notes: {}, prompt: false };
let state: State = SERVER;
let started = false;
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function api(body: unknown) {
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    set({ status: "anon", user: null, done: {}, notes: {}, prompt: true });
    throw new Error("Signed out");
  }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Save failed");
}

async function load() {
  try {
    const res = await fetch("/api/progress", { cache: "no-store" });
    const data = (await res.json()) as { user: User | null; done?: Done; notes?: Notes };
    if (!data.user) return set({ status: "anon", user: null, done: {}, notes: {} });

    const legacyDone = readLocal<Done>(LEGACY_DONE, {});
    const legacyNotes = readLocal<Notes>(LEGACY_NOTES, {});
    if (Object.keys(legacyDone).length || Object.keys(legacyNotes).length) {
      await api({ op: "merge", done: legacyDone, notes: legacyNotes });
      try {
        localStorage.removeItem(LEGACY_DONE);
        localStorage.removeItem(LEGACY_NOTES);
      } catch {}
      return load();
    }
    set({ status: "user", user: data.user, done: data.done ?? {}, notes: data.notes ?? {} });
  } catch {
    set({ status: "error" });
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!started) {
    started = true;
    void load();
  }
  return () => listeners.delete(cb);
}

const snap = () => state;
const serverSnap = () => SERVER;

export function useProgress(): State {
  return useSyncExternalStore(subscribe, snap, serverSnap);
}

export function useDone(): Done {
  return useProgress().done;
}

function needUser() {
  if (state.status === "user") return true;
  if (state.status !== "loading") set({ prompt: true });
  return false;
}

export function closePrompt() {
  set({ prompt: false });
}

export function startSignIn() {
  void signIn("github", { redirectTo: window.location.href });
}

export function startSignOut() {
  void signOut({ redirectTo: window.location.pathname });
}

export function setDone(id: string, value: boolean) {
  if (!needUser()) return;
  const prev = state.done;
  const next = { ...prev };
  if (value) next[id] = next[id] ?? Date.now();
  else delete next[id];
  set({ done: next });
  api({ op: "set", id, value }).catch(() => set({ done: prev }));
}

export function toggleDone(id: string) {
  setDone(id, !state.done[id]);
}

export function setMany(ids: string[], value: boolean) {
  if (!needUser()) return;
  const prev = state.done;
  const next = { ...prev };
  const now = Date.now();
  for (const id of ids) {
    if (value) next[id] = next[id] ?? now;
    else delete next[id];
  }
  set({ done: next });
  api({ op: "bulk", ids, value }).catch(() => set({ done: prev }));
}

export function saveNote(id: string, text: string): Promise<boolean> {
  if (!needUser()) return Promise.resolve(false);
  const prev = state.notes;
  const next = { ...prev };
  if (text.trim()) next[id] = text;
  else delete next[id];
  set({ notes: next });
  return api({ op: "note", id, text }).then(
    () => true,
    () => {
      set({ notes: prev });
      return false;
    },
  );
}

export function setLast(courseSlug: string, lessonSlug: string) {
  const last = readLocal<Record<string, string>>(LAST_KEY, {});
  last[courseSlug] = lessonSlug;
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(last));
  } catch {}
}

export function exportProgress() {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), done: state.done, notes: state.notes }, null, 2);
}

export async function importProgress(json: string) {
  if (!needUser()) throw new Error("Sign in first");
  const data = JSON.parse(json) as { done?: Done; notes?: Notes };
  if (!data || typeof data !== "object" || typeof data.done !== "object") throw new Error("Not a progress file");
  await api({ op: "merge", done: data.done, notes: data.notes ?? {} });
  await load();
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
