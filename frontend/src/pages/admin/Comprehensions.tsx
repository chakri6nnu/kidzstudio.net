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
  FileText,
  Hash,
  Target,
} from "lucide-react";

interface Comprehension {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  difficulty: string;
  questions: number;
  status: string;
  createdAt: string;
  passage?: string;
  wordCount?: number;
}

export default function Comprehensions() {
  const [comprehensions, setComprehensions] = useState<Comprehension[]>([
    {
      id: 1,
      title: "Climate Change and Global Warming",
      category: "Science",
      subCategory: "Environmental Science",
      difficulty: "Medium",
      questions: 5,
      status: "Active",
      createdAt: "2024-01-15",
      passage: "Climate change refers to long-term shifts in global temperatures and weather patterns...",
      wordCount: 450,
    },
    {
      id: 2,
      title: "The Industrial Revolution",
      category: "History",
      subCategory: "Modern History",
      difficulty: "High",
      questions: 8,
      status: "Draft",
      createdAt: "2024-01-14",
      passage: "The Industrial Revolution was a period of major industrialization and innovation...",
      wordCount: 623,
    },
    {
      id: 3,
      title: "Photosynthesis Process",
      category: "Biology",
      subCategory: "Plant Biology",
      difficulty: "Easy",
      questions: 6,
      status: "Active",
      createdAt: "2024-01-13",
      passage: "Photosynthesis is the process by which plants convert light energy into chemical energy...",
      wordCount: 380,
    },
    {
      id: 4,
      title: "Artificial Intelligence in Healthcare",
      category: "Technology",
      subCategory: "AI & Machine Learning",
      difficulty: "High",
      questions: 7,
      status: "Active",
      createdAt: "2024-01-12",
      passage: "Artificial Intelligence is revolutionizing the healthcare industry...",
      wordCount: 520,
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedComprehension, setSelectedComprehension] = useState<Comprehension | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleAdd = () => {
    setSelectedComprehension(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (comprehension: Comprehension) => {
    setSelectedComprehension(comprehension);
    setIsDrawerOpen(true);
  };

  const handleDelete = (comprehension: Comprehension) => {
    setSelectedComprehension(comprehension);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedComprehension) {
      setComprehensions(prev => prev.filter(c => c.id !== selectedComprehension.id));
      setSelectedComprehension(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const comprehensionData = {
      id: selectedComprehension?.id || Date.now(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      subCategory: formData.get("subCategory") as string,
      difficulty: formData.get("difficulty") as string,
      status: formData.get("status") as string,
      passage: formData.get("passage") as string,
      questions: selectedComprehension?.questions || 0,
      wordCount: (formData.get("passage") as string)?.split(' ').length || 0,
      createdAt: selectedComprehension?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (selectedComprehension) {
      setComprehensions(prev => prev.map(c => c.id === selectedComprehension.id ? comprehensionData : c));
    } else {
      setComprehensions(prev => [...prev, comprehensionData]);
    }
    setIsDrawerOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "High": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-success-foreground";
      case "Draft": return "bg-muted text-muted-foreground";
      case "Inactive": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const uniqueCategories = [...new Set(comprehensions.map(c => c.category))];

  const filteredComprehensions = comprehensions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || comp.status === statusFilter;
    const matchesDifficulty = !difficultyFilter || comp.difficulty === difficultyFilter;
    const matchesCategory = !categoryFilter || comp.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
  });

  const columns = [
    {
      key: "title" as keyof Comprehension,
      header: "Title",
      sortable: true,
      render: (comprehension: Comprehension) => (
        <div>
          <div className="font-medium">{comprehension.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {comprehension.wordCount} words
          </div>
        </div>
      ),
    },
    {
      key: "category" as keyof Comprehension,
      header: "Category",
      sortable: true,
      render: (comprehension: Comprehension) => (
        <div>
          <div className="font-medium">{comprehension.category}</div>
          <div className="text-xs text-muted-foreground">{comprehension.subCategory}</div>
        </div>
      ),
    },
    {
      key: "difficulty" as keyof Comprehension,
      header: "Difficulty",
      sortable: true,
      render: (comprehension: Comprehension) => (
        <Badge variant="secondary" className={getDifficultyColor(comprehension.difficulty)}>
          {comprehension.difficulty}
        </Badge>
      ),
    },
    {
      key: "questions" as keyof Comprehension,
      header: "Questions",
      sortable: true,
      render: (comprehension: Comprehension) => (
        <div className="font-medium">{comprehension.questions}</div>
      ),
    },
    {
      key: "status" as keyof Comprehension,
      header: "Status",
      sortable: true,
      render: (comprehension: Comprehension) => (
        <Badge variant="secondary" className={getStatusColor(comprehension.status)}>
          {comprehension.status}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof Comprehension,
      header: "Created",
      sortable: true,
      render: (comprehension: Comprehension) => comprehension.createdAt,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (comprehension: Comprehension) => console.log("View", comprehension),
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

  const activeCount = comprehensions.filter(c => c.status === "Active").length;
  const draftCount = comprehensions.filter(c => c.status === "Draft").length;
  const totalQuestions = comprehensions.reduce((sum, c) => sum + c.questions, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Comprehensions
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage reading comprehension passages and questions
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Comprehension
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comprehensions</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comprehensions.length}</div>
            <p className="text-xs text-success">Reading passages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">Published passages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">In development</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Hash className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <p className="text-xs text-success">Across all passages</p>
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
              { label: "Active", value: "Active" },
              { label: "Draft", value: "Draft" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            id: "difficulty",
            label: "Difficulty",
            value: difficultyFilter,
            options: [
              { label: "All Difficulties", value: "" },
              { label: "Easy", value: "Easy" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
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
          if (filterId === "category") setCategoryFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setDifficultyFilter("");
          setCategoryFilter("");
        }}
        onExport={() => console.log("Export comprehensions")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredComprehensions}
        columns={columns}
        actions={actions}
        emptyMessage="No comprehensions found. Create your first reading comprehension passage."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedComprehension ? "Edit Comprehension" : "Create New Comprehension"}
        description={selectedComprehension ? "Update the comprehension details" : "Add a new reading comprehension passage"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedComprehension?.title}
                placeholder="Enter comprehension title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={selectedComprehension?.category || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subCategory">Sub Category</Label>
                <Input
                  id="subCategory"
                  name="subCategory"
                  defaultValue={selectedComprehension?.subCategory}
                  placeholder="Enter sub category"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select name="difficulty" defaultValue={selectedComprehension?.difficulty || "Medium"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={selectedComprehension?.status || "Draft"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="passage">Passage</Label>
              <Textarea
                id="passage"
                name="passage"
                defaultValue={selectedComprehension?.passage}
                placeholder="Enter the reading comprehension passage"
                rows={8}
                className="min-h-[200px]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedComprehension ? "Update Comprehension" : "Create Comprehension"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Comprehension"
        description="Are you sure you want to delete this comprehension passage? All associated questions will also be deleted."
        itemName={selectedComprehension?.title}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Comprehension"
        variant="destructive"
      />
    </div>
  );
}