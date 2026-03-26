import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_WORKSHEETS,
  IN_PROGRESS_WORKSHEETS,
  SAVED_WORKSHEETS,
} from "@/constants/worksheetsData";

const Worksheets = () => (
  <ContentListingPage
    title="Worksheets"
    subtitle="Design and distribute practice worksheets"
    createLabel="Create Worksheet"
    createPath="/dashboard/worksheets/create"
    recommended={RECOMMENDED_WORKSHEETS}
    inProgress={IN_PROGRESS_WORKSHEETS}
    saved={SAVED_WORKSHEETS}
  />
);

export default Worksheets;
