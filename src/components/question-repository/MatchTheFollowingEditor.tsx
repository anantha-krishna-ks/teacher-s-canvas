import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowRight } from "lucide-react";

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

  const handleLeftChange = (index: number, value: string) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, left: value } : r));
    sync(updated);
  };

  const handleRightChange = (index: number, value: string) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, right: value } : r));
    sync(updated);
  };

  const handleAdd = () => {
    sync([...rows, createPair()]);
  };

  const handleRemove = (index: number) => {
    if (rows.length <= 2) return;
    sync(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-[1fr_32px_1fr_36px] items-center gap-3 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Item
        </span>
        <span />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Match
        </span>
        <span />
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_32px_1fr_36px] items-center gap-3"
          >
            {/* Left input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60 select-none">
                {i + 1}.
              </span>
              <Input
                value={row.left}
                onChange={(e) => handleLeftChange(i, e.target.value)}
                placeholder={`Item ${i + 1}`}
                className="pl-8 h-10 text-sm border-border bg-background focus-visible:ring-primary/30"
              />
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
            </div>

            {/* Right input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60 select-none">
                {String.fromCharCode(65 + i)}.
              </span>
              <Input
                value={row.right}
                onChange={(e) => handleRightChange(i, e.target.value)}
                placeholder={`Match ${String.fromCharCode(65 + i)}`}
                className="pl-8 h-10 text-sm border-border bg-background focus-visible:ring-primary/30"
              />
            </div>

            {/* Delete */}
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => handleRemove(i)}
                disabled={rows.length <= 2}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full h-9 text-xs gap-1.5 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
        onClick={handleAdd}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Pair
      </Button>

      {/* Count */}
      <p className="text-xs text-muted-foreground text-center">
        {rows.length} {rows.length === 1 ? "pair" : "pairs"}
      </p>
    </div>
  );
};

export default MatchTheFollowingEditor;
