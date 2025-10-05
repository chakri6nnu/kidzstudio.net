import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import QuizDetailsTab from "@/components/quiz/QuizDetailsTab";
import QuizSettingsTab from "@/components/quiz/QuizSettingsTab";
import QuizQuestionsTab from "@/components/quiz/QuizQuestionsTab";
import QuizSchedulesTab from "@/components/quiz/QuizSchedulesTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createQuizApi,
  getSubCategoriesApi,
  getQuizTypesApi,
} from "@/lib/utils";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [quizData, setQuizData] = useState({
    title: "",
    details: null,
    settings: null,
    questions: [],
    schedules: [],
  });

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [quizTypes, setQuizTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  useEffect(() => {
    (async () => {
      try {
        const cats = await getSubCategoriesApi();
        setCategories(
          cats.data.map((c) => ({ id: String(c.id), name: c.name }))
        );
        const types = await getQuizTypesApi();
        setQuizTypes(
          types.data.map((t) => ({ id: String(t.id), name: t.name }))
        );
      } catch {}
    })();
  }, []);

  const handleDetailsSubmit = async (data: any) => {
    const payload: any = {
      title: data.title,
      description: data.description || undefined,
      sub_category_id: Number(data.sub_category_id),
      quiz_type_id: Number(data.quiz_type),
      is_paid: !!data.is_paid,
      price: data.is_paid ? Number(data.price || 0) : 0,
      can_redeem: !!data.can_redeem,
      points_required: data.can_redeem ? Number(data.points_required || 0) : 0,
      is_private: !!data.is_private,
      is_active: !!data.is_active,
    };
    const res = await createQuizApi(payload);
    setQuizData((prev) => ({ ...prev, details: data, title: data.title }));
    toast.success(res.message || "Quiz created");
    navigate(`/admin/quizzes/${res.data.id}/edit`);
  };

  const handleSettingsSubmit = async (data: any) => {
    setQuizData((prev) => ({ ...prev, settings: data }));
    toast.success("Quiz settings saved successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setQuizData((prev) => ({ ...prev, questions: data }));
    toast.success("Quiz questions saved successfully!");
  };

  const handleSchedulesSubmit = async (data: any) => {
    setQuizData((prev) => ({ ...prev, schedules: data }));
    toast.success("Quiz schedules saved successfully!");
  };

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
      ),
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
      ),
    },
    {
      id: "questions",
      label: "Questions",
      number: "3",
      component: (
        <QuizQuestionsTab quizData={quizData} onSave={handleQuestionsSubmit} />
      ),
    },
    {
      id: "schedules",
      label: "Schedules",
      number: "4",
      component: (
        <QuizSchedulesTab quizData={quizData} onSave={handleSchedulesSubmit} />
      ),
    },
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
              <BreadcrumbPage>New Quiz</BreadcrumbPage>
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
              {quizData.title || "New Quiz"}
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
