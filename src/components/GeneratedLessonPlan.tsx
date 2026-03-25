import {
  BookOpen,
  Target,
  Package,
  ListOrdered,
  ClipboardCheck,
  Home,
  ChevronLeft,
  Printer,
  Download,
  Edit,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LessonPlanData {
  grade: string;
  subject: string;
  chapter: string;
  concepts: string[];
  duration: string;
  periods: string;
}

interface GeneratedLessonPlanProps {
  data: LessonPlanData;
  onBack: () => void;
}

// Mock generated content based on input
function generateMockPlan(data: LessonPlanData) {
  return {
    title: `${data.chapter}`,
    learningObjectives: [
      `Students will be able to define and explain the key concepts of ${data.concepts[0] || data.chapter}.`,
      `Students will be able to identify real-world applications of ${data.concepts.slice(0, 2).join(" and ")}.`,
      `Students will be able to solve problems related to ${data.concepts[data.concepts.length - 1] || data.chapter}.`,
      `Students will be able to analyze and compare different aspects of ${data.chapter}.`,
    ],
    resources: [
      "NCERT Textbook",
      "Whiteboard & Markers",
      "PowerPoint Presentation",
      "Worksheets (printed)",
      "Lab Equipment (if applicable)",
      "Reference Charts / Maps",
    ],
    procedure: {
      engage: `Begin the lesson by asking students a thought-provoking question related to ${data.concepts[0] || data.chapter}. Use a short video clip or real-life scenario to capture attention and activate prior knowledge.`,
      explore: `Divide students into groups. Provide hands-on activity sheets where they explore ${data.concepts.slice(0, 2).join(" and ")} through experiments, observations, or problem-solving exercises.`,
      explain: `Use direct instruction with visual aids to formally introduce ${data.chapter}. Explain core definitions, formulas, and relationships. Encourage students to ask questions and discuss with peers.`,
      elaborate: `Present a new scenario or application problem. Have students apply their understanding of ${data.concepts.join(", ")} to solve it independently or in pairs. Facilitate cross-group discussion.`,
      evaluate: `Conduct a short quiz or self-assessment. Students answer 5–8 questions covering all concepts. Review answers together and clarify misconceptions.`,
    },
    assessment: {
      formative: [
        "Observation during group activities",
        "Q&A participation during explanation",
        "Worksheet completion and accuracy",
      ],
      summative: [
        "End-of-chapter written test",
        "Project-based assessment",
        "Oral presentation on key concepts",
      ],
    },
    homework: [
      `Complete exercises from NCERT Chapter: ${data.chapter} (Questions 1–10)`,
      `Write a short paragraph on the real-world application of ${data.concepts[0] || data.chapter}`,
      `Prepare a concept map linking all topics covered in this lesson`,
    ],
  };
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const SectionHeader = ({
  icon: Icon,
  number,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  number: number;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-start gap-3 mb-4">
    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-primary" />
    </span>
    <div>
      <h3 className="text-base font-semibold text-foreground">
        {number}. {title}
      </h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export default function GeneratedLessonPlan({ data, onBack }: GeneratedLessonPlanProps) {
  const plan = generateMockPlan(data);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" />
          Back to Setup
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Header card */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="text-lg font-bold text-foreground mb-3">{plan.title}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary/70" />
            <span>Grade {data.grade}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary/70" />
            <span>{data.subject}</span>
          </div>
          {data.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>{data.duration}</span>
            </div>
          )}
          {data.periods && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="w-4 h-4 text-primary/70" />
              <span>{data.periods} Period{Number(data.periods) !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.concepts.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs font-normal">
              {c}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Section 2: Learning Objectives */}
      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <SectionHeader icon={Target} number={2} title="Learning Objectives" subtitle="Students will be able to…" />
        <ul className="space-y-2.5 ml-11">
          {plan.learningObjectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {obj}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Section 3: Required Resources */}
      <motion.div
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <SectionHeader icon={Package} number={3} title="Required Resources" subtitle="Maps, PPTs, Worksheets, Equipment" />
        <div className="flex flex-wrap gap-2 ml-11">
          {plan.resources.map((res) => (
            <Badge key={res} variant="outline" className="text-sm font-normal py-1.5 px-3">
              {res}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Procedure (5-E Model) */}
      <motion.div
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <SectionHeader icon={ListOrdered} number={4} title="Procedure" subtitle="5-E Instructional Model" />
        <div className="ml-11 space-y-4">
          {[
            { step: "Engage", desc: plan.procedure.engage, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
            { step: "Explore", desc: plan.procedure.explore, color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
            { step: "Explain", desc: plan.procedure.explain, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
            { step: "Elaborate", desc: plan.procedure.elaborate, color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
            { step: "Evaluate", desc: plan.procedure.evaluate, color: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
          ].map(({ step, desc, color }, i) => (
            <div key={step} className="flex items-start gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 mt-0.5 ${color}`}>
                {i + 1}. {step}
              </span>
              <p className="text-sm text-foreground/85 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 5: Assessment */}
      <motion.div
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <SectionHeader icon={ClipboardCheck} number={5} title="Assessment" subtitle="Formative & Summative" />
        <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Formative</h4>
            <ul className="space-y-1.5">
              {plan.assessment.formative.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Summative</h4>
            <ul className="space-y-1.5">
              {plan.assessment.summative.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Section 6: Follow-up / Homework */}
      <motion.div
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <SectionHeader icon={Home} number={6} title="Follow-up / Homework" />
        <ul className="space-y-2.5 ml-11">
          {plan.homework.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
              <span className="w-5 h-5 rounded bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Footer note */}
      <motion.p
        custom={6}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="text-xs text-muted-foreground text-center py-2"
      >
        Teachers can customize this plan based on classroom needs and available resources.
      </motion.p>
    </div>
  );
}
