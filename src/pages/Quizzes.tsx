import ContentListingPage from "@/components/ContentListingPage";
import {
  RECOMMENDED_QUIZZES,
  IN_PROGRESS_QUIZZES,
  SAVED_QUIZZES,
} from "@/constants/quizzesData";

const Quizzes = () => (
  <ContentListingPage
    title="Quizzes"
    subtitle="Create and manage interactive quizzes"
    createLabel="Create Quiz"
    createPath="/dashboard/quizzes/create"
    recommended={RECOMMENDED_QUIZZES}
    inProgress={IN_PROGRESS_QUIZZES}
    saved={SAVED_QUIZZES}
    showFilters
    showChapterFilter
  />
);

export default Quizzes;
