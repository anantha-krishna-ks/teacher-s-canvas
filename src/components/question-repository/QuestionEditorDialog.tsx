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
import AssertionReasoningEditor, { type AssertionReasonPair, createDefaultPair } from "./AssertionReasoningEditor";
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
  "assertion-reasoning": "Assertion Reasoning",
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
  trueFalseAnswer?: boolean | null;
  hasImage?: boolean;
  imageData?: string | null;
  marks: string;
  label: string;
  includeWordBank?: boolean;
  matchPairs?: MatchPair[];
  assertionPairs?: AssertionReasonPair[];
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
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(
    editData?.trueFalseAnswer ?? null
  );
  const [assertionPairs, setAssertionPairs] = useState<AssertionReasonPair[]>(
    editData?.assertionPairs ?? [createDefaultPair()]
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
    setTrueFalseAnswer(null);
    setAssertionPairs([createDefaultPair()]);
  }, []);

  const handleSave = useCallback(() => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    onSave({
      id: editData?.id ?? crypto.randomUUID(),
      type,
      questionText,
      answerText,
      trueFalseAnswer: type === "true-false" ? trueFalseAnswer : undefined,
      hasImage,
      imageData,
      marks,
      label: editData?.label ?? labels[0],
      includeWordBank: type === "fill-blank" ? includeWordBank : undefined,
      matchPairs: type === "matching" ? matchPairs : undefined,
      assertionPairs: type === "assertion-reasoning" ? assertionPairs : undefined,
    });
    resetState();
  }, [type, questionText, answerText, trueFalseAnswer, hasImage, imageData, marks, editData, onSave, includeWordBank, matchPairs, assertionPairs, resetState]);

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

    if (type === "true-false") {
      return (
        <div className="space-y-5">
          {/* Question text */}
          <div className="space-y-1.5">
            <Label htmlFor="tf-statement" className="text-sm font-medium text-foreground">
              Statement
            </Label>
            <Textarea
              id="tf-statement"
              placeholder="Type your true/false statement here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="min-h-[100px] resize-y text-sm"
            />
          </div>

          {/* True/False selector */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Correct Answer</legend>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Correct answer">
              <button
                type="button"
                role="radio"
                aria-checked={trueFalseAnswer === true}
                onClick={() => setTrueFalseAnswer(true)}
                className={cn(
                  "relative flex items-center justify-center gap-2.5 rounded-xl border-2 py-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  trueFalseAnswer === true
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/60"
                    : "border-border bg-background text-foreground hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5"
                )}
              >
                <span aria-hidden="true" className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all",
                  trueFalseAnswer === true
                    ? "border-emerald-600 bg-emerald-600"
                    : "border-foreground/30"
                )}>
                  {trueFalseAnswer === true && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                True
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={trueFalseAnswer === false}
                onClick={() => setTrueFalseAnswer(false)}
                className={cn(
                  "relative flex items-center justify-center gap-2.5 rounded-xl border-2 py-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  trueFalseAnswer === false
                    ? "border-red-600 bg-red-50 text-red-800 shadow-sm dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/60"
                    : "border-border bg-background text-foreground hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/5"
                )}
              >
                <span aria-hidden="true" className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all",
                  trueFalseAnswer === false
                    ? "border-red-600 bg-red-600"
                    : "border-foreground/30"
                )}>
                  {trueFalseAnswer === false && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                False
              </button>
            </div>
            {trueFalseAnswer === null && (
              <p className="text-sm text-muted-foreground" role="status">Select the correct answer above</p>
            )}
          </fieldset>
        </div>
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

    if (type === "assertion-reasoning") {
      return (
        <AssertionReasoningEditor
          pairs={assertionPairs}
          onPairsChange={setAssertionPairs}
        />
      );
    }

    return (
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 flex-wrap" role="toolbar" aria-label="Text formatting">
          {TOOLBAR_BUTTONS.map(({ icon: Icon, label: btnLabel }) => (
            <Button
              key={btnLabel}
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground/70 hover:text-foreground"
              aria-label={btnLabel}
              title={btnLabel}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </Button>
          ))}
          <div className="w-px h-5 bg-border mx-1" role="separator" aria-orientation="vertical" />
          {ALIGN_BUTTONS.map(({ icon: Icon, label: btnLabel }) => (
            <Button
              key={btnLabel}
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground/70 hover:text-foreground"
              aria-label={btnLabel}
              title={btnLabel}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </Button>
          ))}
          <div className="w-px h-5 bg-border mx-1" role="separator" aria-orientation="vertical" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground/70 hover:text-foreground"
            aria-label="Clear formatting"
            title="Clear formatting"
          >
            <RemoveFormatting className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="question-text" className="text-sm font-medium text-foreground">
            Question
          </Label>
          <Textarea
            id="question-text"
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="min-h-[120px] resize-y text-sm"
          />
        </div>

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
              <Label htmlFor="marks-input" className="text-sm font-medium text-foreground">Marks</Label>
              <Input
                id="marks-input"
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
                aria-label="Marks"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-foreground block">Type</span>
              <div
                className="h-9 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm text-foreground"
                aria-label="Question type"
              >
                {TYPE_LABELS[type]}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Question editor sections"
            className="flex items-center gap-1 border-b border-border"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "question"}
              aria-controls="tab-panel-question"
              id="tab-question"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-sm",
                activeTab === "question"
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/70 hover:text-foreground"
              )}
              onClick={() => setActiveTab("question")}
            >
              {TYPE_LABELS[type]}
            </button>
            {type === "matching" && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "answer"}
                aria-controls="tab-panel-matching-question"
                id="tab-matching-question"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-sm",
                  activeTab === "answer"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                )}
                onClick={() => setActiveTab("answer")}
              >
                Question
              </button>
            )}
            {type !== "assertion-reasoning" && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "image"}
                aria-controls="tab-panel-image"
                id="tab-image"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-sm",
                  activeTab === "image"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                )}
                onClick={() => setActiveTab("image")}
              >
                <ImagePlus className="w-4 h-4" aria-hidden="true" />
                Image
                {hasImage && (
                  <span
                    className="w-2 h-2 rounded-full bg-primary"
                    aria-label="Image attached"
                    role="status"
                  />
                )}
              </button>
            )}
            {type !== "fill-blank" && type !== "true-false" && type !== "matching" && type !== "assertion-reasoning" && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "answer"}
                aria-controls="tab-panel-answer"
                id="tab-answer"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-sm",
                  activeTab === "answer"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                )}
                onClick={() => setActiveTab("answer")}
              >
                Answer
              </button>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "image" ? (
            <div role="tabpanel" id="tab-panel-image" aria-labelledby="tab-image">
              <ImageUploadEditor
                initialImage={imageData}
                onImageChange={handleImageChange}
              />
            </div>
          ) : activeTab === "answer" ? (
            type === "matching" ? (
              <div role="tabpanel" id="tab-panel-matching-question" aria-labelledby="tab-matching-question" className="space-y-1.5">
                <Label htmlFor="matching-question" className="text-sm font-medium text-foreground">
                  Question
                </Label>
                <Textarea
                  id="matching-question"
                  placeholder="Type your question or instructions here..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="min-h-[140px] resize-y text-sm"
                />
              </div>
            ) : (
              <div role="tabpanel" id="tab-panel-answer" aria-labelledby="tab-answer" className="space-y-2">
                <Label htmlFor="answer-text" className="text-sm font-medium text-foreground">Answer</Label>
                <Textarea
                  id="answer-text"
                  placeholder="Type the answer here..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="min-h-[180px] resize-y text-sm"
                />
              </div>
            )
          ) : (
            <div role="tabpanel" id="tab-panel-question" aria-labelledby="tab-question">
              {renderQuestionContent()}
            </div>
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
