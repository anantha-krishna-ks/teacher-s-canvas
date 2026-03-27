import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import MCQOptionsEditor from "./MCQOptionsEditor";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Underline,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  Pencil,
  Copy,
  Trash2,
  GripVertical,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type QuestionType =
  | "short-answer"
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "fill-blank"
  | "section-heading";

interface QuestionCardProps {
  index: number;
  label: string;
  type: QuestionType;
  onDelete: () => void;
  onDuplicate: () => void;
}

const TYPE_LABELS: Record<QuestionType, string> = {
  "short-answer": "Short Answer",
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  matching: "Matching",
  "fill-blank": "Fill in the Blank",
  "section-heading": "Section Heading",
};

const TABS = ["Answer", "Image", "Options"] as const;

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Subscript, label: "Subscript" },
  { icon: Superscript, label: "Superscript" },
] as const;

const ALIGN_BUTTONS = [
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
  { icon: AlignJustify, label: "Justify" },
] as const;

const QuestionCard = ({
  index,
  label,
  type,
  onDelete,
  onDuplicate,
}: QuestionCardProps) => {
  const [activeTab, setActiveTab] = useState<string>(TYPE_LABELS[type]);
  const [questionText, setQuestionText] = useState("");

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestionText(e.target.value);
    },
    []
  );

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground">
          Q{index}. {label}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main content */}
        <div className="flex-1 p-5 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border">
            <button
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === TYPE_LABELS[type]
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(TYPE_LABELS[type])}
            >
              {TYPE_LABELS[type]}
            </button>
            {TABS.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Image" && <ImagePlus className="w-3.5 h-3.5" />}
                {tab}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 flex-wrap">
            {TOOLBAR_BUTTONS.map(({ icon: Icon, label: btnLabel }) => (
              <Button
                key={btnLabel}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label={btnLabel}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            {ALIGN_BUTTONS.map(({ icon: Icon, label: btnLabel }) => (
              <Button
                key={btnLabel}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label={btnLabel}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Clear formatting"
            >
              <RemoveFormatting className="w-4 h-4" />
            </Button>
          </div>

          {/* Text area */}
          <Textarea
            placeholder="Type your question here..."
            value={questionText}
            onChange={handleTextChange}
            className="min-h-[160px] resize-y text-sm"
          />
        </div>

        {/* Side actions */}
        <div className="flex flex-col items-center gap-1 p-2 border-l border-border bg-muted/20">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Duplicate"
            onClick={onDuplicate}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive/70 hover:text-destructive"
            aria-label="Delete"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-grab"
            aria-label="Reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
