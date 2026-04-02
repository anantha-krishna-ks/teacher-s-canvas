import { useMemo, useCallback } from "react";
import { BookOpen, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LESSON_PLANS_BY_SUBJECT, type TaggableLessonPlan } from "@/constants/lessonPlanTaggingData";

interface LessonPlanTaggingProps {
  subject: string;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const LessonPlanTagging = ({ subject, selectedIds, onSelectionChange }: LessonPlanTaggingProps) => {
  const availablePlans = useMemo(
    () => (subject ? LESSON_PLANS_BY_SUBJECT[subject] || [] : []),
    [subject]
  );

  const togglePlan = useCallback(
    (id: string) => {
      onSelectionChange(
        selectedIds.includes(id)
          ? selectedIds.filter((i) => i !== id)
          : [...selectedIds, id]
      );
    },
    [selectedIds, onSelectionChange]
  );

  const removePlan = useCallback(
    (id: string) => {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    },
    [selectedIds, onSelectionChange]
  );

  return (
    <fieldset className="bg-card border border-border rounded-xl px-5 pb-4 pt-3 space-y-3">
      <legend className="sr-only">Lesson Plans</legend>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
        Lesson Plans
      </div>

      {!subject ? (
        <p className="text-sm text-muted-foreground italic">
          Select a subject to see available lesson plans
        </p>
      ) : availablePlans.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          No lesson plans found for this subject
        </p>
      ) : (
        <div className="space-y-4">
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-primary">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Available Lesson Plans:
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Available lesson plans">
              {availablePlans.map((plan) => {
                const isSelected = selectedIds.includes(plan.id);
                return (
                  <motion.button
                    key={plan.id}
                    layout
                    onClick={() => togglePlan(plan.id)}
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
                    {plan.title}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Show selected plans summary */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {selectedIds.map((id) => {
                  const plan = availablePlans.find((p) => p.id === id);
                  if (!plan) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {plan.title}
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{plan.chapter}</span>
                      <button
                        onClick={() => removePlan(id)}
                        className="ml-1 hover:text-destructive"
                        aria-label={`Remove ${plan.title}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </fieldset>
  );
};

export default LessonPlanTagging;
