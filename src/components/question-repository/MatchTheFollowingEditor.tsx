import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowRight, GripVertical, Shuffle } from "lucide-react";

export interface MatchItem {
  id: string;
  text: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchData {
  items: MatchItem[];
  matches: MatchItem[];
  mapping: Record<string, string>;
}

interface MatchTheFollowingEditorProps {
  pairs: MatchPair[];
  onChange: (pairs: MatchPair[]) => void;
  matchData?: MatchData;
  onMatchDataChange?: (data: MatchData) => void;
}

const createPair = (): MatchPair => ({
  id: crypto.randomUUID(),
  left: "",
  right: "",
});

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* ─── Draggable List ─────────────────────────────────────────────────── */

interface DraggableInputListProps {
  items: { id: string; text: string }[];
  prefix: "number" | "letter";
  placeholder: string;
  onTextChange: (index: number, value: string) => void;
  onReorder: (from: number, to: number) => void;
  onShuffle: () => void;
  label: string;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DraggableInputList = ({
  items,
  prefix,
  placeholder,
  onTextChange,
  onReorder,
  onShuffle,
  label,
}: DraggableInputListProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-2 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
          onClick={onShuffle}
          title={`Shuffle ${label.toLowerCase()}`}
        >
          <Shuffle className="w-3 h-3" />
          Shuffle
        </Button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const badge =
            prefix === "letter"
              ? LETTERS[i] ?? `${i + 1}`
              : `${i + 1}`;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIdx(i);
              }}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-1.5 rounded-lg border border-border bg-background px-1.5 py-1 transition-all group
                ${dragIdx === i ? "opacity-30" : ""}
                ${overIdx === i && dragIdx !== i ? "ring-2 ring-primary/30" : ""}`}
            >
              <GripVertical className="w-3.5 h-3.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground/70" />
              <span className="text-[11px] font-bold text-muted-foreground/50 shrink-0 w-4 text-center select-none">
                {badge}
              </span>
              <Input
                value={item.text}
                onChange={(e) => onTextChange(i, e.target.value)}
                placeholder={`${placeholder} ${badge}`}
                className="h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main Editor ────────────────────────────────────────────────────── */

const MatchTheFollowingEditor = ({ pairs, onChange }: MatchTheFollowingEditorProps) => {
  const [rows, setRows] = useState<MatchPair[]>(() =>
    pairs.length > 0 ? pairs : [createPair(), createPair()]
  );

  const sync = useCallback(
    (updated: MatchPair[]) => {
      setRows(updated);
      onChange(updated);
    },
    [onChange]
  );

  // Items (left column)
  const items = rows.map((r) => ({ id: r.id, text: r.left }));
  // Matches (right column) — stored separately for independent reordering
  const [matchOrder, setMatchOrder] = useState<{ id: string; text: string }[]>(() =>
    rows.map((r) => ({ id: r.id, text: r.right }))
  );

  // Keep matchOrder in sync when rows are added/removed
  const syncAll = useCallback(
    (newRows: MatchPair[], newMatchOrder?: { id: string; text: string }[]) => {
      setRows(newRows);
      if (newMatchOrder) setMatchOrder(newMatchOrder);
      onChange(newRows);
    },
    [onChange]
  );

  const handleLeftChange = (index: number, value: string) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, left: value } : r));
    syncAll(updated);
  };

  const handleRightChange = (index: number, value: string) => {
    const newMatch = matchOrder.map((m, i) => (i === index ? { ...m, text: value } : m));
    setMatchOrder(newMatch);
    // Also update the corresponding row
    const updated = rows.map((r) => {
      const match = newMatch.find((m) => m.id === r.id);
      return match ? { ...r, right: match.text } : r;
    });
    syncAll(updated, newMatch);
  };

  const handleReorderItems = (from: number, to: number) => {
    const reordered = [...rows];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    syncAll(reordered);
  };

  const handleReorderMatches = (from: number, to: number) => {
    const reordered = [...matchOrder];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setMatchOrder(reordered);
  };

  const handleShuffleItems = () => {
    syncAll(shuffleArray(rows));
  };

  const handleShuffleMatches = () => {
    setMatchOrder(shuffleArray(matchOrder));
  };

  const handleAdd = () => {
    const newPair = createPair();
    const newRows = [...rows, newPair];
    const newMatch = [...matchOrder, { id: newPair.id, text: "" }];
    syncAll(newRows, newMatch);
  };

  const handleRemove = (index: number) => {
    if (rows.length <= 2) return;
    const removedId = rows[index].id;
    const newRows = rows.filter((_, i) => i !== index);
    const newMatch = matchOrder.filter((m) => m.id !== removedId);
    syncAll(newRows, newMatch);
  };

  return (
    <div className="space-y-4">
      {/* Two-column layout */}
      <div className="flex gap-4">
        <DraggableInputList
          items={items}
          prefix="number"
          placeholder="Item"
          onTextChange={handleLeftChange}
          onReorder={handleReorderItems}
          onShuffle={handleShuffleItems}
          label="Items"
        />

        {/* Center arrows */}
        <div className="flex flex-col pt-8 gap-[0.45rem]">
          {rows.map((_, i) => (
            <div key={i} className="h-[2.375rem] flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
            </div>
          ))}
        </div>

        <DraggableInputList
          items={matchOrder}
          prefix="letter"
          placeholder="Match"
          onTextChange={handleRightChange}
          onReorder={handleReorderMatches}
          onShuffle={handleShuffleMatches}
          label="Matches"
        />
      </div>

      {/* Add / Remove row */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs gap-1.5 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
          onClick={handleAdd}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Pair
        </Button>
        {rows.length > 2 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 border-dashed border-destructive/30 text-muted-foreground hover:text-destructive hover:border-destructive/60"
            onClick={() => handleRemove(rows.length - 1)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Last
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {rows.length} {rows.length === 1 ? "pair" : "pairs"} · Drag to reorder
      </p>
    </div>
  );
};

export default MatchTheFollowingEditor;
