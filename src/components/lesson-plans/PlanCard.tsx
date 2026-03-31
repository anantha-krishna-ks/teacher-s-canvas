import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { LessonPlanCard } from "@/constants/lessonPlansPageData";
import { SUBJECT_IMAGES } from "@/constants/lessonPlansPageData";

interface PlanCardProps {
  plan: LessonPlanCard;
}

const PlanCard = ({ plan }: PlanCardProps) => {
  const img = SUBJECT_IMAGES[plan.subject];

  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[200px] w-[210px] bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all shrink-0"
      role="button"
      tabIndex={0}
      aria-label={`${plan.subject} — Grade ${plan.grade}, ${plan.questionsCount} questions`}
    >
      {/* Image area */}
      <div className="h-28 bg-accent/40 overflow-hidden">
        {img ? (
          <img src={img} alt={plan.subject} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3.5 flex flex-col justify-between ${(plan.chapter && !plan.name) ? 'h-[120px]' : 'h-[100px]'}`}>
        <div className="space-y-1.5">
          {plan.name ? (
            <>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h4 className="text-sm font-semibold text-foreground truncate">{plan.name}</h4>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[240px] rounded-lg bg-foreground text-background px-3 py-2 text-xs font-medium shadow-lg border-0">
                    {plan.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground truncate">{plan.subject}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0">{plan.code}</Badge>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground truncate">{plan.subject}</h4>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0">{plan.code}</Badge>
              </div>
              {plan.chapter && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-xs text-muted-foreground truncate leading-relaxed cursor-default">
                        {plan.chapter}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[240px] rounded-lg bg-foreground text-background px-3 py-2 text-xs font-medium shadow-lg border-0">
                      {plan.chapter}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <span>Grade {plan.grade}</span>
          <span>{plan.questionsCount} {plan.countLabel || "Questions"}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default PlanCard;
