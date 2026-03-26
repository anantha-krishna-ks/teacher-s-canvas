// Mock data for Assessment page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_ASSESSMENTS: LessonPlanCard[] = [
  { id: "ar1", code: "AS1", subject: "Science", grade: "9", questionsCount: 40, countLabel: "Marks", status: "recommended" },
  { id: "ar2", code: "AS2", subject: "Mathematics", grade: "10", questionsCount: 35, countLabel: "Marks", status: "recommended" },
  { id: "ar3", code: "AS1", subject: "English", grade: "8", questionsCount: 30, countLabel: "Marks", status: "recommended" },
  { id: "ar4", code: "AS2", subject: "Hindi", grade: "9", questionsCount: 25, countLabel: "Marks", status: "recommended" },
];

export const IN_PROGRESS_ASSESSMENTS: LessonPlanCard[] = [
  { id: "ap1", code: "AS1", subject: "Mathematics", grade: "10", questionsCount: 32, countLabel: "Marks", status: "in-progress" },
  { id: "ap2", code: "AS2", subject: "Science", grade: "9", questionsCount: 28, countLabel: "Marks", status: "in-progress" },
  { id: "ap3", code: "AS1", subject: "Social Science", grade: "8", questionsCount: 22, countLabel: "Marks", status: "in-progress" },
];

export const SAVED_ASSESSMENTS: LessonPlanCard[] = [
  { id: "as1", code: "AS1", subject: "Science", grade: "9", questionsCount: 40, countLabel: "Marks", status: "saved" },
  { id: "as2", code: "AS2", subject: "Mathematics", grade: "10", questionsCount: 35, countLabel: "Marks", status: "saved" },
  { id: "as3", code: "AS1", subject: "English", grade: "8", questionsCount: 30, countLabel: "Marks", status: "saved" },
  { id: "as4", code: "AS2", subject: "Hindi", grade: "9", questionsCount: 25, countLabel: "Marks", status: "saved" },
  { id: "as5", code: "AS1", subject: "Geography", grade: "7", questionsCount: 20, countLabel: "Marks", status: "saved" },
];
