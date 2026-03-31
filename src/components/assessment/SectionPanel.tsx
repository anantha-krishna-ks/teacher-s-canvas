import { useState, useCallback, useRef, useMemo } from "react";
import { ChevronDown, ChevronUp, Shuffle, Trash2, Plus, MoreHorizontal, Pencil, Copy, X, Check, Tag, Split, GitBranch } from "lucide-react";
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
  deepUpdateItem,
  deepRemoveItem,
  addSubItem,
  addOrItem,
  linkAsOr,
  makeSubItemsOf,
  type Section,
  type SectionItem,
  type ItemType,
} from "@/constants/assessmentSectionData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        deepUpdateItem(activeSection.items, id, updates)
      );
    },
    [activeSection, updateSectionItems]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      if (!activeSection) return;
      updateSectionItems(
        activeSection.id,
        deepRemoveItem(activeSection.items, id)
      );
      setSelectedItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [activeSection, updateSectionItems]
  );

  const handleAddSubItem = useCallback(
    (parentId: string, type: ItemType) => {
      if (!activeSection) return;
      updateSectionItems(
        activeSection.id,
        addSubItem(activeSection.items, parentId, type)
      );
      toast.success("Sub-question added.");
    },
    [activeSection, updateSectionItems]
  );

  const handleAddOrItem = useCallback(
    (targetId: string, type: ItemType) => {
      if (!activeSection) return;
      updateSectionItems(
        activeSection.id,
        addOrItem(activeSection.items, targetId, type)
      );
      toast.success("OR alternative added.");
    },
    [activeSection, updateSectionItems]
  );

  const handleLinkAsOr = useCallback(() => {
    if (!activeSection || selectedItems.size !== 2) return;
    const [primaryId, secondaryId] = Array.from(selectedItems);
    updateSectionItems(
      activeSection.id,
      linkAsOr(activeSection.items, primaryId, secondaryId)
    );
    setSelectedItems(new Set());
    toast.success("Questions linked as OR pair.");
  }, [activeSection, selectedItems, updateSectionItems]);

  const handleMakeSubItemOf = useCallback(
    (parentId: string) => {
      if (!activeSection || selectedItems.size === 0) return;
      const childIds = Array.from(selectedItems).filter((id) => id !== parentId);
      if (childIds.length === 0) return;
      updateSectionItems(
        activeSection.id,
        makeSubItemsOf(activeSection.items, childIds, parentId)
      );
      setSelectedItems(new Set());
      toast.success(`${childIds.length} item(s) made sub-question(s).`);
    },
    [activeSection, selectedItems, updateSectionItems]
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

  // Items eligible as parent for "Make Sub-Question of..." (top-level items not in selection)
  const eligibleParents = useMemo(() => {
    if (!activeSection) return [];
    return activeSection.items.filter((it) => !selectedItems.has(it.id) && !it.orItem);
  }, [activeSection, selectedItems]);

  const canLinkOr = selectedItems.size === 2 && activeSection?.items.filter(
    (it) => selectedItems.has(it.id) && !it.orItem
  ).length === 2;

  const canMakeSub = selectedItems.size >= 1 && eligibleParents.length > 0;

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
              className={`relative group w-[164px] rounded-xl cursor-pointer transition-all duration-200 overflow-hidden
                ${isActive
                  ? "bg-card border border-primary/30 shadow-[0_1px_8px_-2px_hsl(var(--primary)/0.12)]"
                  : "bg-card border border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md"
                }`}
            >
              {/* Top colored strip */}
              <div className={`h-[3px] w-full transition-colors duration-200 ${isActive ? "bg-primary" : "bg-muted"}`} />

              {/* Card Body */}
              <div className="px-3.5 pt-2.5 pb-3">
                {/* Header row */}
                <div className="flex items-start justify-between mb-2.5">
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
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-semibold leading-tight truncate max-w-[80px] ${isActive ? "text-primary" : "text-foreground"}`}>
                          {sec.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1 -mt-0.5 rounded-md hover:bg-muted"
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

                {/* Stats row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
                    <span className="text-sm font-semibold text-foreground leading-none">{String(secItems).padStart(2, "0")}</span>
                    <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Items</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
                    <span className="text-sm font-semibold text-foreground leading-none">{String(secScore).padStart(2, "0")}</span>
                    <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Score</p>
                  </div>
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
          <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-5 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Section {activeSection.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Items{" "}
                  <span className="inline-flex items-center justify-center min-w-[24px] h-5 rounded bg-background border border-border font-medium text-foreground px-1">
                    {String(totalItems).padStart(2, "0")}
                  </span>
                </span>
                <span className="text-border">|</span>
                <span>
                  Score{" "}
                  <span className="inline-flex items-center justify-center min-w-[24px] h-5 rounded bg-background border border-border font-medium text-foreground px-1">
                    {String(totalScore).padStart(2, "0")}
                  </span>
                </span>
              </div>
            </div>
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

          {/* Toolbar */}
          {!collapsedIds.has(activeSection.id) && (
            <div className="flex items-center justify-between px-5 py-2 bg-card border-b border-border">
              {/* Left: Section actions */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={handleAddSection}
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Section
                </Button>
                <div className="w-px h-4 bg-border mx-0.5" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRenameSection(activeSection.id)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => handleDuplicateSection(activeSection.id)}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/5"
                  onClick={() => handleRemoveSection(activeSection.id)}
                  disabled={sections.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>

              {/* Right: Item actions */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={handleShuffle}
                  disabled={totalItems < 2}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Shuffle
                </Button>
                {selectedItems.size > 0 && (
                  <>
                    <div className="w-px h-4 bg-border mx-0.5" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/5"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete ({selectedItems.size})
                    </Button>
                  </>
                )}
                <div className="w-px h-4 bg-border mx-0.5" />
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
          )}

          {/* Collapsible Body */}
          {!collapsedIds.has(activeSection.id) && (
            <div className="p-4">
              {/* Items Table */}
              <SectionItemsTable
                items={activeSection.items}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
                onReorder={handleReorder}
                selectedIds={selectedItems}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                onAddSubItem={handleAddSubItem}
                onAddOrItem={handleAddOrItem}
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
