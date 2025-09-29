import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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

  const exams = [
    {
      id: 1,
      title: "Final JavaScript Certification",
      category: "Programming",
      type: "Certification",
      questions: 75,
      duration: "120 mins",
      participants: 234,
      status: "Active",
      scheduled: "2024-02-15 10:00",
      created: "2024-01-15",
      difficulty: "Advanced",
      passingScore: 80,
      proctored: true,
      maxAttempts: 2,
    },
    {
      id: 2,
      title: "React Development Assessment",
      category: "Frontend",
      type: "Assessment",
      questions: 45,
      duration: "90 mins",
      participants: 156,
      status: "Scheduled",
      scheduled: "2024-02-20 14:00",
      created: "2024-01-14",
      difficulty: "Intermediate",
      passingScore: 75,
      proctored: true,
      maxAttempts: 1,
    },
    {
      id: 3,
      title: "Database Design Fundamentals",
      category: "Backend",
      type: "Exam",
      questions: 60,
      duration: "105 mins",
      participants: 189,
      status: "Completed",
      scheduled: "2024-01-25 09:00",
      created: "2024-01-10",
      difficulty: "Intermediate",
      passingScore: 70,
      proctored: false,
      maxAttempts: 3,
    },
    {
      id: 4,
      title: "Full-Stack Development Final",
      category: "Full-Stack",
      type: "Final Exam",
      questions: 100,
      duration: "180 mins",
      participants: 89,
      status: "Draft",
      scheduled: "2024-03-01 10:00",
      created: "2024-01-12",
      difficulty: "Advanced",
      passingScore: 85,
      proctored: true,
      maxAttempts: 1,
    },
  ];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || exam.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || exam.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
        { value: "Active", label: "Active" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Draft", label: "Draft" },
        { value: "Completed", label: "Completed" }
      ]
    },
    {
      id: "category",
      label: "Category", 
      value: selectedCategory,
      options: [
        { value: "all", label: "All Categories" },
        { value: "Programming", label: "Programming" },
        { value: "Frontend", label: "Frontend" },
        { value: "Backend", label: "Backend" },
        { value: "Full-Stack", label: "Full-Stack" }
      ]
    }
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
          onClick={() => navigate('/admin/exams/create')}
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
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-success">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-warning">Next: Feb 15, 2024</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,468</div>
            <p className="text-xs text-success">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-success">+5% from last month</p>
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
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{exam.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {exam.type} • {exam.passingScore}% pass • {exam.maxAttempts} attempts
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{exam.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="mr-1 h-3 w-3" />
                        {exam.questions}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {exam.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {exam.participants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{exam.scheduled.split(' ')[0]}</div>
                        <div className="text-muted-foreground">{exam.scheduled.split(' ')[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {exam.proctored && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            <Shield className="mr-1 h-3 w-3" />
                            Proctored
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(exam.status)}
                      >
                        {exam.status}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}>
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