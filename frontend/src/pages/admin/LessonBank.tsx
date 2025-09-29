import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Clock,
  Play,
  FileText,
  Monitor,
  Hash,
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  difficulty: string;
  duration: string;
  type: string;
  status: string;
  views: number;
  createdAt: string;
  description?: string;
  content?: string;
}

export default function LessonBank() {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Introduction to Algebra",
      category: "Mathematics",
      subCategory: "Algebra",
      difficulty: "Beginner",
      duration: "45 min",
      type: "Interactive",
      status: "Published",
      views: 1248,
      createdAt: "2024-01-15",
      description: "Basic concepts of algebraic expressions and equations",
      content: "This lesson covers fundamental algebraic concepts...",
    },
    {
      id: 2,
      title: "Photosynthesis Process",
      category: "Biology",
      subCategory: "Plant Biology",
      difficulty: "Intermediate",
      duration: "30 min",
      type: "Video",
      status: "Draft",
      views: 567,
      createdAt: "2024-01-14",
      description: "Understanding how plants convert light energy to chemical energy",
      content: "Photosynthesis is a complex biological process...",
    },
    {
      id: 3,
      title: "World War II History",
      category: "History",
      subCategory: "Modern History",
      difficulty: "Advanced",
      duration: "60 min",
      type: "Text",
      status: "Published",
      views: 892,
      createdAt: "2024-01-13",
      description: "Comprehensive overview of World War II events and consequences",
      content: "World War II was a global conflict that lasted from 1939 to 1945...",
    },
    {
      id: 4,
      title: "English Grammar Basics",
      category: "English",
      subCategory: "Grammar",
      difficulty: "Beginner",
      duration: "25 min",
      type: "Interactive",
      status: "Published",
      views: 1456,
      createdAt: "2024-01-12",
      description: "Essential grammar rules and sentence structure",
      content: "Understanding grammar is fundamental to effective communication...",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleAdd = () => {
    setSelectedLesson(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDrawerOpen(true);
  };

  const handleDelete = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLesson) {
      setLessons(prev => prev.filter(l => l.id !== selectedLesson.id));
      setSelectedLesson(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const lessonData = {
      id: selectedLesson?.id || Date.now(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      subCategory: formData.get("subCategory") as string,
      difficulty: formData.get("difficulty") as string,
      duration: formData.get("duration") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      views: selectedLesson?.views || 0,
      createdAt: selectedLesson?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (selectedLesson) {
      setLessons(prev => prev.map(l => l.id === selectedLesson.id ? lessonData : l));
    } else {
      setLessons(prev => [...prev, lessonData]);
    }
    setIsDrawerOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success text-success-foreground";
      case "Intermediate": return "bg-warning text-warning-foreground";
      case "Advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-success text-success-foreground";
      case "Draft": return "bg-muted text-muted-foreground";
      case "Archived": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Interactive": return "bg-primary text-primary-foreground";
      case "Video": return "bg-accent text-accent-foreground";
      case "Text": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Interactive": return <Monitor className="h-3 w-3" />;
      case "Video": return <Play className="h-3 w-3" />;
      case "Text": return <FileText className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const uniqueCategories = [...new Set(lessons.map(l => l.category))];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lesson.status === statusFilter;
    const matchesDifficulty = !difficultyFilter || lesson.difficulty === difficultyFilter;
    const matchesType = !typeFilter || lesson.type === typeFilter;
    const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesDifficulty && matchesType && matchesCategory;
  });

  const columns = [
    {
      key: "title" as keyof Lesson,
      header: "Title",
      sortable: true,
      render: (lesson: Lesson) => (
        <div>
          <div className="font-medium">{lesson.title}</div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {lesson.description}
          </div>
        </div>
      ),
    },
    {
      key: "category" as keyof Lesson,
      header: "Category",
      sortable: true,
      render: (lesson: Lesson) => (
        <div>
          <div className="font-medium">{lesson.category}</div>
          <div className="text-xs text-muted-foreground">{lesson.subCategory}</div>
        </div>
      ),
    },
    {
      key: "difficulty" as keyof Lesson,
      header: "Difficulty",
      sortable: true,
      render: (lesson: Lesson) => (
        <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
          {lesson.difficulty}
        </Badge>
      ),
    },
    {
      key: "duration" as keyof Lesson,
      header: "Duration",
      render: (lesson: Lesson) => (
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
          {lesson.duration}
        </div>
      ),
    },
    {
      key: "type" as keyof Lesson,
      header: "Type",
      sortable: true,
      render: (lesson: Lesson) => (
        <Badge variant="secondary" className={getTypeColor(lesson.type)}>
          <div className="flex items-center">
            {getTypeIcon(lesson.type)}
            <span className="ml-1">{lesson.type}</span>
          </div>
        </Badge>
      ),
    },
    {
      key: "views" as keyof Lesson,
      header: "Views",
      sortable: true,
      render: (lesson: Lesson) => (
        <div className="font-medium">{(lesson.views || 0).toLocaleString()}</div>
      ),
    },
    {
      key: "status" as keyof Lesson,
      header: "Status",
      sortable: true,
      render: (lesson: Lesson) => (
        <Badge variant="secondary" className={getStatusColor(lesson.status)}>
          {lesson.status}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof Lesson,
      header: "Created",
      sortable: true,
      render: (lesson: Lesson) => lesson.createdAt,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (lesson: Lesson) => console.log("View", lesson),
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

  const publishedCount = lessons.filter(l => l.status === "Published").length;
  const draftCount = lessons.filter(l => l.status === "Draft").length;
  const totalViews = lessons.reduce((sum, l) => sum + l.views, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Lesson Bank
          </h1>
          <p className="text-muted-foreground mt-2">
            Repository of educational lessons and learning materials
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
            <p className="text-xs text-success">Learning materials</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-success">Available lessons</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">In development</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalViews / 1000).toFixed(1)}K</div>
            <p className="text-xs text-success">Student engagement</p>
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
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
              { label: "Archived", value: "Archived" },
            ],
          },
          {
            id: "difficulty",
            label: "Difficulty",
            value: difficultyFilter,
            options: [
              { label: "All Difficulties", value: "" },
              { label: "Beginner", value: "Beginner" },
              { label: "Intermediate", value: "Intermediate" },
              { label: "Advanced", value: "Advanced" },
            ],
          },
          {
            id: "type",
            label: "Type",
            value: typeFilter,
            options: [
              { label: "All Types", value: "" },
              { label: "Interactive", value: "Interactive" },
              { label: "Video", value: "Video" },
              { label: "Text", value: "Text" },
            ],
          },
          {
            id: "category",
            label: "Category",
            value: categoryFilter,
            options: [
              { label: "All Categories", value: "" },
              ...uniqueCategories.map(cat => ({ label: cat, value: cat })),
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
          if (filterId === "difficulty") setDifficultyFilter(value);
          if (filterId === "type") setTypeFilter(value);
          if (filterId === "category") setCategoryFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setDifficultyFilter("");
          setTypeFilter("");
          setCategoryFilter("");
        }}
        onExport={() => console.log("Export lessons")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredLessons}
        columns={columns}
        actions={actions}
        emptyMessage="No lessons found. Create your first lesson to start building educational content."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedLesson ? "Edit Lesson" : "Create New Lesson"}
        description={selectedLesson ? "Update the lesson details" : "Add a new lesson to the bank"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedLesson?.title}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedLesson?.description}
                placeholder="Brief description of the lesson"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={selectedLesson?.category || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory">Sub Category</Label>
                <Input
                  id="subCategory"
                  name="subCategory"
                  defaultValue={selectedLesson?.subCategory}
                  placeholder="Enter sub category"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select name="difficulty" defaultValue={selectedLesson?.difficulty || "Beginner"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Lesson Type</Label>
                <Select name="type" defaultValue={selectedLesson?.type || "Interactive"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interactive">Interactive</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={selectedLesson?.duration}
                  placeholder="e.g., 30 min"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedLesson?.status || "Draft"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Lesson Content</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={selectedLesson?.content}
                placeholder="Enter the lesson content and materials"
                rows={8}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedLesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Lesson"
        description="Are you sure you want to delete this lesson? This action cannot be undone."
        itemName={selectedLesson?.title}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Lesson"
        variant="destructive"
      />
    </div>
  );
}