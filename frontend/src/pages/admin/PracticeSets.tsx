import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FiltersPanel } from "@/components/ui/filters-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  BookOpen,
  Target,
  Clock,
  Users,
  TrendingUp,
  Award,
  Zap,
  Brain,
  CheckCircle,
} from "lucide-react";

export default function PracticeSets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [practiceSets, setPracticeSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    loadPracticeSets();
  }, [searchTerm, selectedSkill, selectedDifficulty, selectedStatus]);

  const loadPracticeSets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.practiceSets.getAll({
        search: searchTerm || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        page: 1,
        limit: 50,
      });
      setPracticeSets(response.data);
      setMeta({
        total: response.total,
        current_page: response.current_page,
        last_page: response.last_page,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load practice sets");
      toast.error("Failed to load practice sets");
    } finally {
      setLoading(false);
    }
  };

  const filteredSets = practiceSets.filter((set) => {
    const matchesSearch =
      set.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.skill?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === "all" || set.skill === selectedSkill;
    const matchesDifficulty =
      selectedDifficulty === "all" || set.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === "all" || set.status === selectedStatus;

    return matchesSearch && matchesSkill && matchesDifficulty && matchesStatus;
  });

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "skill":
        setSelectedSkill(value);
        break;
      case "difficulty":
        setSelectedDifficulty(value);
        break;
      case "status":
        setSelectedStatus(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSkill("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
  };

  const filters = [
    {
      id: "skill",
      label: "Skill",
      value: selectedSkill,
      options: [
        { value: "all", label: "All Skills" },
        { value: "JavaScript", label: "JavaScript" },
        { value: "React", label: "React" },
        { value: "CSS", label: "CSS" },
        { value: "Database", label: "Database" },
      ],
    },
    {
      id: "difficulty",
      label: "Difficulty",
      value: selectedDifficulty,
      options: [
        { value: "all", label: "All Levels" },
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
      ],
    },
    {
      id: "status",
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "Published", label: "Published" },
        { value: "Draft", label: "Draft" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-success text-success-foreground";
      case "Draft":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Practice Sets
          </h1>
          <p className="text-muted-foreground mt-2">
            Adaptive learning practice sets for skill development
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Practice Set
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Practice Sets
            </CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-success">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,246</div>
            <p className="text-xs text-success">+25% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-success">+3% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Learners
            </CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-success">+12% this week</p>
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
            searchPlaceholder="Search practice sets..."
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practice Set</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSets.map((set) => (
                  <TableRow key={set.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{set.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {set.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{set.skill}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{set.subCategory || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(set.difficulty)}
                      >
                        {set.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Target className="mr-1 h-3 w-3" />
                          {set.questions} questions
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="mr-1 h-3 w-3" />
                          {set.lessons} lessons
                        </div>
                        <div className="flex items-center">
                          <Play className="mr-1 h-3 w-3" />
                          {set.videos} videos
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {set.completions} completions
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {set.averageScore}% avg score
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {set.estimatedTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {set.adaptiveMode && (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary text-xs"
                          >
                            <Zap className="mr-1 h-3 w-3" />
                            Adaptive
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(set.status)}
                      >
                        {set.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/practice-sets/${set.id}/edit`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/practice-sets/${set.id}/edit`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Practice Set
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success(
                                `Preview not yet implemented for #${set.id}`
                              )
                            }
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Preview Practice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success(
                                `Analytics not yet implemented for #${set.id}`
                              )
                            }
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  "Delete this practice set? This action cannot be undone."
                                )
                              )
                                return;
                              try {
                                await api.practiceSets.delete(String(set.id));
                                toast.success("Practice set deleted");
                                await loadPracticeSets();
                              } catch (e: any) {
                                toast.error(e?.message || "Failed to delete");
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
