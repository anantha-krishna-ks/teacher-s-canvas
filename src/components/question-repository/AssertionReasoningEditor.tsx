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
    <div className="space-y-5" role="region" aria-label="Assertion and Reasoning editor">
      {/* Default instruction banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3" role="note">
        <div className="flex gap-2.5">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-foreground leading-relaxed">
            Two statements are given, one labelled as Assertion (A) and the other is labelled as
            Reason (R). Select the correct answer to these questions from the codes (A), (B),
            (C) and (D) as given below.
          </p>
        </div>
      </div>

      {/* Fixed answer options - compact row */}
      <ul className="grid grid-cols-2 gap-2" aria-label="Fixed answer options">
        {FIXED_OPTIONS.map((opt) => (
          <li
            key={opt.label}
            className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5"
            >
              {opt.label}
            </span>
            <span><span className="sr-only">Option {opt.label}: </span>{opt.text}</span>
          </li>
        ))}
      </ul>

      {/* Question pairs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">Question Pairs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-sm gap-1.5 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={handleAddPair}
            aria-label="Add a new assertion-reason pair"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
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
                  aria-controls={`pair-content-${pair.id}`}
                  aria-label={`Toggle question pair ${index + 1}`}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "w-4 h-4 text-foreground transition-transform duration-200",
                        !isOpen && "-rotate-90"
                      )}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      Q{index + 1}
                    </span>
                  </div>
                  {pairs.length > 1 && (
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove question pair ${index + 1}`}
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
                      className="inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                </button>

                {/* Collapsible content */}
                <div
                  id={`pair-content-${pair.id}`}
                  role="region"
                  aria-label={`Question pair ${index + 1} content`}
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="divide-y divide-border">
                      <div className="p-3 space-y-1.5">
                        <Label
                          htmlFor={`assertion-${pair.id}`}
                          className="text-sm font-medium text-foreground"
                        >
                          Assertion (A)
                        </Label>
                        <Textarea
                          id={`assertion-${pair.id}`}
                          placeholder="Enter assertion statement..."
                          value={pair.assertion}
                          onChange={(e) => handlePairChange(pair.id, "assertion", e.target.value)}
                          className="min-h-[72px] resize-y text-sm border border-border bg-background focus-visible:ring-2"
                        />
                      </div>
                      <div className="p-3 space-y-1.5">
                        <Label
                          htmlFor={`reason-${pair.id}`}
                          className="text-sm font-medium text-foreground"
                        >
                          Reason (R)
                        </Label>
                        <Textarea
                          id={`reason-${pair.id}`}
                          placeholder="Enter reason statement..."
                          value={pair.reason}
                          onChange={(e) => handlePairChange(pair.id, "reason", e.target.value)}
                          className="min-h-[72px] resize-y text-sm border border-border bg-background focus-visible:ring-2"
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
