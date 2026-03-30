import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Layers } from "lucide-react";
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
import { toast } from "sonner";

const TEST_TYPES = ["PA1", "PA2", "Mid-Term Exam", "Final Exam", "Unit Test"];
const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"];

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("type");

  const [typeOfTest, setTypeOfTest] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [durationHr, setDurationHr] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleBack = useCallback(() => navigate("/dashboard/assessment"), [navigate]);

  const handleNext = useCallback(() => {
    if (!typeOfTest || !selectedClass || !subject) {
      toast.error("Please fill in all required fields (Type of Test, Class, Subject).");
      return;
    }
    setActiveTab("sections");
  }, [typeOfTest, selectedClass, subject]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
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
                <Select value={typeOfTest} onValueChange={setTypeOfTest}>
                  <SelectTrigger id="typeOfTest" className="bg-background">
                    <SelectValue placeholder="Select type of test" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="class" className="text-sm font-medium text-foreground">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class" className="bg-background">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject" className="bg-background">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Subject Code, Total Marks, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="subjectCode" className="text-sm font-medium text-foreground">
                  Subject Code
                </Label>
                <Input
                  id="subjectCode"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="e.g. MATH101"
                  className="bg-background"
                  maxLength={20}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="totalMarks" className="text-sm font-medium text-foreground">
                  Total Marks
                </Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="Enter total marks"
                  className="bg-background"
                  min={0}
                  max={999}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={durationHr}
                    onChange={(e) => setDurationHr(e.target.value)}
                    placeholder="0"
                    className="bg-background"
                    min={0}
                    max={10}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">hr</span>
                  <Input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    placeholder="0"
                    className="bg-background"
                    min={0}
                    max={59}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">min</span>
                </div>
              </div>
            </div>

            {/* Row 3: Instructions */}
            <div className="space-y-1.5">
              <Label htmlFor="instructions" className="text-sm font-medium text-foreground">
                Instructions <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter any instructions for students..."
                className="bg-background min-h-[100px] resize-y"
                maxLength={2000}
              />
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <Button onClick={handleNext} className="px-8">
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="p-6 mt-0">
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Layers className="w-10 h-10 text-muted-foreground/50" />
              <h3 className="text-base font-medium text-foreground">
                Define Assessment Sections
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Add sections to organize your assessment into parts (e.g. Section A — MCQs, Section B — Short Answers).
              </p>
              <Button variant="outline" className="mt-4 gap-2">
                <Layers className="w-4 h-4" />
                Add Section
              </Button>
            </div>

            {/* Back / Submit */}
            <div className="flex justify-between mt-4">
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
