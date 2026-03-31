// Mock data for Quizzes page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_QUIZZES: LessonPlanCard[] = [
  { id: "qr1", code: "QZ1", subject: "Science", grade: "9", chapter: "Force and Laws of Motion", questionsCount: 30, status: "recommended" },
  { id: "qr2", code: "QZ2", subject: "Mathematics", grade: "10", chapter: "Algebra", questionsCount: 25, status: "recommended" },
  { id: "qr3", code: "QZ1", subject: "Hindi", grade: "8", chapter: "गद्य खंड", questionsCount: 20, status: "recommended" },
  { id: "qr4", code: "QZ2", subject: "English", grade: "9", chapter: "Grammar", questionsCount: 15, status: "recommended" },
  { id: "qr5", code: "QZ1", subject: "Social Science", grade: "7", chapter: "Democratic Politics", questionsCount: 22, status: "recommended" },
];

export const IN_PROGRESS_QUIZZES: LessonPlanCard[] = [
  { id: "qp1", code: "QZ1", subject: "Mathematics", grade: "10", chapter: "Geometry", questionsCount: 28, status: "in-progress" },
  { id: "qp2", code: "QZ2", subject: "Science", grade: "9", chapter: "Atoms and Molecules", questionsCount: 18, status: "in-progress" },
  { id: "qp3", code: "QZ1", subject: "English", grade: "8", chapter: "Prose", questionsCount: 12, status: "in-progress" },
  { id: "qp4", code: "QZ2", subject: "Hindi", grade: "9", chapter: "काव्य खंड", questionsCount: 20, status: "in-progress" },
];

export const SAVED_QUIZZES: LessonPlanCard[] = [
  { id: "qs1", code: "QZ1", subject: "Science", grade: "9", chapter: "Matter in Our Surroundings", questionsCount: 30, status: "saved" },
  { id: "qs2", code: "QZ2", subject: "Mathematics", grade: "10", chapter: "Statistics", questionsCount: 25, status: "saved" },
  { id: "qs3", code: "QZ1", subject: "Geography", grade: "8", chapter: "Climate", questionsCount: 17, status: "saved" },
];
