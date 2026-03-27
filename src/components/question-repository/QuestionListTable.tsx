import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { QuestionData } from "./QuestionEditorDialog";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  "short-answer": "Short Answer",
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  matching: "Matching",
  "fill-blank": "Fill in the Blank",
  "section-heading": "Section Heading",
};

interface QuestionListTableProps {
  questions: QuestionData[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (question: QuestionData) => void;
  onDelete: (id: string) => void;
}

const QuestionListTable = ({
  questions,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: QuestionListTableProps) => {
  const allSelected = questions.length > 0 && selectedIds.size === questions.length;

  if (questions.length === 0) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[40px_48px_1fr_80px_140px_100px] items-center bg-primary text-primary-foreground px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
        <div className="flex justify-center">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onToggleSelectAll}
            className="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
          />
        </div>
        <span className="text-center">Sl No.</span>
        <span>Question</span>
        <span className="text-center">Marks</span>
        <span className="text-center">Type</span>
        <span className="text-center">Action</span>
      </div>

      {/* Table rows */}
      {questions.map((q, i) => {
        const isSelected = selectedIds.has(q.id);
        return (
          <div
            key={q.id}
            className={cn(
              "grid grid-cols-[40px_48px_1fr_80px_140px_100px] items-center px-3 py-3 border-b border-border last:border-b-0 transition-colors group",
              isSelected ? "bg-accent/40" : "hover:bg-muted/30"
            )}
          >
            <div className="flex justify-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(q.id)}
              />
            </div>
            <span className="text-sm text-muted-foreground text-center font-medium">
              {i + 1}
            </span>
            <div className="flex items-start gap-2 pr-4">
              <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5 cursor-grab" />
              <p className="text-sm text-foreground line-clamp-2">
                {q.questionText || (
                  <span className="italic text-muted-foreground">No question text</span>
                )}
              </p>
            </div>
            <span className="text-sm text-foreground text-center font-medium">
              {q.marks}
            </span>
            <span className="text-xs text-muted-foreground text-center">
              {TYPE_LABELS[q.type] ?? q.type}
            </span>
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(q)}
                aria-label="Edit question"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive/70 hover:text-destructive"
                onClick={() => onDelete(q.id)}
                aria-label="Delete question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionListTable;
