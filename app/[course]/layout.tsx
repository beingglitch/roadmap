import { notFound } from "next/navigation";
import { CourseShell } from "@/components/CourseShell";
import { courses, getCourse } from "@/lib/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!getCourse(course)) notFound();
  return <CourseShell slug={course}>{children}</CourseShell>;
}
