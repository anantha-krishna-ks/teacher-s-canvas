import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, GripVertical, Info, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  mapping: Record<string, string>; // itemId -> matchId
}

interface MatchTheFollowingEditorProps {
  pairs: MatchPair[];
  onChange: (pairs: MatchPair[]) => void;
  matchData?: MatchData;
  onMatchDataChange?: (data: MatchData) => void;
}

const ITEM_COLORS = [
  "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  "bg-violet-500/10 text-violet-600 border-violet-200 dark:text-violet-400 dark:border-violet-800",
  "bg-amber-500/10 text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-800",
  "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
  "bg-rose-500/10 text-rose-600 border-rose-200 dark:text-rose-400 dark:border-rose-800",
  "bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:text-cyan-400 dark:border-cyan-800",
  "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800",
  "bg-pink-500/10 text-pink-600 border-pink-200 dark:text-pink-400 dark:border-pink-800",
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const createItem = (): MatchItem => ({ id: crypto.randomUUID(), text: "" });

const initData = (pairs: MatchPair[]): MatchData => {
  const items = pairs.map((p) => ({ id: p.id + "-L", text: p.left }));
  const matches = pairs.map((p) => ({ id: p.id + "-R", text: p.right }));
  const mapping: Record<string, string> = {};
  items.forEach((item, i) => {
    mapping[item.id] = matches[i]?.id ?? "";
  });
  return { items, matches, mapping };
};

/* ─── Draggable Column ──────────────────────────────────────────────── */

interface DraggableColumnProps {
  items: MatchItem[];
  label: string;
  numberPrefix?: "number" | "letter";
  colorOffset?: number;
  onUpdate: (index: number, text: string) => void;
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
  onAdd: () => void;
  minItems: number;
}

const DraggableColumn = ({
  items,
  label,
  numberPrefix = "number",
  colorOffset = 0,
  onUpdate,
  onRemove,
  onReorder,
  onAdd,
  minItems,
}: DraggableColumnProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragEnd = useCallback(() => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  }, [dragIdx, overIdx, onReorder]);

  return (
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
          onClick={onAdd}
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const colorClass = ITEM_COLORS[(i + colorOffset) % ITEM_COLORS.length];
          const badge = numberPrefix === "letter" ? LETTERS[i] ?? `${i + 1}` : `${i + 1}`;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all group",
                colorClass,
                dragIdx === i && "opacity-30",
                overIdx === i && dragIdx !== i && "ring-2 ring-primary/40 scale-[1.01]"
              )}
            >
              <GripVertical className="w-3.5 h-3.5 shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-70" />
              <span className="text-[10px] font-bold shrink-0 w-4 text-center">
                {badge}
              </span>
              <Input
                value={item.text}
                onChange={(e) => onUpdate(i, e.target.value)}
                placeholder={`${label} ${badge}`}
                className="h-7 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 px-1"
              />
              {items.length > minItems && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 text-destructive/60 hover:text-destructive"
                  onClick={() => onRemove(i)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main Editor ────────────────────────────────────────────────────── */

const MatchTheFollowingEditor = ({ pairs, onChange }: MatchTheFollowingEditorProps) => {
  const [data, setData] = useState<MatchData>(() => initData(pairs));

  const updateAndSync = useCallback((newData: MatchData) => {
    setData(newData);
    // Sync back to pairs format for save compatibility
    const synced: MatchPair[] = newData.items.map((item) => {
      const matchId = newData.mapping[item.id];
      const match = newData.matches.find((m) => m.id === matchId);
      return { id: item.id, left: item.text, right: match?.text ?? "" };
    });
    onChange(synced);
  }, [onChange]);

  // Items column handlers
  const handleUpdateItem = useCallback((i: number, text: string) => {
    const newData = { ...data, items: data.items.map((item, idx) => idx === i ? { ...item, text } : item) };
    updateAndSync(newData);
  }, [data, updateAndSync]);

  const handleRemoveItem = useCallback((i: number) => {
    const removed = data.items[i];
    const newItems = data.items.filter((_, idx) => idx !== i);
    const newMapping = { ...data.mapping };
    delete newMapping[removed.id];
    updateAndSync({ ...data, items: newItems, mapping: newMapping });
  }, [data, updateAndSync]);

  const handleReorderItems = useCallback((from: number, to: number) => {
    const reordered = [...data.items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    updateAndSync({ ...data, items: reordered });
  }, [data, updateAndSync]);

  const handleAddItem = useCallback(() => {
    updateAndSync({ ...data, items: [...data.items, createItem()] });
  }, [data, updateAndSync]);

  // Matches column handlers
  const handleUpdateMatch = useCallback((i: number, text: string) => {
    const newData = { ...data, matches: data.matches.map((m, idx) => idx === i ? { ...m, text } : m) };
    updateAndSync(newData);
  }, [data, updateAndSync]);

  const handleRemoveMatch = useCallback((i: number) => {
    const removed = data.matches[i];
    const newMatches = data.matches.filter((_, idx) => idx !== i);
    // Clean mapping references
    const newMapping = { ...data.mapping };
    Object.entries(newMapping).forEach(([key, val]) => {
      if (val === removed.id) delete newMapping[key];
    });
    updateAndSync({ ...data, matches: newMatches, mapping: newMapping });
  }, [data, updateAndSync]);

  const handleReorderMatches = useCallback((from: number, to: number) => {
    const reordered = [...data.matches];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    updateAndSync({ ...data, matches: reordered });
  }, [data, updateAndSync]);

  const handleAddMatch = useCallback(() => {
    updateAndSync({ ...data, matches: [...data.matches, createItem()] });
  }, [data, updateAndSync]);

  // Mapping handler
  const handleSetMapping = useCallback((itemId: string, matchId: string) => {
    const newMapping = { ...data.mapping, [itemId]: matchId };
    updateAndSync({ ...data, mapping: newMapping });
  }, [data, updateAndSync]);

  // Shuffle matches order
  const handleShuffleMatches = useCallback(() => {
    const shuffled = [...data.matches].sort(() => Math.random() - 0.5);
    updateAndSync({ ...data, matches: shuffled });
  }, [data, updateAndSync]);

  // Stats
  const mappedCount = useMemo(
    () => Object.values(data.mapping).filter((v) => v && data.matches.some((m) => m.id === v)).length,
    [data]
  );

  return (
    <div className="space-y-5">
      {/* Instruction */}
      <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground">
            Create items and matches independently. Use the <strong>mapping dropdown</strong> below to connect each item to its correct match.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag to reorder within each column. Items and matches can have different counts.
          </p>
        </div>
      </div>

      {/* Two columns */}
      <div className="flex gap-5">
        <DraggableColumn
          items={data.items}
          label="Items"
          numberPrefix="number"
          colorOffset={0}
          onUpdate={handleUpdateItem}
          onRemove={handleRemoveItem}
          onReorder={handleReorderItems}
          onAdd={handleAddItem}
          minItems={2}
        />
        <DraggableColumn
          items={data.matches}
          label="Matches"
          numberPrefix="letter"
          colorOffset={4}
          onUpdate={handleUpdateMatch}
          onRemove={handleRemoveMatch}
          onReorder={handleReorderMatches}
          onAdd={handleAddMatch}
          minItems={2}
        />
      </div>

      {/* Mapping section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mapping
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
            onClick={handleShuffleMatches}
            title="Shuffle match order for students"
          >
            <Shuffle className="w-3 h-3" />
            Shuffle
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-muted/10 divide-y divide-border overflow-hidden">
          {data.items.map((item, i) => {
            const selectedMatchId = data.mapping[item.id] ?? "";
            const matchLabel = data.matches.find((m) => m.id === selectedMatchId);
            const colorClass = ITEM_COLORS[i % ITEM_COLORS.length];

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/20 transition-colors"
              >
                {/* Item badge */}
                <div className={cn("flex items-center gap-1.5 min-w-0 flex-1", )}>
                  <span className={cn(
                    "inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold shrink-0 border",
                    colorClass
                  )}>
                    {i + 1}
                  </span>
                  <span className="text-sm truncate text-foreground">
                    {item.text || <span className="italic text-muted-foreground">Item {i + 1}</span>}
                  </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-muted-foreground/40">→</div>

                {/* Match selector */}
                <div className="flex-1 min-w-0">
                  <Select
                    value={selectedMatchId}
                    onValueChange={(val) => handleSetMapping(item.id, val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select match..." />
                    </SelectTrigger>
                    <SelectContent>
                      {data.matches.map((match, mi) => (
                        <SelectItem key={match.id} value={match.id}>
                          <span className="flex items-center gap-1.5">
                            <span className={cn(
                              "inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold border",
                              ITEM_COLORS[(mi + 4) % ITEM_COLORS.length]
                            )}>
                              {LETTERS[mi]}
                            </span>
                            {match.text || `Match ${LETTERS[mi]}`}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-primary">{mappedCount}</span> of{" "}
            <span className="font-medium">{data.items.length}</span> mapped
          </span>
          <span>·</span>
          <span>
            <span className="font-medium">{data.items.length}</span> items,{" "}
            <span className="font-medium">{data.matches.length}</span> matches
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchTheFollowingEditor;
