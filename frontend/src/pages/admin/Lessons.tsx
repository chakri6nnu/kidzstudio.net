import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Settings,
  Filter,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";

interface AssignedLesson {
  id: number;
  title: string;
  code: string;
  topic: string;
  tag: string;
  difficulty: string;
  status: string;
  assignedAt: string;
  progress?: number;
  completionRate?: number;
}

export default function Lessons() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [assignedLessons, setAssignedLessons] = useState<AssignedLesson[]>([
    {
      id: 1,
      title: "Creative Writing Fundamentals",
      code: "CW001",
      topic: "Word usage",
      tag: "beginner",
      difficulty: "Easy",
      status: "Active",
      assignedAt: "2024-01-15",
      progress: 75,
      completionRate: 68,
    },
    {
      id: 2,
      title: "Sentence Construction",
      code: "CW002",
      topic: "Grammar",
      tag: "intermediate",
      difficulty: "Medium",
      status: "Active",
      assignedAt: "2024-01-14",
      progress: 45,
      completionRate: 82,
    },
    {
      id: 3,
      title: "Punctuation Mastery",
      code: "CW003",
      topic: "Punctuation",
      tag: "beginner",
      difficulty: "Easy",
      status: "Draft",
      assignedAt: "2024-01-13",
      progress: 0,
      completionRate: 0,
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<AssignedLesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const [filters, setFilters] = useState({
    code: "",
    topic: "",
    byTag: "",
    difficulty: {
      veryEasy: false,
      easy: false,
      medium: false,
      high: false,
      veryHigh: false,
    },
  });

  const handleAdd = () => {
    setSelectedLesson(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (lesson: AssignedLesson) => {
    setSelectedLesson(lesson);
    setIsDrawerOpen(true);
  };

  const handleDelete = (lesson: AssignedLesson) => {
    setSelectedLesson(lesson);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLesson) {
      setAssignedLessons(prev => prev.filter(l => l.id !== selectedLesson.id));
      setSelectedLesson(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const lessonData = {
      id: selectedLesson?.id || Date.now(),
      title: formData.get("title") as string,
      code: formData.get("code") as string,
      topic: formData.get("topic") as string,
      tag: formData.get("tag") as string,
      difficulty: formData.get("difficulty") as string,
      status: formData.get("status") as string,
      assignedAt: selectedLesson?.assignedAt || new Date().toISOString().split('T')[0],
      progress: selectedLesson?.progress || 0,
      completionRate: selectedLesson?.completionRate || 0,
    };

    if (selectedLesson) {
      setAssignedLessons(prev => prev.map(l => l.id === selectedLesson.id ? lessonData : l));
    } else {
      setAssignedLessons(prev => [...prev, lessonData]);
    }
    setIsDrawerOpen(false);
  };

  const handleDifficultyChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      difficulty: {
        ...prev.difficulty,
        [level]: checked,
      },
    }));
  };

  const handleReset = () => {
    setFilters({
      code: "",
      topic: "",
      byTag: "",
      difficulty: {
        veryEasy: false,
        easy: false,
        medium: false,
        high: false,
        veryHigh: false,
      },
    });
  };

  const handleProceed = () => {
    if (selectedSubCategory && selectedSkill) {
      setIsConfigured(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-success-foreground";
      case "Draft": return "bg-muted text-muted-foreground";
      case "Completed": return "bg-primary text-primary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredLessons = assignedLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lesson.status === statusFilter;
    const matchesDifficulty = !difficultyFilter || lesson.difficulty === difficultyFilter;
    const matchesTag = !tagFilter || lesson.tag === tagFilter;
    return matchesSearch && matchesStatus && matchesDifficulty && matchesTag;
  });

  const columns = [
    {
      key: "title" as keyof AssignedLesson,
      header: "Lesson",
      sortable: true,
      render: (lesson: AssignedLesson) => (
        <div>
          <div className="font-medium">{lesson.title}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {lesson.code}
          </Badge>
        </div>
      ),
    },
    {
      key: "topic" as keyof AssignedLesson,
      header: "Topic",
      sortable: true,
      render: (lesson: AssignedLesson) => lesson.topic,
    },
    {
      key: "tag" as keyof AssignedLesson,
      header: "Tag",
      render: (lesson: AssignedLesson) => (
        <Badge variant="secondary">{lesson.tag}</Badge>
      ),
    },
    {
      key: "difficulty" as keyof AssignedLesson,
      header: "Difficulty",
      sortable: true,
      render: (lesson: AssignedLesson) => (
        <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
          {lesson.difficulty}
        </Badge>
      ),
    },
    {
      key: "progress" as keyof AssignedLesson,
      header: "Progress",
      sortable: true,
      render: (lesson: AssignedLesson) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${lesson.progress || 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{lesson.progress || 0}%</span>
        </div>
      ),
    },
    {
      key: "completionRate" as keyof AssignedLesson,
      header: "Completion Rate",
      sortable: true,
      render: (lesson: AssignedLesson) => (
        <div className="font-medium">{lesson.completionRate || 0}%</div>
      ),
    },
    {
      key: "status" as keyof AssignedLesson,
      header: "Status",
      sortable: true,
      render: (lesson: AssignedLesson) => (
        <Badge variant="secondary" className={getStatusColor(lesson.status)}>
          {lesson.status}
        </Badge>
      ),
    },
    {
      key: "assignedAt" as keyof AssignedLesson,
      header: "Assigned",
      sortable: true,
      render: (lesson: AssignedLesson) => lesson.assignedAt,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (lesson: AssignedLesson) => console.log("View", lesson),
    },
    {
      label: "Edit Assignment",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Remove",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const,
    },
  ];

  if (!isConfigured) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Configure Lessons
            </h1>
            <p className="text-muted-foreground mt-2">
              Add Lessons to Learning Path
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="default" className="bg-gradient-primary">
              <span className="bg-primary-foreground text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              Choose Skill
            </Button>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Button variant="outline" disabled>
              <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              Add/Remove Lessons
            </Button>
          </div>
        </div>

        {/* Configuration Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Choose Sub Category & Skill</CardTitle>
            <CardDescription>
              Select the sub category and skill to configure lessons for learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category <span className="text-destructive">*</span></Label>
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative-writing">Creative & Essay Writing</SelectItem>
                  <SelectItem value="grammar">English Grammar</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skill <span className="text-destructive">*</span></Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word-usage">Word usage, sentence construction, punctuation, spelling</SelectItem>
                  <SelectItem value="essay-writing">Essay writing and composition</SelectItem>
                  <SelectItem value="grammar-rules">Grammar rules and application</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary building</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleProceed}
                disabled={!selectedSubCategory || !selectedSkill}
                className="bg-gradient-primary hover:bg-primary-hover"
              >
                PROCEED
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeCount = assignedLessons.filter(l => l.status === "Active").length;
  const draftCount = assignedLessons.filter(l => l.status === "Draft").length;
  const completedCount = assignedLessons.filter(l => l.status === "Completed").length;
  const avgProgress = assignedLessons.reduce((sum, l) => sum + (l.progress || 0), 0) / assignedLessons.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Configure Lessons
          </h1>
          <p className="text-muted-foreground mt-2">
            Creative & Essay Writing - Word usage, sentence construction, punctuation, spelling Lessons
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsConfigured(false)}>
            <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            Choose Skill
          </Button>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Button className="bg-gradient-primary">
            <span className="bg-primary-foreground text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            Add/Remove Lessons
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">Currently assigned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Lessons</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Pending assignment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-primary">Finished lessons</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Settings className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgProgress)}%</div>
            <p className="text-xs text-accent">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Lesson Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="Lesson code"
                  value={filters.code}
                  onChange={(e) => setFilters(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Lesson topic"
                  value={filters.topic}
                  onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="byTag">By Tag</Label>
                <Select value={filters.byTag} onValueChange={(value) => setFilters(prev => ({ ...prev, byTag: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Difficulty Level</Label>
                <div className="space-y-2">
                  {[
                    { key: "veryEasy", label: "Very Easy" },
                    { key: "easy", label: "Easy" },
                    { key: "medium", label: "Medium" },
                    { key: "high", label: "High" },
                    { key: "veryHigh", label: "Very High" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={filters.difficulty[key as keyof typeof filters.difficulty]}
                        onCheckedChange={(checked) => handleDifficultyChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  className="flex-1"
                  size="sm"
                >
                  RESET
                </Button>
                <Button
                  onClick={() => console.log("Search with filters:", filters)}
                  className="flex-1 bg-gradient-primary hover:bg-primary-hover"
                  size="sm"
                >
                  SEARCH
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assigned Lessons</CardTitle>
                  <CardDescription>
                    {assignedLessons.length} lessons configured for this skill
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleAdd} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Button>
                  <Button variant="outline" size="sm">
                    View All Lessons
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredLessons}
                columns={columns}
                actions={actions}
                emptyMessage="No lessons assigned to this skill yet. Start by adding lessons from the lesson bank."
                onAdd={handleAdd}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedLesson ? "Edit Lesson Assignment" : "Assign New Lesson"}
        description={selectedLesson ? "Update the lesson assignment details" : "Assign a lesson to this skill"}
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
              <Label htmlFor="code">Lesson Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={selectedLesson?.code}
                placeholder="Enter lesson code"
                required
              />
            </div>

            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                defaultValue={selectedLesson?.topic}
                placeholder="Enter lesson topic"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tag">Tag</Label>
                <Select name="tag" defaultValue={selectedLesson?.tag || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select name="difficulty" defaultValue={selectedLesson?.difficulty || "Easy"}>
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
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedLesson?.status || "Draft"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedLesson ? "Update Assignment" : "Assign Lesson"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Remove Lesson Assignment"
        description="Are you sure you want to remove this lesson from the skill? This will unassign it from the learning path."
        itemName={selectedLesson?.title}
        onConfirm={handleConfirmDelete}
        confirmText="Remove Assignment"
        variant="destructive"
      />
    </div>
  );
}