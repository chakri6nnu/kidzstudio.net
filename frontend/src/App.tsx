import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { StudentLayout } from "@/components/StudentLayout";
import { PublicLayout } from "@/components/PublicLayout";
import AdminRoute from "@/components/AdminRoute";
import StudentRoute from "@/components/StudentRoute";

// Import all pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CoursesMath from "./pages/CoursesMath";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Import auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Quizzes from "./pages/admin/Quizzes";
import Exams from "./pages/admin/Exams";
import Questions from "./pages/admin/Questions";
import Users from "./pages/admin/Users";
import Plans from "./pages/admin/Plans";
import PracticeSets from "./pages/admin/PracticeSets";
import Analytics from "./pages/admin/Analytics";
import Categories from "./pages/admin/Categories";
import QuizTypes from "./pages/admin/QuizTypes";
import ExamTypes from "./pages/admin/ExamTypes";
import Lessons from "./pages/admin/Lessons.tsx";
import Videos from "./pages/admin/Videos.tsx";
import Subscriptions from "./pages/admin/Subscriptions";
import Payments from "./pages/admin/Payments";
import UserGroups from "./pages/admin/UserGroups";
import SubCategories from "./pages/admin/SubCategories";

// Import student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentPractice from "./pages/student/StudentPractice";
import StudentExams from "./pages/student/StudentExams";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import StudentProgress from "./pages/student/StudentProgress";
import TakeExam from "./pages/student/TakeExam";
import TakeQuiz from "./pages/student/TakeQuiz";
import ExamResults from "./pages/student/ExamResults";
import QuizResults from "./pages/student/QuizResults";
import StudentPerformanceOverview from "./pages/student/analytics/PerformanceOverview";

// Import settings pages
import GeneralSettings from "./pages/admin/settings/GeneralSettings";
import Sections from "./pages/admin/Sections";
import Skills from "./pages/admin/Skills";
import LocalizationSettings from "./pages/admin/settings/LocalizationSettings";
import EmailSettings from "./pages/admin/settings/EmailSettings";
import PaymentSettings from "./pages/admin/settings/PaymentSettings";
import ThemeSettings from "./pages/admin/settings/ThemeSettings";
import MaintenanceSettings from "./pages/admin/settings/MaintenanceSettings";
import BillingTaxSettings from "./pages/admin/settings/BillingTaxSettings";

// Import CRUD pages
import QuestionDetails from "./pages/admin/questions/QuestionDetails";
import CreateQuestion from "./pages/admin/questions/CreateQuestion";
import EditQuestion from "./pages/admin/questions/EditQuestion";
import CreateExam from "./pages/admin/exams/CreateExam";
import EditExam from "./pages/admin/exams/EditExam";
import CreateQuiz from "./pages/admin/quizzes/CreateQuiz";
import EditQuiz from "./pages/admin/quizzes/EditQuiz";
import CreatePracticeSet from "./pages/admin/practiceSets/CreatePracticeSet";
import EditPracticeSet from "./pages/admin/practiceSets/EditPracticeSet";

// Import analytics pages
import AnalyticsOverview from "./pages/admin/analytics/AnalyticsOverview";
import StudentPerformance from "./pages/admin/analytics/StudentPerformance";
import SubjectAnalytics from "./pages/admin/analytics/SubjectAnalytics";

// Import other admin pages
import ImportQuestions from "./pages/admin/ImportQuestions";
import Comprehensions from "./pages/admin/Comprehensions";
import QuestionTypes from "./pages/admin/QuestionTypes";
import LessonBank from "./pages/admin/LessonBank";
import VideoBank from "./pages/admin/VideoBank";
import Tags from "./pages/admin/Tags";
import Topics from "./pages/admin/Topics";
import Pages from "./pages/admin/Pages";
import MenuBuilder from "./pages/admin/MenuBuilder";
import CreatePage from "./pages/admin/pages/CreatePage";
import EditPage from "./pages/admin/pages/EditPage";
import ListPagesStatus from "./pages/admin/ListPagesStatus";
import FileManager from "./pages/admin/FileManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="qwiktest-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/math" element={<CoursesMath />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route
              path="/courses/science"
              element={
                <PublicLayout>
                  <div className="py-20">
                    <div className="container">
                      <h1 className="text-4xl font-bold text-center">
                        Science Courses
                      </h1>
                      <p className="text-xl text-muted-foreground text-center mt-4">
                        Discover the wonders of science through interactive
                        learning.
                      </p>
                    </div>
                  </div>
                </PublicLayout>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/file-manager"
              element={
                <AdminRoute>
                  <Layout>
                    <FileManager />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Engage Section Routes */}
            <Route
              path="/admin/quizzes"
              element={
                <AdminRoute>
                  <Layout>
                    <Quizzes />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/create"
              element={
                <AdminRoute>
                  <Layout>
                    <CreateQuiz />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/:id/edit"
              element={
                <AdminRoute>
                  <Layout>
                    <EditQuiz />
                  </Layout>
                </AdminRoute>
              }
            />
            {/* Dynamic Exam Routes */}
            <Route
              path="/admin/exams/*"
              element={
                <AdminRoute>
                  <Layout>
                    <Exams />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quiz-types"
              element={
                <AdminRoute>
                  <Layout>
                    <QuizTypes />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/exam-types"
              element={
                <AdminRoute>
                  <Layout>
                    <ExamTypes />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/practice-sets"
              element={
                <AdminRoute>
                  <Layout>
                    <PracticeSets />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/practice-sets/create"
              element={
                <AdminRoute>
                  <Layout>
                    <CreatePracticeSet />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/practice-sets/:id/edit"
              element={
                <AdminRoute>
                  <Layout>
                    <EditPracticeSet />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lessons"
              element={
                <AdminRoute>
                  <Layout>
                    <Lessons />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <AdminRoute>
                  <Layout>
                    <Videos />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Library Section Routes */}
            <Route
              path="/admin/questions"
              element={
                <AdminRoute>
                  <Layout>
                    <Questions />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/questions/create"
              element={
                <AdminRoute>
                  <Layout>
                    <CreateQuestion />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/questions/:id/edit"
              element={
                <AdminRoute>
                  <Layout>
                    <EditQuestion />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/questions/:id/details"
              element={
                <AdminRoute>
                  <Layout>
                    <QuestionDetails />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/import-questions"
              element={
                <AdminRoute>
                  <Layout>
                    <ImportQuestions />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/comprehensions"
              element={
                <AdminRoute>
                  <Layout>
                    <Comprehensions />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/question-types"
              element={
                <AdminRoute>
                  <Layout>
                    <QuestionTypes />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lesson-bank"
              element={
                <AdminRoute>
                  <Layout>
                    <LessonBank />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/video-bank"
              element={
                <AdminRoute>
                  <Layout>
                    <VideoBank />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Configuration Section Routes */}
            <Route
              path="/admin/plans"
              element={
                <AdminRoute>
                  <Layout>
                    <Plans />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/subscriptions"
              element={
                <AdminRoute>
                  <Layout>
                    <Subscriptions />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user-groups"
              element={
                <AdminRoute>
                  <Layout>
                    <UserGroups />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/import-users"
              element={
                <AdminRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Import Users</h1>
                      <p>Bulk import user accounts...</p>
                    </div>
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <Layout>
                    <Categories />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sub-categories"
              element={
                <AdminRoute>
                  <Layout>
                    <SubCategories />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tags"
              element={
                <AdminRoute>
                  <Layout>
                    <Tags />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sections"
              element={
                <AdminRoute>
                  <Layout>
                    <Sections />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <AdminRoute>
                  <Layout>
                    <Skills />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/topics"
              element={
                <AdminRoute>
                  <Layout>
                    <Topics />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* CMS Section Routes */}
            <Route
              path="/admin/pages"
              element={
                <AdminRoute>
                  <Layout>
                    <Pages />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/create"
              element={
                <AdminRoute>
                  <Layout>
                    <CreatePage />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/:id/edit"
              element={
                <AdminRoute>
                  <Layout>
                    <EditPage />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/menu-builder"
              element={
                <AdminRoute>
                  <Layout>
                    <MenuBuilder />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/list-pages-status"
              element={
                <AdminRoute>
                  <Layout>
                    <ListPagesStatus />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Settings Section Routes */}
            <Route
              path="/admin/general-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <GeneralSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/sections"
              element={
                <AdminRoute>
                  <Layout>
                    <Sections />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/localization-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <LocalizationSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/email-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <EmailSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payment-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <PaymentSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/theme-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <ThemeSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/maintenance-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <MaintenanceSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/billing-tax-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <BillingTaxSettings />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/home-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Home Page</h1>
                      <p>Customize home page content...</p>
                    </div>
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/billing-tax-settings"
              element={
                <AdminRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Billing & Tax</h1>
                      <p>Tax and billing configuration...</p>
                    </div>
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Analytics Routes */}
            <Route
              path="/admin/analytics"
              element={
                <Layout>
                  <Analytics />
                </Layout>
              }
            />
            <Route
              path="/admin/analytics/overview"
              element={
                <Layout>
                  <AnalyticsOverview />
                </Layout>
              }
            />
            <Route
              path="/admin/analytics/student-performance"
              element={
                <Layout>
                  <StudentPerformance />
                </Layout>
              }
            />
            <Route
              path="/admin/analytics/subject-analytics"
              element={
                <Layout>
                  <SubjectAnalytics />
                </Layout>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <Layout>
                  <Analytics />
                </Layout>
              }
            />

            {/* File Manager Route */}
            <Route
              path="/admin/file-manager"
              element={
                <AdminRoute>
                  <Layout>
                    <FileManager />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/practice"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentPractice />
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/quizzes"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentQuizzes />
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/quizzes/:quizId"
              element={
                <StudentRoute>
                  <TakeQuiz />
                </StudentRoute>
              }
            />
            <Route
              path="/student/quiz-results/:quizId"
              element={
                <StudentRoute>
                  <QuizResults />
                </StudentRoute>
              }
            />
            <Route
              path="/student/exams"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentExams />
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/exams/:examId"
              element={
                <StudentRoute>
                  <TakeExam />
                </StudentRoute>
              }
            />
            <Route
              path="/student/exam-results/:examId"
              element={
                <StudentRoute>
                  <ExamResults />
                </StudentRoute>
              }
            />
            <Route
              path="/student/progress"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentProgress />
                  </StudentLayout>
                </StudentRoute>
              }
            />

            {/* Student Analytics Routes */}
            <Route
              path="/student/analytics/performance-overview"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <StudentPerformanceOverview />
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Results</h1>
                      <p>Your exam and quiz results...</p>
                    </div>
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/schedule"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Schedule</h1>
                      <p>Your exam and quiz schedule...</p>
                    </div>
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Settings</h1>
                      <p>Account settings and preferences...</p>
                    </div>
                  </StudentLayout>
                </StudentRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <StudentRoute>
                  <StudentLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">My Profile</h1>
                      <p>View and edit your profile...</p>
                    </div>
                  </StudentLayout>
                </StudentRoute>
              }
            />

            {/* Profile and Settings Routes */}
            <Route
              path="/profile"
              element={
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p>View and edit your profile...</p>
                  </div>
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p>System settings and preferences...</p>
                  </div>
                </Layout>
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
