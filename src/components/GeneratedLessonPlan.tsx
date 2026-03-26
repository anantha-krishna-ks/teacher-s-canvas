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
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateMockPlan, type LessonPlanFormData, type GeneratedPlan } from "@/utils/generateMockPlan";

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
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: {
  icon: React.ElementType;
  number: number;
  title: string;
  subtitle?: string;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) => (
  <div className="flex items-start gap-3 mb-4">
    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
    </span>
    <div className="flex-1">
      <h3 className="text-base font-semibold text-foreground">
        {number}. {title}
      </h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    {isEditing ? (
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 px-2.5 gap-1 text-muted-foreground hover:text-foreground" aria-label="Cancel editing">
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Cancel
        </Button>
        <Button size="sm" onClick={onSave} className="h-8 px-2.5 gap-1" aria-label="Save changes">
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Save
        </Button>
      </div>
    ) : onEdit ? (
      <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2.5 gap-1 text-muted-foreground hover:text-foreground" aria-label={`Edit ${title}`}>
        <Edit className="w-3.5 h-3.5" aria-hidden="true" />
        Edit
      </Button>
    ) : null}
  </div>
);

type EditingSection = "objectives" | "resources" | "procedure" | "assessment" | "homework" | null;

export default function GeneratedLessonPlan({ data, onBack }: GeneratedLessonPlanProps) {
  const [plan, setPlan] = useState<GeneratedPlan>(() => generateMockPlan(data));
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  // Draft states for each section
  const [draftObjectives, setDraftObjectives] = useState<string[]>([]);
  const [draftResources, setDraftResources] = useState<GeneratedPlan["resources"]>([]);
  const [draftProcedure, setDraftProcedure] = useState<GeneratedPlan["procedure"]>({ engage: "", explore: "", explain: "", elaborate: "", evaluate: "" });
  const [draftHomework, setDraftHomework] = useState<string[]>([]);
  const [draftQuiz, setDraftQuiz] = useState<GeneratedPlan["assessment"]["formativeQuiz"]>([]);

  const handleStartEdit = useCallback((section: EditingSection) => {
    if (section === "objectives") setDraftObjectives([...plan.learningObjectives]);
    if (section === "resources") setDraftResources(plan.resources.map(r => ({ ...r })));
    if (section === "procedure") setDraftProcedure({ ...plan.procedure });
    if (section === "homework") setDraftHomework([...plan.homework]);
    if (section === "assessment") setDraftQuiz(plan.assessment.formativeQuiz.map(q => ({ ...q, options: [...q.options] })));
    setEditingSection(section);
  }, [plan]);

  const handleCancelEdit = useCallback(() => {
    setEditingSection(null);
  }, []);

  const handleSaveObjectives = useCallback(() => {
    const filtered = draftObjectives.filter(o => o.trim());
    if (filtered.length === 0) { toast.error("At least one objective is required"); return; }
    setPlan(prev => ({ ...prev, learningObjectives: filtered }));
    setEditingSection(null);
    toast.success("Learning objectives updated");
  }, [draftObjectives]);

  const handleSaveResources = useCallback(() => {
    const valid = draftResources.filter(r => r.name.trim() && r.url.trim());
    if (valid.length === 0) { toast.error("At least one resource is required"); return; }
    setPlan(prev => ({ ...prev, resources: valid }));
    setEditingSection(null);
    toast.success("Resources updated");
  }, [draftResources]);

  const handleSaveProcedure = useCallback(() => {
    setPlan(prev => ({ ...prev, procedure: { ...draftProcedure } }));
    setEditingSection(null);
    toast.success("Procedure updated");
  }, [draftProcedure]);

  const handleSaveAssessment = useCallback(() => {
    const valid = draftQuiz.filter(q => q.question.trim() && q.options.every(o => o.trim()));
    if (valid.length === 0) { toast.error("At least one complete question is required"); return; }
    setPlan(prev => ({ ...prev, assessment: { ...prev.assessment, formativeQuiz: valid } }));
    setEditingSection(null);
    toast.success("Assessment updated");
  }, [draftQuiz]);

  const handleSaveHomework = useCallback(() => {
    const filtered = draftHomework.filter(h => h.trim());
    if (filtered.length === 0) { toast.error("At least one homework item is required"); return; }
    setPlan(prev => ({ ...prev, homework: filtered }));
    setEditingSection(null);
    toast.success("Homework updated");
  }, [draftHomework]);

  const handlePrint = useCallback(() => {
    window.print();
    toast.success("Print dialog opened");
  }, []);

  const handleExport = useCallback(() => {
    toast.success("Lesson plan exported successfully");
  }, []);

  const handleEditAll = useCallback(() => {
    toast.info("Use the Edit button on each section to make changes");
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
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleEditAll} aria-label="Edit lesson plan">
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
        <SectionHeader
          icon={Target}
          number={2}
          title="Learning Objectives"
          subtitle="Students will be able to…"
          isEditing={editingSection === "objectives"}
          onEdit={() => handleStartEdit("objectives")}
          onSave={handleSaveObjectives}
          onCancel={handleCancelEdit}
        />
        {editingSection === "objectives" ? (
          <div className="space-y-2.5 ml-11">
            {draftObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-2.5">
                  {i + 1}
                </span>
                <Textarea
                  value={obj}
                  onChange={(e) => {
                    const updated = [...draftObjectives];
                    updated[i] = e.target.value;
                    setDraftObjectives(updated);
                  }}
                  className="min-h-[60px] text-sm"
                  rows={2}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-1"
                  onClick={() => setDraftObjectives(draftObjectives.filter((_, idx) => idx !== i))}
                  aria-label={`Remove objective ${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 ml-7"
              onClick={() => setDraftObjectives([...draftObjectives, ""])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Objective
            </Button>
          </div>
        ) : (
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
        )}
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
        <SectionHeader
          icon={Package}
          number={3}
          title="Required Resources"
          subtitle="PDFs, PPTs, Worksheets, Videos"
          isEditing={editingSection === "resources"}
          onEdit={() => handleStartEdit("resources")}
          onSave={handleSaveResources}
          onCancel={handleCancelEdit}
        />
        {editingSection === "resources" ? (
          <div className="space-y-3 ml-11">
            {draftResources.map((res, i) => {
              const style = RESOURCE_ICON_MAP[res.type];
              const ResIcon = style.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/40">
                  <span className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center shrink-0 mt-1`}>
                    <ResIcon className={`w-4.5 h-4.5 ${style.color}`} aria-hidden="true" />
                  </span>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={res.name}
                      onChange={(e) => {
                        const updated = [...draftResources];
                        updated[i] = { ...updated[i], name: e.target.value };
                        setDraftResources(updated);
                      }}
                      className="text-sm h-9"
                      placeholder="Resource name"
                    />
                    <div className="flex gap-2">
                      <select
                        value={res.type}
                        onChange={(e) => {
                          const updated = [...draftResources];
                          updated[i] = { ...updated[i], type: e.target.value as "pdf" | "ppt" | "worksheet" | "video" };
                          setDraftResources(updated);
                        }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        aria-label="Resource type"
                      >
                        <option value="pdf">PDF</option>
                        <option value="ppt">PPT</option>
                        <option value="worksheet">Worksheet</option>
                        <option value="video">Video</option>
                      </select>
                      <Input
                        value={res.url}
                        onChange={(e) => {
                          const updated = [...draftResources];
                          updated[i] = { ...updated[i], url: e.target.value };
                          setDraftResources(updated);
                        }}
                        className="text-sm h-9 flex-1"
                        placeholder="URL"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-1"
                    onClick={() => setDraftResources(draftResources.filter((_, idx) => idx !== i))}
                    aria-label={`Remove ${res.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setDraftResources([...draftResources, { name: "", type: "pdf", url: "" }])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Resource
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-11">
            {plan.resources.map((res, i) => {
              const style = RESOURCE_ICON_MAP[res.type];
              const ResIcon = style.icon;
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
                    <ResIcon className={`w-4.5 h-4.5 ${style.color}`} aria-hidden="true" />
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
        )}
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
        <SectionHeader
          icon={ListOrdered}
          number={4}
          title="Procedure"
          subtitle="5-E Instructional Model"
          isEditing={editingSection === "procedure"}
          onEdit={() => handleStartEdit("procedure")}
          onSave={handleSaveProcedure}
          onCancel={handleCancelEdit}
        />
        <div className="ml-11 space-y-4">
          {PROCEDURE_STEPS.map(({ step, key, color }, i) => (
            <div key={step} className="flex items-start gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 mt-0.5 ${color}`}>
                {i + 1}. {step}
              </span>
              {editingSection === "procedure" ? (
                <Textarea
                  value={draftProcedure[key]}
                  onChange={(e) => setDraftProcedure(prev => ({ ...prev, [key]: e.target.value }))}
                  className="min-h-[70px] text-sm flex-1"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-foreground/85 leading-relaxed">{plan.procedure[key]}</p>
              )}
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
        <SectionHeader
          icon={ClipboardCheck}
          number={5}
          title="Assessment"
          subtitle="Formative Quiz"
          isEditing={editingSection === "assessment"}
          onEdit={() => handleStartEdit("assessment")}
          onSave={handleSaveAssessment}
          onCancel={handleCancelEdit}
        />
        <div className="ml-11 space-y-6">
          {editingSection === "assessment" ? (
            <div className="space-y-5">
              {draftQuiz.map((q, qi) => (
                <div key={qi} className="bg-muted/40 border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-foreground mt-2">Q{qi + 1}.</span>
                    <Input
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...draftQuiz];
                        updated[qi] = { ...updated[qi], question: e.target.value };
                        setDraftQuiz(updated);
                      }}
                      className="text-sm"
                      placeholder="Enter question..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => setDraftQuiz(draftQuiz.filter((_, idx) => idx !== qi))}
                      aria-label={`Remove question ${qi + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...draftQuiz];
                            updated[qi] = { ...updated[qi], correctAnswer: oi };
                            setDraftQuiz(updated);
                          }}
                          className={`w-5 h-5 rounded-full border text-xs font-medium flex items-center justify-center shrink-0 transition-colors ${
                            oi === q.correctAnswer
                              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
                          }`}
                          aria-label={`Mark option ${String.fromCharCode(65 + oi)} as correct`}
                        >
                          {String.fromCharCode(65 + oi)}
                        </button>
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const updated = [...draftQuiz];
                            const newOptions = [...updated[qi].options];
                            newOptions[oi] = e.target.value;
                            updated[qi] = { ...updated[qi], options: newOptions };
                            setDraftQuiz(updated);
                          }}
                          className="text-sm h-9"
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setDraftQuiz([...draftQuiz, { question: "", options: ["", "", "", ""], correctAnswer: 0 }])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </Button>
            </div>
          ) : (
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
          )}
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
        <SectionHeader
          icon={Home}
          number={6}
          title="Follow-up / Homework"
          isEditing={editingSection === "homework"}
          onEdit={() => handleStartEdit("homework")}
          onSave={handleSaveHomework}
          onCancel={handleCancelEdit}
        />
        {editingSection === "homework" ? (
          <div className="space-y-2.5 ml-11">
            {draftHomework.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center shrink-0 mt-2.5">
                  {i + 1}
                </span>
                <Textarea
                  value={item}
                  onChange={(e) => {
                    const updated = [...draftHomework];
                    updated[i] = e.target.value;
                    setDraftHomework(updated);
                  }}
                  className="min-h-[60px] text-sm"
                  rows={2}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-1"
                  onClick={() => setDraftHomework(draftHomework.filter((_, idx) => idx !== i))}
                  aria-label={`Remove homework item ${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 ml-7"
              onClick={() => setDraftHomework([...draftHomework, ""])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </Button>
          </div>
        ) : (
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
        )}
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