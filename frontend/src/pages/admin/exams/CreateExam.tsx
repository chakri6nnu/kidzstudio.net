import { useState, useEffect } from "react";
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
import ExamDetailsTab from "@/components/exam/ExamDetailsTab";
import ExamSettingsTab from "@/components/exam/ExamSettingsTab";
import ExamSectionsTab from "@/components/exam/ExamSectionsTab";
import ExamQuestionsTab from "@/components/exam/ExamQuestionsTab";
import ExamSchedulesTab from "@/components/exam/ExamSchedulesTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getExamTypesApi,
  getSubCategoriesApi,
  createExamApi,
} from "@/lib/utils";

export default function CreateExam() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState({
    title: "",
    details: null,
    settings: null,
    sections: [],
    questions: [],
    schedules: [],
  });

  // Lookups loaded from API
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [examTypes, setExamTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // TODO: fetch lookups from API
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [types, cats] = await Promise.all([
          getExamTypesApi(),
          getSubCategoriesApi(),
        ]);
        setExamTypes(
          types.data.map((t) => ({ id: String(t.id), name: t.name }))
        );
        setCategories(
          cats.data.map((c) => ({ id: String(c.id), name: c.name }))
        );
      } catch (e) {
        // keep empty, tabs will show empty selects
      }
    };
    loadLookups();
  }, []);

  const handleDetailsSubmit = async (data: any) => {
    // Map UI fields to API payload
    const payload: any = {
      title: data.title,
      description: data.description || undefined,
      sub_category_id: Number(data.sub_category_id),
      exam_type_id: Number(data.exam_type),
      is_paid: !!data.is_paid,
      price: data.is_paid ? Number(data.price || 0) : 0,
      can_redeem: !!data.can_redeem,
      points_required: data.can_redeem ? Number(data.points_required || 0) : 0,
      is_private: !!data.is_private,
      is_active: !!data.is_active,
    };
    const res = await createExamApi(payload);
    setExamData((prev) => ({ ...prev, details: data, title: data.title }));
    toast.success(res.message || "Exam created");
    navigate(`/admin/exams/${res.data.id}/edit`);
  };

  const handleSettingsSubmit = async (data: any) => {
    setExamData((prev) => ({ ...prev, settings: data }));
    toast.success("Exam settings saved successfully!");
  };

  const handleSectionsSubmit = async (data: any) => {
    setExamData((prev) => ({ ...prev, sections: data }));
    toast.success("Exam sections saved successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setExamData((prev) => ({ ...prev, questions: data }));
    toast.success("Exam questions saved successfully!");
  };

  const handleSchedulesSubmit = async (data: any) => {
    setExamData((prev) => ({ ...prev, schedules: data }));
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
      ),
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
      ),
    },
    {
      id: "sections",
      label: "Sections",
      number: "3",
      component: (
        <ExamSectionsTab examData={examData} onSave={handleSectionsSubmit} />
      ),
    },
    {
      id: "questions",
      label: "Questions",
      number: "4",
      component: (
        <ExamQuestionsTab examData={examData} onSave={handleQuestionsSubmit} />
      ),
    },
    {
      id: "schedules",
      label: "Schedules",
      number: "5",
      component: (
        <ExamSchedulesTab examData={examData} onSave={handleSchedulesSubmit} />
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
              {examData.title ||
                "#1 Addition, subtraction, multiplication, division / Number & Arithmetic"}
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
