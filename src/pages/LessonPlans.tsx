import { Plus, ChevronLeft, ChevronRight, Clock, BookOpen, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";

interface LessonPlanCard {
  id: string;
  code: string;
  subject: string;
  grade: string;
  questionsCount: number;
  status?: "in-progress" | "saved" | "recommended";
}

const recommendedPlans: LessonPlanCard[] = [
  { id: "r1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "recommended" },
  { id: "r2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "recommended" },
  { id: "r3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 18, status: "recommended" },
  { id: "r4", code: "PA2", subject: "English", grade: "8", questionsCount: 10, status: "recommended" },
  { id: "r5", code: "PA1", subject: "Social Science", grade: "9", questionsCount: 16, status: "recommended" },
];

const inProgressPlans: LessonPlanCard[] = [
  { id: "p1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "in-progress" },
  { id: "p2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "in-progress" },
  { id: "p3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 8, status: "in-progress" },
  { id: "p4", code: "PA2", subject: "English", grade: "8", questionsCount: 20, status: "in-progress" },
];

const savedPlans: LessonPlanCard[] = [
  { id: "s1", code: "PA1", subject: "Hindi", grade: "9", questionsCount: 12, status: "saved" },
  { id: "s2", code: "PA2", subject: "Science", grade: "9", questionsCount: 14, status: "saved" },
  { id: "s3", code: "PA1", subject: "Mathematics", grade: "10", questionsCount: 15, status: "saved" },
  { id: "s4", code: "PA2", subject: "English", grade: "8", questionsCount: 11, status: "saved" },
  { id: "s5", code: "PA1", subject: "Geography", grade: "9", questionsCount: 9, status: "saved" },
];

const statusConfig = {
  recommended: { icon: Star, label: "Recommended", className: "bg-primary/10 text-primary border-primary/20" },
  "in-progress": { icon: Clock, label: "In progress", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  saved: { icon: Save, label: "Saved", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
};

const PlanCard = ({ plan }: { plan: LessonPlanCard }) => {
  const config = statusConfig[plan.status || "recommended"];
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="min-w-[200px] max-w-[220px] bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all shrink-0"
    >
      <span className="text-sm font-bold text-primary">{plan.code}</span>
      <span className="text-base font-semibold text-foreground">{plan.subject}</span>
      <span className="text-sm text-muted-foreground">Grade - {plan.grade}</span>
      <span className="text-xs text-muted-foreground">No. of Questions: {plan.questionsCount}</span>
      <Badge variant="outline" className={`mt-1 text-[11px] gap-1 ${config.className}`}>
        <StatusIcon className="w-3 h-3" />
        {config.label}
      </Badge>
    </motion.div>
  );
};

const ScrollableSection = ({
  title,
  icon: Icon,
  plans,
  count,
}: {
  title: string;
  icon: React.ElementType;
  plans: LessonPlanCard[];
  count: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => scroll("left")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => scroll("right")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin"
        style={{ scrollbarWidth: "thin" }}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

const LessonPlans = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/dashboard")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Lesson Plan Setup</h1>
            <p className="text-sm text-muted-foreground">Create, manage, and track your lesson plans</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create LP
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Recommended Lesson Plans" icon={Star} plans={recommendedPlans} count={recommendedPlans.length} />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Lesson Plans In Progress" icon={Clock} plans={inProgressPlans} count={inProgressPlans.length} />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Lesson Plans Saved" icon={BookOpen} plans={savedPlans} count={savedPlans.length} />
        </div>
      </div>
    </div>
  );
};

export default LessonPlans;
