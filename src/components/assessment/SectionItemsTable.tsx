import { useState } from "react";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/empty-section-lottie.json";
import { GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { SectionItem } from "@/constants/assessmentSectionData";

interface SectionItemsTableProps {
  items: SectionItem[];
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

const SectionItemsTable = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onReorder,
  selectedIds,
  onToggleSelect,
  onToggleAll,
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
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <img
          src={emptyIllustration}
          alt="No items"
          width={140}
          height={140}
          loading="lazy"
          className="opacity-80"
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
      <div className="grid grid-cols-[40px_48px_1fr_100px_120px_44px] items-center bg-muted/50 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
        <div className="flex justify-center">
          <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
        </div>
        <span className="text-center">Sl No.</span>
        <span className="pl-2">Items</span>
        <span className="text-center">Score</span>
        <span className="text-center">Type</span>
        <span />
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
          onDragEnd={handleDragEnd}
          className={`grid grid-cols-[40px_48px_1fr_100px_120px_44px] items-start px-2 py-3 border-b border-border last:border-b-0 group transition-all
            ${dragIdx === i ? "opacity-30" : ""}
            ${overIdx === i && dragIdx !== i ? "bg-primary/5" : "hover:bg-muted/30"}`}
        >
          {/* Checkbox */}
          <div className="flex justify-center pt-0.5">
            <Checkbox
              checked={selectedIds.has(item.id)}
              onCheckedChange={() => onToggleSelect(item.id)}
            />
          </div>

          {/* Sl No + drag */}
          <div className="flex items-center gap-0.5 justify-center pt-0.5">
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 cursor-grab active:cursor-grabbing group-hover:text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground">{i + 1}</span>
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

          {/* Remove */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionItemsTable;
