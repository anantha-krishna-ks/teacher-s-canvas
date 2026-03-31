// Mock data for the Lesson Plans listing page

import hindiImg from "@/assets/subject-hindi.png";
import scienceImg from "@/assets/subject-science.png";
import mathImg from "@/assets/subject-math.png";
import englishImg from "@/assets/subject-english.png";
import socialImg from "@/assets/subject-social.png";
import geographyImg from "@/assets/subject-geography.png";

export const SUBJECT_IMAGES: Record<string, string> = {
  Hindi: hindiImg,
  Science: scienceImg,
  Mathematics: mathImg,
  English: englishImg,
  "Social Science": socialImg,
  Geography: geographyImg,
};

export interface LessonPlanCard {
  id: string;
  code: string;
  subject: string;
  grade: string;
  questionsCount: number;
  countLabel?: string; // e.g. "Slides", "Sessions", "Questions" — defaults to "Questions"
  chapter?: string;
  status?: "in-progress" | "saved" | "recommended";
}

export const RECOMMENDED_PLANS: LessonPlanCard[] = [
  { id: "r1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "recommended" },
  { id: "r2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "recommended" },
  { id: "r3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 18, status: "recommended" },
  { id: "r4", code: "PA2", subject: "English", grade: "8", questionsCount: 10, status: "recommended" },
  { id: "r5", code: "PA1", subject: "Social Science", grade: "9", questionsCount: 16, status: "recommended" },
];

export const IN_PROGRESS_PLANS: LessonPlanCard[] = [
  { id: "p1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "in-progress" },
  { id: "p2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "in-progress" },
  { id: "p3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 8, status: "in-progress" },
  { id: "p4", code: "PA2", subject: "English", grade: "8", questionsCount: 20, status: "in-progress" },
];

export const SAVED_PLANS: LessonPlanCard[] = [
  { id: "s1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "saved" },
  { id: "s2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "saved" },
  { id: "s3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 15, status: "saved" },
  { id: "s4", code: "PA2", subject: "English", grade: "8", questionsCount: 11, status: "saved" },
  { id: "s5", code: "PA1", subject: "Geography", grade: "9", questionsCount: 9, status: "saved" },
];
