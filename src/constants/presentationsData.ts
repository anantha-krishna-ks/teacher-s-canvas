// Mock data for Presentations page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_PRESENTATIONS: LessonPlanCard[] = [
  { id: "pr1", code: "PT1", subject: "Science", grade: "9", questionsCount: 15, status: "recommended" },
  { id: "pr2", code: "PT2", subject: "Mathematics", grade: "10", questionsCount: 20, status: "recommended" },
  { id: "pr3", code: "PT1", subject: "English", grade: "8", questionsCount: 12, status: "recommended" },
  { id: "pr4", code: "PT2", subject: "Hindi", grade: "9", questionsCount: 18, status: "recommended" },
  { id: "pr5", code: "PT1", subject: "Geography", grade: "7", questionsCount: 10, status: "recommended" },
];

export const IN_PROGRESS_PRESENTATIONS: LessonPlanCard[] = [
  { id: "pp1", code: "PT1", subject: "Science", grade: "10", questionsCount: 14, status: "in-progress" },
  { id: "pp2", code: "PT2", subject: "Hindi", grade: "9", questionsCount: 8, status: "in-progress" },
  { id: "pp3", code: "PT1", subject: "English", grade: "8", questionsCount: 11, status: "in-progress" },
  { id: "pp4", code: "PT2", subject: "Mathematics", grade: "10", questionsCount: 16, status: "in-progress" },
];

export const SAVED_PRESENTATIONS: LessonPlanCard[] = [
  { id: "ps1", code: "PT1", subject: "Science", grade: "9", questionsCount: 15, status: "saved" },
  { id: "ps2", code: "PT2", subject: "Mathematics", grade: "10", questionsCount: 20, status: "saved" },
  { id: "ps3", code: "PT1", subject: "Social Science", grade: "8", questionsCount: 13, status: "saved" },
];
