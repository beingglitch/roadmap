import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { courses } from "@/lib/courses";
import { doneKey, notesKey, redis } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_IDS = new Set(courses.flatMap((c) => c.lessons.map((l) => l.id)));
const MAX_NOTE = 20_000;
const MAX_BATCH = 1_000;

const isId = (x: unknown): x is string => typeof x === "string" && VALID_IDS.has(x);
const noStore = { "Cache-Control": "no-store" };

/** The only source of identity is the server-side session. Clients never choose whose data they touch. */
async function currentUser() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return { id, name: session.user?.name ?? null, image: session.user?.image ?? null };
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null }, { headers: noStore });

  const db = redis();
  const [doneRaw, notesRaw] = await Promise.all([
    db.hgetall<Record<string, number | string>>(doneKey(user.id)),
    db.hgetall<Record<string, string>>(notesKey(user.id)),
  ]);
  const done: Record<string, number> = {};
  for (const [k, v] of Object.entries(doneRaw ?? {})) if (VALID_IDS.has(k)) done[k] = Number(v);
  const notes: Record<string, string> = {};
  for (const [k, v] of Object.entries(notesRaw ?? {})) if (VALID_IDS.has(k)) notes[k] = String(v);

  return NextResponse.json({ user: { name: user.name, image: user.image }, done, notes }, { headers: noStore });
}

type Op =
  | { op: "set"; id: string; value: boolean }
  | { op: "bulk"; ids: string[]; value: boolean }
  | { op: "note"; id: string; text: string }
  | { op: "merge"; done?: Record<string, number>; notes?: Record<string, string> };

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers: noStore });

  let body: Op;
  try {
    body = (await req.json()) as Op;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const db = redis();
  const dk = doneKey(user.id);
  const nk = notesKey(user.id);
  const now = Date.now();

  switch (body?.op) {
    case "set": {
      if (!isId(body.id)) return bad("Unknown lesson");
      if (body.value) await db.hset(dk, { [body.id]: now });
      else await db.hdel(dk, body.id);
      break;
    }
    case "bulk": {
      if (!Array.isArray(body.ids) || body.ids.length > MAX_BATCH || !body.ids.every(isId)) return bad("Bad ids");
      if (body.ids.length === 0) break;
      if (body.value) {
        const p = db.pipeline();
        for (const id of body.ids) p.hsetnx(dk, id, now);
        await p.exec();
      } else await db.hdel(dk, ...body.ids);
      break;
    }
    case "note": {
      if (!isId(body.id) || typeof body.text !== "string" || body.text.length > MAX_NOTE) return bad("Bad note");
      if (body.text.trim()) await db.hset(nk, { [body.id]: body.text });
      else await db.hdel(nk, body.id);
      break;
    }
    case "merge": {
      const done = Object.entries(body.done ?? {}).filter(([k, v]) => isId(k) && Number.isFinite(Number(v)));
      const notes = Object.entries(body.notes ?? {}).filter(([k, v]) => isId(k) && typeof v === "string" && v.length <= MAX_NOTE);
      if (done.length + notes.length > MAX_BATCH * 2) return bad("Too many entries");
      if (done.length || notes.length) {
        const p = db.pipeline();
        // Keep existing values; only fill in what the account does not have yet.
        for (const [k, v] of done) p.hsetnx(dk, k, Math.min(Number(v), now));
        for (const [k, v] of notes) p.hsetnx(nk, k, v);
        await p.exec();
      }
      break;
    }
    default:
      return bad("Unknown op");
  }
  return NextResponse.json({ ok: true }, { headers: noStore });
}

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
