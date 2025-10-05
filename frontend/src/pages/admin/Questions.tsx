import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getQuestionsApi } from "@/lib/utils";
import { getTopicsApi, getTagsApi } from "@/lib/utils";
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
  Calendar,
  RotateCcw,
  Filter,
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
    tag: "",
    type: "",
    difficulty: "",
    status: "",
    date_from: "",
    date_to: "",
    per_page: 10,
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic data for dropdowns
  const [sections, setSections] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [questionTypes, setQuestionTypes] = useState<any[]>([]);
  const [difficulties, setDifficulties] = useState<any[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  // Daily Practice Section state
  const [showDailyPractice, setShowDailyPractice] = useState(false);
  const [dailyPracticeQuestions, setDailyPracticeQuestions] = useState<any[]>(
    []
  );
  const [showAddQuestions, setShowAddQuestions] = useState(false);
  const [showViewQuestions, setShowViewQuestions] = useState(false);

  // Load dynamic data for dropdowns
  const loadDynamicData = async () => {
    try {
      const normalize = (
        res: unknown
      ): Array<{ id: any; name: string; code?: string }> => {
        const dataPart = (res as any)?.data ?? res;
        if (!Array.isArray(dataPart)) return [];
        return dataPart.map((o: any) => ({
          id: o?.id ?? o?.value ?? o?.key,
          name: o?.name ?? o?.title ?? o?.label ?? String(o?.id ?? ""),
          code: o?.code,
        }));
      };

      const [sectionsRes, skillsRes, topicsRes, tagsRes, typesRes, diffsRes] =
        await Promise.all([
          api.sections.getAll(),
          api.skills.getAll(),
          getTopicsApi(), // public topics endpoint
          getTagsApi(), // public tags endpoint
          api.lookup.questionTypes().catch(() => ({ data: [] })),
          api.lookup.difficultyLevels().catch(() => ({ data: [] })),
        ]);

      const sec = normalize(sectionsRes);
      const skl = normalize(skillsRes);
      const tpc = normalize(topicsRes);
      const tgs = normalize(tagsRes);
      let qtypes = normalize(typesRes);
      if (qtypes.length === 0) {
        qtypes = [
          { id: "mcsa", name: "Multiple Choice Single Answer" },
          { id: "mcma", name: "Multiple Choice Multiple Answers" },
          { id: "tf", name: "True or False" },
          { id: "sa", name: "Short Answer" },
          { id: "mtf", name: "Match the Following" },
          { id: "os", name: "Ordering/Sequence" },
          { id: "fitb", name: "Fill in the Blanks" },
        ];
      }
      let diffs = normalize(diffsRes).map((d) => ({
        ...d,
        code: d.code || d.name,
      }));
      if (diffs.length === 0) {
        diffs = [
          { id: "very-easy", name: "Very Easy", code: "very-easy" },
          { id: "easy", name: "Easy", code: "easy" },
          { id: "medium", name: "Medium", code: "medium" },
          { id: "hard", name: "Hard", code: "hard" },
          { id: "very-hard", name: "Very Hard", code: "very-hard" },
        ];
      }

      setSections(sec);
      setSkills(skl);
      setTopics(tpc);
      setTags(tgs);
      setQuestionTypes(qtypes);
      setDifficulties(diffs);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
      toast.error("Failed to load question data. Using default values.");
      setError("Failed to load question data");

      // Still use fallback but notify user
      setSections([]);
      setSkills([]);
      setTopics([]);
      setTags([]);
      setQuestionTypes([
        { id: "mcsa", name: "Multiple Choice Single Answer" },
        { id: "mcma", name: "Multiple Choice Multiple Answers" },
        { id: "tf", name: "True or False" },
        { id: "sa", name: "Short Answer" },
        { id: "mtf", name: "Match the Following" },
        { id: "os", name: "Ordering/Sequence" },
        { id: "fitb", name: "Fill in the Blanks" },
      ]);
      setDifficulties([
        { id: "very-easy", name: "Very Easy", code: "very-easy" },
        { id: "easy", name: "Easy", code: "easy" },
        { id: "medium", name: "Medium", code: "medium" },
        { id: "hard", name: "Hard", code: "hard" },
        { id: "very-hard", name: "Very Hard", code: "very-hard" },
      ]);
    }
  };

  const load = async (page?: number) => {
    try {
      setLoading(true);
      setError("");
      const { data, meta } = await getQuestionsApi({
        code: filters.code || undefined,
        search: filters.question || undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        section: filters.section || undefined,
        skill: filters.skill || undefined,
        topic: filters.topic || undefined,
        tag: filters.tag || undefined,
        difficulty: filters.difficulty || undefined,
        status: filters.status || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        page: page || 1,
        per_page: filters.per_page,
      } as any);
      setQuestions(data as any[]);
      setMeta({
        total: (meta as any)?.total,
        current_page: (meta as any)?.current_page,
        last_page: (meta as any)?.last_page,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load questions");
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Load Daily Practice questions
  const loadDailyPracticeQuestions = async () => {
    try {
      const { data } = await getQuestionsApi({
        section: "Daily Practice",
        per_page: 50,
      } as any);
      setDailyPracticeQuestions((data as any[]) || []);
    } catch (error) {
      console.error("Failed to load daily practice questions:", error);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      code: "",
      question: "",
      section: "",
      skill: "",
      topic: "",
      tag: "",
      type: "",
      difficulty: "",
      status: "",
      date_from: "",
      date_to: "",
      per_page: 10,
    });
    setSelectedType("all");
  };

  useEffect(() => {
    loadDynamicData();
  }, []);

  // Debounced dynamic loading on filter changes
  useEffect(() => {
    const handle = setTimeout(() => {
      load();
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.code,
    filters.question,
    filters.section,
    filters.skill,
    filters.topic,
    filters.tag,
    filters.difficulty,
    filters.status,
    filters.date_from,
    filters.date_to,
    selectedType,
    filters.per_page,
  ]);

  useEffect(() => {
    if (showDailyPractice) {
      loadDailyPracticeQuestions();
    }
  }, [showDailyPractice]);

  // Cascade: load skills when section changes
  useEffect(() => {
    (async () => {
      try {
        if (!filters.section) {
          const base = await api.skills.getAll();
          const list = (base as any)?.data ?? base;
          setSkills(Array.isArray(list) ? list : []);
          return;
        }
        const res = await api.browseSkills.list({
          section_id: filters.section,
        });
        const list = (res as any)?.data ?? res;
        setSkills(Array.isArray(list) ? list : []);
        setFilters((p) => ({ ...p, skill: "", topic: "", tag: "" }));
      } catch (_) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.section]);

  // Cascade: load topics when skill changes (if available)
  useEffect(() => {
    (async () => {
      try {
        setTopicsLoading(true);
        if (!filters.skill) {
          // If no skill selected, load all topics (public endpoint)
          const base = await getTopicsApi();
          const list = (base as any)?.data ?? base;
          setTopics(Array.isArray(list) ? list : []);
          return;
        }
        const res = await getTopicsApi({
          skill_id: filters.skill as any,
        } as any);
        const list = (res as any)?.data ?? res;
        setTopics(Array.isArray(list) ? list : []);
        // Reset topic and tag when skill changes
        setFilters((p) => ({ ...p, topic: "", tag: "" }));
      } catch (_) {
        // ignore
      } finally {
        setTopicsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.skill]);

  // Cascade: load tags when topic changes (if available)
  useEffect(() => {
    (async () => {
      try {
        setTagsLoading(true);
        if (!filters.topic) {
          const base = await getTagsApi();
          const list = (base as any)?.data ?? base;
          setTags(Array.isArray(list) ? list : []);
          return;
        }
        const res = await getTagsApi({
          topic_id: filters.topic as any,
          skill_id: filters.skill || undefined,
        } as any);
        const list = (res as any)?.data ?? res;
        setTags(Array.isArray(list) ? list : []);
        // Reset tag when topic changes
        setFilters((p) => ({ ...p, tag: "" }));
      } catch (_) {
        // ignore
      } finally {
        setTagsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.topic]);

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

      {/* Daily Practice Section */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-800 dark:text-blue-400">
                Daily Practice Section
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-400">
                Manage questions for daily practice sessions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddQuestions(!showAddQuestions)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Questions
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowViewQuestions(!showViewQuestions)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Questions
              </Button>
            </div>
          </div>
        </CardHeader>
        {showAddQuestions && (
          <CardContent>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              Add Questions functionality will filter questions and exclude
              already added ones.
            </div>
          </CardContent>
        )}
        {showViewQuestions && (
          <CardContent>
            <div className="text-sm text-blue-700 dark:text-blue-400">
              View Questions will show all questions in the Daily Practice
              section.
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Code</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter code"
                  className="pl-10"
                  value={filters.code}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, code: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Search Question */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Question</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter question text"
                  className="pl-10"
                  value={filters.question}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, question: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select
                value={filters.section || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    section: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill</label>
              <Select
                value={filters.skill || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    skill: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={String(skill.id)}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select
                value={filters.topic || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    topic: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={String(topic.id)}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag</label>
              <Select
                value={filters.tag || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    tag: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={String(tag.id)}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={filters.difficulty || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    difficulty: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem
                      key={difficulty.id}
                      value={difficulty.code || difficulty.name}
                    >
                      {difficulty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((p) => ({
                    ...p,
                    status: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.date_from}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, date_from: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="date"
                  className="pl-10"
                  value={filters.date_to}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, date_to: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>

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
                  <TableHead>TAG</TableHead>
                  <TableHead>DIFFICULTY</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading questions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
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
                        <div className="truncate text-sm text-muted-foreground">
                          {q.section?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm text-muted-foreground">
                          {q.skill?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm text-muted-foreground">
                          {q.topic?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm text-muted-foreground">
                          {q.tag?.name || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-foreground">
                          {q.difficulty || "-"}
                        </Badge>
                      </TableCell>
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
