import "server-only";
import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function redis() {
  if (client) return client;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured (KV_REST_API_URL / KV_REST_API_TOKEN)");
  client = new Redis({ url, token });
  return client;
}

export const doneKey = (uid: string) => `u:${uid}:done`;
export const notesKey = (uid: string) => `u:${uid}:notes`;
