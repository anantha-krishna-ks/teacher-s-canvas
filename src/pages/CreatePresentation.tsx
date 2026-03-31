import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  X,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Check,
  Presentation,
  Download,
  Loader2,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  GRADES,
  SUBJECTS_BY_GRADE,
  CHAPTERS_BY_SUBJECT,
} from "@/constants/lessonPlanData";

const CONCEPT_SUGGESTIONS: Record<string, string[]> = {
  "Chapter 1: Matter in Our Surroundings": [
    "States of Matter",
    "Change of State",
    "Evaporation",
    "Latent Heat",
    "Boiling Point",
  ],
  "Chapter 2: Is Matter Around Us Pure": [
    "Mixtures",
    "Solutions",
    "Suspensions",
    "Colloids",
    "Separation Techniques",
  ],
  "Chapter 1: Number Systems": [
    "Natural Numbers",
    "Rational Numbers",
    "Irrational Numbers",
    "Real Numbers",
    "Number Line",
  ],
  "Chapter 2: Polynomials": [
    "Degree of Polynomial",
    "Zeroes of Polynomial",
    "Remainder Theorem",
    "Factor Theorem",
    "Algebraic Identities",
  ],
};

const CreatePresentation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [conceptTags, setConceptTags] = useState<string[]>([]);
  const [newConcept, setNewConcept] = useState("");
  const [instructions, setInstructions] = useState("");
  const [generateAiImages, setGenerateAiImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const subjects = useMemo(
    () => (grade ? SUBJECTS_BY_GRADE[grade] || [] : []),
    [grade]
  );
  const chapters = useMemo(
    () => (subject ? CHAPTERS_BY_SUBJECT[subject] || [] : []),
    [subject]
  );
  const suggestedConcepts = useMemo(
    () => (chapter ? CONCEPT_SUGGESTIONS[chapter] || [] : []),
    [chapter]
  );

  const handleGradeChange = useCallback((val: string) => {
    setGrade(val);
    setSubject("");
    setChapter("");
    setConceptTags([]);
    setIsGenerated(false);
  }, []);

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    setChapter("");
    setConceptTags([]);
    setIsGenerated(false);
  }, []);

  const handleChapterChange = useCallback((val: string) => {
    setChapter(val);
    setConceptTags([]);
    setIsGenerated(false);
  }, []);

  const toggleConcept = useCallback((concept: string) => {
    setConceptTags((prev) =>
      prev.includes(concept)
        ? prev.filter((c) => c !== concept)
        : [...prev, concept]
    );
    setIsGenerated(false);
  }, []);

  const addCustomConcept = useCallback(() => {
    const trimmed = newConcept.trim();
    if (trimmed && !conceptTags.includes(trimmed)) {
      setConceptTags((prev) => [...prev, trimmed]);
      setNewConcept("");
      setIsGenerated(false);
    }
  }, [newConcept, conceptTags]);

  const removeConcept = useCallback((concept: string) => {
    setConceptTags((prev) => prev.filter((c) => c !== concept));
    setIsGenerated(false);
  }, []);

  const handleNewConceptKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addCustomConcept();
      }
    },
    [addCustomConcept]
  );

  const handleCancel = useCallback(
    () => navigate("/dashboard/presentations"),
    [navigate]
  );
  const handleNavigateBack = useCallback(
    () => navigate("/dashboard/presentations"),
    [navigate]
  );

  const isFormValid =
    grade && subject && chapter && conceptTags.length > 0;

  const handleGenerate = useCallback(() => {
    if (!isFormValid) return;
    setIsGenerating(true);
    // Simulate PPT generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast({
        title: "Presentation Generated",
        description:
          "Your presentation has been successfully generated and automatically saved in the 'Saved Presentations' section.",
      });
    }, 2500);
  }, [isFormValid, toast]);

  const handleDownload = useCallback(() => {
    // Mock download — in production this would fetch the actual file
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${subject}_${chapter}_presentation.pptx`;
    toast({
      title: "Download Started",
      description: "Your presentation file is being downloaded.",
    });
  }, [subject, chapter, toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
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
              <NavLink to="/dashboard/presentations">Presentations</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Presentation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleNavigateBack}
          aria-label="Go back to presentations"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Create Presentation
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure and generate a teaching presentation
          </p>
        </div>
      </div>

      {/* Section 1: Class & Subject */}
      <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
        <legend className="sr-only">Class and Subject</legend>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <GraduationCap className="w-4 h-4 text-primary" aria-hidden="true" />
          Class & Subject
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="grade">Class</Label>
            <Select value={grade} onValueChange={handleGradeChange}>
              <SelectTrigger id="grade">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>
                    Grade {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={subject}
              onValueChange={handleSubjectChange}
              disabled={!grade}
            >
              <SelectTrigger id="subject">
                <SelectValue
                  placeholder={grade ? "Select subject" : "Select class first"}
                />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapter">Chapter</Label>
            <Select
              value={chapter}
              onValueChange={handleChapterChange}
              disabled={!subject}
            >
              <SelectTrigger id="chapter">
                <SelectValue
                  placeholder={
                    subject ? "Select chapter" : "Select subject first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((ch) => (
                  <SelectItem key={ch} value={ch}>
                    {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* Section 2: Concepts Tagging */}
      <fieldset className="bg-card border border-border rounded-xl p-6 space-y-6">
        <legend className="sr-only">Concepts Tagging</legend>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
          Concepts Tagging
        </div>

        {!chapter ? (
          <p className="text-sm text-muted-foreground italic">
            Select a chapter to see available concepts
          </p>
        ) : (
          <div className="space-y-4">
            {/* Suggested concepts */}
            {suggestedConcepts.length > 0 && (
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-primary">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Available Concepts:
                </div>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Suggested concepts"
                >
                  {suggestedConcepts.map((concept) => {
                    const isSelected = conceptTags.includes(concept);
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
                            isSelected
                              ? "bg-primary/70 border-primary/70"
                              : "border-muted-foreground/40"
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </span>
                        {concept}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected tags display */}
            <AnimatePresence>
              {conceptTags.filter((c) => !suggestedConcepts.includes(c))
                .length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {conceptTags
                    .filter((c) => !suggestedConcepts.includes(c))
                    .map((concept) => (
                      <motion.button
                        key={concept}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => removeConcept(concept)}
                        aria-label={`Remove concept: ${concept}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-primary/15 text-primary border border-primary/30 transition-colors"
                      >
                        <span
                          className="w-4 h-4 rounded border bg-primary border-primary flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </span>
                        {concept}
                        <X
                          className="w-3.5 h-3.5 ml-0.5 hover:text-destructive"
                          aria-hidden="true"
                        />
                      </motion.button>
                    ))}
                </div>
              )}
            </AnimatePresence>

            {/* Add custom concept */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a custom concept tag..."
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                onKeyDown={handleNewConceptKeyDown}
                className="flex-1"
                aria-label="Custom concept tag"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomConcept}
                disabled={!newConcept.trim()}
              >
                <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                Add
              </Button>
            </div>
          </div>
        )}
      </fieldset>

      {/* Section 3: Additional Instructions */}
      <fieldset className="bg-card border border-border rounded-xl p-6 space-y-4">
        <legend className="sr-only">Additional Instructions</legend>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
          Additional Instructions
          <span className="text-muted-foreground font-normal">(optional)</span>
        </div>
        <Textarea
          placeholder="e.g., Focus on visual diagrams for complex concepts, include interactive elements, emphasize key learning objectives..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
          aria-label="Additional instructions for presentation"
        />
        <p className="text-xs text-muted-foreground">
          These instructions will guide the AI in creating a customized
          presentation that meets your specific needs.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="ai-images"
            checked={generateAiImages}
            onCheckedChange={(checked) =>
              setGenerateAiImages(checked === true)
            }
          />
          <Label
            htmlFor="ai-images"
            className="text-sm font-normal cursor-pointer"
          >
            Generate AI Images for Slides
          </Label>
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 pt-2 pb-6">
        <div className="flex items-center gap-3 w-full justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!isFormValid || isGenerating}
            className="gap-2"
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Presentation className="w-4 h-4" aria-hidden="true" />
                Generate Presentation
              </>
            )}
          </Button>
        </div>

        {/* Post-generation download */}
        <AnimatePresence>
          {isGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="flex flex-col items-center gap-2"
            >
              <Button
                onClick={handleDownload}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Download Generated PPT
              </Button>
              <p className="text-xs text-muted-foreground">
                {subject} — {chapter}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePresentation;
