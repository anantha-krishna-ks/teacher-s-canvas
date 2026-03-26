import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_PRESENTATIONS,
  IN_PROGRESS_PRESENTATIONS,
  SAVED_PRESENTATIONS,
} from "@/constants/presentationsData";

const Presentations = () => (
  <ContentListingPage
    title="Presentations"
    subtitle="Create and manage teaching presentations"
    createLabel="Create Presentation"
    createPath="/dashboard/presentations/create"
    recommended={RECOMMENDED_PRESENTATIONS}
    inProgress={IN_PROGRESS_PRESENTATIONS}
    saved={SAVED_PRESENTATIONS}
  />
);

export default Presentations;
