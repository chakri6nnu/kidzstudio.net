import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const quizzes = [
    {
      id: 1,
      title: "JavaScript Basics Quiz",
      category: "Programming",
      type: "Multiple Choice",
      questions: 25,
      duration: "30 mins",
      participants: 124,
      status: "Active",
      created: "2024-01-15",
      lastModified: "2024-01-20",
      difficulty: "Intermediate",
      passingScore: 70,
    },
    {
      id: 2,
      title: "React Components Test",
      category: "Frontend",
      type: "Mixed",
      questions: 15,
      duration: "20 mins",
      participants: 89,
      status: "Draft",
      created: "2024-01-14",
      lastModified: "2024-01-19",
      difficulty: "Advanced",
      passingScore: 75,
    },
    {
      id: 3,
      title: "Database Fundamentals",
      category: "Backend",
      type: "Multiple Choice",
      questions: 30,
      duration: "45 mins",
      participants: 156,
      status: "Completed",
      created: "2024-01-10",
      lastModified: "2024-01-18",
      difficulty: "Beginner",
      passingScore: 65,
    },
    {
      id: 4,
      title: "CSS Layout Quiz",
      category: "Frontend",
      type: "Practical",
      questions: 12,
      duration: "25 mins",
      participants: 67,
      status: "Active",
      created: "2024-01-12",
      lastModified: "2024-01-17",
      difficulty: "Intermediate",
      passingScore: 70,
    },
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || quiz.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
        { value: "Programming", label: "Programming" },
        { value: "Frontend", label: "Frontend" },
        { value: "Backend", label: "Backend" }
      ]
    },
    {
      id: "status",
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Draft", label: "Draft" },
        { value: "Completed", label: "Completed" }
      ]
    }
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
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-success">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,436</div>
            <p className="text-xs text-success">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
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
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{quiz.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {quiz.type} • {quiz.passingScore}% pass rate
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </TableCell>
                    <TableCell>{quiz.questions}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {quiz.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {quiz.participants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(quiz.difficulty)}
                      >
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(quiz.status)}
                      >
                        {quiz.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {quiz.created}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Quiz
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          {quiz.status === "Active" ? (
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
                          <DropdownMenuItem className="text-destructive">
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