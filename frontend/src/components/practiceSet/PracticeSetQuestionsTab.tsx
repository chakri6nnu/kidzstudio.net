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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  getQuestionsApi,
  getQuestionTypesApi,
  getSkillsApi as getSkillsPublic,
  getTopicsApi as getTopicsPublic,
  getTagsApi as getTagsPublic,
  type Question,
} from "@/lib/utils";

interface PracticeSetQuestionsTabProps {
  practiceSetData?: any;
  onSave: (data: any) => void;
}

export default function PracticeSetQuestionsTab({
  practiceSetData,
  onSave,
}: PracticeSetQuestionsTabProps) {
  const practiceSetId = String(
    practiceSetData?.id || practiceSetData?.practiceSetId || ""
  );

  const [filters, setFilters] = useState({
    code: "",
    type: "",
    skill_id: "",
    topic_id: "",
    tag_id: "",
    difficulty: [] as string[],
  });

  type OptionItem = { id: number | string; name: string };
  const [questionTypes, setQuestionTypes] = useState<OptionItem[]>([]);
  const [skills, setSkills] = useState<OptionItem[]>([]);
  const [topics, setTopics] = useState<OptionItem[]>([]);
  const [tags, setTags] = useState<OptionItem[]>([]);

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

  const handleReset = () => {
    setFilters({
      code: "",
      type: "",
      skill_id: "",
      topic_id: "",
      tag_id: "",
      difficulty: [],
    });
  };

  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attached, setAttached] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");
  const [viewPage, setViewPage] = useState(1);
  const [viewPerPage, setViewPerPage] = useState(20);

  // Load attached questions for practice set
  useEffect(() => {
    if (!practiceSetId) return;
    (async () => {
      try {
        const res = await api.practiceSets.getQuestions(practiceSetId, {
          per_page: 1000,
        });
        setAttached(res.data || []);
      } catch (_) {}
    })();
  }, [practiceSetId]);

  // Load dropdown data (types, skills, tags). Topics are loaded on skill select
  useEffect(() => {
    (async () => {
      try {
        const normalize = (res: unknown): OptionItem[] => {
          if (!res) return [];
          const dataPart = (res as { data?: unknown })?.data;
          const arr: unknown[] = Array.isArray(res)
            ? (res as unknown[])
            : Array.isArray(dataPart)
            ? (dataPart as unknown[])
            : [];
          return arr.map((i) => {
            const obj = i as Record<string, unknown>;
            const id = String(obj.id ?? obj.value ?? obj.key ?? "");
            const name = String(
              obj.name ?? obj.title ?? obj.label ?? obj.id ?? id
            );
            return { id, name };
          });
        };

        const [skillsRes, tagsRes, typesRes] = await Promise.all([
          getSkillsPublic(),
          getTagsPublic(),
          getQuestionTypesApi(),
        ]);

        setSkills(normalize(skillsRes));
        setTags(normalize(tagsRes));
        let normTypes = normalize(typesRes);
        if (normTypes.length === 0) {
          normTypes = [
            { id: "mcsa", name: "Multiple Choice Single Answer" },
            { id: "mcma", name: "Multiple Choice Multiple Answers" },
            { id: "tf", name: "True or False" },
            { id: "sa", name: "Short Answer" },
            { id: "mtf", name: "Match the Following" },
            { id: "os", name: "Ordering/Sequence" },
            { id: "fitb", name: "Fill in the Blanks" },
          ];
        }
        setQuestionTypes(normTypes);
      } catch (_) {
        // fallback to static types if api fails
        setQuestionTypes([
          { id: "mcsa", name: "Multiple Choice Single Answer" },
          { id: "mcma", name: "Multiple Choice Multiple Answers" },
          { id: "tf", name: "True or False" },
          { id: "sa", name: "Short Answer" },
          { id: "mtf", name: "Match the Following" },
          { id: "os", name: "Ordering/Sequence" },
          { id: "fitb", name: "Fill in the Blanks" },
        ]);
      }
    })();
  }, []);

  // Search questions when requested
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
        if (meta && typeof meta.total === "number") {
          setTotal(meta.total);
        } else {
          setTotal((data || []).length);
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to load questions";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [hasSearched, page, perPage, filters]);

  const addQuestion = async (qid: number) => {
    if (!practiceSetId) {
      toast.error("Create practice set first");
      return;
    }
    await api.practiceSets.addQuestions(practiceSetId, [qid]);
    toast.success("Question added");
    const res = await api.practiceSets.getQuestions(practiceSetId, {
      per_page: 1000,
    });
    setAttached(res.data || []);
  };

  const removeQuestion = async (qid: number) => {
    if (!practiceSetId) return;
    await api.practiceSets.removeQuestion(practiceSetId, qid);
    toast.success("Question removed");
    const res = await api.practiceSets.getQuestions(practiceSetId, {
      per_page: 1000,
    });
    setAttached(res.data || []);
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
            {/* Header banner */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800 dark:text-green-400">
                  Currently Adding Practice Set Questions
                </h4>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-green-600 dark:text-green-400 p-0 h-auto hover:no-underline"
                    onClick={() => {
                      setPage(1);
                      setHasSearched(true);
                    }}
                  >
                    Search
                  </Button>
                  <span className="text-green-600 dark:text-green-400">|</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-green-600 dark:text-green-400 p-0 h-auto hover:no-underline"
                  >
                    Add Questions
                  </Button>
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                {loading
                  ? "Loading..."
                  : hasSearched
                  ? `${questions.length} items found for the selected criteria.`
                  : "Use filters and click Search to load questions."}
              </p>
            </div>

            {/* Filters and Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <Filter className="h-4 w-4" />
                  Filters
                </div>

                {/* Code Filter with icon */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Code</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Enter Code"
                      className="pl-10"
                      value={filters.code}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Type as RadioGroup */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Type</Label>
                  <RadioGroup
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, type: value }))
                    }
                  >
                    {questionTypes.map((type) => (
                      <div
                        key={String(type.id)}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={String(type.id)}
                          id={String(type.id)}
                        />
                        <Label
                          htmlFor={String(type.id)}
                          className="text-sm text-yellow-500 cursor-pointer font-normal"
                        >
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Skill Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Skill</Label>
                  <Select
                    value={filters.skill_id}
                    onValueChange={async (value) => {
                      setFilters((prev) => ({
                        ...prev,
                        skill_id: value,
                        topic_id: "",
                      }));
                      try {
                        if (value) {
                          const topicsRes = await getTopicsPublic({
                            skill_id: value,
                          });
                          const normalize = (res: unknown): OptionItem[] => {
                            const dataPart = (res as { data?: unknown })?.data;
                            const arr: unknown[] = Array.isArray(res)
                              ? (res as unknown[])
                              : Array.isArray(dataPart)
                              ? (dataPart as unknown[])
                              : [];
                            return arr.map((i) => {
                              const obj = i as Record<string, unknown>;
                              const id = String(
                                obj.id ?? obj.value ?? obj.key ?? ""
                              );
                              const name = String(
                                obj.name ??
                                  obj.title ??
                                  obj.label ??
                                  obj.id ??
                                  id
                              );
                              return { id, name };
                            });
                          };
                          setTopics(normalize(topicsRes));
                        } else {
                          setTopics([]);
                        }
                      } catch (_) {
                        setTopics([]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((s) => (
                        <SelectItem key={String(s.id)} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Topic</Label>
                  <Select
                    value={filters.topic_id}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, topic_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((t) => (
                        <SelectItem key={String(t.id)} value={String(t.id)}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tag Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">By Tag</Label>
                  <Select
                    value={filters.tag_id}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, tag_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={String(tag.id)} value={String(tag.id)}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
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
                          className="text-sm cursor-pointer font-normal"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPage(1);
                      setHasSearched(true);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Questions Display Panel */}
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
                    {questions.map((q) => (
                      <Card key={q.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="font-medium text-lg">
                                {q.text || "Question"}
                              </div>
                              <Button
                                variant="link"
                                className="p-0 h-auto text-green-600 hover:text-green-800"
                              >
                                View Options
                              </Button>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>
                                  Question Type:{" "}
                                  {q.question_type?.name ||
                                    "Multiple Choice Single Answer"}
                                </div>
                                <div>
                                  Difficulty Level:{" "}
                                  {q.difficulty_level?.name || "Easy"}
                                </div>
                                <div>Marks/Points: 1 XP</div>
                                <div>Attachment: No Attachment</div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {q.code}
                              </div>
                            </div>
                            {new Set(attached.map((a) => Number(a.id))).has(
                              Number(q.id)
                            ) ? (
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
                                onClick={async () => {
                                  await addQuestion(Number(q.id));
                                }}
                              >
                                ADD
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {/* Pagination footer for Add */}
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
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-400">
                    Currently Viewing Practice Set Questions
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {loading
                      ? "Loading..."
                      : `${attached.length} questions in this practice set.`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const res = await api.practiceSets.getQuestions(
                      practiceSetId,
                      { per_page: 1000 }
                    );
                    setAttached(res.data || []);
                  }}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {attached.length === 0 && !loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No questions attached to this practice set yet.</p>
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
                              {q.code}
                            </div>
                            <div className="font-medium text-lg">
                              {q.text || "Question"}
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
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(Number(q.id))}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {/* Pagination footer for View */}
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
