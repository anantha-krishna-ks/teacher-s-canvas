import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft, Sparkles, BookOpen, Download, Save,
  CheckCircle2, BookOpenText, LayoutList, Pencil, Trash2, X, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import { generateMockQuiz, type QuizQuestionItem, type DifficultyLevel, type BloomLevel } from "@/utils/generateMockQuiz";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard: "bg-red-50 text-red-700 border-red-200",
};

const bloomColor: Record<string, string> = {
  Knowledge: "bg-blue-50 text-blue-700 border-blue-200",
  Understanding: "bg-purple-50 text-purple-700 border-purple-200",
  Application: "bg-orange-50 text-orange-700 border-orange-200",
  Analysis: "bg-teal-50 text-teal-700 border-teal-200",
};

const DIFFICULTIES: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const BLOOM_LEVELS: BloomLevel[] = ["Knowledge", "Understanding", "Application", "Analysis"];

/* ───── Read-only Question Card ───── */
interface QuestionCardProps {
  item: QuizQuestionItem;
  onEdit: (item: QuizQuestionItem) => void;
  onDelete: (id: string) => void;
}

const QuestionCard = ({ item, onEdit, onDelete }: QuestionCardProps) => (
  <div className="space-y-5">
    {/* Header row with badges + actions */}
    <div className="flex items-center justify-between pb-3 border-b border-border/60">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-lg font-bold text-foreground tracking-tight">Q{item.number}</span>
        <div className="w-px h-5 bg-border" />
        <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${difficultyColor[item.difficulty]}`}>
          {item.difficulty}
        </Badge>
        <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${bloomColor[item.bloomLevel]}`}>
          {item.bloomLevel}
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" onClick={() => onEdit(item)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => onDelete(item.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Question text */}
    <div className="bg-muted/30 rounded-lg px-5 py-3.5 border border-border/40">
      <p className="text-sm font-semibold text-foreground leading-relaxed">{item.question}</p>
    </div>

    {/* Options */}
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 inline-block" />
        Options
      </p>
      <div className="grid gap-1.5">
        {item.options.map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm transition-all ${
              opt.isCorrect
                ? "bg-green-50 border border-green-200/80 shadow-sm shadow-green-100"
                : "border border-transparent hover:bg-muted/20"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              opt.isCorrect
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-muted/60 text-muted-foreground border border-border/60"
            }`}>
              {opt.label}
            </span>
            <span className={`flex-1 ${opt.isCorrect ? "text-green-800 font-medium" : "text-foreground/80"}`}>{opt.text}</span>
            {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
          </div>
        ))}
      </div>
    </div>

    {/* Correct Answer & Explanation side by side on larger screens */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Correct Answer */}
      <div className="bg-green-50/60 border border-green-200/70 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Correct Answer
        </p>
        <p className="text-sm text-foreground font-medium">{item.correctAnswer}</p>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
          <BookOpenText className="w-3.5 h-3.5" />
          Explanation
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed">{item.explanation}</p>
      </div>
    </div>
  </div>
);

/* ───── Edit Question Modal ───── */
interface EditQuestionModalProps {
  item: QuizQuestionItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: QuizQuestionItem) => void;
}

const EditQuestionModal = ({ item, open, onClose, onSave }: EditQuestionModalProps) => {
  const [editData, setEditData] = useState<QuizQuestionItem | null>(null);

  useEffect(() => {
    if (item) {
      setEditData({ ...item });
    } else {
      setEditData(null);
    }
  }, [item]);

  if (!editData) return null;

  const handleOptionTextChange = (idx: number, text: string) => {
    setEditData((prev) =>
      prev ? { ...prev, options: prev.options.map((o, i) => (i === idx ? { ...o, text } : o)) } : prev
    );
  };

  const handleCorrectToggle = (idx: number) => {
    setEditData((prev) =>
      prev
        ? {
            ...prev,
            options: prev.options.map((o, i) => ({ ...o, isCorrect: i === idx })),
            correctAnswer: prev.options[idx].text,
          }
        : prev
    );
  };

  const handleSave = () => {
    if (!editData) return;
    const correct = editData.options.find((o) => o.isCorrect);
    onSave({ ...editData, correctAnswer: correct?.text || editData.correctAnswer });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Edit Question {editData.number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Question text */}
          <div className="space-y-2">
            <Label htmlFor="edit-question">Question</Label>
            <Textarea
              id="edit-question"
              value={editData.question}
              onChange={(e) => setEditData((p) => p ? { ...p, question: e.target.value } : p)}
              rows={3}
            />
          </div>

          {/* Difficulty & Bloom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={editData.difficulty}
                onValueChange={(v) => setEditData((p) => p ? { ...p, difficulty: v as DifficultyLevel } : p)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bloom's Level</Label>
              <Select
                value={editData.bloomLevel}
                onValueChange={(v) => setEditData((p) => p ? { ...p, bloomLevel: v as BloomLevel } : p)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BLOOM_LEVELS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Options (select the correct answer)</Label>
            {editData.options.map((opt, idx) => (
              <div key={opt.label} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCorrectToggle(idx)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    opt.isCorrect ? "border-green-500 bg-green-500" : "border-muted-foreground/40 hover:border-primary"
                  }`}
                  aria-label={`Mark option ${opt.label} as correct`}
                >
                  {opt.isCorrect && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className="text-sm font-semibold text-muted-foreground w-6">{opt.label}.</span>
                <Input
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="edit-explanation">Explanation</Label>
            <Textarea
              id="edit-explanation"
              value={editData.explanation}
              onChange={(e) => setEditData((p) => p ? { ...p, explanation: e.target.value } : p)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ───── Main Page ───── */
const QuizPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initialQuiz = useMemo(() => {
    const name = searchParams.get("name") || "Untitled Quiz";
    const grade = searchParams.get("grade") || "";
    const subject = searchParams.get("subject") || "";
    const concepts = (searchParams.get("concepts") || "").split("||").filter(Boolean);
    const count = parseInt(searchParams.get("count") || "5", 10);
    return generateMockQuiz({ quizName: name, grade, subject, concepts, questionCount: count });
  }, [searchParams]);

  const [questions, setQuestions] = useState<QuizQuestionItem[]>(initialQuiz.questions);
  const [editingItem, setEditingItem] = useState<QuizQuestionItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = useCallback((item: QuizQuestionItem) => setEditingItem(item), []);
  const handleCloseEdit = useCallback(() => setEditingItem(null), []);

  const handleSaveEdit = useCallback((updated: QuizQuestionItem) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setEditingItem(null);
    toast({ title: "Question Updated", description: `Q${updated.number} has been updated.` });
  }, [toast]);

  const confirmDelete = useCallback(() => {
    if (!deleteId) return;
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== deleteId);
      return filtered.map((q, i) => ({ ...q, number: i + 1 }));
    });
    setDeleteId(null);
    toast({ title: "Question Deleted", description: "The question has been removed." });
  }, [deleteId, toast]);

  const handleBack = useCallback(() => navigate("/dashboard/quizzes/create"), [navigate]);
  const handleBackToList = useCallback(() => navigate("/dashboard/quizzes"), [navigate]);

  const handleSave = useCallback(() => {
    toast({ title: "Quiz Saved", description: "Your quiz has been saved successfully." });
  }, [toast]);

  const handleExport = useCallback(() => {
    toast({ title: "Quiz Exported", description: "Your quiz has been exported successfully." });
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in pb-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><NavLink to="/dashboard">Dashboard</NavLink></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><NavLink to="/dashboard/quizzes">Quizzes</NavLink></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Quiz Preview</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Quiz Preview & Editing</h1>
            <p className="text-sm text-muted-foreground">Review and edit your generated quiz</p>
          </div>
        </div>
      </div>

      {/* Quiz info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{initialQuiz.quizName}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <LayoutList className="w-3.5 h-3.5" />
                Chapter: {initialQuiz.chapter}
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
            {initialQuiz.subject}
          </Badge>
        </div>
      </div>

      {/* Questions header */}
      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
        <LayoutList className="w-5 h-5 text-primary" />
        Questions ({questions.length})
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-6">
            <QuestionCard item={q} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            All questions have been removed.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditQuestionModal
        item={editingItem}
        open={!!editingItem}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom action bar - rendered as sticky at end of content */}
      <div className="sticky bottom-0 -mx-3 md:-mx-4 lg:-mx-6 bg-card border-t border-border py-3 px-6 z-40 mt-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleBackToList}>
            <BookOpen className="w-4 h-4" />
            Discard
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
