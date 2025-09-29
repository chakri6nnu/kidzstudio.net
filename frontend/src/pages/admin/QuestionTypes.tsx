import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import { getAdminQuestionTypesApi, createAdminQuestionTypeApi, updateAdminQuestionTypeApi, deleteAdminQuestionTypeApi, type AdminQuestionType } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  HelpCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface QuestionType {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  questions: number;
  icon: string;
  settings?: {
    allowMultipleAnswers?: boolean;
    showExplanation?: boolean;
    timeLimit?: number;
    difficulty?: string;
  };
  created: string;
}

export default function QuestionTypes() {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminQuestionTypesApi();
      const mapped: QuestionType[] = res.data.map((qt: AdminQuestionType) => ({
        id: qt.id,
        name: qt.name,
        code: qt.code,
        description: qt.description || '',
        isActive: qt.is_active,
        questions: 0,
        icon: '○',
        settings: { allowMultipleAnswers: false, showExplanation: true, timeLimit: 60, difficulty: 'Medium' },
        created: new Date(qt.created_at).toISOString().split('T')[0],
      }));
      setQuestionTypes(mapped);
    } catch (e: any) {
      setError(e?.message || 'Failed to load question types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAdd = () => {
    setSelectedQuestionType(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (questionType: QuestionType) => {
    setSelectedQuestionType(questionType);
    setIsDrawerOpen(true);
  };

  const handleDelete = (questionType: QuestionType) => {
    setSelectedQuestionType(questionType);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuestionType) return;
    try {
      await deleteAdminQuestionTypeApi(selectedQuestionType.id);
      await load();
      setSelectedQuestionType(null);
      setIsDeleteDrawerOpen(false);
      toast.success('Question type deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    }
  };

  const handleSave = async (formData: FormData) => {
    const questionTypeData = {
      id: selectedQuestionType?.id || Date.now(),
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      isActive: formData.get("isActive") === "on",
      settings: {
        allowMultipleAnswers: formData.get("allowMultipleAnswers") === "on",
        showExplanation: formData.get("showExplanation") === "on",
        timeLimit: parseInt(formData.get("timeLimit") as string) || 60,
        difficulty: formData.get("difficulty") as string,
      },
      questions: selectedQuestionType?.questions || 0,
      created: selectedQuestionType?.created || new Date().toISOString().split('T')[0],
    };
    try {
    if (selectedQuestionType) {
        await updateAdminQuestionTypeApi(selectedQuestionType.id, {
          name: questionTypeData.name,
          code: questionTypeData.code,
          description: questionTypeData.description,
          is_active: questionTypeData.isActive,
        });
        toast.success('Question type updated');
    } else {
        await createAdminQuestionTypeApi({
          name: questionTypeData.name,
          code: questionTypeData.code,
          description: questionTypeData.description,
          is_active: questionTypeData.isActive,
        });
        toast.success('Question type created');
    }
    setIsDrawerOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Save failed');
    }
  };

  const handleToggleStatus = (id: number) => {
    setQuestionTypes(prev => prev.map(qt => 
      qt.id === id ? { ...qt, isActive: !qt.isActive } : qt
    ));
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-success text-success-foreground" 
      : "bg-muted text-muted-foreground";
  };

  const filteredQuestionTypes = questionTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
                         (statusFilter === "active" && type.isActive) ||
                         (statusFilter === "inactive" && !type.isActive);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "icon" as keyof QuestionType,
      header: "Icon",
      render: (questionType: QuestionType) => (
        <div className="text-2xl">{questionType.icon}</div>
      ),
    },
    {
      key: "name" as keyof QuestionType,
      header: "Name",
      sortable: true,
      render: (questionType: QuestionType) => (
        <div>
          <div className="font-medium">{questionType.name}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {questionType.code}
          </Badge>
        </div>
      ),
    },
    {
      key: "description" as keyof QuestionType,
      header: "Description",
      render: (questionType: QuestionType) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {questionType.description}
          </p>
        </div>
      ),
    },
    {
      key: "questions" as keyof QuestionType,
      header: "Questions",
      sortable: true,
      render: (questionType: QuestionType) => (
        <div className="font-medium">{(questionType.questions || 0).toLocaleString()}</div>
      ),
    },
    {
      key: "isActive" as keyof QuestionType,
      header: "Status",
      sortable: true,
      render: (questionType: QuestionType) => (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={getStatusColor(questionType.isActive)}>
            {questionType.isActive ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={questionType.isActive}
            onCheckedChange={() => handleToggleStatus(questionType.id)}
          />
        </div>
      ),
    },
    {
      key: "created" as keyof QuestionType,
      header: "Created",
      sortable: true,
      render: (questionType: QuestionType) => questionType.created,
    },
  ];

  const actions = [
    {
      label: "Configure",
      icon: <Settings className="h-4 w-4" />,
      onClick: (questionType: QuestionType) => console.log("Configure", questionType),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const,
    },
  ];

  const activeCount = questionTypes.filter(qt => qt.isActive).length;
  const inactiveCount = questionTypes.filter(qt => !qt.isActive).length;
  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.questions, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Question Types
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage different types of questions and their formats
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Question Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <HelpCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionTypes.length}</div>
            <p className="text-xs text-success">Question formats</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Types</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">Currently available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Types</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCount}</div>
            <p className="text-xs text-muted-foreground">Not available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalQuestions || 0).toLocaleString()}</div>
            <p className="text-xs text-success">Across all types</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FiltersPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            id: "status",
            label: "Status",
            value: statusFilter,
            options: [
              { label: "All Statuses", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
        }}
        onExport={() => console.log("Export question types")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredQuestionTypes}
        columns={columns}
        actions={actions}
        emptyMessage="No question types found. Create your first question type to start building assessments."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedQuestionType ? "Edit Question Type" : "Create New Question Type"}
        description={selectedQuestionType ? "Update the question type details" : "Add a new question type for assessments"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Type Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedQuestionType?.name}
                placeholder="Enter question type name"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={selectedQuestionType?.code}
                placeholder="Enter unique code (e.g., MCQ, TF)"
                required
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                name="icon"
                defaultValue={selectedQuestionType?.icon}
                placeholder="Enter icon/emoji (e.g., ○, ✓, ___)"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedQuestionType?.description}
                placeholder="Describe this question type"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                name="isActive"
                defaultChecked={selectedQuestionType?.isActive ?? true}
              />
              <Label htmlFor="isActive">Active (Available for use)</Label>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Settings</h3>
              
              <div>
                <Label htmlFor="difficulty">Default Difficulty</Label>
                <Select name="difficulty" defaultValue={selectedQuestionType?.settings?.difficulty || "Medium"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeLimit">Default Time Limit (seconds)</Label>
                <Input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  min="10"
                  defaultValue={selectedQuestionType?.settings?.timeLimit || 60}
                  placeholder="60"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowMultipleAnswers"
                    name="allowMultipleAnswers"
                    defaultChecked={selectedQuestionType?.settings?.allowMultipleAnswers}
                  />
                  <Label htmlFor="allowMultipleAnswers">Allow Multiple Answers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showExplanation"
                    name="showExplanation"
                    defaultChecked={selectedQuestionType?.settings?.showExplanation ?? true}
                  />
                  <Label htmlFor="showExplanation">Show Explanation</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedQuestionType ? "Update Question Type" : "Create Question Type"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Question Type"
        description="Are you sure you want to delete this question type? All questions using this type will be affected."
        itemName={selectedQuestionType?.name}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Question Type"
        variant="destructive"
      />
    </div>
  );
}