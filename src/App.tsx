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

// Lazy-loaded dashboard pages — kept as named importers so we can prefetch them on idle.
const importers = {
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

const Dashboard = lazy(importers.Dashboard);
const LessonPlans = lazy(importers.LessonPlans);
const CreateLessonPlan = lazy(importers.CreateLessonPlan);
const ClassPlans = lazy(importers.ClassPlans);
const Presentations = lazy(importers.Presentations);
const CreatePresentation = lazy(importers.CreatePresentation);
const PresentationEditor = lazy(importers.PresentationEditor);
const Worksheets = lazy(importers.Worksheets);
const Quizzes = lazy(importers.Quizzes);
const CreateQuiz = lazy(importers.CreateQuiz);
const QuizPreview = lazy(importers.QuizPreview);
const QuizDisplay = lazy(importers.QuizDisplay);
const Assessment = lazy(importers.Assessment);
const QuestionRepository = lazy(importers.QuestionRepository);
const CreateAssessment = lazy(importers.CreateAssessment);
const ClassroomResources = lazy(importers.ClassroomResources);
const ViewLessonPlan = lazy(importers.ViewLessonPlan);
const ViewPresentation = lazy(importers.ViewPresentation);
const ViewQuiz = lazy(importers.ViewQuiz);
const NotFound = lazy(importers.NotFound);

const queryClient = new QueryClient();

const prefetchRoutes = () => {
  const ric = typeof window !== "undefined" ? (window as Window & {
    requestIdleCallback?: (cb: () => void) => number;
  }).requestIdleCallback : undefined;
  const schedule = ric ?? ((cb: () => void) => window.setTimeout(cb, 200));
  Object.values(importers).forEach((load) => {
    schedule(() => {
      load().catch(() => {
        /* swallow prefetch errors */
      });
    });
  });
};

const App = () => {
  useEffect(() => {
    prefetchRoutes();
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
