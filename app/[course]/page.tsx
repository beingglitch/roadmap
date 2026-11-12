import type { Metadata } from "next";
import { CourseOverview } from "@/components/CourseOverview";
import { getCourse } from "@/lib/courses";

export async function generateMetadata({ params }: { params: Promise<{ course: string }> }): Promise<Metadata> {
  const { course } = await params;
  const c = getCourse(course);
  return { title: c?.title, description: c?.tagline };
}

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  return <CourseOverview slug={course} />;
}
