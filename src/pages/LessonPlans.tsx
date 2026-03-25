import { Plus, ChevronLeft, ChevronRight, Clock, BookOpen, Save, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";

import hindiImg from "@/assets/subject-hindi.png";
import scienceImg from "@/assets/subject-science.png";
import mathImg from "@/assets/subject-math.png";
import englishImg from "@/assets/subject-english.png";
import socialImg from "@/assets/subject-social.png";
import geographyImg from "@/assets/subject-geography.png";

const subjectImages: Record<string, string> = {
  Hindi: hindiImg,
  Science: scienceImg,
  Mathematics: mathImg,
  English: englishImg,
  "Social Science": socialImg,
  Geography: geographyImg,
};

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

const PlanCard = ({ plan }: { plan: LessonPlanCard }) => {
  const img = subjectImages[plan.subject];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="min-w-[200px] w-[210px] bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all shrink-0"
    >
      {/* Image area */}
      <div className="h-28 bg-accent/40 flex items-center justify-center p-4">
        {img ? (
          <img src={img} alt={plan.subject} loading="lazy" className="h-16 w-16 object-contain" />
        ) : (
          <FileText className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground truncate">{plan.subject}</h4>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0">{plan.code}</Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Grade {plan.grade}</span>
          <span>{plan.questionsCount} Questions</span>
        </div>
      </div>
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
        className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 pt-2 -mt-2"
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
