import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateMockQuiz, type QuizQuestionItem } from "@/utils/generateMockQuiz";
import { cn } from "@/lib/utils";

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-muted text-foreground border-border",
  Hard: "bg-red-50 text-red-700 border-red-200",
};

const bloomColor: Record<string, string> = {
  Knowledge: "bg-blue-50 text-blue-700 border-blue-200",
  Understanding: "bg-purple-50 text-purple-700 border-purple-200",
  Application: "bg-orange-50 text-orange-700 border-orange-200",
  Analysis: "bg-teal-50 text-teal-700 border-teal-200",
};

const QuizDisplay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const quiz = useMemo(() => {
    const name = searchParams.get("name") || "Untitled Quiz";
    const grade = searchParams.get("grade") || "";
    const subject = searchParams.get("subject") || "";
    const concepts = (searchParams.get("concepts") || "").split("||").filter(Boolean);
    const count = parseInt(searchParams.get("count") || "5", 10);
    return generateMockQuiz({ quizName: name, grade, subject, concepts, questionCount: count });
  }, [searchParams]);

  const questions = quiz.questions;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Record<number, string>>({});

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));
  const handleGoTo = (idx: number) => setCurrentIndex(idx);

  const handleSelect = (optionLabel: string) => {
    setSelectedOption((prev) => ({ ...prev, [currentIndex]: optionLabel }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Quiz
      </Button>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-primary">Progress</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question card */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-bold text-foreground">Question {current.number}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs font-medium rounded-full px-2.5 py-0.5", difficultyColor[current.difficulty])}>
              {current.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium rounded-full px-2.5 py-0.5 bg-muted/50 text-muted-foreground border-border">
              {current.type}
            </Badge>
            <Badge variant="outline" className={cn("text-xs font-medium rounded-full px-2.5 py-0.5", bloomColor[current.bloomLevel])}>
              {current.bloomLevel}
            </Badge>
          </div>
        </div>

        {/* Question text */}
        <p className="text-base text-foreground leading-relaxed">{current.question}</p>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((opt) => {
            const isSelected = selectedOption[currentIndex] === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.label)}
                className={cn(
                  "w-full flex items-center gap-4 text-left px-5 py-4 rounded-lg border transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-accent/30"
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </span>
                <span className={cn("text-sm", isSelected ? "text-foreground font-medium" : "text-foreground")}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <Button
          variant="ghost"
          className="gap-1.5 text-muted-foreground"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleGoTo(idx)}
              className={cn(
                "w-8 h-8 rounded-full text-sm font-medium transition-all",
                idx === currentIndex
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          className="gap-1.5 text-muted-foreground"
          onClick={handleNext}
          disabled={currentIndex === total - 1}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuizDisplay;
