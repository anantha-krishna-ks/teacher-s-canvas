// Mock data for Presentations page

import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

export const RECOMMENDED_PRESENTATIONS: LessonPlanCard[] = [
  { id: "pr1", code: "PT1", subject: "Science", grade: "9", questionsCount: 15, countLabel: "Slides", chapter: "Matter in Our Surroundings", status: "recommended" },
  { id: "pr2", code: "PT2", subject: "Mathematics", grade: "10", questionsCount: 20, countLabel: "Slides", chapter: "Number Systems", status: "recommended" },
  { id: "pr3", code: "PT1", subject: "English", grade: "8", questionsCount: 12, countLabel: "Slides", chapter: "Prose", status: "recommended" },
  { id: "pr4", code: "PT2", subject: "Hindi", grade: "9", questionsCount: 18, countLabel: "Slides", chapter: "गद्य खंड", status: "recommended" },
  { id: "pr5", code: "PT1", subject: "Geography", grade: "7", questionsCount: 10, countLabel: "Slides", chapter: "Resources and Development", status: "recommended" },
];

export const SAVED_PRESENTATIONS: LessonPlanCard[] = [
  { id: "ps1", code: "PT1", subject: "Science", grade: "9", questionsCount: 15, countLabel: "Slides", chapter: "Force and Laws of Motion", status: "saved" },
  { id: "ps2", code: "PT2", subject: "Mathematics", grade: "10", questionsCount: 20, countLabel: "Slides", chapter: "Algebra", status: "saved" },
  { id: "ps3", code: "PT1", subject: "Social Science", grade: "8", questionsCount: 13, countLabel: "Slides", chapter: "India and the Contemporary World", status: "saved" },
];
