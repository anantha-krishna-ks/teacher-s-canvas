import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  LayoutGrid,
  Columns2,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutMode = "grid" | "split" | "list";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  isLocked: boolean;
}

const LAYOUT_OPTIONS: { mode: LayoutMode; label: string; icon: React.ElementType }[] = [
  { mode: "grid", label: "Grid (4-Col)", icon: LayoutGrid },
  { mode: "split", label: "Split (2-Col)", icon: Columns2 },
  { mode: "list", label: "List", icon: List },
];

const MCQOptionsEditor = () => {
  const [layout, setLayout] = useState<LayoutMode>("list");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [options, setOptions] = useState<MCQOption[]>(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
      isLocked: false,
    }))
  );

  const handleTextChange = useCallback((id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }, []);

  const handleToggleCorrect = useCallback(
    (id: string) => {
      setOptions((prev) =>
        prev.map((o) => {
          if (o.id === id) return { ...o, isCorrect: !o.isCorrect };
          if (!allowMultiple) return { ...o, isCorrect: false };
          return o;
        })
      );
    },
    [allowMultiple]
  );

  const handleToggleLock = useCallback((id: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isLocked: !o.isLocked } : o))
    );
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return;
    setOptions((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setOptions((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setOptions((prev) => (prev.length <= 2 ? prev : prev.filter((o) => o.id !== id)));
  }, []);

  const handleAdd = useCallback(() => {
    setOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", isCorrect: false, isLocked: false },
    ]);
  }, []);

  const optionLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <Checkbox
            checked={allowMultiple}
            onCheckedChange={(v) => setAllowMultiple(!!v)}
          />
          Multiple correct answers
        </label>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {LAYOUT_OPTIONS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                layout === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div
        className={cn(
          "gap-3",
          layout === "grid" && "grid grid-cols-2 xl:grid-cols-4",
          layout === "split" && "grid grid-cols-1 sm:grid-cols-2",
          layout === "list" && "flex flex-col"
        )}
      >
        {options.map((opt, i) => (
          <div
            key={opt.id}
            className={cn(
              "flex items-center gap-2 group/opt rounded-lg border p-2 transition-colors",
              opt.isCorrect
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-background"
            )}
          >
            {/* Select correct */}
            <button
              onClick={() => handleToggleCorrect(opt.id)}
              className={cn(
                "shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors",
                opt.isCorrect
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
              )}
              title="Mark as correct"
            >
              {optionLabels[i]}
            </button>

            {/* Input */}
            <Input
              value={opt.text}
              onChange={(e) => handleTextChange(opt.id, e.target.value)}
              placeholder={`Option ${optionLabels[i]}`}
              className="flex-1 h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-2"
            />

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover/opt:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleToggleLock(opt.id)}
                title={opt.isLocked ? "Unlock" : "Lock"}
              >
                {opt.isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleMoveUp(i)}
                disabled={i === 0}
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleMoveDown(i)}
                disabled={i === options.length - 1}
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive/70 hover:text-destructive"
                onClick={() => handleRemove(opt.id)}
                disabled={options.length <= 2}
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add option */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={handleAdd}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Option
      </Button>
    </div>
  );
};

export default MCQOptionsEditor;
