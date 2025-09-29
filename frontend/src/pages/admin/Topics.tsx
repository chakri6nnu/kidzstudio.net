import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Layers,
  Hash,
  Target,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTopicsApi,
  createTopicApi,
  updateTopicApi,
  deleteTopicApi,
  getCategoriesApi,
  getSkillsApi,
  type Topic as ApiTopic,
  type Category as ApiCategory,
  type Skill as ApiSkill,
} from "@/lib/utils";

interface Topic {
  id: string;
  name: string;
  description: string;
  category: string;
  parentTopic: string | null;
  isActive: boolean;
  questions: number;
  subTopics: number;
  students: number;
  createdAt: string;
  updatedAt: string;
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [skills, setSkills] = useState<ApiSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Load topics, categories, and skills from API
  const loadTopics = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: { search?: string; status?: string; category_id?: string; skill_id?: string; per_page?: number } = {
        search: searchTerm || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        category_id: selectedCategory !== "all" ? selectedCategory : undefined,
        skill_id: selectedSkill !== "all" ? selectedSkill : undefined,
      };
      const response = await getTopicsApi(filters);
      
      // Map API response to UI format
      const mappedTopics: Topic[] = response.data.map((t: ApiTopic) => ({
        id: t.id.toString(),
        name: t.name,
        description: t.description || "",
        category: t.category.name,
        parentTopic: null, // Topics don't have parent topics in this structure
        isActive: t.is_active,
        questions: t.questions_count || 0,
        subTopics: 0, // Not available in API
        students: 0, // Not available in API
        createdAt: new Date(t.created_at).toLocaleDateString(),
        updatedAt: new Date(t.updated_at).toLocaleDateString(),
      }));
      
      setTopics(mappedTopics);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load topics");
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategoriesApi({});
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadSkills = async () => {
    try {
      const response = await getSkillsApi({});
      setSkills(response.data);
    } catch (err: any) {
      console.error("Failed to load skills:", err);
    }
  };

  useEffect(() => {
    loadTopics();
    loadCategories();
    loadSkills();
  }, [searchTerm, selectedStatus, selectedCategory, selectedSkill]);
  
  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    parentTopic: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  // Filter options
  const filters = [
    {
      key: "category",
      type: "select" as const,
      label: "Category",
      value: selectedCategory,
      onChange: (value: string) => setSelectedCategory(value),
      options: [
        { value: "all", label: "All Categories" },
        ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
      ]
    },
    {
      key: "skill",
      type: "select" as const,
      label: "Skill",
      value: selectedSkill,
      onChange: (value: string) => setSelectedSkill(value),
      options: [
        { value: "all", label: "All Skills" },
        ...skills.map(skill => ({ value: skill.id.toString(), label: skill.name }))
      ]
    },
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

  // Helper functions
  const getTopicType = (topic: Topic) => {
    return topic.parentTopic ? "Sub Topic" : "Main Topic";
  };

  const getTypeColor = (topic: Topic) => {
    return topic.parentTopic 
      ? "bg-primary/10 text-primary"
      : "bg-accent/10 text-accent";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mathematics":
        return "bg-success/10 text-success";
      case "English":
        return "bg-warning/10 text-warning";
      case "Science":
        return "bg-destructive/10 text-destructive";
      case "History":
        return "bg-secondary/10 text-secondary-foreground";
      case "Geography":
        return "bg-muted/10 text-muted-foreground";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  // CRUD operations
  const handleFilterChange = (filterId: string, value: string) => {
    const filter = filters.find(f => f.key === filterId);
    if (filter) {
      filter.onChange(value);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSkill("all");
    setSelectedStatus("all");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      parentTopic: "",
      isActive: true,
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedTopic(null);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (topic: Topic) => {
    setSelectedTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      category: topic.category,
      parentTopic: topic.parentTopic || "",
      isActive: topic.isActive,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDeleteDrawerOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const topicData = {
        name: formData.name,
        description: formData.description,
        category_id: parseInt(formData.category),
        skill_id: formData.parentTopic ? parseInt(formData.parentTopic) : undefined,
        is_active: formData.isActive,
      };

      await createTopicApi(topicData);
      setIsAddDrawerOpen(false);
      resetForm();
      toast.success("Topic created successfully!");
      loadTopics(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to create topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedTopic || !formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const topicData = {
        name: formData.name,
        description: formData.description,
        category_id: parseInt(formData.category),
        skill_id: formData.parentTopic ? parseInt(formData.parentTopic) : undefined,
        is_active: formData.isActive,
      };

      await updateTopicApi(parseInt(selectedTopic.id), topicData);
      setIsEditDrawerOpen(false);
      setSelectedTopic(null);
      resetForm();
      toast.success("Topic updated successfully!");
      loadTopics(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to update topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTopic) return;

    try {
      await deleteTopicApi(parseInt(selectedTopic.id));
      setIsDeleteDrawerOpen(false);
      setSelectedTopic(null);
      toast.success("Topic deleted successfully!");
      loadTopics(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete topic");
    }
  };

  // Table columns
  const columns = [
    {
      key: "name" as keyof Topic,
      header: "Topic",
      sortable: true,
      render: (topic: Topic) => (
        <div className="flex items-center space-x-2">
          {topic.parentTopic && (
            <>
              <span className="text-muted-foreground text-sm">{topic.parentTopic}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </>
          )}
          <div>
            <div className="font-semibold">{topic.name}</div>
            <Badge variant="outline" className={getTypeColor(topic)}>
              {getTopicType(topic)}
            </Badge>
          </div>
        </div>
      )
    },
    {
      key: "category" as keyof Topic,
      header: "Category",
      render: (topic: Topic) => (
        <Badge variant="outline" className={getCategoryColor(topic.category)}>
          {topic.category}
        </Badge>
      )
    },
    {
      key: "description" as keyof Topic,
      header: "Description",
      render: (topic: Topic) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {topic.description}
        </div>
      )
    },
    {
      key: "questions" as keyof Topic,
      header: "Content",
      render: (topic: Topic) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Hash className="mr-1 h-3 w-3" />
            {topic.questions} questions
          </div>
          {topic.subTopics > 0 && (
            <div className="flex items-center text-muted-foreground">
              <Layers className="mr-1 h-3 w-3" />
              {topic.subTopics} sub-topics
            </div>
          )}
        </div>
      )
    },
    {
      key: "students" as keyof Topic,
      header: "Students",
      sortable: true,
      render: (topic: Topic) => (
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          {(topic.students || 0).toLocaleString()}
        </div>
      )
    },
    {
      key: "isActive" as keyof Topic,
      header: "Status",
      render: (topic: Topic) => (
        <Badge 
          variant="secondary" 
          className={topic.isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
        >
          {topic.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      key: "createdAt" as keyof Topic,
      header: "Created",
      sortable: true,
      render: (topic: Topic) => topic.createdAt
    }
  ];

  // Table actions
  const actions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (topic: Topic) => {
        toast.success(`Viewing topic: ${topic.name}`);
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

  // Statistics
  const mainTopics = topics.filter(t => !t.parentTopic);
  const subTopics = topics.filter(t => t.parentTopic);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Topics Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize content by topics and subtopics for structured learning
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Topics</CardTitle>
            <Layers className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mainTopics.length}</div>
            <p className="text-xs text-success">Primary categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Topics</CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subTopics.length}</div>
            <p className="text-xs text-success">Nested topics</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Hash className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((sum, t) => sum + (t.questions || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">Across all topics</p>
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
            searchPlaceholder="Search topics, categories, descriptions..."
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={topics}
            columns={columns}
            actions={actions}
            emptyMessage="No topics found"
            onAdd={handleAdd}
            loading={loading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Add Topic Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Add New Topic"
        description="Create a new topic for organizing educational content"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Topic Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter topic name"
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
                placeholder="Enter topic description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parentTopic" className="text-sm font-medium">
                  Parent Topic (Optional)
                </Label>
                <Select
                  value={formData.parentTopic}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentTopic: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Main Topic)</SelectItem>
                    {parentTopics.map(topic => (
                      <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Topic will be available for use in courses and assessments
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
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
              {isSubmitting ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Topic Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Topic"
        description="Update topic information and settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Topic Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter topic name"
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
                placeholder="Enter topic description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-parentTopic" className="text-sm font-medium">
                  Parent Topic (Optional)
                </Label>
                <Select
                  value={formData.parentTopic}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentTopic: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Main Topic)</SelectItem>
                    {parentTopics
                      .filter(topic => topic.id !== selectedTopic?.id) // Don't allow self as parent
                      .map(topic => (
                        <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Topic will be available for use in courses and assessments
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
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
              {isSubmitting ? "Updating..." : "Update Topic"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Topic"
        description={`Are you sure you want to delete "${selectedTopic?.name}"? This action cannot be undone and will remove the topic from all courses and assessments.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Topic"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}