import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_CLASS_PLANS,
  IN_PROGRESS_CLASS_PLANS,
  SAVED_CLASS_PLANS,
} from "@/constants/classPlanData";

const ClassPlans = () => (
  <ContentListingPage
    title="Class Plan"
    subtitle="Plan and organize your class schedules"
    createLabel="Create CP"
    createPath="/dashboard/class-plans/create"
    recommended={RECOMMENDED_CLASS_PLANS}
    inProgress={IN_PROGRESS_CLASS_PLANS}
    saved={SAVED_CLASS_PLANS}
  />
);

export default ClassPlans;
