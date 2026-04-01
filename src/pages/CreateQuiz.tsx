import { useState, useMemo, useCallback } from "react";
import UploadReferenceDocument, { type UploadedFile } from "@/components/UploadReferenceDocument";
import LessonPlanTagging from "@/components/LessonPlanTagging";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X, Sparkles, GraduationCap, Layers, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavLink } from "@/components/NavLink";
import { GRADES, SUBJECTS_BY_GRADE, CHAPTERS_BY_SUBJECT, CONCEPTS_BY_CHAPTER } from "@/constants/lessonPlanData";

const QUESTION_COUNT_OPTIONS = [
  { value: "5", label: "Create quiz with 5 questions" },
  { value: "10", label: "Create quiz with 10 questions" },
  { value: "12", label: "Create quiz with 12 questions" },
];

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedLessonPlans, setSelectedLessonPlans] = useState<string[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<UploadedFile[]>([]);
  const [questionCount, setQuestionCount] = useState("");

  const subjects = useMemo(() => (grade ? SUBJECTS_BY_GRADE[grade] || [] : []), [grade]);
  const chapters = useMemo(() => (subject ? CHAPTERS_BY_SUBJECT[subject] || [] : []), [subject]);
  

  const handleGradeChange = useCallback((val: string) => {
    setGrade(val);
    setSubject("");
    setChapter("");
  }, []);

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    setChapter("");
  }, []);

  const handleChapterChange = useCallback((val: string) => {
    setChapter(val);
  }, []);

  const isFormValid = quizName.trim() && grade && subject && questionCount;

  const handleGenerate = useCallback(() => {
    const params = new URLSearchParams({
      name: quizName,
      grade,
      subject,
      concepts: selectedConcepts.join("||"),
      count: questionCount,
    });
    navigate(`/dashboard/quizzes/preview?${params.toString()}`);
  }, [navigate, quizName, grade, subject, selectedConcepts, questionCount]);

  const handleCancel = useCallback(() => navigate("/dashboard/quizzes"), [navigate]);
  const handleNavigateBack = useCallback(() => navigate("/dashboard/quizzes"), [navigate]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
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
            <BreadcrumbPage>Create Quiz</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNavigateBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Quiz</h1>
          <p className="text-sm text-muted-foreground">Configure and generate an interactive quiz</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quiz Name */}
        <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
          <legend className="sr-only">Quiz Details</legend>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Quiz Details
          </div>
          <div className="space-y-2">
            <Label htmlFor="quizName">Quiz Name</Label>
            <Input
              id="quizName"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>
        </fieldset>

        {/* Class & Subject */}
        <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
          <legend className="sr-only">Class and Subject</legend>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            Class & Subject
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade">Class</Label>
              <Select value={grade} onValueChange={handleGradeChange}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>Class {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={handleSubjectChange} disabled={!grade}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder={grade ? "Select subject" : "Select class first"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={chapter} onValueChange={handleChapterChange} disabled={!subject}>
                <SelectTrigger id="chapter">
                  <SelectValue placeholder={subject ? "Select chapter" : "Select subject first"} />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((ch) => (
                    <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionCount">Question Count</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="questionCount">
                  <SelectValue placeholder="Select question count" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_COUNT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>

        {/* Lesson Plans Tagging */}
        <LessonPlanTagging
          subject={subject}
          selectedIds={selectedLessonPlans}
          onSelectionChange={setSelectedLessonPlans}
        />

        {/* Upload Reference Document */}
        <UploadReferenceDocument files={referenceFiles} onFilesChange={setReferenceFiles} />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button disabled={!isFormValid} className="gap-2" onClick={handleGenerate}>
            <Sparkles className="w-4 h-4" />
            Generate Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
