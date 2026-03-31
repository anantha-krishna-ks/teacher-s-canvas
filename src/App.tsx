import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LessonPlans from "./pages/LessonPlans";
import CreateLessonPlan from "./pages/CreateLessonPlan";
import ClassPlans from "./pages/ClassPlans";
import Presentations from "./pages/Presentations";
import CreatePresentation from "./pages/CreatePresentation";
import Worksheets from "./pages/Worksheets";
import Quizzes from "./pages/Quizzes";
import CreateQuiz from "./pages/CreateQuiz";
import QuizPreview from "./pages/QuizPreview";
import QuizDisplay from "./pages/QuizDisplay";
import Assessment from "./pages/Assessment";
import QuestionRepository from "./pages/QuestionRepository";
import CreateAssessment from "./pages/CreateAssessment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
