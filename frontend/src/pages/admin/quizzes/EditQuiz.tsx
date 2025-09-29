import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import QuizDetailsTab from "@/components/quiz/QuizDetailsTab";
import QuizSettingsTab from "@/components/quiz/QuizSettingsTab";
import QuizQuestionsTab from "@/components/quiz/QuizQuestionsTab";
import QuizSchedulesTab from "@/components/quiz/QuizSchedulesTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditQuiz() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const categories = [
    { id: "1", name: "Mathematics / Numerical Reasoning" },
    { id: "2", name: "English / Verbal Reasoning" },
    { id: "3", name: "Science / General Knowledge" },
  ];

  const quizTypes = [
    { id: "1", name: "Practice Quiz" },
    { id: "2", name: "Mock Quiz" },
    { id: "3", name: "Live Quiz" },
    { id: "4", name: "Assessment" },
  ];

  // Mock quiz data
  const mockQuizData = {
    id: id,
    title: "Basic Math Quiz",
    details: {
      title: "Basic Math Quiz",
      sub_category_id: "1",
      quiz_type: "1",
      is_paid: false,
      price: 0,
      can_redeem: false,
      points_required: 0,
      description: "A basic mathematics quiz covering fundamental arithmetic operations.",
      is_private: false,
      is_active: true,
    },
    settings: {
      auto_duration: true,
      auto_grading: true,
      negative_marking: false,
      overall_pass_percentage: 60,
      enable_section_cutoff: false,
      shuffle_questions: true,
      restrict_attempts: true,
      disable_finish_button: false,
      enable_question_list_view: true,
      hide_solutions: false,
      show_leaderboard: true,
    },
    questions: [],
    schedules: [
      {
        id: "1",
        code: "qsb_6ENKIQLHKZ1",
        type: "Flexible",
        starts_at: "Sat, Sep 27, 2025 12:00 AM",
        ends_at: "Wed, Nov 26, 2025 12:10 AM",
        status: "Active"
      }
    ]
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuizData(mockQuizData);
      } catch (error) {
        toast.error("Failed to load quiz");
        navigate("/admin/quizzes");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id, navigate]);

  const handleDetailsSubmit = async (data: any) => {
    setQuizData((prev: any) => ({ ...prev, details: data, title: data.title }));
    toast.success("Quiz details updated successfully!");
  };

  const handleSettingsSubmit = async (data: any) => {
    setQuizData((prev: any) => ({ ...prev, settings: data }));
    toast.success("Quiz settings updated successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setQuizData((prev: any) => ({ ...prev, questions: data }));
    toast.success("Quiz questions updated successfully!");
  };

  const handleSchedulesSubmit = async (data: any) => {
    setQuizData((prev: any) => ({ ...prev, schedules: data }));
    toast.success("Quiz schedules updated successfully!");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-full max-w-md" />
        <Skeleton className="h-12 w-full max-w-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Quiz Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The quiz you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/admin/quizzes")}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const tabConfig = [
    {
      id: "details",
      label: "Details",
      number: "1",
      component: (
        <QuizDetailsTab
          quizData={quizData.details}
          onSave={handleDetailsSubmit}
          categories={categories}
          quizTypes={quizTypes}
        />
      )
    },
    {
      id: "settings",
      label: "Settings",
      number: "2", 
      component: (
        <QuizSettingsTab
          quizData={quizData.settings}
          onSave={handleSettingsSubmit}
        />
      )
    },
    {
      id: "questions", 
      label: "Questions",
      number: "3",
      component: (
        <QuizQuestionsTab
          quizData={quizData}
          onSave={handleQuestionsSubmit}
        />
      )
    },
    {
      id: "schedules",
      label: "Schedules", 
      number: "4",
      component: (
        <QuizSchedulesTab
          quizData={quizData}
          onSave={handleSchedulesSubmit}
        />
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/quizzes">Quizzes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Quiz #{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" onClick={() => navigate("/admin/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quiz Details</h1>
            <div className="text-muted-foreground">
              {quizData.title}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 h-auto bg-muted/30 p-2 rounded-xl">
          {tabConfig.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-muted/50"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    activeTab === tab.id 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {tab.number}
                </div>
                <span className="font-medium">{tab.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}