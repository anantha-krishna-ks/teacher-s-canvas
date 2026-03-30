export const SECTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const ITEM_TYPES = [
  "Short Answer",
  "Multiple Choice",
  "True / False",
  "Matching",
  "Fill in the Blank",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface SectionItem {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  score: number;
  type: ItemType;
}

export interface Section {
  id: string;
  label: string;
  items: SectionItem[];
}

export const createSection = (label: string): Section => ({
  id: crypto.randomUUID(),
  label,
  items: [],
});

export const createSectionItem = (type: ItemType): SectionItem => ({
  id: crypto.randomUUID(),
  question: "",
  score: 1,
  type,
});
