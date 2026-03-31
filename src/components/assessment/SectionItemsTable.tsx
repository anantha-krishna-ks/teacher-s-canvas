import { useState } from "react";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/empty-section-lottie.json";
import { GripVertical, Trash2, GitBranch, Split, MoreHorizontal, CornerDownRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { SectionItem, ItemType } from "@/constants/assessmentSectionData";
import { ITEM_TYPES } from "@/constants/assessmentSectionData";

interface SectionItemsTableProps {
  items: SectionItem[];
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
}

/* ── Item action menu ── */
const ItemActions = ({
  hasOr,
  onRemove,
  onAddSub,
  onAddOr,
}: {
  hasOr: boolean;
  onRemove: () => void;
  onAddSub?: (type: ItemType) => void;
  onAddOr?: (type: ItemType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover/row:opacity-100"
        title="Actions"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      {onAddSub && (
        <>
          <DropdownMenuItem disabled className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
            Add Sub Question
          </DropdownMenuItem>
          {ITEM_TYPES.map((type) => (
            <DropdownMenuItem key={`sub-${type}`} onClick={() => onAddSub(type)} className="text-sm pl-6">
              <GitBranch className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              {type}
            </DropdownMenuItem>
          ))}
        </>
      )}
      {onAddOr && !hasOr && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
            Add OR Alternative
          </DropdownMenuItem>
          {ITEM_TYPES.map((type) => (
            <DropdownMenuItem key={`or-${type}`} onClick={() => onAddOr(type)} className="text-sm pl-6">
              <Split className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              {type}
            </DropdownMenuItem>
          ))}
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive text-sm">
        <Trash2 className="w-3.5 h-3.5 mr-2" />
        Remove
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ── Inline row (used for sub-items and OR items) ── */
const InlineRow = ({
  item,
  label,
  onUpdateItem,
  onRemoveItem,
  selectedIds,
  onToggleSelect,
}: {
  item: SectionItem;
  label: string;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) => (
  <div className="grid grid-cols-[32px_40px_1fr_80px_100px_36px] items-center py-2 group/row">
    <div className="flex justify-center">
      <Checkbox
        checked={selectedIds.has(item.id)}
        onCheckedChange={() => onToggleSelect(item.id)}
        className="h-3.5 w-3.5"
      />
    </div>
    <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    <div className="pr-2">
      <Input
        value={item.question}
        onChange={(e) => onUpdateItem(item.id, { question: e.target.value })}
        placeholder="Enter question text..."
        className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
      />
    </div>
    <div className="flex justify-center">
      <Input
        type="number"
        value={item.score}
        onChange={(e) => onUpdateItem(item.id, { score: Number(e.target.value) || 0 })}
        className="h-7 w-14 text-xs text-center bg-transparent border-border"
        min={0}
        max={100}
      />
    </div>
    <div className="flex justify-center">
      <span className="text-[10px] text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5 truncate max-w-[90px]">
        {item.type}
      </span>
    </div>
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => onRemoveItem(item.id)}
        className="p-0.5 rounded text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover/row:opacity-100"
        title="Remove"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
);

/* ── Main question row with nested sub/OR rendering ── */
const QuestionBlock = ({
  item,
  index,
  onUpdateItem,
  onRemoveItem,
  selectedIds,
  onToggleSelect,
  onAddSubItem,
  onAddOrItem,
  dragHandlers,
}: {
  item: SectionItem;
  index: number;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
  dragHandlers: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isOver: boolean;
  };
}) => {
  const hasSubs = item.subItems && item.subItems.length > 0;
  const hasOr = !!item.orItem;
  const hasNested = hasSubs || hasOr;

  return (
    <div
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDragEnd={dragHandlers.onDragEnd}
      className={`border-b border-border last:border-b-0 transition-all
        ${dragHandlers.isDragging ? "opacity-30" : ""}
        ${dragHandlers.isOver ? "bg-primary/5" : ""}`}
    >
      {/* ── Primary question row ── */}
      <div className="grid grid-cols-[40px_56px_1fr_100px_120px_44px] items-center px-2 py-3 group/row hover:bg-muted/30 transition-colors">
        <div className="flex justify-center">
          <Checkbox
            checked={selectedIds.has(item.id)}
            onCheckedChange={() => onToggleSelect(item.id)}
          />
        </div>
        <div className="flex items-center gap-0.5 justify-center">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 cursor-grab active:cursor-grabbing group-hover/row:text-muted-foreground/60" />
          <span className="text-sm font-semibold text-foreground">{index + 1}</span>
        </div>
        <div className="pl-2 pr-2">
          <Input
            value={item.question}
            onChange={(e) => onUpdateItem(item.id, { question: e.target.value })}
            placeholder="Enter question text..."
            className="h-8 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>
        <div className="flex justify-center">
          <Input
            type="number"
            value={item.score}
            onChange={(e) => onUpdateItem(item.id, { score: Number(e.target.value) || 0 })}
            className="h-8 w-16 text-sm text-center bg-transparent border-border"
            min={0}
            max={100}
          />
        </div>
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-muted/60 rounded-md px-2 py-1 truncate max-w-[110px]">
            {item.type}
          </span>
        </div>
        <div className="flex justify-center">
          <ItemActions
            hasOr={hasOr}
            onRemove={() => onRemoveItem(item.id)}
            onAddSub={onAddSubItem ? (type) => onAddSubItem(item.id, type) : undefined}
            onAddOr={onAddOrItem ? (type) => onAddOrItem(item.id, type) : undefined}
          />
        </div>
      </div>

      {/* ── Nested content (sub-items + OR) ── */}
      {hasNested && (
        <div className="ml-12 mr-4 mb-3">
          {/* Sub-items card */}
          {hasSubs && (
            <div className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border-b border-border/40">
                <CornerDownRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Sub-Questions
                </span>
              </div>
              <div className="divide-y divide-border/30">
                {item.subItems!.map((sub, si) => (
                  <InlineRow
                    key={sub.id}
                    item={sub}
                    label={`(${String.fromCharCode(97 + si)})`}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OR alternative card */}
          {hasOr && (
            <div className={`rounded-lg border-2 border-dashed border-primary/25 bg-primary/[0.02] overflow-hidden ${hasSubs ? "mt-2" : ""}`}>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border-b border-dashed border-primary/20">
                <Split className="w-3 h-3 text-primary/70" />
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">
                  OR Alternative
                </span>
              </div>
              <div className="px-1">
                <InlineRow
                  item={item.orItem!}
                  label={`${index + 1}'`}
                  onUpdateItem={onUpdateItem}
                  onRemoveItem={onRemoveItem}
                  selectedIds={selectedIds}
                  onToggleSelect={onToggleSelect}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Main Table ── */
const SectionItemsTable = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onReorder,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onAddSubItem,
  onAddOrItem,
}: SectionItemsTableProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  if (items.length === 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-2">
        <Lottie
          animationData={emptyAnimation}
          loop
          autoplay
          style={{ width: 180, height: 130 }}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No items yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click <span className="font-medium text-primary">Add Items</span> from the toolbar to get started.
          </p>
        </div>
      </div>
    );
  }

  const allSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id));

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[40px_56px_1fr_100px_120px_44px] items-center bg-muted/50 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
        <div className="flex justify-center">
          <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
        </div>
        <span className="text-center">No.</span>
        <span className="pl-2">Items</span>
        <span className="text-center">Score</span>
        <span className="text-center">Type</span>
        <span />
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <QuestionBlock
          key={item.id}
          item={item}
          index={i}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onAddSubItem={onAddSubItem}
          onAddOrItem={onAddOrItem}
          dragHandlers={{
            onDragStart: () => setDragIdx(i),
            onDragOver: (e) => { e.preventDefault(); setOverIdx(i); },
            onDragEnd: handleDragEnd,
            isDragging: dragIdx === i,
            isOver: overIdx === i && dragIdx !== i,
          }}
        />
      ))}
    </div>
  );
};

export default SectionItemsTable;
