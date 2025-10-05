import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  FileText,
  Calendar,
  Copy,
  Shield,
  Award,
  Check,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import CreateExam from "./exams/CreateExam";
import EditExam from "./exams/EditExam";
import ExamAnalyticsOverall from "./exams/ExamAnalyticsOverall";
import ExamAnalyticsDetailed from "./exams/ExamAnalyticsDetailed";

export default function Exams() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_exams_per_page")
        : null;
    return stored ? parseInt(stored) : 25;
  });
  const [activeCount, setActiveCount] = useState<number>(0);
  const [paidCount, setPaidCount] = useState<number>(0);

  // Load exams from API
  useEffect(() => {
    loadExams();
  }, [searchTerm, selectedStatus, selectedCategory, page, perPage]);

  // counters now come from the main list meta (no extra requests)

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.exams.getAll({
        search: searchTerm || undefined,
        status:
          selectedStatus !== "all"
            ? selectedStatus === "published"
              ? "active"
              : selectedStatus
            : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        page,
        limit: perPage,
      });
      const metaResp = (response as any).meta || {};
      setExams((response as any).data || []);
      setMeta({
        total: metaResp.total ?? (response as any).total,
        current_page: metaResp.current_page ?? (response as any).current_page,
        last_page: metaResp.last_page ?? (response as any).last_page,
        per_page: parseInt(metaResp.per_page ?? perPage, 10),
      });
      const counters = metaResp.counters;
      if (counters) {
        setActiveCount(counters.total_active || 0);
        setPaidCount(counters.total_paid || 0);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load exams");
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    try {
      await api.exams.delete(examId.toString());
      toast.success("Exam deleted successfully");
      await loadExams(); // Reload the list
    } catch (err: any) {
      setError(err?.message || "Failed to delete exam");
      toast.error("Failed to delete exam");
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

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes((prev) => new Set(prev).add(code));
      toast.success("Code copied to clipboard");

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(code);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const filters = [
    {
      id: "status",
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "published", label: "Published" },
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
      case "Published":
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
        <Route
          path=":id/analytics/overall"
          element={<ExamAnalyticsOverall />}
        />
        <Route
          path=":id/analytics/detailed"
          element={<ExamAnalyticsDetailed />}
        />
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
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sections
            </CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exams.reduce(
                (sum, exam) => sum + (exam.exam_sections_count || 0),
                0
              )}
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
            <div className="text-2xl font-bold">{paidCount}</div>
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
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading exams...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : exams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No exams found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {exams.map((exam) => (
                      <TableRow key={exam.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="select-all">{exam.code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => handleCopyCode(exam.code)}
                            >
                              {copiedCodes.has(exam.code) ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{exam.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {exam.total_marks || 0} marks •{" "}
                              {exam.total_duration} mins
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
                            <Badge variant="secondary">
                              {exam.exam_type?.name || "N/A"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            {exam.exam_sections_count || 0}
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
                            {exam.is_private ? (
                              <Badge
                                variant="outline"
                                className="bg-warning/10 text-warning"
                              >
                                Private
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-success/10 text-success"
                              >
                                Public
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(
                              exam.is_active ? "Published" : "Draft"
                            )}
                          >
                            {exam.is_active ? "Published" : "Draft"}
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
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/admin/exams/${exam.id}/edit?tab=schedules`
                                  )
                                }
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedules
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/exams/${exam.id}/edit`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page {meta.current_page || page} of {meta.last_page || 1} •
          Total {meta.total || 0}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Badge variant="outline">{page}</Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= (meta.last_page || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= (meta.last_page || 1)}
            onClick={() => setPage(meta.last_page || 1)}
          >
            Last
          </Button>
          <div className="ml-4 flex items-center gap-2 text-sm text-muted-foreground">
            Rows:
            <select
              className="h-8 rounded-md border bg-background px-2"
              value={perPage}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setPerPage(v);
                try {
                  localStorage.setItem("admin_exams_per_page", String(v));
                } catch (_) {}
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
