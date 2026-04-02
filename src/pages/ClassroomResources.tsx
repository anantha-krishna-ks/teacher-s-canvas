import { useState, useMemo } from "react";
import { Info, BookOpen, Eye, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADES, SUBJECTS_BY_GRADE, CHAPTERS_BY_SUBJECT } from "@/constants/lessonPlanData";
import ModuleCardPreview, { type PreviewType } from "@/components/ModuleCardPreview";

type ResourceStatus = "Ready" | "In-Progress" | "Not Created";

interface ResourcePod {
  label: string;
  previewType: PreviewType;
  status: ResourceStatus;
}

const getStatusStyle = (status: ResourceStatus) => {
  switch (status) {
    case "Ready":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In-Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Not Created":
      return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusDot = (status: ResourceStatus) => {
  switch (status) {
    case "Ready":
      return "bg-emerald-500";
    case "In-Progress":
      return "bg-amber-500";
    case "Not Created":
      return "bg-muted-foreground/40";
  }
};

// Mock status generator based on selection
const generateStatuses = (grade: string, subject: string, chapter: string): ResourcePod[] => {
  const hash = (grade + subject + chapter).length;
  const statuses: ResourceStatus[] = ["Ready", "In-Progress", "Not Created"];
  return [
    { label: "Lesson Plan", previewType: "lesson", status: "Ready" as ResourceStatus },
    { label: "Presentation", previewType: "presentation", status: "Ready" as ResourceStatus },
    { label: "Worksheet", previewType: "worksheet", status: "Not Created" as ResourceStatus },
    { label: "Quizzes", previewType: "quiz", status: statuses[(hash + 3) % 3] },
    { label: "Assessment", previewType: "assessment", status: "Not Created" as ResourceStatus },
  ];
};

const ClassroomResources = () => {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const navigate = useNavigate();

  const subjects = useMemo(() => (grade ? SUBJECTS_BY_GRADE[grade] || [] : []), [grade]);
  const chapters = useMemo(() => (subject ? CHAPTERS_BY_SUBJECT[subject] || [] : []), [subject]);
  const allSelected = grade && subject && chapter;

  const pods = useMemo(
    () => (allSelected ? generateStatuses(grade, subject, chapter) : []),
    [grade, subject, chapter, allSelected]
  );

  const handleGradeChange = (v: string) => {
    setGrade(v);
    setSubject("");
    setChapter("");
  };

  const handleSubjectChange = (v: string) => {
    setSubject(v);
    setChapter("");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Classroom Resources</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Access and manage resources for your classroom sessions
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Info className="h-4 w-4 text-primary" />
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/80">
          This section allows you to display the respective resources in the class during the lesson
          in progress. Select a class, subject, and chapter to view available resources.
        </p>
      </div>

      {/* Filter dropdowns */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Class</label>
            <Select value={grade} onValueChange={handleGradeChange}>
              <SelectTrigger className="h-9 text-sm bg-white">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map((g) => (
                  <SelectItem key={g} value={g}>Class {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Subject</label>
            <Select value={subject} onValueChange={handleSubjectChange} disabled={!grade}>
              <SelectTrigger className="h-9 text-sm bg-white">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Chapter</label>
            <Select value={chapter} onValueChange={setChapter} disabled={!subject}>
              <SelectTrigger className="h-9 text-sm bg-white">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resource pods — dashboard card style */}
      <AnimatePresence mode="wait">
        {allSelected && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Resources for Class {grade} — {subject} — {chapter}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {pods.map((pod, i) => (
                <motion.article
                  key={pod.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className="bg-card rounded-lg border border-border overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] transition-shadow duration-200 group flex flex-col"
                >
                  {/* Mini preview — same as dashboard */}
                  <ModuleCardPreview type={pod.previewType} />

                  {/* Card body */}
                  <div className="p-3.5 flex flex-col flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{pod.label}</h4>
                    <p className="text-[11px] text-muted-foreground mb-3 truncate">
                      {subject} · {chapter}
                    </p>

                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium w-fit mb-3 ${getStatusStyle(pod.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(pod.status)}`} />
                      {pod.status}
                    </div>

                    {/* View button pinned to bottom */}
                    <div className="mt-auto">
                      <Button
                        variant={pod.status === "Not Created" ? "outline" : "default"}
                        size="sm"
                        className="h-8 text-xs w-full gap-1.5"
                        disabled={pod.status === "Not Created"}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {pod.status === "Not Created" ? "Not Available" : "View"}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!allSelected && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No resources to display</p>
          <p className="text-xs text-muted-foreground mt-1">
            Select a class, subject, and chapter to view available resources
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassroomResources;
