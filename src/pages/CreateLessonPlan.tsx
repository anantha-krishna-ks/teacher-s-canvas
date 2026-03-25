import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, X, Sparkles, Clock, BookOpen, Layers, FileText, GraduationCap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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


// --- Mock Data ---
const grades = ["6", "7", "8", "9", "10", "11", "12"];

const subjectsByGrade: Record<string, string[]> = {
  "6": ["Hindi", "English", "Mathematics", "Science", "Social Science"],
  "7": ["Hindi", "English", "Mathematics", "Science", "Social Science"],
  "8": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "9": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "10": ["Hindi", "English", "Mathematics", "Science", "Social Science", "Geography"],
  "11": ["Hindi", "English", "Mathematics", "Physics", "Chemistry", "Biology"],
  "12": ["Hindi", "English", "Mathematics", "Physics", "Chemistry", "Biology"],
};

const chaptersBySubject: Record<string, string[]> = {
  Hindi: ["गद्य खंड", "काव्य खंड", "व्याकरण", "लेखन"],
  English: ["Prose", "Poetry", "Grammar", "Writing Skills"],
  Mathematics: ["Number Systems", "Algebra", "Geometry", "Trigonometry", "Statistics"],
  Science: ["Matter in Our Surroundings", "Force and Laws of Motion", "Atoms and Molecules", "Cell Biology"],
  "Social Science": ["India and the Contemporary World", "Democratic Politics", "Economics", "Geography of India"],
  Geography: ["Resources and Development", "Climate", "Natural Vegetation", "Population"],
  Physics: ["Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy"],
  Chemistry: ["Chemical Reactions", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon Compounds"],
  Biology: ["Life Processes", "Control and Coordination", "Heredity", "Our Environment"],
};

const conceptsByChapter: Record<string, string[]> = {
  "Force and Laws of Motion": [
    "Newton's First Law of Motion",
    "Inertia and Mass",
    "Newton's Second Law of Motion",
    "Force and Acceleration",
    "Newton's Third Law of Motion",
    "Conservation of Momentum",
    "Friction and its Types",
  ],
  "Number Systems": [
    "Rational Numbers",
    "Irrational Numbers",
    "Real Number Line",
    "Laws of Exponents",
    "Decimal Expansions",
  ],
  Algebra: [
    "Polynomials",
    "Linear Equations",
    "Quadratic Equations",
    "Factorization",
    "Remainder Theorem",
  ],
  Geometry: [
    "Lines and Angles",
    "Triangles",
    "Quadrilaterals",
    "Circles",
    "Coordinate Geometry",
  ],
  Trigonometry: [
    "Trigonometric Ratios",
    "Trigonometric Identities",
    "Heights and Distances",
  ],
  Statistics: [
    "Mean", "Median", "Mode", "Frequency Distribution", "Graphical Representation",
  ],
  "Matter in Our Surroundings": [
    "States of Matter", "Change of State", "Evaporation", "Diffusion", "Particle Nature of Matter",
  ],
  "Atoms and Molecules": [
    "Laws of Chemical Combination", "Dalton's Atomic Theory", "Atomic Mass", "Molecular Mass", "Mole Concept",
  ],
  "Cell Biology": [
    "Cell Structure", "Cell Organelles", "Cell Division", "Prokaryotic vs Eukaryotic",
  ],
  Prose: ["Comprehension", "Character Analysis", "Theme Exploration", "Narrative Techniques"],
  Poetry: ["Rhyme and Meter", "Figurative Language", "Tone and Mood", "Poetic Devices"],
  Grammar: ["Tenses", "Voice", "Narration", "Clauses", "Modals"],
  "Writing Skills": ["Essay Writing", "Letter Writing", "Report Writing", "Creative Writing"],
  "गद्य खंड": ["गद्यांश बोध", "लेखक परिचय", "भाव विस्तार"],
  "काव्य खंड": ["कविता का भाव", "अलंकार", "रस"],
  "व्याकरण": ["संज्ञा", "सर्वनाम", "क्रिया", "विशेषण", "समास"],
  "लेखन": ["निबंध", "पत्र लेखन", "अनुच्छेद"],
  "India and the Contemporary World": ["French Revolution", "Russian Revolution", "Nazism"],
  "Democratic Politics": ["Democracy", "Constitutional Design", "Electoral Politics"],
  Economics: ["People as Resource", "Poverty as a Challenge", "Food Security"],
  "Geography of India": ["Physical Features", "Drainage", "Climate", "Natural Vegetation"],
  "Resources and Development": ["Types of Resources", "Land Resources", "Soil Types"],
  Climate: ["Factors Affecting Climate", "Indian Monsoon", "Seasons"],
  "Natural Vegetation": ["Types of Forests", "Wildlife", "Conservation"],
  Population: ["Population Distribution", "Population Growth", "Migration"],
  Motion: ["Distance and Displacement", "Speed and Velocity", "Acceleration", "Equations of Motion"],
  Gravitation: ["Universal Law of Gravitation", "Free Fall", "Mass and Weight"],
  "Work and Energy": ["Work", "Energy", "Power", "Conservation of Energy"],
  "Chemical Reactions": ["Types of Reactions", "Balancing Equations", "Oxidation and Reduction"],
  "Acids, Bases and Salts": ["Indicators", "pH Scale", "Neutralization", "Salts"],
  "Metals and Non-metals": ["Physical Properties", "Chemical Properties", "Reactivity Series"],
  "Carbon Compounds": ["Covalent Bonding", "Homologous Series", "Functional Groups"],
  "Life Processes": ["Nutrition", "Respiration", "Transportation", "Excretion"],
  "Control and Coordination": ["Nervous System", "Hormones", "Reflex Action"],
  Heredity: ["Mendel's Laws", "Genes", "Evolution"],
  "Our Environment": ["Ecosystem", "Food Chain", "Ozone Layer"],
};

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

  const subjects = useMemo(() => (grade ? subjectsByGrade[grade] || [] : []), [grade]);
  const chapters = useMemo(() => (subject ? chaptersBySubject[subject] || [] : []), [subject]);
  const concepts = useMemo(() => (chapter ? conceptsByChapter[chapter] || [] : []), [chapter]);

  const handleGradeChange = (val: string) => {
    setGrade(val);
    setSubject("");
    setChapter("");
    setSelectedConcepts([]);
  };

  const handleSubjectChange = (val: string) => {
    setSubject(val);
    setChapter("");
    setSelectedConcepts([]);
  };

  const handleChapterChange = (val: string) => {
    setChapter(val);
    setSelectedConcepts([]);
  };

  const toggleConcept = (concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  };

  const addCustomConcept = () => {
    const trimmed = newConcept.trim();
    if (trimmed && !selectedConcepts.includes(trimmed)) {
      setSelectedConcepts((prev) => [...prev, trimmed]);
      setNewConcept("");
    }
  };

  const removeConcept = (concept: string) => {
    setSelectedConcepts((prev) => prev.filter((c) => c !== concept));
  };

  const isFormValid = grade && subject && chapter && selectedConcepts.length > 0;

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
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/dashboard/lesson-plans")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Lesson Plan</h1>
          <p className="text-sm text-muted-foreground">Configure and generate a structured lesson plan</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 w-full">
        {[
          { label: "Lesson Setup", icon: FileText },
          { label: "Generated Plan", icon: Sparkles },
        ].map((step, index) => (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => index === 0 && setCurrentStep(0)}
              className={`flex items-center gap-2 cursor-default ${
                index === 0 ? "cursor-pointer" : ""
              }`}
              disabled={index > 0}
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
                {currentStep > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
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
            {index < 1 && (
              <div className={`flex-1 h-px mx-4 ${currentStep > 0 ? "bg-primary/40" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <div className="space-y-6">
          {/* Row 1: Grade & Duration */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GraduationCap className="w-4 h-4 text-primary" />
              Class & Duration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade */}
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={grade} onValueChange={handleGradeChange}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g} value={g}>
                        Grade {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Hr"
                    min={0}
                    max={10}
                    value={durationHr}
                    onChange={(e) => setDurationHr(e.target.value)}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">hr</span>
                  <Input
                    type="number"
                    placeholder="Min"
                    min={0}
                    max={59}
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={handleSubjectChange} disabled={!grade}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={grade ? "Select subject" : "Select grade first"} />
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

              {/* No. of Periods */}
              <div className="space-y-2">
                <Label htmlFor="periods">No. of Periods</Label>
                <Input
                  id="periods"
                  type="number"
                  placeholder="e.g. 5"
                  min={1}
                  max={20}
                  value={periods}
                  onChange={(e) => setPeriods(e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Chapter & Concepts */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Layers className="w-4 h-4 text-primary" />
              Chapter & Concepts
            </div>

            {/* Chapter */}
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select value={chapter} onValueChange={handleChapterChange} disabled={!subject}>
                <SelectTrigger id="chapter">
                  <SelectValue placeholder={subject ? "Select chapter" : "Select subject first"} />
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

            {/* Concepts */}
            <div className="space-y-3">
              <Label>Concepts</Label>

              {!chapter ? (
                <p className="text-sm text-muted-foreground italic">Select a chapter to see available concepts</p>
              ) : (
                <div className="space-y-4">
                  {/* Concept pills */}
                  <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm font-medium text-primary">
                      <Sparkles className="w-4 h-4" />
                      Available Concepts:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {concepts.map((concept) => {
                        const isSelected = selectedConcepts.includes(concept);
                        return (
                          <motion.button
                            key={concept}
                            layout
                            onClick={() => toggleConcept(concept)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "bg-background text-foreground/80 border border-border hover:border-primary/30 hover:text-primary"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-primary/70 border-primary/70" : "border-muted-foreground/40"
                            }`}>
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
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium bg-primary/15 text-primary border border-primary/30 transition-colors"
                            >
                              <span className="w-4 h-4 rounded border bg-primary border-primary flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </span>
                              {concept}
                              <X className="w-3.5 h-3.5 ml-0.5 hover:text-destructive" />
                            </motion.button>
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Add custom concept */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a custom concept..."
                      value={newConcept}
                      onChange={(e) => setNewConcept(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomConcept()}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={addCustomConcept} disabled={!newConcept.trim()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Additional Instructions */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BookOpen className="w-4 h-4 text-primary" />
              Additional Instructions
              <span className="text-muted-foreground font-normal">(optional)</span>
            </div>
            <Textarea
              placeholder="Add any specific instructions for the lesson plan generation..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/lesson-plans")}>
              Cancel
            </Button>
            <Button disabled={!isFormValid} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Lesson Plan
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Your generated lesson plan will appear here.</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(0)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Setup
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateLessonPlan;
