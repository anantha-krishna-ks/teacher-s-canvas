// Reusable listing page layout for Plan/Create menu items
// Renders 3 scrollable sections (Recommended, In Progress, Saved) with a header and Create button

import { useCallback } from "react";
import { Plus, ChevronLeft, Clock, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScrollableSection from "@/components/lesson-plans/ScrollableSection";
import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

interface ExtraAction {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

interface ContentListingPageProps {
  title: string;
  subtitle: string;
  createLabel: string;
  createPath: string;
  backPath?: string;
  recommended?: LessonPlanCard[];
  inProgress: LessonPlanCard[];
  saved: LessonPlanCard[];
  sectionLabels?: {
    recommended?: string;
    inProgress?: string;
    saved?: string;
  };
  extraActions?: ExtraAction[];
}

const ContentListingPage = ({
  title,
  subtitle,
  createLabel,
  createPath,
  backPath = "/dashboard",
  recommended,
  inProgress,
  saved,
  sectionLabels,
  extraActions,
}: ContentListingPageProps) => {
  const navigate = useNavigate();

  const handleNavigateBack = useCallback(() => navigate(backPath), [navigate, backPath]);
  const handleCreateNew = useCallback(() => navigate(createPath), [navigate, createPath]);

  const recommendedTitle = sectionLabels?.recommended || `Recommended ${title}`;
  const inProgressTitle = sectionLabels?.inProgress || `${title} In Progress`;
  const savedTitle = sectionLabels?.saved || `${title} Saved`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleNavigateBack} aria-label="Go back to dashboard">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button className="gap-2" onClick={handleCreateNew}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          {createLabel}
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {recommended && recommended.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <ScrollableSection title={recommendedTitle} icon={Star} plans={recommended} count={recommended.length} />
          </div>
        )}
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title={inProgressTitle} icon={Clock} plans={inProgress} count={inProgress.length} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <ScrollableSection title={savedTitle} icon={BookOpen} plans={saved} count={saved.length} />
        </div>
      </div>
    </div>
  );
};

export default ContentListingPage;
