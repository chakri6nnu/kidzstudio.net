import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import PracticeSetDetailsTab from "@/components/practiceSet/PracticeSetDetailsTab";
import PracticeSetSettingsTab from "@/components/practiceSet/PracticeSetSettingsTab";
import PracticeSetQuestionsTab from "@/components/practiceSet/PracticeSetQuestionsTab";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditPracticeSet() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [practiceSetData, setPracticeSetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [skills, setSkills] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchPracticeSet = async () => {
      try {
        if (!id) return;
        const [subs, skillsRes, setRes] = await Promise.all([
          api.subCategories.getAll(),
          api.skills.getAll(),
          api.practiceSets.getById(id),
        ]);

        const subList =
          subs && Array.isArray((subs as any).data)
            ? (subs as any).data
            : Array.isArray(subs)
            ? subs
            : [];
        const skillList =
          skillsRes && Array.isArray((skillsRes as any).data)
            ? (skillsRes as any).data
            : Array.isArray(skillsRes)
            ? skillsRes
            : [];
        setCategories(
          subList.map((s: any) => ({ id: String(s.id), name: s.name }))
        );
        setSkills(
          skillList.map((s: any) => ({ id: String(s.id), name: s.name }))
        );

        let ps: any = setRes || null;
        if (!ps || !ps.id) {
          // fallback: try loading from list and pick by id
          const list = await api.practiceSets.getAll({ page: 1, limit: 50 });
          const found = (list?.data || []).find(
            (p: any) => String(p.id) === String(id)
          );
          if (!found) throw new Error("Practice set not found");
          ps = found;
        }
        setPracticeSetData({
          id: ps.id,
          title: ps.title,
          details: {
            title: ps.title,
            sub_category_id: String(ps.sub_category_id),
            skill_id: String(ps.skill_id),
            is_paid: !!ps.is_paid,
            price: ps.price || 0,
            description: ps.description || "",
            is_active: !!ps.is_active,
          },
          settings: ps.settings || null,
          questions: [],
        });
      } catch (error) {
        toast.error("Failed to load practice set");
        navigate("/admin/practice-sets");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPracticeSet();
    }
  }, [id, navigate]);

  const handleDetailsSubmit = async (data: any) => {
    if (!id) return;
    await api.practiceSets.update(id, {
      title: data.title,
      sub_category_id: Number(data.sub_category_id),
      skill_id: Number(data.skill_id),
      is_paid: data.is_paid,
      price: data.price,
      description: data.description,
      is_active: data.is_active,
    });
    setPracticeSetData((prev: any) => ({
      ...prev,
      details: data,
      title: data.title,
    }));
    toast.success("Practice set details updated successfully!");
  };

  const handleSettingsSubmit = async (data: any) => {
    if (!id) return;
    await api.practiceSets.update(id, {
      settings: {
        allow_reward_points: data.allow_reward_points,
        show_reward_popup: data.show_reward_popup,
        points_mode: data.points_mode,
        points_correct: data.points_correct,
      },
      ...(data.points_mode === "manual" &&
      typeof data.points_correct === "number"
        ? { correct_marks: data.points_correct }
        : {}),
    } as any);
    setPracticeSetData((prev: any) => ({ ...prev, settings: data }));
    toast.success("Practice set settings updated successfully!");
  };

  const handleQuestionsSubmit = async (data: any) => {
    setPracticeSetData((prev: any) => ({ ...prev, questions: data }));
    toast.success("Practice set questions updated successfully!");
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

  if (!practiceSetData) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Practice Set Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The practice set you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate("/admin/practice-sets")}>
          Back to Practice Sets
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
        <PracticeSetDetailsTab
          practiceSetData={practiceSetData.details}
          onSave={handleDetailsSubmit}
          categories={categories}
          skills={skills}
        />
      ),
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
      ),
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
              <BreadcrumbLink href="/admin/practice-sets">
                Practice Sets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Practice Set #{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          variant="outline"
          onClick={() => navigate("/admin/practice-sets")}
        >
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
            <div className="text-muted-foreground">{practiceSetData.title}</div>
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
