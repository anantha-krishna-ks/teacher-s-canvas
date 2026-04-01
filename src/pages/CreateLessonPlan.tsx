import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X, Sparkles, BookOpen, Layers, FileText, GraduationCap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneratedLessonPlan from "@/components/GeneratedLessonPlan";
import UploadReferenceDocument, { type UploadedFile } from "@/components/UploadReferenceDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const STEPPER_STEPS = [
  { label: "Lesson Setup", icon: FileText },
  { label: "Generated Plan", icon: Sparkles },
] as const;

const CreateLessonPlan = () => {
  const navigate = useNavigate();

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [newConcept, setNewConcept] = useState("");
  const [durationHr, setDurationHr] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [periods, setPeriods] = useState("");
  const [instructions, setInstructions] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const subjects = useMemo(() => (grade ? SUBJECTS_BY_GRADE[grade] || [] : []), [grade]);
  const chapters = useMemo(() => (subject ? CHAPTERS_BY_SUBJECT[subject] || [] : []), [subject]);
  const concepts = useMemo(() => (chapter ? CONCEPTS_BY_CHAPTER[chapter] || [] : []), [chapter]);

  const handleGradeChange = useCallback((val: string) => {
    setGrade(val);
    setSubject("");
    setChapter("");
    setSelectedConcepts([]);
  }, []);

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    setChapter("");
    setSelectedConcepts([]);
  }, []);

  const handleChapterChange = useCallback((val: string) => {
    setChapter(val);
    setSelectedConcepts([]);
  }, []);

  const toggleConcept = useCallback((concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  }, []);

  const addCustomConcept = useCallback(() => {
    const trimmed = newConcept.trim();
    if (trimmed && !selectedConcepts.includes(trimmed)) {
      setSelectedConcepts((prev) => [...prev, trimmed]);
      setNewConcept("");
    }
  }, [newConcept, selectedConcepts]);

  const removeConcept = useCallback((concept: string) => {
    setSelectedConcepts((prev) => prev.filter((c) => c !== concept));
  }, []);

  const handleNewConceptKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") addCustomConcept();
    },
    [addCustomConcept]
  );

  const handleNewConceptChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewConcept(e.target.value),
    []
  );

  const handleDurationHrChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDurationHr(e.target.value),
    []
  );

  const handleDurationMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDurationMin(e.target.value),
    []
  );

  const handlePeriodsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPeriods(e.target.value),
    []
  );

  const handleInstructionsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value),
    []
  );

  const handleCancel = useCallback(() => navigate("/dashboard/lesson-plans"), [navigate]);
  const handleGenerate = useCallback(() => setCurrentStep(1), []);
  const handleBackToSetup = useCallback(() => setCurrentStep(0), []);
  const handleNavigateBack = useCallback(() => navigate("/dashboard/lesson-plans"), [navigate]);

  const isFormValid = grade && subject && chapter && selectedConcepts.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
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
              <NavLink to="/dashboard/lesson-plans">Lesson Plans</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Lesson Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNavigateBack} aria-label="Go back to lesson plans">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Lesson Plan</h1>
          <p className="text-sm text-muted-foreground">Configure and generate a structured lesson plan</p>
        </div>
      </div>

      {/* Stepper */}
      <nav className="flex items-center gap-0 w-full" aria-label="Lesson plan creation steps">
        {STEPPER_STEPS.map((step, index) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={index === 0 ? handleBackToSetup : undefined}
              className={`flex items-center gap-2 ${index === 0 ? "cursor-pointer" : "cursor-default"}`}
              disabled={index > 0}
              aria-current={currentStep === index ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${step.label}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : currentStep > index
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > index ? <Check className="w-4 h-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  currentStep === index
                    ? "text-foreground"
                    : currentStep > index
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </button>
            {index < STEPPER_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${currentStep > 0 ? "bg-primary/40" : "bg-border"}`} />
            )}
          </div>
        ))}
      </nav>

      {currentStep === 0 && (
        <div className="space-y-6">
          {/* Row 1: Grade & Duration */}
          <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
            <legend className="sr-only">Class and Duration</legend>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GraduationCap className="w-4 h-4 text-primary" aria-hidden="true" />
              Class & Duration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={grade} onValueChange={handleGradeChange}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Hr"
                    min={0}
                    max={10}
                    value={durationHr}
                    onChange={handleDurationHrChange}
                    className="w-20 text-center"
                    aria-label="Duration hours"
                  />
                  <span className="text-sm text-muted-foreground">hr</span>
                  <Input
                    type="number"
                    placeholder="Min"
                    min={0}
                    max={59}
                    value={durationMin}
                    onChange={handleDurationMinChange}
                    className="w-20 text-center"
                    aria-label="Duration minutes"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={handleSubjectChange} disabled={!grade}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={grade ? "Select subject" : "Select grade first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periods">No. of Periods</Label>
                <Input
                  id="periods"
                  type="number"
                  placeholder="e.g. 5"
                  min={1}
                  max={20}
                  value={periods}
                  onChange={handlePeriodsChange}
                  className="w-32"
                />
              </div>
            </div>
          </fieldset>

          {/* Row 2: Chapter & Concepts */}
          <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
            <legend className="sr-only">Chapter and Concepts</legend>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
              Chapter & Concepts
            </div>

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

            <div className="space-y-3">
              <Label>Concepts</Label>

              {!chapter ? (
                <p className="text-sm text-muted-foreground italic">Select a chapter to see available concepts</p>
              ) : (
                <div className="space-y-4">
                  <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm font-medium text-primary">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Available Concepts:
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Available concepts">
                      {concepts.map((concept) => {
                        const isSelected = selectedConcepts.includes(concept);
                        return (
                          <motion.button
                            key={concept}
                            layout
                            onClick={() => toggleConcept(concept)}
                            aria-pressed={isSelected}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "bg-background text-foreground/80 border border-border hover:border-primary/30 hover:text-primary"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-primary/70 border-primary/70" : "border-muted-foreground/40"
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </span>
                            {concept}
                          </motion.button>
                        );
                      })}
                      <AnimatePresence>
                        {selectedConcepts
                          .filter((c) => !concepts.includes(c))
                          .map((concept) => (
                            <motion.button
                              key={concept}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => removeConcept(concept)}
                              aria-label={`Remove custom concept: ${concept}`}
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-primary/15 text-primary border border-primary/30 transition-colors"
                            >
                              <span className="w-4 h-4 rounded border bg-primary border-primary flex items-center justify-center shrink-0" aria-hidden="true">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </span>
                              {concept}
                              <X className="w-3.5 h-3.5 ml-0.5 hover:text-destructive" aria-hidden="true" />
                            </motion.button>
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a custom concept..."
                      value={newConcept}
                      onChange={handleNewConceptChange}
                      onKeyDown={handleNewConceptKeyDown}
                      className="flex-1"
                      aria-label="Custom concept name"
                    />
                    <Button variant="outline" size="sm" onClick={addCustomConcept} disabled={!newConcept.trim()}>
                      <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Row 3: Additional Instructions */}
          <fieldset className="bg-card border border-border rounded-xl p-6 space-y-4">
            <legend className="sr-only">Additional Instructions</legend>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
              Additional Instructions
              <span className="text-muted-foreground font-normal">(optional)</span>
            </div>
            <Textarea
              placeholder="Add any specific instructions for the lesson plan generation..."
              value={instructions}
              onChange={handleInstructionsChange}
              rows={4}
              aria-label="Additional instructions for lesson plan"
            />
          </fieldset>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button disabled={!isFormValid} className="gap-2" onClick={handleGenerate}>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Generate Lesson Plan
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <GeneratedLessonPlan
          data={{
            grade,
            subject,
            chapter,
            concepts: selectedConcepts,
            duration: [durationHr && `${durationHr}hr`, durationMin && `${durationMin}min`].filter(Boolean).join(" "),
            periods,
          }}
          onBack={handleBackToSetup}
        />
      )}
    </div>
  );
};

export default CreateLessonPlan;
