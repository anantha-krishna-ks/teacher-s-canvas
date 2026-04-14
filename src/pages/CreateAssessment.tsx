import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Info, Layers } from "lucide-react";
import SectionPanel from "@/components/assessment/SectionPanel";
import { createSection, type Section } from "@/constants/assessmentSectionData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

const TEST_TYPES = ["PA1", "PA2", "Mid-Term Exam", "Final Exam", "Unit Test"];
const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"];
const CHAPTERS = ["Chapter 1: Number Systems", "Chapter 2: Polynomials", "Chapter 3: Coordinate Geometry", "Chapter 4: Linear Equations", "Chapter 5: Triangles", "Chapter 6: Quadrilaterals", "Chapter 7: Areas", "Chapter 8: Circles", "Chapter 9: Constructions", "Chapter 10: Statistics"];

const INSTRUCTIONS_REQUIRED_TYPES = ["Final Exam", "Mid-Term Exam"];

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("type");
  const [attempted, setAttempted] = useState(false);

  const [typeOfTest, setTypeOfTest] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [totalMarks, setTotalMarks] = useState("");
  const [durationHr, setDurationHr] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [instructions, setInstructions] = useState("");
  const [sections, setSections] = useState<Section[]>([createSection("A")]);

  const isInstructionsRequired = INSTRUCTIONS_REQUIRED_TYPES.includes(typeOfTest);
  const hasDuration = durationHr || durationMin;

  const errors = attempted
    ? {
        typeOfTest: !typeOfTest ? "Please select a test type" : "",
        selectedClass: !selectedClass ? "Please select a class" : "",
        subject: !subject ? "Please select a subject" : "",
        chapters: chapters.length === 0 ? "Please select at least one chapter" : "",
        totalMarks: !totalMarks ? "Please enter total marks" : "",
        duration: !hasDuration ? "Please enter duration" : "",
        instructions: isInstructionsRequired && !instructions.trim() ? "Instructions are mandatory for Final and Mid-Term Exams" : "",
      }
    : { typeOfTest: "", selectedClass: "", subject: "", chapters: "", totalMarks: "", duration: "", instructions: "" };

  const handleBack = useCallback(() => navigate("/dashboard/assessment"), [navigate]);

  const handleNext = useCallback(() => {
    setAttempted(true);
    if (!typeOfTest || !selectedClass || !subject || chapters.length === 0 || !totalMarks || !hasDuration) return;
    if (isInstructionsRequired && !instructions.trim()) return;
    setActiveTab("sections");
  }, [typeOfTest, selectedClass, subject, chapters, totalMarks, hasDuration, isInstructionsRequired, instructions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleBack}
          aria-label="Go back to assessments"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Assessment</h1>
          <p className="text-sm text-muted-foreground">
            Set up a new assessment for your students
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/30 p-0 h-auto">
            <TabsTrigger
              value="type"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4" />
              Type of Assessment
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:shadow-none"
            >
              <Layers className="w-4 h-4" />
              Sections
            </TabsTrigger>
          </TabsList>

          {/* Type of Assessment Tab */}
          <TabsContent value="type" className="p-6 mt-0 space-y-6">
            {/* Row 1: Test Type, Class, Subject */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="typeOfTest" className="text-sm font-medium text-foreground">
                  Type of Test <span className="text-destructive">*</span>
                </Label>
                <Select value={typeOfTest} onValueChange={(v) => { setTypeOfTest(v); }}>
                  <SelectTrigger id="typeOfTest" className={`bg-background ${errors.typeOfTest ? "border-destructive ring-1 ring-destructive/30" : ""}`}>
                    <SelectValue placeholder="Select type of test" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeOfTest && <p className="text-xs text-destructive">{errors.typeOfTest}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="class" className="text-sm font-medium text-foreground">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); }}>
                  <SelectTrigger id="class" className={`bg-background ${errors.selectedClass ? "border-destructive ring-1 ring-destructive/30" : ""}`}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.selectedClass && <p className="text-xs text-destructive">{errors.selectedClass}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select value={subject} onValueChange={(v) => { setSubject(v); }}>
                  <SelectTrigger id="subject" className={`bg-background ${errors.subject ? "border-destructive ring-1 ring-destructive/30" : ""}`}>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>
            </div>

            {/* Row 2: Chapters, Total Marks, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="chapters" className="text-sm font-medium text-foreground">
                  Chapters <span className="text-destructive">*</span>
                </Label>
                <MultiSelect
                  id="chapters"
                  options={CHAPTERS}
                  selected={chapters}
                  onChange={setChapters}
                  placeholder="Select chapters"
                  className={errors.chapters ? "border-destructive ring-1 ring-destructive/30" : ""}
                />
                {errors.chapters && <p className="text-xs text-destructive">{errors.chapters}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="totalMarks" className="text-sm font-medium text-foreground">
                  Total Marks <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="Enter total marks"
                  className={`bg-background ${errors.totalMarks ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                  min={0}
                  max={999}
                />
                {errors.totalMarks && <p className="text-xs text-destructive">{errors.totalMarks}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Duration <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={durationHr}
                    onChange={(e) => setDurationHr(e.target.value)}
                    placeholder="0"
                    className={`bg-background ${errors.duration ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                    min={0}
                    max={10}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">hr</span>
                  <Input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    placeholder="0"
                    className={`bg-background ${errors.duration ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                    min={0}
                    max={59}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">min</span>
                </div>
                {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
              </div>
            </div>

            {/* Row 3: Instructions */}
            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-sm font-medium text-foreground">
                Instructions {isInstructionsRequired ? <span className="text-destructive">*</span> : <span className="text-muted-foreground text-xs">(optional)</span>}
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter any instructions for students..."
                className={`bg-background min-h-[100px] resize-y ${errors.instructions ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                maxLength={2000}
              />
              <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These instructions will appear at the beginning of the question paper.
                </p>
              </div>
              {errors.instructions && <p className="text-xs text-destructive">{errors.instructions}</p>}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <Button onClick={handleNext} className="px-8">
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="p-6 mt-0 space-y-6">
            <SectionPanel sections={sections} onChange={setSections} />

            {/* Back / Submit */}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setActiveTab("type")}>
                Back
              </Button>
              <Button
                onClick={() => toast.success("Assessment created successfully!")}
                className="px-8"
              >
                Create Assessment
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateAssessment;
