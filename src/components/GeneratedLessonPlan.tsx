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
  FileText,
  Presentation,
  FileSpreadsheet,
  Video,
  ExternalLink,
} from "lucide-react";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateMockPlan, type LessonPlanFormData } from "@/utils/generateMockPlan";

interface GeneratedLessonPlanProps {
  data: LessonPlanFormData;
  onBack: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const RESOURCE_ICON_MAP = {
  pdf: { icon: FileText, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  ppt: { icon: Presentation, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
  worksheet: { icon: FileSpreadsheet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  video: { icon: Video, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
} as const;

const PROCEDURE_STEPS = [
  { step: "Engage", key: "engage" as const, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  { step: "Explore", key: "explore" as const, color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  { step: "Explain", key: "explain" as const, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { step: "Elaborate", key: "elaborate" as const, color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  { step: "Evaluate", key: "evaluate" as const, color: "bg-rose-500/10 text-rose-700 dark:text-rose-400" },
];

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
      <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
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

  const handlePrint = useCallback(() => {
    window.print();
    toast.success("Print dialog opened");
  }, []);

  const handleExport = useCallback(() => {
    toast.success("Lesson plan exported successfully");
  }, []);

  const handleEdit = useCallback(() => {
    toast.info("Edit mode is not available in preview");
  }, []);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Back to Setup
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint} aria-label="Print lesson plan">
            <Printer className="w-4 h-4" aria-hidden="true" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport} aria-label="Export lesson plan">
            <Download className="w-4 h-4" aria-hidden="true" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleEdit} aria-label="Edit lesson plan">
            <Edit className="w-4 h-4" aria-hidden="true" />
            Edit
          </Button>
        </div>
      </div>

      {/* Header card */}
      <motion.article
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
      >
        <h2 className="text-lg font-bold text-foreground mb-3">{plan.title}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary/70" aria-hidden="true" />
            <span>Grade {data.grade}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary/70" aria-hidden="true" />
            <span>{data.subject}</span>
          </div>
          {data.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary/70" aria-hidden="true" />
              <span>{data.duration}</span>
            </div>
          )}
          {data.periods && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="w-4 h-4 text-primary/70" aria-hidden="true" />
              <span>{data.periods} Period{Number(data.periods) !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.concepts.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs font-normal">{c}</Badge>
          ))}
        </div>
      </motion.article>

      {/* Section 2: Learning Objectives */}
      <motion.section
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
        aria-label="Learning Objectives"
      >
        <SectionHeader icon={Target} number={2} title="Learning Objectives" subtitle="Students will be able to…" />
        <ol className="space-y-2.5 ml-11 list-none">
          {plan.learningObjectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {obj}
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Section 3: Required Resources */}
      <motion.section
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
        aria-label="Required Resources"
      >
        <SectionHeader icon={Package} number={3} title="Required Resources" subtitle="PDFs, PPTs, Worksheets, Videos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-11">
          {plan.resources.map((res, i) => {
            const style = RESOURCE_ICON_MAP[res.type];
            const Icon = style.icon;
            return (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors group cursor-pointer"
                aria-label={`Open ${res.name} (${res.type.toUpperCase()})`}
              >
                <span className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${style.color}`} aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{res.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{res.type}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </motion.section>

      {/* Section 4: Procedure (5-E Model) */}
      <motion.section
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
        aria-label="Procedure"
      >
        <SectionHeader icon={ListOrdered} number={4} title="Procedure" subtitle="5-E Instructional Model" />
        <div className="ml-11 space-y-4">
          {PROCEDURE_STEPS.map(({ step, key, color }, i) => (
            <div key={step} className="flex items-start gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 mt-0.5 ${color}`}>
                {i + 1}. {step}
              </span>
              <p className="text-sm text-foreground/85 leading-relaxed">{plan.procedure[key]}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Section 5: Assessment */}
      <motion.section
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
        aria-label="Assessment"
      >
        <SectionHeader icon={ClipboardCheck} number={5} title="Assessment" subtitle="Formative Quiz" />
        <div className="ml-11 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
              Formative Quiz (MCQ)
            </h4>
            <div className="space-y-4">
              {plan.assessment.formativeQuiz.map((q, qi) => (
                <div key={qi} className="bg-muted/40 border border-border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Q{qi + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list" aria-label={`Options for question ${qi + 1}`}>
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        role="listitem"
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm border transition-colors ${
                          oi === q.correctAnswer
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-background border-border text-foreground/75"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-xs font-medium flex items-center justify-center shrink-0 ${
                          oi === q.correctAnswer
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span>{opt}</span>
                        {oi === q.correctAnswer && (
                          <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 6: Follow-up / Homework */}
      <motion.section
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-xl p-6"
        aria-label="Homework"
      >
        <SectionHeader icon={Home} number={6} title="Follow-up / Homework" />
        <ol className="space-y-2.5 ml-11 list-none">
          {plan.homework.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85">
              <span className="w-5 h-5 rounded bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </motion.section>

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
