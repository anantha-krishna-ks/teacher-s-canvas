import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchTheFollowingEditorProps {
  pairs: MatchPair[];
  onChange: (pairs: MatchPair[]) => void;
}

const createPair = (): MatchPair => ({
  id: crypto.randomUUID(),
  left: "",
  right: "",
});

const MatchTheFollowingEditor = ({ pairs, onChange }: MatchTheFollowingEditorProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleAddPair = useCallback(() => {
    onChange([...pairs, createPair()]);
  }, [pairs, onChange]);

  const handleRemovePair = useCallback(
    (index: number) => {
      if (pairs.length <= 2) return;
      onChange(pairs.filter((_, i) => i !== index));
    },
    [pairs, onChange]
  );

  const handleUpdateLeft = useCallback(
    (index: number, value: string) => {
      const updated = [...pairs];
      updated[index] = { ...updated[index], left: value };
      onChange(updated);
    },
    [pairs, onChange]
  );

  const handleUpdateRight = useCallback(
    (index: number, value: string) => {
      const updated = [...pairs];
      updated[index] = { ...updated[index], right: value };
      onChange(updated);
    },
    [pairs, onChange]
  );

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      const reordered = [...pairs];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(overIndex, 0, moved);
      onChange(reordered);
    }
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, pairs, onChange]);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-foreground">
          Enter items on the <span className="font-semibold">left</span> and their matching answers on the <span className="font-semibold">right</span>.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Drag rows to reorder. Students will see the right column shuffled.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[28px_32px_1fr_24px_1fr_32px] gap-2 items-center px-1">
        <div />
        <div />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Item
        </span>
        <div />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Match
        </span>
        <div />
      </div>

      {/* Pairs */}
      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`grid grid-cols-[28px_32px_1fr_24px_1fr_32px] gap-2 items-center group transition-all rounded-lg px-1 py-1.5 ${
              dragIndex === index ? "opacity-40" : ""
            } ${
              overIndex === index && dragIndex !== index
                ? "ring-2 ring-primary/30 bg-primary/5"
                : "hover:bg-muted/30"
            }`}
          >
            {/* Drag handle */}
            <div className="flex justify-center cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground/40" />
            </div>

            {/* Number */}
            <div className="flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                {index + 1}
              </span>
            </div>

            {/* Left input */}
            <Input
              value={pair.left}
              onChange={(e) => handleUpdateLeft(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="h-9 text-sm"
            />

            {/* Arrow connector */}
            <div className="flex justify-center">
              <div className="w-5 h-px bg-border relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-border border-y-[3px] border-y-transparent" />
              </div>
            </div>

            {/* Right input */}
            <Input
              value={pair.right}
              onChange={(e) => handleUpdateRight(index, e.target.value)}
              placeholder={`Match ${index + 1}`}
              className="h-9 text-sm"
            />

            {/* Remove button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-destructive/60 hover:text-destructive transition-opacity ${
                  pairs.length <= 2 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={() => handleRemovePair(index)}
                aria-label={`Remove pair ${index + 1}`}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add pair button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={handleAddPair}
      >
        <Plus className="w-3.5 h-3.5" />
        Add pair
      </Button>

      {/* Summary */}
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-primary">{pairs.length}</span>{" "}
        matching pair{pairs.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default MatchTheFollowingEditor;
