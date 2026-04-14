import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
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

interface AssertionReasoningEditorProps {
  assertionText: string;
  reasonText: string;
  selectedAnswer: string | null;
  onAssertionChange: (val: string) => void;
  onReasonChange: (val: string) => void;
  onAnswerChange: (val: string | null) => void;
}

const AssertionReasoningEditor = ({
  assertionText,
  reasonText,
  selectedAnswer,
  onAssertionChange,
  onReasonChange,
  onAnswerChange,
}: AssertionReasoningEditorProps) => {
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

      {/* Fixed answer options - display only */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Answer Options (Fixed)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FIXED_OPTIONS.map((opt) => (
            <div
              key={opt.label}
              className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-muted-foreground/30 text-[10px] font-bold shrink-0 mt-0.5">
                {opt.label}
              </span>
              <span className="leading-relaxed">{opt.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assertion & Reason inputs */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Assertion (A) <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Enter the assertion statement..."
            value={assertionText}
            onChange={(e) => onAssertionChange(e.target.value)}
            className="min-h-[80px] resize-y text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Reason (R) <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Enter the reason statement..."
            value={reasonText}
            onChange={(e) => onReasonChange(e.target.value)}
            className="min-h-[80px] resize-y text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default AssertionReasoningEditor;
