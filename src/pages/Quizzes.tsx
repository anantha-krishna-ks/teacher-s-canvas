import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_QUIZZES,
  SAVED_QUIZZES,
} from "@/constants/quizzesData";

const Quizzes = () => (
  <ContentListingPage
    title="Quizzes"
    subtitle="Create and manage interactive quizzes"
    createLabel="Create Quiz"
    createPath="/dashboard/quizzes/create"
    recommended={RECOMMENDED_QUIZZES}
    inProgress={[]}
    saved={SAVED_QUIZZES}
    showFilters
    showChapterFilter
  />
);

export default Quizzes;
