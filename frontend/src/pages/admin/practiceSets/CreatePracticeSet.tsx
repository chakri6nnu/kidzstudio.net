import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PracticeSetDetailsTab from "@/components/practiceSet/PracticeSetDetailsTab";
import PracticeSetSettingsTab from "@/components/practiceSet/PracticeSetSettingsTab";
import PracticeSetQuestionsTab from "@/components/practiceSet/PracticeSetQuestionsTab";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatePracticeSet() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [practiceSetData, setPracticeSetData] = useState({
    title: "",
    details: null,
    settings: null,
    questions: []
  });

  // Mock data
  const categories = [
    { id: "1", name: "Mathematics / Numerical Reasoning" },
    { id: "2", name: "English / Verbal Reasoning" },
    { id: "3", name: "Science / General Knowledge" },
  ];

  const skills = [
    { id: "1", name: "Basic Arithmetic" },
    { id: "2", name: "Algebra" },
    { id: "3", name: "Geometry" },
    { id: "4", name: "Reading Comprehension" },
    { id: "5", name: "Grammar" },
  ];

  const handleDetailsSubmit = async (data: any) => {
    setPracticeSetData(prev => ({ ...prev, details: data, title: data.title }));
    toast.success("Practice set details saved successfully!");
  };

  const handleSettingsSubmit = async (data: any) => {
    setPracticeSetData(prev => ({ ...prev, settings: data }));
    toast.success("Practice set settings saved successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setPracticeSetData(prev => ({ ...prev, questions: data }));
    toast.success("Practice set questions saved successfully!");
  };

  const tabConfig = [
    {
      id: "details",
      label: "Details",
      number: "1",
      component: (
        <PracticeSetDetailsTab
          practiceSetData={practiceSetData.details}
          onSave={handleDetailsSubmit}
          categories={categories}
          skills={skills}
        />
      )
    },
    {
      id: "settings",
      label: "Settings", 
      number: "2",
      component: (
        <PracticeSetSettingsTab
          practiceSetData={practiceSetData.settings}
          onSave={handleSettingsSubmit}
        />
      )
    },
    {
      id: "questions",
      label: "Questions",
      number: "3",
      component: (
        <PracticeSetQuestionsTab
          practiceSetData={practiceSetData}
          onSave={handleQuestionsSubmit}
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
              <BreadcrumbLink href="/admin/practice-sets">Practice Sets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New Practice Set</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" onClick={() => navigate("/admin/practice-sets")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Practice Sets
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Practice Set Details</h1>
            <div className="text-muted-foreground">
              {practiceSetData.title || "New Practice Set"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-auto bg-muted/30 p-2 rounded-xl">
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