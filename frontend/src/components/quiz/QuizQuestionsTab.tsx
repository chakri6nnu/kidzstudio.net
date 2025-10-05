import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Search } from "lucide-react";
import {
  getQuestionsApi,
  getQuestionTypesApi,
  getSkillsApi as getSkillsPublic,
  getTopicsApi as getTopicsPublic,
  getTagsApi as getTagsPublic,
  type Question,
  getQuizQuestionsApi,
  addQuizQuestionsApi,
  removeQuizQuestionApi,
} from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface QuizQuestionsTabProps {
  quizId?: number;
}

export default function QuizQuestionsTab({ quizId }: QuizQuestionsTabProps) {
  const [filters, setFilters] = useState({
    code: "",
    type: "",
    skill_id: "",
    topic_id: "",
    tag_id: "",
    difficulty: [] as string[],
    date_from: "",
    date_to: "",
  });

  const [questionTypes, setQuestionTypes] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [skills, setSkills] = useState<Array<{ id: string; name: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);

  const difficultyLevels = [
    { id: "very-easy", label: "Very Easy" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
    { id: "very-hard", label: "Very Hard" },
  ];

  const handleDifficultyChange = (difficultyId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: checked
        ? [...prev.difficulty, difficultyId]
        : prev.difficulty.filter((id) => id !== difficultyId),
    }));
  };

  // data state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchNonce, setSearchNonce] = useState(0);
  const [attached, setAttached] = useState<Question[]>([]);
  const [viewPage, setViewPage] = useState(1);
  const [viewPerPage, setViewPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");

  useEffect(() => {
    (async () => {
      try {
        const [types, skillsRes, tagsRes] = await Promise.all([
          getQuestionTypesApi(),
          getSkillsPublic(),
          getTagsPublic(),
        ]);
        setQuestionTypes(
          ((types as any).data || []).map((t: any) => ({
            id: String(t.id),
            name: t.name,
          }))
        );
        setSkills(
          ((skillsRes as any).data || []).map((s: any) => ({
            id: String(s.id),
            name: s.name,
          }))
        );
        setTags(
          ((tagsRes as any).data || []).map((t: any) => ({
            id: String(t.id),
            name: t.name,
          }))
        );
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    if (!hasSearched) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const { data, meta } = await getQuestionsApi({
          ...filters,
          page,
          per_page: perPage,
        });
        setQuestions(data || []);
        setTotal(meta?.total || data?.length || 0);
      } catch (e: any) {
        setError(e?.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchNonce, page, perPage]);

  const loadAttached = async () => {
    if (!quizId) return;
    try {
      const res = await getQuizQuestionsApi(quizId, { per_page: 1000 });
      setAttached(res.data || []);
    } catch (_) {}
  };

  useEffect(() => {
    loadAttached();
  }, [quizId]);

  const addQuestion = async (id: number) => {
    if (!quizId) {
      toast.error("Create quiz first");
      return;
    }
    await addQuizQuestionsApi(quizId, [id]);
    toast.success("Question added");
    loadAttached();
  };

  const removeQuestion = async (id: number) => {
    if (!quizId) return;
    await removeQuizQuestionApi(quizId, id);
    toast.success("Question removed");
    loadAttached();
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "add" | "view")}
        >
          <TabsList className="mb-4 bg-muted/30">
            <TabsTrigger value="add">Add Questions</TabsTrigger>
            <TabsTrigger value="view">View Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">
                  Currently Adding Quiz Questions
                </h4>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({
                        code: "",
                        type: "",
                        skill_id: "",
                        topic_id: "",
                        tag_id: "",
                        difficulty: [],
                        date_from: "",
                        date_to: "",
                      });
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPage(1);
                      setHasSearched(true);
                      setSearchNonce((n) => n + 1);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                </div>
              </div>
              <p className="text-sm text-green-700">
                {loading
                  ? "Loading..."
                  : hasSearched
                  ? `${questions.length} items found for the selected criteria.`
                  : "Use filters and click Search to load questions."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Filter className="h-4 w-4" /> Filters
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Code</Label>
                  <Input
                    placeholder="Enter Code"
                    value={filters.code}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, code: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((p) => ({ ...p, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Skill</Label>
                  <Select
                    value={filters.skill_id}
                    onValueChange={async (value) => {
                      setFilters((p) => ({
                        ...p,
                        skill_id: value,
                        topic_id: "",
                      }));
                      if (value) {
                        const res = await getTopicsPublic({ skill_id: value });
                        setTopics(
                          ((res as any).data || []).map((t: any) => ({
                            id: String(t.id),
                            name: t.name,
                          }))
                        );
                      } else {
                        setTopics([]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Topic</Label>
                  <Select
                    value={filters.topic_id}
                    onValueChange={(value) =>
                      setFilters((p) => ({ ...p, topic_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">By Tag</Label>
                  <Select
                    value={filters.tag_id}
                    onValueChange={(value) =>
                      setFilters((p) => ({ ...p, tag_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date From</Label>
                    <Input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, date_from: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date To</Label>
                    <Input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) =>
                        setFilters((p) => ({ ...p, date_to: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Difficulty Level
                  </Label>
                  <div className="space-y-2">
                    {difficultyLevels.map((level) => (
                      <div
                        key={level.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={level.id}
                          checked={filters.difficulty.includes(level.id)}
                          onCheckedChange={(checked) =>
                            handleDifficultyChange(level.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={level.id}
                          className="text-sm cursor-pointer"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset & Search Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setFilters({
                        code: "",
                        type: "",
                        skill_id: "",
                        topic_id: "",
                        tag_id: "",
                        difficulty: [],
                        date_from: "",
                        date_to: "",
                      });
                      setHasSearched(false);
                      setQuestions([]);
                      setTotal(0);
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setPage(1);
                      setHasSearched(true);
                      setSearchNonce((n) => n + 1);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-3 space-y-4">
                {!hasSearched ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Use filters on the left, then click Search to load
                    questions.
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-destructive">
                    {error}
                  </div>
                ) : questions.length === 0 && !loading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg font-medium">
                      No Questions
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      No questions match your current filter criteria. Try
                      adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q) => {
                      const already = new Set(
                        attached.map((a) => Number((a as any).id))
                      ).has(Number((q as any).id));
                      return (
                        <Card key={q.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="font-medium text-lg">
                                  {(q as any).text || "Question"}
                                </div>
                                <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                                  <span>
                                    Type:{" "}
                                    <span className="text-foreground">
                                      {q.question_type?.name}
                                    </span>
                                  </span>
                                  <span>
                                    Difficulty:{" "}
                                    <span className="text-foreground">
                                      {q.difficulty_level?.name}
                                    </span>
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {q.code}
                                </div>
                              </div>
                              {already ? (
                                <Button
                                  className="shrink-0"
                                  variant="secondary"
                                  size="sm"
                                  disabled
                                >
                                  Added
                                </Button>
                              ) : (
                                <Button
                                  className="shrink-0 bg-green-600 hover:bg-green-700"
                                  size="sm"
                                  onClick={() =>
                                    addQuestion(Number((q as any).id))
                                  }
                                >
                                  ADD
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        Page {page} of{" "}
                        {Math.max(1, Math.ceil((total || 0) / perPage))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                        >
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) =>
                              p * perPage < (total || 0) ? p + 1 : p
                            )
                          }
                          disabled={page * perPage >= (total || 0)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">
                    Currently Viewing Quiz Questions
                  </h4>
                  <p className="text-sm text-blue-700">
                    {attached.length} questions in this quiz.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadAttached}>
                  Refresh
                </Button>
              </div>
            </div>

            {attached.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No questions attached yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attached
                  .slice((viewPage - 1) * viewPerPage, viewPage * viewPerPage)
                  .map((q) => (
                    <Card key={q.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="text-xs text-muted-foreground">
                              {(q as any).code}
                            </div>
                            <div className="font-medium text-lg">
                              {(q as any).text || "Question"}
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                              <span>
                                Type:{" "}
                                <span className="text-foreground">
                                  {(q as any).question_type?.name}
                                </span>
                              </span>
                              <span>
                                Difficulty:{" "}
                                <span className="text-foreground">
                                  {(q as any).difficulty_level?.name}
                                </span>
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              removeQuestion(Number((q as any).id))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Page {viewPage} of{" "}
                    {Math.max(1, Math.ceil(attached.length / viewPerPage))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewPage((p) => Math.max(1, p - 1))}
                      disabled={viewPage <= 1}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setViewPage((p) =>
                          p * viewPerPage < attached.length ? p + 1 : p
                        )
                      }
                      disabled={viewPage * viewPerPage >= attached.length}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
