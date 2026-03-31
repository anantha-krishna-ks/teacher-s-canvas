import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft, Sparkles, BookOpen, Download, Save,
  CheckCircle2, BookOpenText, LayoutList, Pencil, Trash2, X, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { generateMockQuiz, type QuizQuestionItem } from "@/utils/generateMockQuiz";

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

interface QuestionCardProps {
  item: QuizQuestionItem;
  onEdit: (item: QuizQuestionItem) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  onSaveEdit: (item: QuizQuestionItem) => void;
  onCancelEdit: () => void;
}

const QuestionCard = ({ item, onEdit, onDelete, isEditing, onSaveEdit, onCancelEdit }: QuestionCardProps) => {
  const [editData, setEditData] = useState(item);

  const handleOptionTextChange = useCallback((idx: number, text: string) => {
    setEditData((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => (i === idx ? { ...o, text } : o)),
    }));
  }, []);

  const handleCorrectToggle = useCallback((idx: number) => {
    setEditData((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => ({ ...o, isCorrect: i === idx })),
      correctAnswer: prev.options[idx].text,
    }));
  }, []);

  const handleSave = useCallback(() => {
    const correct = editData.options.find((o) => o.isCorrect);
    onSaveEdit({ ...editData, correctAnswer: correct?.text || editData.correctAnswer });
  }, [editData, onSaveEdit]);

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">Q{item.number} — Editing</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Input
          value={editData.question}
          onChange={(e) => setEditData((p) => ({ ...p, question: e.target.value }))}
          className="text-sm font-medium"
        />
        <div className="space-y-2 pl-1">
          <p className="text-xs font-semibold text-muted-foreground">Options (click radio to set correct):</p>
          {editData.options.map((opt, idx) => (
            <div key={opt.label} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCorrectToggle(idx)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  opt.isCorrect ? "border-green-500 bg-green-500" : "border-muted-foreground/40"
                }`}
              >
                {opt.isCorrect && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm font-medium text-muted-foreground w-5">{opt.label}.</span>
              <Input
                value={opt.text}
                onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                className="flex-1 h-8 text-sm"
              />
            </div>
          ))}
        </div>
        <Input
          value={editData.explanation}
          onChange={(e) => setEditData((p) => ({ ...p, explanation: e.target.value }))}
          placeholder="Explanation"
          className="text-sm"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row with badges + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-foreground">Q{item.number}</span>
          <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${difficultyColor[item.difficulty]}`}>
            {item.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium rounded-full px-2.5 py-0.5 bg-muted/50 text-muted-foreground">
            {item.type}
          </Badge>
          <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${bloomColor[item.bloomLevel]}`}>
            {item.bloomLevel}
          </Badge>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Question text */}
      <div className="bg-muted/40 rounded-lg px-4 py-3 border border-border/50">
        <p className="text-sm font-medium text-foreground">{item.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-0 pl-2">
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
          Options:
        </p>
        {item.options.map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              opt.isCorrect
                ? "bg-green-50 border border-green-200"
                : ""
            }`}
          >
            <span className={`font-medium ${opt.isCorrect ? "text-green-700" : "text-muted-foreground"}`}>{opt.label}.</span>
            <span className={opt.isCorrect ? "text-green-800 font-medium" : "text-foreground/80"}>{opt.text}</span>
            {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 ml-1 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div className="bg-green-50/80 border border-green-200 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Correct Answer:
        </p>
        <p className="text-sm text-foreground font-medium">{item.correctAnswer}</p>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-1">
          <BookOpenText className="w-3.5 h-3.5" />
          Explanation:
        </p>
        <p className="text-sm text-foreground/90">{item.explanation}</p>
      </div>
    </div>
  );
};

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = useCallback((item: QuizQuestionItem) => setEditingId(item.id), []);
  const handleCancelEdit = useCallback(() => setEditingId(null), []);

  const handleSaveEdit = useCallback((updated: QuizQuestionItem) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setEditingId(null);
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

      {/* Questions — each in its own bordered card */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-6">
            <QuestionCard
              item={q}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
              isEditing={editingId === q.id}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            All questions have been removed.
          </div>
        )}
      </div>

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

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-3 px-6 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
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
