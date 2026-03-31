import { useState } from "react";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/empty-section-lottie.json";
import { GripVertical, Trash2, GitBranch, Split, MoreHorizontal } from "lucide-react";
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
  itemId,
  hasOr,
  onRemove,
  onAddSub,
  onAddOr,
}: {
  itemId: string;
  hasOr: boolean;
  onRemove: () => void;
  onAddSub?: (type: ItemType) => void;
  onAddOr?: (type: ItemType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
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

/* ── Single row renderer ── */
const ItemRow = ({
  item,
  index,
  label,
  indent = 0,
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
  label: string;
  indent?: number;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
  dragHandlers?: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isOver: boolean;
  };
}) => {
  const paddingLeft = indent * 24;

  return (
    <>
      <div
        draggable={!!dragHandlers}
        onDragStart={dragHandlers?.onDragStart}
        onDragOver={dragHandlers?.onDragOver}
        onDragEnd={dragHandlers?.onDragEnd}
        className={`grid grid-cols-[40px_56px_1fr_100px_120px_44px] items-start px-2 py-3 border-b border-border last:border-b-0 group transition-all
          ${dragHandlers?.isDragging ? "opacity-30" : ""}
          ${dragHandlers?.isOver ? "bg-primary/5" : "hover:bg-muted/30"}`}
        style={{ paddingLeft: `${8 + paddingLeft}px` }}
      >
        {/* Checkbox */}
        <div className="flex justify-center pt-0.5">
          <Checkbox
            checked={selectedIds.has(item.id)}
            onCheckedChange={() => onToggleSelect(item.id)}
          />
        </div>

        {/* Label + drag */}
        <div className="flex items-center gap-0.5 justify-center pt-0.5">
          {dragHandlers && (
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 cursor-grab active:cursor-grabbing group-hover:text-muted-foreground/60" />
          )}
          {!dragHandlers && indent > 0 && (
            <span className="w-3.5" />
          )}
          <span className={`text-sm ${indent > 0 ? "text-muted-foreground" : "text-foreground"} font-medium`}>
            {label}
          </span>
        </div>

        {/* Question */}
        <div className="pl-2 pr-2">
          <Input
            value={item.question}
            onChange={(e) => onUpdateItem(item.id, { question: e.target.value })}
            placeholder="Enter question text..."
            className="h-8 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
          />
        </div>

        {/* Score */}
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

        {/* Type */}
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-muted/60 rounded-md px-2 py-1 truncate max-w-[110px]">
            {item.type}
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <ItemActions
            itemId={item.id}
            hasOr={!!item.orItem}
            onRemove={() => onRemoveItem(item.id)}
            onAddSub={onAddSubItem ? (type) => onAddSubItem(item.id, type) : undefined}
            onAddOr={onAddOrItem ? (type) => onAddOrItem(item.id, type) : undefined}
          />
        </div>
      </div>

      {/* Sub Items */}
      {item.subItems?.map((sub, si) => (
        <ItemRow
          key={sub.id}
          item={sub}
          index={si}
          label={`(${String.fromCharCode(97 + si)})`}
          indent={indent + 1}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onAddSubItem={onAddSubItem}
          onAddOrItem={onAddOrItem}
        />
      ))}

      {/* OR Item */}
      {item.orItem && (
        <>
          {/* OR Divider */}
          <div className="flex items-center gap-3 px-6 py-1.5" style={{ paddingLeft: `${16 + paddingLeft}px` }}>
            <div className="flex-1 border-t border-dashed border-primary/30" />
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full tracking-wide uppercase">
              OR
            </span>
            <div className="flex-1 border-t border-dashed border-primary/30" />
          </div>
          <ItemRow
            item={item.orItem}
            index={index}
            label={`${label}'`}
            indent={indent}
            onUpdateItem={onUpdateItem}
            onRemoveItem={onRemoveItem}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onAddSubItem={onAddSubItem}
            onAddOrItem={undefined}
          />
        </>
      )}
    </>
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
        <ItemRow
          key={item.id}
          item={item}
          index={i}
          label={`${i + 1}`}
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
