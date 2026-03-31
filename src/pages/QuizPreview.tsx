import { useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Sparkles, BookOpen, Download, Save, CheckCircle2, AlertCircle, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";
import { generateMockQuiz, type QuizQuestionItem } from "@/utils/generateMockQuiz";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

const bloomColor: Record<string, string> = {
  Knowledge: "bg-blue-100 text-blue-700 border-blue-200",
  Understanding: "bg-purple-100 text-purple-700 border-purple-200",
  Application: "bg-orange-100 text-orange-700 border-orange-200",
  Analysis: "bg-teal-100 text-teal-700 border-teal-200",
};

const QuestionCard = ({ item }: { item: QuizQuestionItem }) => {
  const correctOption = item.options.find((o) => o.isCorrect);

  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-bold text-foreground">Q{item.number}</span>
        <Badge variant="outline" className={`text-xs font-medium ${difficultyColor[item.difficulty]}`}>
          {item.difficulty}
        </Badge>
        <Badge variant="outline" className="text-xs font-medium bg-muted text-muted-foreground">
          {item.type}
        </Badge>
        <Badge variant="outline" className={`text-xs font-medium ${bloomColor[item.bloomLevel]}`}>
          {item.bloomLevel}
        </Badge>
      </div>

      {/* Question text */}
      <div className="bg-muted/50 rounded-lg px-4 py-3">
        <p className="text-sm font-medium text-foreground">{item.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-1.5 pl-1">
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
          Options:
        </p>
        {item.options.map((opt) => (
          <div
            key={opt.label}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
              opt.isCorrect
                ? "bg-green-50 text-green-800 font-medium"
                : "text-foreground/80"
            }`}
          >
            <span className="font-medium text-muted-foreground">{opt.label}.</span>
            <span>{opt.text}</span>
            {opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto shrink-0" />}
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
        <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Correct Answer:
        </p>
        <p className="text-sm text-green-800 font-medium">{item.correctAnswer}</p>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
        <p className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mb-0.5">
          <AlertCircle className="w-3.5 h-3.5" />
          Explanation:
        </p>
        <p className="text-sm text-blue-800">{item.explanation}</p>
      </div>
    </div>
  );
};

const QuizPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const quiz = useMemo(() => {
    const name = searchParams.get("name") || "Untitled Quiz";
    const grade = searchParams.get("grade") || "";
    const subject = searchParams.get("subject") || "";
    const concepts = (searchParams.get("concepts") || "").split("||").filter(Boolean);
    const count = parseInt(searchParams.get("count") || "5", 10);

    return generateMockQuiz({ quizName: name, grade, subject, concepts, questionCount: count });
  }, [searchParams]);

  const handleBack = useCallback(() => navigate("/dashboard/quizzes/create"), [navigate]);
  const handleBackToList = useCallback(() => navigate("/dashboard/quizzes"), [navigate]);

  const handleSave = useCallback(() => {
    toast({ title: "Quiz Saved", description: "Your quiz has been saved successfully." });
  }, [toast]);

  const handleExport = useCallback(() => {
    toast({ title: "Quiz Exported", description: "Your quiz has been exported successfully." });
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/dashboard/quizzes">Quizzes</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quiz Preview</BreadcrumbPage>
          </BreadcrumbItem>
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

      {/* Quiz info card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{quiz.quizName}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <LayoutList className="w-3.5 h-3.5" />
                Chapter: {quiz.chapter}
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
            {quiz.subject}
          </Badge>
        </div>
      </div>

      {/* Questions header */}
      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
        <LayoutList className="w-5 h-5 text-primary" />
        Questions ({quiz.questions.length})
      </div>

      {/* Questions list */}
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {quiz.questions.map((q) => (
          <div key={q.id} className="p-6">
            <QuestionCard item={q} />
          </div>
        ))}
      </div>

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
