import { useState } from "react";
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
  Zap,
  TrendingUp,
  BookOpen,
  Target,
  Award,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  isActive: boolean;
  questions: number;
  lessons: number;
  students: number;
  createdAt: string;
  updatedAt: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "1",
      name: "Problem Solving",
      code: "PS",
      description: "Analytical and critical thinking abilities to solve complex problems effectively",
      category: "Cognitive",
      level: "Advanced",
      isActive: true,
      questions: 1248,
      lessons: 45,
      students: 892,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "Mathematical Reasoning",
      code: "MR",
      description: "Numerical and logical mathematical skills for quantitative analysis",
      category: "Mathematics",
      level: "Intermediate",
      isActive: true,
      questions: 967,
      lessons: 38,
      students: 756,
      createdAt: "2024-01-14",
      updatedAt: "2024-01-19",
    },
    {
      id: "3",
      name: "Reading Comprehension",
      code: "RC",
      description: "Text understanding and interpretation skills for effective communication",
      category: "Language",
      level: "Beginner",
      isActive: true,
      questions: 834,
      lessons: 52,
      students: 1234,
      createdAt: "2024-01-13",
      updatedAt: "2024-01-18",
    },
    {
      id: "4",
      name: "Data Analysis",
      code: "DA",
      description: "Statistical and data interpretation skills for informed decision making",
      category: "Analytics",
      level: "Advanced",
      isActive: false,
      questions: 456,
      lessons: 29,
      students: 423,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-17",
    },
    {
      id: "5",
      name: "Critical Thinking",
      code: "CT",
      description: "Objective analysis and evaluation skills for better reasoning",
      category: "Cognitive",
      level: "Intermediate",
      isActive: true,
      questions: 723,
      lessons: 41,
      students: 678,
      createdAt: "2024-01-11",
      updatedAt: "2024-01-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    level: "Beginner" as Skill["level"],
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and search logic
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || skill.level === selectedLevel;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && skill.isActive) ||
                         (selectedStatus === "inactive" && !skill.isActive);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

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
        { value: "Cognitive", label: "Cognitive" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Language", label: "Language" },
        { value: "Analytics", label: "Analytics" },
        { value: "Science", label: "Science" },
        { value: "Technology", label: "Technology" }
      ]
    },
    {
      key: "level",
      type: "select" as const,
      label: "Level",
      value: selectedLevel,
      onChange: (value: string) => setSelectedLevel(value),
      options: [
        { value: "all", label: "All Levels" },
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" }
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
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-warning/10 text-warning";
      case "Advanced":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Cognitive":
        return "bg-primary/10 text-primary";
      case "Mathematics":
        return "bg-accent/10 text-accent";
      case "Language":
        return "bg-secondary/10 text-secondary-foreground";
      case "Analytics":
        return "bg-muted/10 text-muted-foreground";
      case "Science":
        return "bg-success/10 text-success";
      case "Technology":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
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
    setSelectedLevel("all"); 
    setSelectedStatus("all");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      category: "",
      level: "Beginner",
      isActive: true,
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedSkill(null);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      code: skill.code,
      description: skill.description,
      category: skill.category,
      level: skill.level,
      isActive: skill.isActive,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteDrawerOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.name || !formData.code || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if code already exists
    if (skills.some(skill => skill.code.toLowerCase() === formData.code.toLowerCase())) {
      toast.error("Skill code already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSkill: Skill = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        category: formData.category,
        level: formData.level,
        isActive: formData.isActive,
        questions: 0,
        lessons: 0,
        students: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setSkills(prev => [newSkill, ...prev]);
      setIsAddDrawerOpen(false);
      resetForm();
      toast.success("Skill created successfully!");
    } catch (error) {
      toast.error("Failed to create skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedSkill || !formData.name || !formData.code || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if code already exists (excluding current skill)
    if (skills.some(skill => 
      skill.id !== selectedSkill.id && 
      skill.code.toLowerCase() === formData.code.toLowerCase()
    )) {
      toast.error("Skill code already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSkills(prev => prev.map(skill => 
        skill.id === selectedSkill.id 
          ? {
              ...skill,
              name: formData.name,
              code: formData.code.toUpperCase(),
              description: formData.description,
              category: formData.category,
              level: formData.level,
              isActive: formData.isActive,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : skill
      ));

      setIsEditDrawerOpen(false);
      setSelectedSkill(null);
      resetForm();
      toast.success("Skill updated successfully!");
    } catch (error) {
      toast.error("Failed to update skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSkill) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSkills(prev => prev.filter(skill => skill.id !== selectedSkill.id));
      setIsDeleteDrawerOpen(false);
      setSelectedSkill(null);
      toast.success("Skill deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  // Table columns
  const columns = [
    {
      key: "name" as keyof Skill,
      header: "Skill",
      sortable: true,
      render: (skill: Skill) => (
        <div>
          <div className="font-semibold">{skill.name}</div>
          <div className="text-sm text-muted-foreground">
            Code: {skill.code}
          </div>
        </div>
      )
    },
    {
      key: "category" as keyof Skill,
      header: "Category",
      render: (skill: Skill) => (
        <Badge variant="outline" className={getCategoryColor(skill.category)}>
          {skill.category}
        </Badge>
      )
    },
    {
      key: "level" as keyof Skill,
      header: "Level",
      render: (skill: Skill) => (
        <Badge variant="outline" className={getLevelColor(skill.level)}>
          {skill.level}
        </Badge>
      )
    },
    {
      key: "description" as keyof Skill,
      header: "Description",
      render: (skill: Skill) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {skill.description}
        </div>
      )
    },
    {
      key: "questions" as keyof Skill,
      header: "Content",
      render: (skill: Skill) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Target className="mr-1 h-3 w-3" />
            {skill.questions} questions
          </div>
          <div className="flex items-center">
            <BookOpen className="mr-1 h-3 w-3" />
            {skill.lessons} lessons
          </div>
        </div>
      )
    },
    {
      key: "students" as keyof Skill,
      header: "Students",
      sortable: true,
      render: (skill: Skill) => (
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          {(skill.students || 0).toLocaleString()}
        </div>
      )
    },
    {
      key: "isActive" as keyof Skill,
      header: "Status",
      render: (skill: Skill) => (
        <Badge 
          variant="secondary" 
          className={skill.isActive ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}
        >
          {skill.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      key: "createdAt" as keyof Skill,
      header: "Created",
      sortable: true,
      render: (skill: Skill) => skill.createdAt
    }
  ];

  // Table actions
  const actions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (skill: Skill) => {
        toast.success(`Viewing skill: ${skill.name}`);
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
            Skills Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage learning skills and competencies for student development
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="text-xs text-success">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Skills</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skills.filter(s => s.isActive).length}
            </div>
            <p className="text-xs text-success">Ready for use</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skills.reduce((sum, s) => sum + (s.questions || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">Across all skills</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skills.reduce((sum, s) => sum + (s.students || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">Learning these skills</p>
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
            searchPlaceholder="Search skills, codes, descriptions..."
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={filteredSkills}
            columns={columns}
            actions={actions}
            emptyMessage="No skills found"
            onAdd={handleAdd}
          />
        </CardContent>
      </Card>

      {/* Add Skill Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Add New Skill"
        description="Create a new learning skill for student development"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Skill Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter skill name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="code" className="text-sm font-medium">
                Skill Code *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="Enter skill code (e.g., PS)"
                className="mt-1"
                maxLength={5}
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
                placeholder="Enter skill description"
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
                    <SelectItem value="Cognitive">Cognitive</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level" className="text-sm font-medium">
                  Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: value as Skill["level"] }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Skill will be available for use in courses and assessments
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
              {isSubmitting ? "Creating..." : "Create Skill"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Skill Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Skill"
        description="Update skill information and settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Skill Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter skill name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-code" className="text-sm font-medium">
                Skill Code *
              </Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="Enter skill code (e.g., PS)"
                className="mt-1"
                maxLength={5}
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
                placeholder="Enter skill description"
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
                    <SelectItem value="Cognitive">Cognitive</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-level" className="text-sm font-medium">
                  Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: value as Skill["level"] }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Skill will be available for use in courses and assessments
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
              {isSubmitting ? "Updating..." : "Update Skill"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Skill"
        description={`Are you sure you want to delete "${selectedSkill?.name}"? This action cannot be undone and will remove the skill from all courses and assessments.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Skill"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}