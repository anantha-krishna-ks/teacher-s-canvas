import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentListingPage from "@/components/ContentListingPage";
import { RECOMMENDED_PLANS, IN_PROGRESS_PLANS, SAVED_PLANS } from "@/constants/lessonPlansPageData";
import { getInProgressPlans, getSavedPlans, subscribe } from "@/stores/lessonPlanStore";

const LessonPlans = () => {
  const [userInProgress, setUserInProgress] = useState(getInProgressPlans);
  const [userSaved, setUserSaved] = useState(getSavedPlans);

  useEffect(() => {
    return subscribe(() => {
      setUserInProgress(getInProgressPlans());
      setUserSaved(getSavedPlans());
    });
  }, []);

  const allInProgress = [...userInProgress, ...IN_PROGRESS_PLANS];
  const allSaved = [...userSaved, ...SAVED_PLANS];

  return (
    <ContentListingPage
      title="Lesson Plan Setup"
      subtitle="Create, manage, and track your lesson plans"
      createLabel="Create LP"
      createPath="/dashboard/lesson-plans/create"
      recommended={RECOMMENDED_PLANS}
      inProgress={allInProgress}
      saved={allSaved}
      sectionLabels={{
        recommended: "Recommended Lesson Plans",
        inProgress: "Lesson Plans In Progress",
        saved: "Lesson Plans Saved",
      }}
    />
  );
};

export default LessonPlans;
