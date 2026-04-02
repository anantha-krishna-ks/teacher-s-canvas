import { useState, useMemo, useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import UploadReferenceDocument, { type UploadedFile } from "@/components/UploadReferenceDocument";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Presentation,
  Download,
  Loader2,
  FileText,
  ArrowLeft,
  CheckCircle2,
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
import LessonPlanTagging from "@/components/LessonPlanTagging";
import {
  GRADES,
  SUBJECTS_BY_GRADE,
  CHAPTERS_BY_SUBJECT,
} from "@/constants/lessonPlanData";

const CreatePresentation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [selectedLessonPlans, setSelectedLessonPlans] = useState<string[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<UploadedFile[]>([]);
  const [instructions, setInstructions] = useState("");
  const [generateAiImages, setGenerateAiImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = useMemo(
    () => (grade ? SUBJECTS_BY_GRADE[grade] || [] : []),
    [grade]
  );
  const chapters = useMemo(
    () => (subject ? CHAPTERS_BY_SUBJECT[subject] || [] : []),
    [subject]
  );

  const handleGradeChange = useCallback((val: string) => {
    setGrade(val);
    setSubject("");
    setChapter("");
    setIsGenerated(false);
    setErrors(prev => { const { grade, ...rest } = prev; return rest; });
  }, []);

  const handleSubjectChange = useCallback((val: string) => {
    setSubject(val);
    setChapter("");
    setIsGenerated(false);
    setErrors(prev => { const { subject, ...rest } = prev; return rest; });
  }, []);

  const handleChapterChange = useCallback((val: string) => {
    setChapter(val);
    setIsGenerated(false);
    setErrors(prev => { const { chapter, ...rest } = prev; return rest; });
  }, []);

  const handleCancel = useCallback(
    () => navigate("/dashboard/presentations"),
    [navigate]
  );
  const handleNavigateBack = useCallback(
    () => navigate("/dashboard/presentations"),
    [navigate]
  );

  const isFormValid = grade && subject && chapter;

  const handleGenerate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!grade) newErrors.grade = "Class is required";
    if (!subject) newErrors.subject = "Subject is required";
    if (!chapter) newErrors.chapter = "Chapter is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      sonnerToast.error("Please fill all mandatory fields");
      return;
    }
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
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in">
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
      <fieldset className="bg-card border border-border rounded-xl px-5 pb-4 pt-3 space-y-3">
        <legend className="sr-only">Class and Subject</legend>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <GraduationCap className="w-4 h-4 text-primary" aria-hidden="true" />
          Class & Subject
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="grade">Class <span className="text-destructive">*</span></Label>
            <Select value={grade} onValueChange={handleGradeChange}>
              <SelectTrigger id="grade" className={errors.grade ? "border-destructive" : ""}>
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
            {errors.grade && <p className="text-xs text-destructive">{errors.grade}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
            <Select
              value={subject}
              onValueChange={handleSubjectChange}
              disabled={!grade}
            >
              <SelectTrigger id="subject" className={errors.subject ? "border-destructive" : ""}>
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
            {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapter">Chapter <span className="text-destructive">*</span></Label>
            <Select
              value={chapter}
              onValueChange={handleChapterChange}
              disabled={!subject}
            >
              <SelectTrigger id="chapter" className={errors.chapter ? "border-destructive" : ""}>
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
            {errors.chapter && <p className="text-xs text-destructive">{errors.chapter}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 2: Lesson Plans Tagging */}
      <LessonPlanTagging
        subject={subject}
        selectedIds={selectedLessonPlans}
        onSelectionChange={setSelectedLessonPlans}
      />

      {/* Upload Reference Document */}
      <UploadReferenceDocument files={referenceFiles} onFilesChange={setReferenceFiles} />

      {/* Section 3: Additional Settings */}
      <fieldset className="bg-card border border-border rounded-xl px-5 pb-4 pt-3 space-y-3">
        <legend className="sr-only">Additional Settings</legend>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
          Additional Settings
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-sm">
            Instructions
            <span className="text-muted-foreground font-normal ml-1">(optional)</span>
          </Label>
          <Textarea
            id="instructions"
            placeholder="e.g., Focus on visual diagrams for complex concepts, include interactive elements, emphasize key learning objectives..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="resize-none"
            aria-label="Additional instructions for presentation"
          />
          <p className="text-xs text-muted-foreground">
            These instructions will guide the AI in creating a customized presentation.
          </p>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <Label className="text-sm">Preferences</Label>
          <label
            htmlFor="ai-images"
            className="flex items-center gap-3 cursor-pointer select-none rounded-lg border border-border bg-muted/20 px-4 py-3.5 hover:border-primary/30 transition-colors"
          >
            <Checkbox
              id="ai-images"
              checked={generateAiImages}
              onCheckedChange={(checked) =>
                setGenerateAiImages(checked === true)
              }
            />
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-foreground">
                Generate AI Images for Slides
              </span>
              <p className="text-xs text-muted-foreground">
                Automatically create relevant visuals for each slide using AI
              </p>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Actions — pre-generation */}
      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div
            key="form-actions"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 w-full justify-between pt-2 pb-6"
          >
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={isGenerating}
              className="gap-2"
              onClick={handleGenerate}
            >
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
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pb-6 space-y-5"
          >
            {/* Result card */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Success banner */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/20">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Presentation Generated Successfully</h3>
                  <p className="text-xs text-muted-foreground">
                    {subject} — {chapter} • Saved automatically
                  </p>
                </div>
              </div>

              {/* File row */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg border border-border bg-muted/30 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {subject.toLowerCase().replace(/\s+/g, "_")}_{chapter.toLowerCase().replace(/\s+/g, "_")}_presentation.pptx
                    </p>
                    <p className="text-xs text-muted-foreground">Generated just now</p>
                  </div>
                </div>
                <Button onClick={handleDownload} size="sm" className="gap-2 shrink-0 ml-4">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download PPT
                </Button>
              </div>
            </div>

            {/* Post-generation navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/dashboard/presentations")}
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Presentations
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePresentation;
