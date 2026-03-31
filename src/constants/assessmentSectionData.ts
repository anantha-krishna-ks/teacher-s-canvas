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
  subItems?: SectionItem[];
  orItem?: SectionItem;
}

export interface Section {
  id: string;
  label: string;
  items: SectionItem[];
}

/** Deep-update a SectionItem anywhere in the tree (including subItems and orItems) */
export const deepUpdateItem = (
  items: SectionItem[],
  id: string,
  updates: Partial<SectionItem>
): SectionItem[] =>
  items.map((item) => {
    if (item.id === id) return { ...item, ...updates };
    const next = { ...item };
    if (next.subItems) next.subItems = deepUpdateItem(next.subItems, id, updates);
    if (next.orItem && next.orItem.id === id) next.orItem = { ...next.orItem, ...updates };
    else if (next.orItem?.subItems) {
      next.orItem = { ...next.orItem, subItems: deepUpdateItem(next.orItem.subItems, id, updates) };
    }
    return next;
  });

/** Deep-remove a SectionItem anywhere in the tree */
export const deepRemoveItem = (items: SectionItem[], id: string): SectionItem[] =>
  items
    .filter((item) => item.id !== id)
    .map((item) => {
      const next = { ...item };
      if (next.subItems) next.subItems = deepRemoveItem(next.subItems, id);
      if (next.orItem) {
        if (next.orItem.id === id) {
          next.orItem = undefined;
        } else if (next.orItem.subItems) {
          next.orItem = { ...next.orItem, subItems: deepRemoveItem(next.orItem.subItems, id) };
        }
      }
      return next;
    });

/** Add a sub-question to a parent item */
export const addSubItem = (items: SectionItem[], parentId: string, type: ItemType): SectionItem[] =>
  items.map((item) => {
    if (item.id === parentId) {
      const sub = createSectionItem(type);
      return { ...item, subItems: [...(item.subItems ?? []), sub] };
    }
    const next = { ...item };
    if (next.subItems) next.subItems = addSubItem(next.subItems, parentId, type);
    if (next.orItem) {
      if (next.orItem.id === parentId) {
        const sub = createSectionItem(type);
        next.orItem = { ...next.orItem, subItems: [...(next.orItem.subItems ?? []), sub] };
      } else if (next.orItem.subItems) {
        next.orItem = { ...next.orItem, subItems: addSubItem(next.orItem.subItems, parentId, type) };
      }
    }
    return next;
  });

/** Add an OR alternative to an item */
export const addOrItem = (items: SectionItem[], targetId: string, type: ItemType): SectionItem[] =>
  items.map((item) => {
    if (item.id === targetId) {
      if (item.orItem) return item; // already has OR
      return { ...item, orItem: createSectionItem(type) };
    }
    const next = { ...item };
    if (next.subItems) next.subItems = addOrItem(next.subItems, targetId, type);
    if (next.orItem?.subItems) {
      next.orItem = { ...next.orItem, subItems: addOrItem(next.orItem.subItems, targetId, type) };
    }
    return next;
  });

/** Count all items recursively (for scoring totals) */
export const countAllItems = (items: SectionItem[]): number => {
  let count = 0;
  for (const item of items) {
    count++;
    if (item.subItems) count += countAllItems(item.subItems);
    if (item.orItem) {
      count++;
      if (item.orItem.subItems) count += countAllItems(item.orItem.subItems);
    }
  }
  return count;
};

/** Find a top-level item by id */
const findTopLevelItem = (items: SectionItem[], id: string): SectionItem | null =>
  items.find((it) => it.id === id) ?? null;

/** Link two existing top-level items as OR pair (second becomes orItem of first) */
export const linkAsOr = (items: SectionItem[], primaryId: string, secondaryId: string): SectionItem[] => {
  const secondary = findTopLevelItem(items, secondaryId);
  if (!secondary) return items;
  // Remove secondary from top level
  const filtered = items.filter((it) => it.id !== secondaryId);
  // Attach as orItem of primary
  return filtered.map((item) => {
    if (item.id === primaryId) {
      if (item.orItem) return item; // already has OR
      return { ...item, orItem: { ...secondary } };
    }
    return item;
  });
};

/** Move selected top-level items as sub-items of a parent */
export const makeSubItemsOf = (items: SectionItem[], childIds: string[], parentId: string): SectionItem[] => {
  const children = items.filter((it) => childIds.includes(it.id));
  if (children.length === 0) return items;
  // Remove children from top level
  const filtered = items.filter((it) => !childIds.includes(it.id));
  // Add as subItems of parent
  return filtered.map((item) => {
    if (item.id === parentId) {
      return { ...item, subItems: [...(item.subItems ?? []), ...children] };
    }
    return item;
  });
};

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
