import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MCQOptionsEditor from "./MCQOptionsEditor";
import ImageUploadEditor from "./ImageUploadEditor";
import FillInBlankEditor from "./FillInBlankEditor";
import MatchTheFollowingEditor from "./MatchTheFollowingEditor";
import type { MatchPair } from "./MatchTheFollowingEditor";
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
  matching: "Match the Following",
  "fill-blank": "Fill in the Blank",
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

const createDefaultPairs = (): MatchPair[] =>
  Array.from({ length: 4 }, () => ({
    id: crypto.randomUUID(),
    left: "",
    right: "",
  }));

export interface QuestionData {
  id: string;
  type: QuestionType;
  questionText: string;
  answerText?: string;
  hasImage?: boolean;
  imageData?: string | null;
  marks: string;
  label: string;
  includeWordBank?: boolean;
  matchPairs?: MatchPair[];
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
  const [activeTab, setActiveTab] = useState<"question" | "answer" | "image">("question");
  const [answerText, setAnswerText] = useState(editData?.answerText ?? "");
  const [hasImage, setHasImage] = useState(editData?.hasImage ?? false);
  const [imageData, setImageData] = useState<string | null>(editData?.imageData ?? null);
  const [includeWordBank, setIncludeWordBank] = useState(editData?.includeWordBank ?? false);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>(
    editData?.matchPairs ?? createDefaultPairs()
  );

  const handleImageChange = useCallback((newHasImage: boolean, newImageData: string | null) => {
    setHasImage(newHasImage);
    setImageData(newImageData);
  }, []);

  const resetState = useCallback(() => {
    setQuestionText("");
    setAnswerText("");
    setMarks(INITIAL_MARKS);
    setActiveTab("question");
    setHasImage(false);
    setImageData(null);
    setIncludeWordBank(false);
    setMatchPairs(createDefaultPairs());
  }, []);

  const handleSave = useCallback(() => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    onSave({
      id: editData?.id ?? crypto.randomUUID(),
      type,
      questionText,
      answerText,
      hasImage,
      imageData,
      marks,
      label: editData?.label ?? labels[0],
      includeWordBank: type === "fill-blank" ? includeWordBank : undefined,
      matchPairs: type === "matching" ? matchPairs : undefined,
    });
    resetState();
  }, [type, questionText, answerText, hasImage, imageData, marks, editData, onSave, includeWordBank, matchPairs, resetState]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!val) resetState();
      onOpenChange(val);
    },
    [onOpenChange, resetState]
  );

  // Determine which question-tab content to render
  const renderQuestionContent = () => {
    if (type === "fill-blank") {
      return (
        <FillInBlankEditor
          value={questionText}
          onChange={setQuestionText}
          includeWordBank={includeWordBank}
          onWordBankChange={setIncludeWordBank}
        />
      );
    }

    if (type === "matching") {
      return (
        <MatchTheFollowingEditor
          pairs={matchPairs}
          onChange={setMatchPairs}
        />
      );
    }

    return (
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {TOOLBAR_BUTTONS.map(({ icon: Icon, label: btnLabel }) => (
            <Button
              key={btnLabel}
              type="button"
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
              type="button"
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
            type="button"
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editData ? "Edit" : "Add"} {TYPE_LABELS[type]} Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Marks & Type */}
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
              type="button"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === "question"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("question")}
            >
              {TYPE_LABELS[type]}
            </button>
            <button
              type="button"
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
              {hasImage && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
            <button
              type="button"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === "answer"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("answer")}
            >
              Answer
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "image" ? (
            <ImageUploadEditor
              initialImage={imageData}
              onImageChange={handleImageChange}
            />
          ) : activeTab === "answer" ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Answer</Label>
              <Textarea
                placeholder="Type the answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="min-h-[180px] resize-y text-sm"
              />
            </div>
          ) : (
            renderQuestionContent()
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {editData ? "Update" : "Save"} Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditorDialog;
