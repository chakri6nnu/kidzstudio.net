import { useEffect, useState } from "react";
import { getQuestionsApi } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ImportQuestionsDialog from "@/components/dialogs/ImportQuestionsDialog";

export default function Questions() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [filters, setFilters] = useState({
    code: "",
    question: "",
    section: "",
    skill: "",
    topic: "",
    type: "",
    per_page: 10,
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (page?: number) => {
    try {
      setLoading(true);
      setError("");
      const res = await getQuestionsApi({
        ...filters,
        per_page: filters.per_page,
        page,
      });
      setQuestions(res.data);
      setMeta(res.meta);
    } catch (e: any) {
      setError(e?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    filters.code,
    filters.question,
    filters.section,
    filters.skill,
    filters.topic,
    selectedType,
    filters.per_page,
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Questions
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            IMPORT QUESTIONS
          </Button>
          <ImportQuestionsDialog
            onImport={(data) => console.log("Import:", data)}
            trigger={
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Questions
              </Button>
            }
          />
          <Button
            className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
            onClick={() => navigate("/admin/questions/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            NEW QUESTION
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Code"
                    className="pl-10 w-32"
                    value={filters.code}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, code: e.target.value }))
                    }
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Question"
                    className="pl-10 w-40"
                    value={filters.question}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, question: e.target.value }))
                    }
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Search Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Multiple Choice Single Answer">
                      Multiple Choice Single Answer
                    </SelectItem>
                    <SelectItem value="Multiple Choice Multiple Answers">
                      Multiple Choice Multiple Answers
                    </SelectItem>
                    <SelectItem value="True or False">True or False</SelectItem>
                    <SelectItem value="Short Answer">Short Answer</SelectItem>
                    <SelectItem value="Match the Following">
                      Match the Following
                    </SelectItem>
                    <SelectItem value="Ordering/Sequence">
                      Ordering/Sequence
                    </SelectItem>
                    <SelectItem value="Fill in the Blanks">
                      Fill in the Blanks
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Section"
                    className="pl-10 w-36"
                    value={filters.section}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, section: e.target.value }))
                    }
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Skill"
                    className="pl-10 w-32"
                    value={filters.skill}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, skill: e.target.value }))
                    }
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search Topic"
                    className="pl-10 w-32"
                    value={filters.topic}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, topic: e.target.value }))
                    }
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search Status" className="pl-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CODE</TableHead>
                  <TableHead>QUESTION</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>SECTION</TableHead>
                  <TableHead>SKILL</TableHead>
                  <TableHead>TOPIC</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading questions...</span>
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
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No questions found
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((q: any) => (
                    <TableRow key={q.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-primary text-primary-foreground"
                        >
                          {q.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">
                          {q.text || q.question || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{q.question_type?.name || "-"}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm">
                          {q.section?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm">
                          {q.skill?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{q.topic?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-success text-success-foreground"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/questions/${q.id}/details`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/questions/${q.id}/edit`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Question
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                ROWS PER PAGE:
              </span>
              <Select
                value={String(filters.per_page)}
                onValueChange={(v) =>
                  setFilters((p) => ({ ...p, per_page: Number(v) }))
                }
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">PAGE</span>
              <Button variant="outline" size="sm">
                {meta.current_page || 1}
              </Button>
              <span className="text-sm text-muted-foreground">
                OF {meta.last_page || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  meta.current_page < meta.last_page &&
                  load((meta.current_page || 1) + 1)
                }
              >
                NEXT →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
