import { useState, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Shuffle, Trash2, Plus, MoreHorizontal, Pencil, Copy, X, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectionItemsTable from "./SectionItemsTable";
import AddItemsModal from "./AddItemsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [addItemsOpen, setAddItemsOpen] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

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

  const handleDuplicateSection = useCallback(
    (sectionId: string) => {
      const source = sections.find((s) => s.id === sectionId);
      if (!source) return;
      const nextLabel = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
      const duplicated: Section = {
        id: crypto.randomUUID(),
        label: nextLabel,
        items: source.items.map((it) => ({ ...it, id: crypto.randomUUID() })),
      };
      const idx = sections.findIndex((s) => s.id === sectionId);
      const updated = [...sections];
      updated.splice(idx + 1, 0, duplicated);
      onChange(updated);
      setActiveSectionId(duplicated.id);
      toast.success("Section duplicated.");
    },
    [sections, onChange]
  );

  const handleRenameSection = useCallback(
    (sectionId: string) => {
      const sec = sections.find((s) => s.id === sectionId);
      if (!sec) return;
      setEditingId(sectionId);
      setEditingLabel(sec.label);
      setTimeout(() => editInputRef.current?.focus(), 50);
    },
    [sections]
  );

  const commitRename = useCallback(() => {
    if (!editingId || !editingLabel.trim()) {
      setEditingId(null);
      return;
    }
    onChange(
      sections.map((s) =>
        s.id === editingId ? { ...s, label: editingLabel.trim() } : s
      )
    );
    setEditingId(null);
    toast.success("Section renamed.");
  }, [editingId, editingLabel, sections, onChange]);

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

  const handleAddItemsFromRepo = useCallback(
    (items: SectionItem[]) => {
      if (!activeSection) return;
      updateSectionItems(activeSection.id, [...activeSection.items, ...items]);
      toast.success(`${items.length} item(s) added.`);
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
    <div className="space-y-5">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {sections.length} Section{sections.length !== 1 ? "s" : ""}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={handleAddSection}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </Button>
      </div>

      {/* Section Cards Grid */}
      <div className="flex flex-wrap gap-3">
        {sections.map((sec, idx) => {
          const isActive = activeSectionId === sec.id;
          const isEditing = editingId === sec.id;
          const secItems = sec.items.length;
          const secScore = sec.items.reduce((s, it) => s + it.score, 0);
          return (
            <div
              key={sec.id}
              onClick={() => {
                if (!isEditing) {
                  setActiveSectionId(sec.id);
                  setSelectedItems(new Set());
                }
              }}
              className={`relative group w-[155px] rounded-lg cursor-pointer transition-all duration-150 border
                ${isActive
                  ? "border-primary/40 bg-primary/[0.06]"
                  : "border-border bg-card hover:border-primary/20"
                }`}
            >
              {/* Left accent bar */}
              {isActive && (
                <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-primary" />
              )}

              {/* Card Top */}
              <div className="px-3.5 pt-2.5 pb-1 flex items-start justify-between">
                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1 mr-1">
                    <Input
                      ref={editInputRef}
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="h-6 text-xs px-1.5 w-full"
                    />
                    <button type="button" onClick={commitRename} className="text-primary hover:text-primary/80">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Section {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[13px] font-semibold truncate max-w-[100px] ${isActive ? "text-primary" : "text-foreground"}`}>
                      {sec.label}
                    </span>
                  </div>
                )}

                {!isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRenameSection(sec.id); }}>
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateSection(sec.id); }}>
                        <Copy className="w-3.5 h-3.5 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); handleRemoveSection(sec.id); }}
                        className="text-destructive focus:text-destructive"
                        disabled={sections.length <= 1}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Card Stats */}
              <div className="px-3.5 pb-2.5 pt-0.5 flex items-center gap-3 text-foreground">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{String(secItems).padStart(2, "0")}</span>
                  <span className="text-[9px] text-muted-foreground font-medium">Items</span>
                </div>
                <div className="w-px h-5 bg-border" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{String(secScore).padStart(2, "0")}</span>
                  <span className="text-[9px] text-muted-foreground font-medium">Score</span>
                </div>
              </div>
            </div>
          );
        })}
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
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => setAddItemsOpen(true)}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Add Items
                  </Button>
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
      {activeSection && (
        <AddItemsModal
          open={addItemsOpen}
          onOpenChange={setAddItemsOpen}
          sectionLabel={activeSection.label}
          onAddItems={handleAddItemsFromRepo}
        />
      )}
    </div>
  );
};

export default SectionPanel;
