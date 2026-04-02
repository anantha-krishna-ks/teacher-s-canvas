import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import ReadOnlyLessonPlan from "@/components/ReadOnlyLessonPlan";
import { generateMockPlan, type LessonPlanFormData } from "@/utils/generateMockPlan";
import { CONCEPTS_BY_CHAPTER } from "@/constants/lessonPlanData";

const ViewLessonPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { grade, subject, chapter } = (location.state as { grade: string; subject: string; chapter: string }) || {};

  const formData: LessonPlanFormData = useMemo(() => ({
    grade: grade || "6",
    subject: subject || "Mathematics",
    chapter: chapter || "Algebra",
    concepts: CONCEPTS_BY_CHAPTER[chapter] || ["Key Concepts"],
    duration: "45 min",
    periods: "1",
  }), [grade, subject, chapter]);

  const plan = useMemo(() => generateMockPlan(formData), [formData]);

  return (
    <div className="max-w-6xl mx-auto">
      <ReadOnlyLessonPlan
        data={formData}
        plan={plan}
        onBack={() => navigate("/dashboard/classroom-resources")}
      />
    </div>
  );
};

export default ViewLessonPlan;
