import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_ASSESSMENTS,
  IN_PROGRESS_ASSESSMENTS,
  SAVED_ASSESSMENTS,
} from "@/constants/assessmentData";

const Assessment = () => (
  <ContentListingPage
    title="Assessment"
    subtitle="Build and track student assessments"
    createLabel="Create Assessment"
    createPath="/dashboard/assessment/create"
    recommended={RECOMMENDED_ASSESSMENTS}
    inProgress={IN_PROGRESS_ASSESSMENTS}
    saved={SAVED_ASSESSMENTS}
  />
);

export default Assessment;
