// Mock data for Dashboard module cards

import type { PreviewType } from "@/components/ModuleCardPreview";

export interface RecentItem {
  name: string;
  id: string;
}

export interface ModuleCard {
  title: string;
  slug: string;
  previewType: PreviewType;
  recentItems: RecentItem[];
}

export const MODULES: ModuleCard[] = [
  {
    title: "Lesson Plan",
    slug: "lesson-plans",
    previewType: "lesson",
    recentItems: [
      { name: "Grade 5 — Fractions Introduction", id: "lp-001" },
      { name: "Grade 8 — Photosynthesis", id: "lp-002" },
    ],
  },
  {
    title: "Class Plan",
    slug: "class-plans",
    previewType: "class",
    recentItems: [
      { name: "Weekly Plan — Science", id: "cp-001" },
      { name: "Monthly Plan — English", id: "cp-002" },
    ],
  },
  {
    title: "Presentations",
    slug: "presentations",
    previewType: "presentation",
    recentItems: [
      { name: "Solar System Overview", id: "pr-001" },
      { name: "World War II Timeline", id: "pr-002" },
    ],
  },
  {
    title: "Worksheets",
    slug: "worksheets",
    previewType: "worksheet",
    recentItems: [
      { name: "Math — Algebra Practice", id: "ws-001" },
      { name: "English — Reading Comprehension", id: "ws-002" },
    ],
  },
  {
    title: "Quizzes",
    slug: "quizzes",
    previewType: "quiz",
    recentItems: [
      { name: "Science — Chapter 4 Quiz", id: "qz-001" },
      { name: "History — Midterm Review", id: "qz-002" },
    ],
  },
  {
    title: "Assessment",
    slug: "assessments",
    previewType: "assessment",
    recentItems: [
      { name: "Grade 6 — Term 1 Assessment", id: "as-001" },
    ],
  },
  {
    title: "Classroom Display",
    slug: "displays",
    previewType: "display",
    recentItems: [
      { name: "Periodic Table Poster", id: "cd-001" },
      { name: "Class Rules Display", id: "cd-002" },
    ],
  },
];
