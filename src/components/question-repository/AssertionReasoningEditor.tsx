import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Plus, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FIXED_OPTIONS = [
  {
    label: "A",
    text: "Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of the Assertion (A).",
  },
  {
    label: "B",
    text: "Both Assertion (A) and Reason (R) are true, but Reason (R) is not the correct explanation of the Assertion (A).",
  },
  {
    label: "C",
    text: "Assertion (A) is true, but Reason (R) is false.",
  },
  {
    label: "D",
    text: "Assertion (A) is false, but Reason (R) is true.",
  },
];

export interface AssertionReasonPair {
  id: string;
  assertion: string;
  reason: string;
}

export const createDefaultPair = (): AssertionReasonPair => ({
  id: crypto.randomUUID(),
  assertion: "",
  reason: "",
});

interface AssertionReasoningEditorProps {
  pairs: AssertionReasonPair[];
  onPairsChange: (pairs: AssertionReasonPair[]) => void;
}

const AssertionReasoningEditor = ({
  pairs,
  onPairsChange,
}: AssertionReasoningEditorProps) => {
  const [openPairs, setOpenPairs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(pairs.map((p) => [p.id, true]))
  );

  const togglePair = (id: string) => {
    setOpenPairs((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const handlePairChange = (id: string, field: "assertion" | "reason", value: string) => {
    onPairsChange(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleAddPair = () => {
    onPairsChange([...pairs, createDefaultPair()]);
  };

  const handleRemovePair = (id: string) => {
    if (pairs.length <= 1) return;
    onPairsChange(pairs.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Default instruction banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex gap-2.5">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Default Instructions:</span>{" "}
            Two statements are given, one labelled as Assertion (A) and the other is labelled as
            Reason (R). Select the correct answer to these questions from the codes (A), (B),
            (C) and (D) as given below.
          </p>
        </div>
      </div>

      {/* Fixed answer options - compact row */}
      <div className="grid grid-cols-2 gap-1.5">
        {FIXED_OPTIONS.map((opt) => (
          <div
            key={opt.label}
            className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-2.5 py-2 text-[11px] text-muted-foreground leading-relaxed"
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-muted-foreground/10 text-[9px] font-bold shrink-0 mt-0.5">
              {opt.label}
            </span>
            <span>{opt.text}</span>
          </div>
        ))}
      </div>

      {/* Question pairs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Question Pairs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={handleAddPair}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Pair
          </Button>
        </div>

        <div className="space-y-3">
          {pairs.map((pair, index) => {
            const isOpen = openPairs[pair.id] ?? true;
            return (
              <div
                key={pair.id}
                className="relative rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-sm"
              >
                {/* Pair header (clickable) */}
                <button
                  type="button"
                  onClick={() => togglePair(pair.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        !isOpen && "-rotate-90"
                      )}
                    />
                    <span className="text-xs font-semibold text-foreground">
                      Q{index + 1}
                    </span>
                  </div>
                  {pairs.length > 1 && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Remove pair"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePair(pair.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemovePair(pair.id);
                        }
                      }}
                      className="inline-flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>

                {/* Collapsible content */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="divide-y divide-border">
                      <div className="p-3 space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Assertion (A)
                        </Label>
                        <Textarea
                          placeholder="Enter assertion statement..."
                          value={pair.assertion}
                          onChange={(e) => handlePairChange(pair.id, "assertion", e.target.value)}
                          className="min-h-[72px] resize-y text-sm border-0 bg-background/50 focus-visible:ring-1"
                        />
                      </div>
                      <div className="p-3 space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Reason (R)
                        </Label>
                        <Textarea
                          placeholder="Enter reason statement..."
                          value={pair.reason}
                          onChange={(e) => handlePairChange(pair.id, "reason", e.target.value)}
                          className="min-h-[72px] resize-y text-sm border-0 bg-background/50 focus-visible:ring-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssertionReasoningEditor;
