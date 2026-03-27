import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MCQOptionsEditor from "./MCQOptionsEditor";
import ImageUploadEditor from "./ImageUploadEditor";
import type { QuestionType } from "./QuestionCard";
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
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<QuestionType, string> = {
  "short-answer": "Short Answer",
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  matching: "Matching",
  "fill-blank": "Fill in the Blank",
  "section-heading": "Section Heading",
};

const INITIAL_MARKS = "1.00";

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

export interface QuestionData {
  id: string;
  type: QuestionType;
  questionText: string;
  marks: string;
  label: string;
}

interface QuestionEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: QuestionType;
  onSave: (data: QuestionData) => void;
  editData?: QuestionData | null;
}

const QuestionEditorDialog = ({
  open,
  onOpenChange,
  type,
  onSave,
  editData,
}: QuestionEditorDialogProps) => {
  const [questionText, setQuestionText] = useState(editData?.questionText ?? "");
  const [marks, setMarks] = useState(editData?.marks ?? INITIAL_MARKS);
  const [activeTab, setActiveTab] = useState<"question" | "image">("question");

  const handleSave = useCallback(() => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    onSave({
      id: editData?.id ?? crypto.randomUUID(),
      type,
      questionText,
      marks,
      label: editData?.label ?? labels[0],
    });
    setQuestionText("");
    setMarks(INITIAL_MARKS);
    setActiveTab("question");
  }, [type, questionText, marks, editData, onSave]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        setQuestionText("");
        setMarks(INITIAL_MARKS);
        setActiveTab("question");
      }
      onOpenChange(val);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editData ? "Edit" : "Add"} {TYPE_LABELS[type]} Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Marks */}
          <div className="flex items-center gap-4">
            <div className="space-y-1.5 w-32">
              <Label className="text-sm font-medium">Marks</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={marks}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(val)) {
                    setMarks(val);
                  }
                }}
                onBlur={() => {
                  const num = parseFloat(marks);
                  if (!isNaN(num)) {
                    setMarks(num.toFixed(2));
                  } else {
                    setMarks("1.00");
                  }
                }}
                className="h-9"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Type</Label>
              <div className="h-9 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm text-muted-foreground">
                {TYPE_LABELS[type]}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border">
            <button
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === "question"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("question")}
            >
              Question
            </button>
            <button
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5",
                activeTab === "image"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("image")}
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Image
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "image" ? (
            <ImageUploadEditor />
          ) : (
            <div className="space-y-3">
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

              <Textarea
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="min-h-[120px] resize-y text-sm"
              />

              {type === "multiple-choice" && <MCQOptionsEditor />}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editData ? "Update" : "Save"} Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditorDialog;
