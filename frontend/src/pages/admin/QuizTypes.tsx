import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Target,
  CheckCircle,
  Hash,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface QuizType {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  quizCount: number;
  participants: number;
  avgDuration: number;
  createdAt: string;
  updatedAt: string;
}

export default function QuizTypes() {
  const [quizTypes, setQuizTypes] = useState<QuizType[]>([
    {
      id: "1",
      code: "qtp_XuodMqpXNI",
      name: "Quiz",
      description: "Standard quiz format with multiple choice and short answer questions",
      color: "#3B82F6",
      isActive: true,
      quizCount: 45,
      participants: 1234,
      avgDuration: 15,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2", 
      code: "qtp_ugGmmXNldue",
      name: "Contest",
      description: "Competitive quiz format with leaderboards and time pressure",
      color: "#10B981",
      isActive: true,
      quizCount: 32,
      participants: 892,
      avgDuration: 20,
      createdAt: "2024-01-14",
      updatedAt: "2024-01-19",
    },
    {
      id: "3",
      code: "qtp_XXbmdpjqjVSE",
      name: "Daily Challenge",
      description: "Daily quiz challenges to maintain engagement and learning momentum",
      color: "#8B5CF6",
      isActive: true,
      quizCount: 18,
      participants: 567,
      avgDuration: 10,
      createdAt: "2024-01-13",
      updatedAt: "2024-01-18",
    },
    {
      id: "4",
      code: "qtp_6U77bbemc",
      name: "Daily Task",
      description: "Task-based quiz format focusing on practical applications",
      color: "#F59E0B",
      isActive: true,
      quizCount: 28,
      participants: 445,
      avgDuration: 12,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-17",
    },
    {
      id: "5",
      code: "qtp_pWUdPRpML7",
      name: "Hackathon",
      description: "Collaborative quiz format for team-based problem solving",
      color: "#EF4444",
      isActive: false,
      quizCount: 12,
      participants: 234,
      avgDuration: 60,
      createdAt: "2024-01-11",
      updatedAt: "2024-01-16",
    },
    {
      id: "6",
      code: "qtp_ddcdEdEdg4",
      name: "Assignment",
      description: "Assignment-style quiz with extended time and detailed responses",
      color: "#6366F1",
      isActive: true,
      quizCount: 23,
      participants: 356,
      avgDuration: 45,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState<QuizType | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and search logic
  const filteredQuizTypes = quizTypes.filter(quizType => {
    const matchesSearch = quizType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quizType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quizType.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && quizType.isActive) ||
                         (selectedStatus === "inactive" && !quizType.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Filter options
  const filters = [
    {
      key: "status",
      type: "select" as const,
      label: "Status",
      value: selectedStatus,
      onChange: (value: string) => setSelectedStatus(value),
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    }
  ];

  // CRUD operations
  const handleFilterChange = (filterId: string, value: string) => {
    const filter = filters.find(f => f.key === filterId);
    if (filter) {
      filter.onChange(value);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedQuizType(null);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (quizType: QuizType) => {
    setSelectedQuizType(quizType);
    setFormData({
      name: quizType.name,
      description: quizType.description,
      color: quizType.color,
      isActive: quizType.isActive,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (quizType: QuizType) => {
    setSelectedQuizType(quizType);
    setIsDeleteDrawerOpen(true);
  };

  const generateQuizTypeCode = () => {
    return `qtp_${Math.random().toString(36).substr(2, 12)}`;
  };

  const handleAddSubmit = async () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if name already exists
    if (quizTypes.some(qt => qt.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error("Quiz type name already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newQuizType: QuizType = {
        id: Date.now().toString(),
        code: generateQuizTypeCode(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isActive: formData.isActive,
        quizCount: 0,
        participants: 0,
        avgDuration: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setQuizTypes(prev => [newQuizType, ...prev]);
      setIsAddDrawerOpen(false);
      resetForm();
      toast.success("Quiz type created successfully!");
    } catch (error) {
      toast.error("Failed to create quiz type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedQuizType || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if name already exists (excluding current quiz type)
    if (quizTypes.some(qt => 
      qt.id !== selectedQuizType.id && 
      qt.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      toast.error("Quiz type name already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setQuizTypes(prev => prev.map(quizType => 
        quizType.id === selectedQuizType.id 
          ? {
              ...quizType,
              name: formData.name,
              description: formData.description,
              color: formData.color,
              isActive: formData.isActive,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : quizType
      ));

      setIsEditDrawerOpen(false);
      setSelectedQuizType(null);
      resetForm();
      toast.success("Quiz type updated successfully!");
    } catch (error) {
      toast.error("Failed to update quiz type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuizType) return;

    // Check if quiz type is in use
    if (selectedQuizType.quizCount > 0) {
      toast.error("Cannot delete quiz type that is currently being used in quizzes");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuizTypes(prev => prev.filter(qt => qt.id !== selectedQuizType.id));
      setIsDeleteDrawerOpen(false);
      setSelectedQuizType(null);
      toast.success("Quiz type deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete quiz type");
    }
  };

  // Table columns
  const columns = [
    {
      key: "name" as keyof QuizType,
      header: "Quiz Type",
      sortable: true,
      render: (quizType: QuizType) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: quizType.color }}
          />
          <div>
            <div className="font-semibold">{quizType.name}</div>
            <div className="text-sm text-muted-foreground">
              {quizType.code}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "description" as keyof QuizType,
      header: "Description",
      render: (quizType: QuizType) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {quizType.description}
        </div>
      )
    },
    {
      key: "quizCount" as keyof QuizType,
      header: "Usage",
      sortable: true,
      render: (quizType: QuizType) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Target className="mr-1 h-3 w-3" />
            {quizType.quizCount} quizzes
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-3 w-3" />
            {(quizType.participants || 0).toLocaleString()} participants
          </div>
        </div>
      )
    },
    {
      key: "avgDuration" as keyof QuizType,
      header: "Avg Duration",
      render: (quizType: QuizType) => (
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {quizType.avgDuration} min
        </div>
      )
    },
    {
      key: "isActive" as keyof QuizType,
      header: "Status",
      render: (quizType: QuizType) => (
        <Badge 
          variant="secondary" 
          className={quizType.isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
        >
          {quizType.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      key: "createdAt" as keyof QuizType,
      header: "Created",
      sortable: true,
      render: (quizType: QuizType) => quizType.createdAt
    }
  ];

  // Table actions
  const actions = [
    {
      label: "View Usage",
      icon: <Eye className="h-4 w-4" />,
      onClick: (quizType: QuizType) => {
        toast.success(`Viewing usage for: ${quizType.name}`);
      }
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Quiz Types Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage different types of quizzes and their configurations
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Quiz Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizTypes.length}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Types</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizTypes.filter(qt => qt.isActive).length}
            </div>
            <p className="text-xs text-success">Ready for use</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Hash className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizTypes.reduce((sum, qt) => sum + qt.quizCount, 0)}
            </div>
            <p className="text-xs text-success">Using these types</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizTypes.reduce((sum, qt) => sum + (qt.participants || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => toast.success("Export started")}
            searchPlaceholder="Search quiz types, codes, descriptions..."
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={filteredQuizTypes}
            columns={columns}
            actions={actions}
            emptyMessage="No quiz types found"
            onAdd={handleAdd}
          />
        </CardContent>
      </Card>

      {/* Add Quiz Type Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Add New Quiz Type"
        description="Create a new quiz type with custom configuration"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Quiz Type Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter quiz type name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz type description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="color" className="text-sm font-medium">
                Color *
              </Label>
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10 rounded border-0 p-0 cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Quiz type will be available for creating new quizzes
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>

            {/* Type Preview */}
            <div className="rounded-lg border p-3">
              <Label className="text-sm font-medium block mb-2">Preview</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: formData.color }}
                />
                <Badge variant="outline" style={{ color: formData.color, borderColor: formData.color }}>
                  {formData.name || "Quiz Type Name"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? "Creating..." : "Create Quiz Type"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Quiz Type Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Quiz Type"
        description="Update quiz type information and settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Quiz Type Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter quiz type name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz type description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="edit-color" className="text-sm font-medium">
                Color *
              </Label>
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10 rounded border-0 p-0 cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Quiz type will be available for creating new quizzes
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>

            {/* Usage Warning */}
            {selectedQuizType && selectedQuizType.quizCount > 0 && (
              <div className="rounded-lg border border-warning bg-warning/5 p-3">
                <div className="flex items-start space-x-2">
                  <Hash className="h-4 w-4 text-warning mt-0.5" />
                  <div>
                    <Label className="text-sm font-medium text-warning">In Use</Label>
                    <div className="text-sm text-muted-foreground">
                      This quiz type is currently used in {selectedQuizType.quizCount} quizzes. 
                      Changes may affect existing content.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Type Preview */}
            <div className="rounded-lg border p-3">
              <Label className="text-sm font-medium block mb-2">Preview</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: formData.color }}
                />
                <Badge variant="outline" style={{ color: formData.color, borderColor: formData.color }}>
                  {formData.name || "Quiz Type Name"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? "Updating..." : "Update Quiz Type"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Quiz Type"
        description={`Are you sure you want to delete "${selectedQuizType?.name}"? This action cannot be undone and will affect ${selectedQuizType?.quizCount || 0} existing quizzes.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Quiz Type"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}