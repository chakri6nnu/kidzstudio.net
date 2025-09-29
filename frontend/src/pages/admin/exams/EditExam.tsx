import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ExamDetailsTab from "@/components/exam/ExamDetailsTab";
import ExamSettingsTab from "@/components/exam/ExamSettingsTab";
import ExamSectionsTab from "@/components/exam/ExamSectionsTab";
import ExamQuestionsTab from "@/components/exam/ExamQuestionsTab";
import ExamSchedulesTab from "@/components/exam/ExamSchedulesTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditExam() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const categories = [
    { id: "1", name: "Mathematics / Numerical Reasoning (UK Grammar School 11+ Exam Preparation)" },
    { id: "2", name: "English / Verbal Reasoning" },
    { id: "3", name: "Science / General Knowledge" },
  ];

  const examTypes = [
    { id: "1", name: "Daily Challenge Question" },
    { id: "2", name: "Practice Test" },
    { id: "3", name: "Mock Exam" },
    { id: "4", name: "Assessment" },
  ];

  // Mock exam data
  const mockExamData = {
    id: id,
    title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
    details: {
      title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
      sub_category_id: "1",
      exam_type: "1",
      is_paid: true,
      price: 10,
      can_redeem: false,
      points_required: 0,
      description: "This exam covers basic arithmetic operations including addition, subtraction, multiplication, and division.",
      is_private: true,
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
      disable_section_navigation: true,
      disable_finish_button: true,
      enable_question_list_view: true,
      hide_solutions: true,
      show_leaderboard: true,
    },
    sections: [
      {
        id: "1",
        display_name: "Main",
        section: "Number & Arithmetic ← Mathematics / Numerical Reasoning",
        section_order: 1,
        total_questions: 20,
        total_duration: 20,
        total_marks: 20
      }
    ],
    questions: [],
    schedules: [
      {
        id: "1",
        code: "esd_6ENKIQLHKZ1",
        type: "Flexible",
        starts_at: "Sat, Sep 27, 2025 12:00 AM",
        ends_at: "Wed, Nov 26, 2025 12:10 AM",
        status: "Active"
      }
    ]
  };

  useEffect(() => {
    const fetchExam = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExamData(mockExamData);
      } catch (error) {
        toast.error("Failed to load exam");
        navigate("/admin/exams");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExam();
    }
  }, [id, navigate]);

  const handleDetailsSubmit = async (data: any) => {
    setExamData((prev: any) => ({ ...prev, details: data, title: data.title }));
    toast.success("Exam details updated successfully!");
  };

  const handleSettingsSubmit = async (data: any) => {
    setExamData((prev: any) => ({ ...prev, settings: data }));
    toast.success("Exam settings updated successfully!");
  };

  const handleSectionsSubmit = async (data: any) => {
    setExamData((prev: any) => ({ ...prev, sections: data }));
    toast.success("Exam sections updated successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setExamData((prev: any) => ({ ...prev, questions: data }));
    toast.success("Exam questions updated successfully!");
  };

  const handleSchedulesSubmit = async (data: any) => {
    setExamData((prev: any) => ({ ...prev, schedules: data }));
    toast.success("Exam schedules updated successfully!");
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

  if (!examData) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Exam Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The exam you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/admin/exams")}>
          Back to Exams
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
        <ExamDetailsTab
          examData={examData.details}
          onSave={handleDetailsSubmit}
          categories={categories}
          examTypes={examTypes}
        />
      )
    },
    {
      id: "settings",
      label: "Settings",
      number: "2", 
      component: (
        <ExamSettingsTab
          examData={examData.settings}
          onSave={handleSettingsSubmit}
        />
      )
    },
    {
      id: "sections",
      label: "Sections",
      number: "3",
      component: (
        <ExamSectionsTab
          examData={examData}
          onSave={handleSectionsSubmit}
        />
      )
    },
    {
      id: "questions", 
      label: "Questions",
      number: "4",
      component: (
        <ExamQuestionsTab
          examData={examData}
          onSave={handleQuestionsSubmit}
        />
      )
    },
    {
      id: "schedules",
      label: "Schedules", 
      number: "5",
      component: (
        <ExamSchedulesTab
          examData={examData}
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
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/exams">Exams</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Exam #{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" onClick={() => navigate("/admin/exams")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Exam Details</h1>
            <div className="text-muted-foreground">
              {examData.title}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 h-auto bg-muted/30 p-2 rounded-xl">
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