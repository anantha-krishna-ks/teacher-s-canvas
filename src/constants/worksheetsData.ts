// Mock data for Worksheets page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_WORKSHEETS: LessonPlanCard[] = [
  { id: "wr1", code: "WS1", subject: "Mathematics", grade: "9", questionsCount: 25, countLabel: "Problems", status: "recommended" },
  { id: "wr2", code: "WS2", subject: "Science", grade: "10", questionsCount: 20, countLabel: "Problems", status: "recommended" },
  { id: "wr3", code: "WS1", subject: "English", grade: "8", questionsCount: 15, countLabel: "Problems", status: "recommended" },
  { id: "wr4", code: "WS2", subject: "Hindi", grade: "9", questionsCount: 18, countLabel: "Problems", status: "recommended" },
];

export const IN_PROGRESS_WORKSHEETS: LessonPlanCard[] = [
  { id: "wp1", code: "WS1", subject: "Mathematics", grade: "10", questionsCount: 22, countLabel: "Problems", status: "in-progress" },
  { id: "wp2", code: "WS2", subject: "Science", grade: "9", questionsCount: 16, countLabel: "Problems", status: "in-progress" },
  { id: "wp3", code: "WS1", subject: "Hindi", grade: "8", questionsCount: 12, countLabel: "Problems", status: "in-progress" },
];

export const SAVED_WORKSHEETS: LessonPlanCard[] = [
  { id: "ws1", code: "WS1", subject: "Mathematics", grade: "9", questionsCount: 25, countLabel: "Problems", status: "saved" },
  { id: "ws2", code: "WS2", subject: "Science", grade: "10", questionsCount: 20, countLabel: "Problems", status: "saved" },
  { id: "ws3", code: "WS1", subject: "English", grade: "8", questionsCount: 15, countLabel: "Problems", status: "saved" },
  { id: "ws4", code: "WS2", subject: "Geography", grade: "7", questionsCount: 14, countLabel: "Problems", status: "saved" },
  { id: "ws5", code: "WS1", subject: "Social Science", grade: "9", questionsCount: 19, countLabel: "Problems", status: "saved" },
];
