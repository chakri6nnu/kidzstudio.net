import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ExamDetailsTab from "@/components/exam/ExamDetailsTab";
import ExamSettingsTab from "@/components/exam/ExamSettingsTab";
import ExamSectionsTab from "@/components/exam/ExamSectionsTab";
import ExamQuestionsTab from "@/components/exam/ExamQuestionsTab";
import ExamSchedulesTab from "@/components/exam/ExamSchedulesTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateExam() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState({
    title: "",
    details: null,
    settings: null,
    sections: [],
    questions: [],
    schedules: []
  });

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

  const handleDetailsSubmit = async (data: any) => {
    setExamData(prev => ({ ...prev, details: data, title: data.title }));
    toast.success("Exam details saved successfully!");
  };

  const handleSettingsSubmit = async (data: any) => {
    setExamData(prev => ({ ...prev, settings: data }));
    toast.success("Exam settings saved successfully!");
  };

  const handleSectionsSubmit = async (data: any) => {
    setExamData(prev => ({ ...prev, sections: data }));
    toast.success("Exam sections saved successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setExamData(prev => ({ ...prev, questions: data }));
    toast.success("Exam questions saved successfully!");
  };

  const handleSchedulesSubmit = async (data: any) => {
    setExamData(prev => ({ ...prev, schedules: data }));
    toast.success("Exam schedules saved successfully!");
  };

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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/exams">Exams</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Exam</BreadcrumbPage>
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
              {examData.title || "#1 Addition, subtraction, multiplication, division / Number & Arithmetic"}
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