import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlanCard from "./PlanCard";
import type { LessonPlanCard } from "@/constants/lessonPlansPageData";

interface ScrollableSectionProps {
  title: string;
  icon: React.ElementType;
  plans: LessonPlanCard[];
  count: number;
}

const SCROLL_AMOUNT = 240;

const ScrollableSection = ({ title, icon: Icon, plans, count }: ScrollableSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const handleScrollLeft = useCallback(() => handleScroll("left"), [handleScroll]);
  const handleScrollRight = useCallback(() => handleScroll("right"), [handleScroll]);

  return (
    <section className="space-y-3" aria-label={title}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleScrollLeft}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleScrollRight}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 pt-2 -mt-2"
        style={{ scrollbarWidth: "thin" }}
        role="list"
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default ScrollableSection;
