// Shared in-memory store for user-created lesson plans (draft & finalized)

import { LessonPlanCard } from "@/constants/lessonPlansPageData";

type Listener = () => void;

let inProgressPlans: LessonPlanCard[] = [];
let savedPlans: LessonPlanCard[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

let nextId = 1;

export function addLessonPlan(
  plan: { subject: string; grade: string; chapter: string; questionsCount: number },
  status: "in-progress" | "saved",
) {
  const card: LessonPlanCard = {
    id: `user-${nextId++}`,
    code: `LP${nextId}`,
    subject: plan.subject,
    grade: plan.grade,
    questionsCount: plan.questionsCount,
    status,
  };

  if (status === "in-progress") {
    inProgressPlans = [card, ...inProgressPlans];
  } else {
    savedPlans = [card, ...savedPlans];
  }
  notify();
  return card;
}

export function getInProgressPlans(): LessonPlanCard[] {
  return inProgressPlans;
}

export function getSavedPlans(): LessonPlanCard[] {
  return savedPlans;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
