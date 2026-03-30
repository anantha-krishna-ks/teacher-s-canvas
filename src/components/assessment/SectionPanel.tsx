import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Shuffle, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectionItemsTable from "./SectionItemsTable";
import AddItemsDropdown from "./AddItemsDropdown";
import {
  createSection,
  createSectionItem,
  SECTION_LABELS,
  type Section,
  type SectionItem,
  type ItemType,
} from "@/constants/assessmentSectionData";

interface SectionPanelProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SectionPanel = ({ sections, onChange }: SectionPanelProps) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sections[0]?.id ?? null
  );
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? null;

  const handleAddSection = useCallback(() => {
    const nextLabel = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
    const newSection = createSection(nextLabel);
    const updated = [...sections, newSection];
    onChange(updated);
    setActiveSectionId(newSection.id);
  }, [sections, onChange]);

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      if (sections.length <= 1) {
        toast.error("At least one section is required.");
        return;
      }
      const updated = sections.filter((s) => s.id !== sectionId);
      onChange(updated);
      if (activeSectionId === sectionId) {
        setActiveSectionId(updated[0]?.id ?? null);
      }
      toast.success("Section removed.");
    },
    [sections, onChange, activeSectionId]
  );

  const updateSectionItems = useCallback(
    (sectionId: string, items: SectionItem[]) => {
      onChange(sections.map((s) => (s.id === sectionId ? { ...s, items } : s)));
    },
    [sections, onChange]
  );

  const handleAddItem = useCallback(
    (type: ItemType) => {
      if (!activeSection) return;
      const newItem = createSectionItem(type);
      updateSectionItems(activeSection.id, [...activeSection.items, newItem]);
    },
    [activeSection, updateSectionItems]
  );

  const handleUpdateItem = useCallback(
    (id: string, updates: Partial<SectionItem>) => {
      if (!activeSection) return;
      updateSectionItems(
        activeSection.id,
        activeSection.items.map((it) => (it.id === id ? { ...it, ...updates } : it))
      );
    },
    [activeSection, updateSectionItems]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      if (!activeSection) return;
      updateSectionItems(
        activeSection.id,
        activeSection.items.filter((it) => it.id !== id)
      );
      setSelectedItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [activeSection, updateSectionItems]
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      if (!activeSection) return;
      const reordered = [...activeSection.items];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      updateSectionItems(activeSection.id, reordered);
    },
    [activeSection, updateSectionItems]
  );

  const handleShuffle = useCallback(() => {
    if (!activeSection || activeSection.items.length < 2) return;
    updateSectionItems(activeSection.id, shuffleArray(activeSection.items));
    toast.success("Items shuffled.");
  }, [activeSection, updateSectionItems]);

  const handleDeleteSelected = useCallback(() => {
    if (!activeSection || selectedItems.size === 0) return;
    updateSectionItems(
      activeSection.id,
      activeSection.items.filter((it) => !selectedItems.has(it.id))
    );
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} item(s) removed.`);
  }, [activeSection, selectedItems, updateSectionItems]);

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!activeSection) return;
    const allIds = activeSection.items.map((it) => it.id);
    const allSelected = allIds.every((id) => selectedItems.has(id));
    setSelectedItems(allSelected ? new Set() : new Set(allIds));
  };

  const totalItems = activeSection?.items.length ?? 0;
  const totalScore = activeSection?.items.reduce((sum, it) => sum + it.score, 0) ?? 0;

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              setActiveSectionId(sec.id);
              setSelectedItems(new Set());
            }}
            className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${activeSectionId === sec.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            Section {sec.label}
          </button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-xs gap-1 text-muted-foreground hover:text-foreground"
          onClick={handleAddSection}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </Button>
      </div>

      {/* Active Section Content */}
      {activeSection && (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-5 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Section {activeSection.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Total Items{" "}
                  <span className="inline-flex items-center justify-center w-6 h-5 rounded bg-background border border-border font-medium text-foreground">
                    {String(totalItems).padStart(2, "0")}
                  </span>
                </span>
                <span className="text-border">|</span>
                <span>
                  Total Score{" "}
                  <span className="inline-flex items-center justify-center w-6 h-5 rounded bg-background border border-border font-medium text-foreground">
                    {String(totalScore).padStart(2, "0")}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {sections.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveSection(activeSection.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => toggleCollapse(activeSection.id)}
              >
                {collapsedIds.has(activeSection.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Collapsible Body */}
          {!collapsedIds.has(activeSection.id) && (
            <div className="p-4 space-y-3">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={handleShuffle}
                    disabled={totalItems < 2}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Shuffle Items
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {selectedItems.size > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete ({selectedItems.size})
                    </Button>
                  )}
                  <AddItemsDropdown onAdd={handleAddItem} />
                </div>
              </div>

              {/* Items Table */}
              <SectionItemsTable
                items={activeSection.items}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
                onReorder={handleReorder}
                selectedIds={selectedItems}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionPanel;
