// Mock data for Class Plan page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_CLASS_PLANS: LessonPlanCard[] = [
  { id: "cr1", code: "CP1", subject: "Hindi", grade: "9", questionsCount: 8, countLabel: "Sessions", status: "recommended" },
  { id: "cr2", code: "CP2", subject: "Science", grade: "10", questionsCount: 10, countLabel: "Sessions", status: "recommended" },
  { id: "cr3", code: "CP1", subject: "Mathematics", grade: "8", questionsCount: 12, countLabel: "Sessions", status: "recommended" },
  { id: "cr4", code: "CP2", subject: "English", grade: "9", questionsCount: 6, countLabel: "Sessions", status: "recommended" },
  { id: "cr5", code: "CP1", subject: "Social Science", grade: "7", questionsCount: 9, countLabel: "Sessions", status: "recommended" },
];

export const IN_PROGRESS_CLASS_PLANS: LessonPlanCard[] = [
  { id: "cp1", code: "CP1", subject: "Science", grade: "9", questionsCount: 5, countLabel: "Sessions", status: "in-progress" },
  { id: "cp2", code: "CP2", subject: "Mathematics", grade: "10", questionsCount: 7, countLabel: "Sessions", status: "in-progress" },
  { id: "cp3", code: "CP1", subject: "English", grade: "8", questionsCount: 4, countLabel: "Sessions", status: "in-progress" },
];

export const SAVED_CLASS_PLANS: LessonPlanCard[] = [
  { id: "cs1", code: "CP1", subject: "Hindi", grade: "9", questionsCount: 8, countLabel: "Sessions", status: "saved" },
  { id: "cs2", code: "CP2", subject: "Science", grade: "10", questionsCount: 10, countLabel: "Sessions", status: "saved" },
  { id: "cs3", code: "CP1", subject: "Mathematics", grade: "8", questionsCount: 12, countLabel: "Sessions", status: "saved" },
  { id: "cs4", code: "CP2", subject: "English", grade: "9", questionsCount: 6, countLabel: "Sessions", status: "saved" },
];
