import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageLoader from "@/components/PageLoader";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy-loaded dashboard pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LessonPlans = lazy(() => import("./pages/LessonPlans"));
const CreateLessonPlan = lazy(() => import("./pages/CreateLessonPlan"));
const ClassPlans = lazy(() => import("./pages/ClassPlans"));
const Presentations = lazy(() => import("./pages/Presentations"));
const CreatePresentation = lazy(() => import("./pages/CreatePresentation"));
const Worksheets = lazy(() => import("./pages/Worksheets"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const CreateQuiz = lazy(() => import("./pages/CreateQuiz"));
const QuizPreview = lazy(() => import("./pages/QuizPreview"));
const QuizDisplay = lazy(() => import("./pages/QuizDisplay"));
const Assessment = lazy(() => import("./pages/Assessment"));
const QuestionRepository = lazy(() => import("./pages/QuestionRepository"));
const CreateAssessment = lazy(() => import("./pages/CreateAssessment"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
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
              <Route path="worksheets" element={<Worksheets />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quizzes/create" element={<CreateQuiz />} />
              <Route path="quizzes/preview" element={<QuizPreview />} />
              <Route path="quizzes/display" element={<QuizDisplay />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="assessment/create" element={<CreateAssessment />} />
              <Route path="assessment/question-repository" element={<QuestionRepository />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
