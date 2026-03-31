import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_PRESENTATIONS,
  SAVED_PRESENTATIONS,
} from "@/constants/presentationsData";

const Presentations = () => (
  <ContentListingPage
    title="Presentations"
    subtitle="Create and manage teaching presentations"
    createLabel="Create Presentation"
    createPath="/dashboard/presentations/create"
    recommended={RECOMMENDED_PRESENTATIONS}
    inProgress={[]}
    saved={SAVED_PRESENTATIONS}
    sectionLabels={{ inProgress: "" }}
    showFilters
  />
);

export default Presentations;
