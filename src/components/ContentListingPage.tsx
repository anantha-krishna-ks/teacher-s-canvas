// Reusable listing page layout for Plan/Create menu items
// Renders optional filter bar + scrollable sections (Recommended, In Progress, Saved)

import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, ChevronLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import ScrollableSection from "@/components/lesson-plans/ScrollableSection";
import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

interface ExtraAction {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
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
  showFilters?: boolean;
  showChapterFilter?: boolean;
}

const ALL = "__all__";

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
  showFilters = false,
  showChapterFilter = false,
}: ContentListingPageProps) => {
  const navigate = useNavigate();
  const [gradeFilter, setGradeFilter] = useState(ALL);
  const [subjectFilter, setSubjectFilter] = useState(ALL);
  const [chapterFilter, setChapterFilter] = useState(ALL);

  const handleNavigateBack = useCallback(() => navigate(backPath), [navigate, backPath]);
  const handleCreateNew = useCallback(() => navigate(createPath), [navigate, createPath]);

  // Derive unique grades & subjects from all data
  const allPlans = useMemo(
    () => [...(recommended || []), ...inProgress, ...saved],
    [recommended, inProgress, saved],
  );

  const grades = useMemo(() => [...new Set(allPlans.map((p) => p.grade))].sort((a, b) => Number(a) - Number(b)), [allPlans]);
  const subjects = useMemo(() => [...new Set(allPlans.map((p) => p.subject))].sort(), [allPlans]);
  const chapters = useMemo(() => [...new Set(allPlans.map((p) => p.chapter).filter(Boolean) as string[])].sort(), [allPlans]);

  const filterPlans = useCallback(
    (plans: LessonPlanCard[]) => {
      if (!showFilters) return plans;
      return plans.filter((p) => {
        if (gradeFilter !== ALL && p.grade !== gradeFilter) return false;
        if (subjectFilter !== ALL && p.subject !== subjectFilter) return false;
        if (showChapterFilter && chapterFilter !== ALL && p.chapter !== chapterFilter) return false;
        return true;
      });
    },
    [showFilters, gradeFilter, subjectFilter, showChapterFilter, chapterFilter],
  );

  const filteredRecommended = useMemo(() => (recommended ? filterPlans(recommended) : undefined), [recommended, filterPlans]);
  const filteredInProgress = useMemo(() => filterPlans(inProgress), [inProgress, filterPlans]);
  const filteredSaved = useMemo(() => filterPlans(saved), [saved, filterPlans]);

  const handleClearFilters = useCallback(() => {
    setGradeFilter(ALL);
    setSubjectFilter(ALL);
    setChapterFilter(ALL);
  }, []);

  const hasActiveFilters = gradeFilter !== ALL || subjectFilter !== ALL || chapterFilter !== ALL;

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
        <div className="flex items-center gap-2">
          {extraActions?.map((action) => (
            <Button
              key={action.path}
              variant={action.variant || "outline"}
              className={cn("gap-2", action.className)}
              onClick={() => navigate(action.path)}
            >
              {action.icon && <action.icon className="w-4 h-4" aria-hidden="true" />}
              {action.label}
            </Button>
          ))}
          <Button className="gap-2" onClick={handleCreateNew}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            {createLabel}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">Filters</span>
          </div>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Grades</SelectItem>
              {grades.map((g) => (
                <SelectItem key={g} value={g}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[170px] h-9 text-sm">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showChapterFilter && chapters.length > 0 && (
            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger className="w-[200px] h-9 text-sm">
                <SelectValue placeholder="All Chapters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Chapters</SelectItem>
                {chapters.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground" onClick={handleClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {filteredRecommended && filteredRecommended.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <ScrollableSection title={recommendedTitle} icon={Star} plans={filteredRecommended} count={filteredRecommended.length} />
          </div>
        )}
        {filteredInProgress.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <ScrollableSection title={inProgressTitle} icon={Clock} plans={filteredInProgress} count={filteredInProgress.length} />
          </div>
        )}
        {filteredSaved.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <ScrollableSection title={savedTitle} icon={BookOpen} plans={filteredSaved} count={filteredSaved.length} />
          </div>
        )}
        {showFilters && hasActiveFilters && filteredRecommended?.length === 0 && filteredInProgress.length === 0 && filteredSaved.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No results match your filters.</p>
            <Button variant="link" size="sm" className="mt-1" onClick={handleClearFilters}>Clear filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentListingPage;
