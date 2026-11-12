import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { courses, getCourse } from "@/lib/courses";

export const dynamicParams = false;

type Params = Promise<{ course: string; lesson: string }>;

export function generateStaticParams() {
  return courses.flatMap((c) => c.lessons.map((l) => ({ course: c.slug, lesson: l.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course, lesson } = await params;
  const l = getCourse(course)?.lessons.find((x) => x.slug === lesson);
  return { title: l?.title };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { course, lesson } = await params;
  const c = getCourse(course);
  if (!c || !c.lessons.some((l) => l.slug === lesson)) notFound();
  return <LessonView courseSlug={course} lessonSlug={lesson} />;
}
