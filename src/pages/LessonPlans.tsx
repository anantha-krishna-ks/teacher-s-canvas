import { useCallback } from "react";
import { Plus, ChevronLeft, Clock, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScrollableSection from "@/components/lesson-plans/ScrollableSection";
import { RECOMMENDED_PLANS, IN_PROGRESS_PLANS, SAVED_PLANS } from "@/constants/lessonPlansPageData";

const LessonPlans = () => {
  const navigate = useNavigate();

  const handleNavigateBack = useCallback(() => navigate("/dashboard"), [navigate]);
  const handleCreateNew = useCallback(() => navigate("/dashboard/lesson-plans/create"), [navigate]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNavigateBack} aria-label="Go back to dashboard">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Lesson Plan Setup</h1>
            <p className="text-sm text-muted-foreground">Create, manage, and track your lesson plans</p>
          </div>
        </div>
        <Button className="gap-2" onClick={handleCreateNew}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create LP
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Recommended Lesson Plans" icon={Star} plans={RECOMMENDED_PLANS} count={RECOMMENDED_PLANS.length} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Lesson Plans In Progress" icon={Clock} plans={IN_PROGRESS_PLANS} count={IN_PROGRESS_PLANS.length} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title="Lesson Plans Saved" icon={BookOpen} plans={SAVED_PLANS} count={SAVED_PLANS.length} />
        </div>
      </div>
    </div>
  );
};

export default LessonPlans;
