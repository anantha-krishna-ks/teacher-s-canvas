import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, BookOpen, CheckCircle2, BookOpenText, LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const ReadOnlyQuestionCard = ({ item }: { item: QuizQuestionItem }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-2.5 flex-wrap pb-3 border-b border-border/60">
      <span className="text-lg font-bold text-foreground tracking-tight">Q{item.number}</span>
      <div className="w-px h-5 bg-border" />
      <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${difficultyColor[item.difficulty]}`}>
        {item.difficulty}
      </Badge>
      <Badge variant="outline" className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${bloomColor[item.bloomLevel]}`}>
        {item.bloomLevel}
      </Badge>
    </div>

    <div className="bg-muted/30 rounded-lg px-5 py-3.5 border border-border/40">
      <p className="text-sm font-semibold text-foreground leading-relaxed">{item.question}</p>
    </div>

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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-green-50/60 border border-green-200/70 rounded-lg px-4 py-3">
        <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Correct Answer
        </p>
        <p className="text-sm text-foreground font-medium">{item.correctAnswer}</p>
      </div>
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

const ViewQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { grade, subject, chapter } = (location.state as { grade: string; subject: string; chapter: string }) || {
    grade: "",
    subject: "",
    chapter: "",
  };

  const quiz = useMemo(
    () => generateMockQuiz({ quizName: chapter, grade, subject, concepts: [], questionCount: 5 }),
    [grade, subject, chapter]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/dashboard/classroom-resources")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Quiz Preview</h1>
          <p className="text-sm text-muted-foreground">Review the generated quiz</p>
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
              <h2 className="text-base font-semibold text-foreground">{chapter}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <LayoutList className="w-3.5 h-3.5" />
                Class {grade} · {subject}
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
            {subject}
          </Badge>
        </div>
      </div>

      {/* Questions header */}
      <div className="flex items-center gap-2 text-base font-semibold text-foreground">
        <LayoutList className="w-5 h-5 text-primary" />
        Questions ({quiz.questions.length})
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-6">
            <ReadOnlyQuestionCard item={q} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewQuiz;
