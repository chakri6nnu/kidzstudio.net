import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  getExamsApi,
  deleteExamApi,
  type Exam,
  type ExamFilters,
} from "@/lib/utils";
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
  Clock,
  Users,
  FileText,
  Calendar,
  Play,
  Pause,
  Copy,
  Shield,
  Award,
  BarChart3,
  Download,
} from "lucide-react";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import CreateExam from "./exams/CreateExam";
import EditExam from "./exams/EditExam";

export default function Exams() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});

  // Load exams from API
  useEffect(() => {
    loadExams();
  }, [searchTerm, selectedStatus, selectedCategory]);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: ExamFilters = {
        search: searchTerm || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      };
      const response = await getExamsApi(filters);
      setExams(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    try {
      await deleteExamApi(examId);
      await loadExams(); // Reload the list
    } catch (err: any) {
      setError(err?.message || "Failed to delete exam");
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "status":
        setSelectedStatus(value);
        break;
      case "category":
        setSelectedCategory(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  const filters = [
    {
      id: "status",
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "paid", label: "Paid" },
        { value: "private", label: "Private" },
      ],
    },
    {
      id: "category",
      label: "Category",
      value: selectedCategory,
      options: [
        { value: "all", label: "All Categories" },
        // These will be populated from the API data
        ...Array.from(
          new Set(exams.map((e) => e.sub_category?.name).filter(Boolean))
        ).map((name) => ({
          value: name,
          label: name,
        })),
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Scheduled":
        return "bg-primary text-primary-foreground";
      case "Draft":
        return "bg-warning text-warning-foreground";
      case "Completed":
        return "bg-muted text-muted-foreground";
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

  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== "/admin/exams";

  if (isSubRoute) {
    return (
      <Routes>
        <Route path="create" element={<CreateExam />} />
        <Route path=":id/edit" element={<EditExam />} />
      </Routes>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Exam Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, schedule and monitor comprehensive examinations
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          onClick={() => navigate("/admin/exams/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Exam
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total || 0}</div>
            <p className="text-xs text-success">Active exams</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter((e) => e.is_active).length}
            </div>
            <p className="text-xs text-success">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.reduce((sum, exam) => sum + exam.total_questions, 0)}
            </div>
            <p className="text-xs text-success">Across all exams</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Exams</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.filter((e) => e.is_paid).length}
            </div>
            <p className="text-xs text-success">Premium content</p>
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
            onExport={() => console.log("Export exams")}
            searchPlaceholder="Search exams..."
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading exams...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : exams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No exams found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {exams.map((exam) => (
                      <TableRow key={exam.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{exam.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {exam.exam_type?.name} • {exam.exam_mode} •{" "}
                              {exam.total_marks || 0} marks
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {exam.sub_category?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            {exam.total_questions}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {exam.total_duration} mins
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {exam.exam_sections_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {new Date(exam.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(exam.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {exam.is_paid && (
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary"
                              >
                                <Shield className="mr-1 h-3 w-3" />
                                Paid
                              </Badge>
                            )}
                            {exam.is_private && (
                              <Badge
                                variant="outline"
                                className="bg-warning/10 text-warning"
                              >
                                Private
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(
                              exam.is_active ? "Active" : "Draft"
                            )}
                          >
                            {exam.is_active ? "Active" : "Draft"}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/exams/${exam.id}/edit`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Exam
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Results
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              {exam.status === "Active" ? (
                                <DropdownMenuItem>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause Exam
                                </DropdownMenuItem>
                              ) : exam.status === "Draft" ? (
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  Publish Exam
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Results
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteExam(exam.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
