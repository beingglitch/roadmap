import type { Chapter, Course, CourseSpec, Lesson, LessonExtra, Link } from "../types";
import { systemDesign } from "./system-design";
import { aiEngineering } from "./ai-engineering";
import { inferenceEngineering } from "./inference-engineering";
import { cloud } from "./cloud";
import { awsPricing } from "./aws-pricing";
import { unityVr } from "./unity-vr";

const pad = (n: number) => String(n).padStart(2, "0");

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ytSearch = (q: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q.trim()).replace(/%20/g, "+")}`;

function build(spec: CourseSpec): Course {
  const used = new Set<string>();
  const all: Lesson[] = [];
  const chapters: Chapter[] = spec.chapters.map((ch, ci) => {
    const lessons = ch.lessons.map((l, li) => {
      const [title, extra]: [string, LessonExtra] = typeof l === "string" ? [l, {}] : l;
      let slug = slugify(title);
      if (used.has(slug)) slug = `${slug}-${pad(ci + 1)}`;
      used.add(slug);

      const query = extra.q ?? `${ch.vq} ${title}`;
      const videos: Link[] = [];
      if (extra.video) videos.push(extra.video);
      videos.push({ label: `Search YouTube: "${query.trim()}"`, url: ytSearch(query) });
      for (const v of ch.video ?? []) if (!videos.some((x) => x.url === v.url)) videos.push(v);

      const reads: Link[] = [];
      if (extra.read) reads.push(extra.read);
      for (const r of ch.read) if (!reads.some((x) => x.url === r.url)) reads.push(r);

      const source: Link | undefined =
        extra.src && spec.srcBase
          ? { label: `Lesson on ${spec.source?.label ?? "source course"}`, url: spec.srcBase + extra.src }
          : spec.source;

      const lesson: Lesson = {
        id: `${spec.slug}/${slug}`,
        slug,
        title,
        code: `${pad(ci + 1)}.${pad(li + 1)}`,
        chapterIndex: ci,
        index: all.length,
        videos,
        reads,
        source,
      };
      all.push(lesson);
      return lesson;
    });
    return { ...ch, index: ci, num: pad(ci + 1), lessons };
  });
  return { ...spec, chapters, lessons: all };
}

export const courses: Course[] = [systemDesign, aiEngineering, inferenceEngineering, cloud, awsPricing, unityVr].map(build);

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

export const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);
