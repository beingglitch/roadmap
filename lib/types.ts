export type Link = {
  label: string;
  url: string;
  /** YouTube video id, when the video can be embedded directly */
  embed?: string;
};

export type LessonExtra = {
  /** specific video for this lesson, shown first */
  video?: Link;
  /** specific reading/diagram for this lesson, shown before the chapter defaults */
  read?: Link;
  /** slug on the course source site (fanout.sh) */
  src?: string;
  /** optional custom YouTube search query (replaces the default) */
  q?: string;
};

export type LessonSpec = string | [string, LessonExtra];

export type ChapterSpec = {
  title: string;
  group: string;
  blurb: string;
  /** YouTube search prefix, usually a trusted channel name */
  vq: string;
  video?: Link[];
  read: Link[];
  lessons: LessonSpec[];
};

export type CourseSpec = {
  slug: string;
  title: string;
  short: string;
  priority: 1 | 2;
  tagline: string;
  description: string;
  unitLabel: string;
  source?: Link;
  /** prefix for lesson-level source links, joined with LessonExtra.src */
  srcBase?: string;
  bestVideo: Link[];
  bestRead: Link[];
  chapters: ChapterSpec[];
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  code: string;
  chapterIndex: number;
  index: number;
  videos: Link[];
  reads: Link[];
  source?: Link;
};

export type Chapter = Omit<ChapterSpec, "lessons"> & {
  index: number;
  num: string;
  lessons: Lesson[];
};

export type Course = Omit<CourseSpec, "chapters"> & {
  chapters: Chapter[];
  lessons: Lesson[];
};
