import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzesApi, deleteQuizApi, type Quiz } from "@/lib/utils";
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
  Target,
  Calendar,
  Play,
  Pause,
  Copy,
} from "lucide-react";

export default function Quizzes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_quizzes_per_page")
        : null;
    return stored ? parseInt(stored) : 25;
  });
  const [activeCount, setActiveCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);

  useEffect(() => {
    loadQuizzes();
  }, [searchTerm, selectedStatus, selectedCategory, page, perPage]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await getQuizzesApi({
        search: searchTerm || undefined,
        status:
          selectedStatus !== "all"
            ? selectedStatus === "Active"
              ? "active"
              : "inactive"
            : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        page,
        per_page: perPage,
      });
      setQuizzes(resp.data);
      setMeta(resp.meta);
      if (resp.meta?.counters) {
        setActiveCount(resp.meta.counters.total_active || 0);
        setPaidCount(resp.meta.counters.total_paid || 0);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes; // server-side filtered

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "category":
        setSelectedCategory(value);
        break;
      case "status":
        setSelectedStatus(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const filters = [
    {
      id: "category",
      label: "Category",
      value: selectedCategory,
      options: [
        { value: "all", label: "All Categories" },
        ...Array.from(
          new Set(quizzes.map((q) => q.sub_category?.name).filter(Boolean))
        ).map((name) => ({
          value: String(name),
          label: String(name),
        })),
      ],
    },
    {
      id: "status",
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Draft", label: "Draft" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Quiz Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage and monitor your quizzes
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/quizzes/create")}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Quizzes
            </CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-success">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Completion
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-success">+3% from last month</p>
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
            searchPlaceholder="Search quizzes..."
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">End Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading quizzes...</span>
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
                ) : filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No quizzes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{quiz.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {quiz.quiz_type?.name || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {quiz.sub_category?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* questions count if available */}-
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {quiz.total_duration || 0} mins
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />-
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-muted text-muted-foreground"
                        >
                          -
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(
                            quiz.is_active ? "Active" : "Draft"
                          )}
                        >
                          {quiz.is_active ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {quiz.is_active ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </div>
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
                                navigate(`/admin/quizzes/${quiz.id}/edit`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            {(quiz.is_active ? "Active" : "Draft") ===
                            "Active" ? (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Quiz
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Activate Quiz
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={async () => {
                                await deleteQuizApi(quiz.id);
                                await loadQuizzes();
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page {meta?.current_page || page} of {meta?.last_page || 1} •
          Total {meta?.total || 0}
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
            disabled={page >= (meta?.last_page || 1)}
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
            disabled={page >= (meta?.last_page || 1)}
            onClick={() => setPage(meta?.last_page || 1)}
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
                  localStorage.setItem("admin_quizzes_per_page", String(v));
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
