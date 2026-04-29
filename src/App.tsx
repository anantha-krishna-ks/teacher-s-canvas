import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageLoader from "@/components/PageLoader";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy-loaded dashboard pages (factories kept so we can preload them)
const lazyImports = {
  Dashboard: () => import("./pages/Dashboard"),
  LessonPlans: () => import("./pages/LessonPlans"),
  CreateLessonPlan: () => import("./pages/CreateLessonPlan"),
  ClassPlans: () => import("./pages/ClassPlans"),
  Presentations: () => import("./pages/Presentations"),
  CreatePresentation: () => import("./pages/CreatePresentation"),
  PresentationEditor: () => import("./pages/PresentationEditor"),
  Worksheets: () => import("./pages/Worksheets"),
  Quizzes: () => import("./pages/Quizzes"),
  CreateQuiz: () => import("./pages/CreateQuiz"),
  QuizPreview: () => import("./pages/QuizPreview"),
  QuizDisplay: () => import("./pages/QuizDisplay"),
  Assessment: () => import("./pages/Assessment"),
  QuestionRepository: () => import("./pages/QuestionRepository"),
  CreateAssessment: () => import("./pages/CreateAssessment"),
  ClassroomResources: () => import("./pages/ClassroomResources"),
  ViewLessonPlan: () => import("./pages/ViewLessonPlan"),
  ViewPresentation: () => import("./pages/ViewPresentation"),
  ViewQuiz: () => import("./pages/ViewQuiz"),
  NotFound: () => import("./pages/NotFound"),
};

const Dashboard = lazy(lazyImports.Dashboard);
const LessonPlans = lazy(lazyImports.LessonPlans);
const CreateLessonPlan = lazy(lazyImports.CreateLessonPlan);
const ClassPlans = lazy(lazyImports.ClassPlans);
const Presentations = lazy(lazyImports.Presentations);
const CreatePresentation = lazy(lazyImports.CreatePresentation);
const PresentationEditor = lazy(lazyImports.PresentationEditor);
const Worksheets = lazy(lazyImports.Worksheets);
const Quizzes = lazy(lazyImports.Quizzes);
const CreateQuiz = lazy(lazyImports.CreateQuiz);
const QuizPreview = lazy(lazyImports.QuizPreview);
const QuizDisplay = lazy(lazyImports.QuizDisplay);
const Assessment = lazy(lazyImports.Assessment);
const QuestionRepository = lazy(lazyImports.QuestionRepository);
const CreateAssessment = lazy(lazyImports.CreateAssessment);
const ClassroomResources = lazy(lazyImports.ClassroomResources);
const ViewLessonPlan = lazy(lazyImports.ViewLessonPlan);
const ViewPresentation = lazy(lazyImports.ViewPresentation);
const ViewQuiz = lazy(lazyImports.ViewQuiz);
const NotFound = lazy(lazyImports.NotFound);

const preloadRoutes = () => {
  Object.values(lazyImports).forEach((load) => {
    load().catch(() => {
      /* ignore preload errors */
    });
  });
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(preloadRoutes);
    } else {
      setTimeout(preloadRoutes, 200);
    }
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="lesson-plans" element={<LessonPlans />} />
              <Route path="lesson-plans/create" element={<CreateLessonPlan />} />
              <Route path="class-plans" element={<ClassPlans />} />
              <Route path="presentations" element={<Presentations />} />
              <Route path="presentations/create" element={<CreatePresentation />} />
              <Route path="presentations/editor" element={<PresentationEditor />} />
              <Route path="worksheets" element={<Worksheets />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quizzes/create" element={<CreateQuiz />} />
              <Route path="quizzes/preview" element={<QuizPreview />} />
              <Route path="quizzes/display" element={<QuizDisplay />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="assessment/create" element={<CreateAssessment />} />
              <Route path="assessment/question-repository" element={<QuestionRepository />} />
              <Route path="classroom-resources" element={<ClassroomResources />} />
              <Route path="classroom-resources/view-lesson-plan" element={<ViewLessonPlan />} />
              <Route path="classroom-resources/view-presentation" element={<ViewPresentation />} />
              <Route path="classroom-resources/view-quiz" element={<ViewQuiz />} />
              <Route path="classroom-resources/display-quiz" element={<QuizDisplay />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
