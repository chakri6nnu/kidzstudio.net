import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, RotateCcw, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getQuestionsApi,
  attachSectionQuestions,
  removeSectionQuestion,
  getSectionQuestions,
  getQuestionTypesApi,
  type Question,
  getSectionsApi as getSectionsPublic,
  getSkillsApi as getSkillsPublic,
  getTopicsApi as getTopicsPublic,
  getTagsApi as getTagsPublic,
} from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ExamQuestionsTabProps {
  examId?: string;
  examData?: unknown;
  onSave?: (data: Record<string, unknown>) => Promise<void>;
}

export default function ExamQuestionsTab({
  examId,
  examData,
  onSave,
}: ExamQuestionsTabProps) {
  const [filters, setFilters] = useState({
    code: "",
    type: "",
    section_id: "",
    skill_id: "",
    topic_id: "",
    tag_id: "",
    difficulty: [] as string[],
    date_from: "",
    date_to: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachedQuestions, setAttachedQuestions] = useState<Question[]>([]);
  // Pagination state for Add tab
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  // Pagination state for View tab (client-side over attachedQuestions)
  const [viewPage, setViewPage] = useState(1);
  const [viewPerPage, setViewPerPage] = useState(20);
  const [attachedTotal, setAttachedTotal] = useState<number | null>(null);
  // Search trigger flag for Add tab
  const [hasSearched, setHasSearched] = useState(false);
  // Force trigger for searches even if page/perPage unchanged
  const [searchNonce, setSearchNonce] = useState(0);

  // Dynamic data for dropdowns
  type OptionItem = { id: number | string; name: string };
  const [sections, setSections] = useState<OptionItem[]>([]);
  const [skills, setSkills] = useState<OptionItem[]>([]);
  const [topics, setTopics] = useState<OptionItem[]>([]);
  const [tags, setTags] = useState<OptionItem[]>([]);
  const [questionTypes, setQuestionTypes] = useState<OptionItem[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");
  const showAddQuestions = activeTab === "add";
  const showViewQuestions = activeTab === "view";

  // Load dynamic data for dropdowns
  const asString = (v: unknown): string =>
    typeof v === "string" ? v : String(v ?? "");

  const loadDynamicData = async (): Promise<void> => {
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
          const id = asString(obj.id);
          const sectionName = (obj as Record<string, unknown>)?.section;
          const name = asString(obj.name ?? sectionName ?? obj.title ?? obj.id);
          return { id, name };
        });
      };

      // Minimal, single-batch lookups. No admin fallbacks; frontend will still work with static types if needed.
      const [sectionsRes, skillsRes, tagsRes, typesRes] = await Promise.all([
        examId ? api.exams.getSections(String(examId)) : getSectionsPublic(),
        getSkillsPublic(),
        getTagsPublic(),
        getQuestionTypesApi(),
      ]);

      const normSections = normalize(sectionsRes);
      const normSkills = normalize(skillsRes);
      const normTags = normalize(tagsRes);
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

      setSections(normSections);
      setSkills(normSkills);
      setTags(normTags);
      setQuestionTypes(normTypes);
      // topics are loaded on-demand when a skill is chosen
      setTopics([]);
    } catch (error) {
      console.error("Failed to load dynamic data:", error);
    }
  };

  const load = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const { data, meta } = await getQuestionsApi({
        ...filters,
        page,
        per_page: perPage,
      });
      setQuestions(data);
      if (meta && typeof meta.total === "number") {
        setTotal(meta.total);
      }
    } catch (e: unknown) {
      // Retry once without pagination params in case backend doesn't support them
      try {
        const { data, meta } = await getQuestionsApi({ ...filters });
        setQuestions(data);
        if (meta && typeof meta.total === "number") {
          setTotal(meta.total);
        } else {
          setTotal(data?.length || 0);
        }
      } catch (e2: unknown) {
        const message =
          e2 instanceof Error ? e2.message : "Failed to load questions";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      code: "",
      type: "",
      section_id: "",
      skill_id: "",
      topic_id: "",
      tag_id: "",
      difficulty: [],
      date_from: "",
      date_to: "",
    });
  };

  useEffect(() => {
    // intentionally not adding as dependency to avoid re-creating function warnings
    loadDynamicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load only when user searches or changes pagination after first search
  useEffect(() => {
    if (!hasSearched) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchNonce, page, perPage]);

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

  const handleSave = () => {
    if (onSave) {
      onSave({ filters, selectedQuestions: [] });
    }
  };

  const getActiveSectionId = (): number | null => {
    const sections = (examData as Record<string, unknown>)?.sections as
      | Array<Record<string, unknown>>
      | undefined;
    const first = sections?.[0];
    if (!first) return null;
    // sections may have id as string
    const id =
      (first as Record<string, unknown>).id ??
      (first as Record<string, unknown>).section_id;
    return Number(id || 0) || null;
  };

  const loadAttached = async (): Promise<void> => {
    if (!examId) return;
    const sectionId = getActiveSectionId();
    if (!sectionId) return;
    try {
      setLoading(true);
      // ask backend for a high per_page to retrieve all; fallback to data length
      const res = await getSectionQuestions(Number(examId), sectionId, {
        per_page: 1000,
      });
      setAttachedQuestions(res.data || []);
      if (res.meta && typeof res.meta.total === "number") {
        setAttachedTotal(res.meta.total);
      } else {
        setAttachedTotal((res.data || []).length);
      }
    } catch (e: unknown) {
      // ignore silently in view
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (questionId: number) => {
    if (!examId) {
      toast.error("Create and save exam first");
      return;
    }
    const sectionId = getActiveSectionId();
    if (!sectionId) {
      toast.error("Add at least one section first");
      return;
    }
    try {
      await attachSectionQuestions(Number(examId), sectionId, [questionId]);
      toast.success("Question added to section");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to add question";
      toast.error(message);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    if (!examId) return;
    const sectionId = getActiveSectionId();
    if (!sectionId) return;
    try {
      await removeSectionQuestion(Number(examId), sectionId, questionId);
      toast.success("Question removed from section");
      if (showViewQuestions) {
        loadAttached();
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to remove question";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (showViewQuestions) {
      loadAttached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showViewQuestions, examId]);

  return (
    <div className="flex">
      {/* Content Area only (no sidebar) */}
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
            {/* Header */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800 dark:text-green-400">
                  Currently Adding Daily Practice Section Questions
                </h4>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-green-600 dark:text-green-400 p-0 h-auto hover:no-underline"
                    onClick={() => {
                      setPage(1);
                      setHasSearched(true);
                      setSearchNonce((n) => n + 1);
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

                {/* Code Filter */}
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

                {/* Question Type Filter */}
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

                {/* Section Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Section</Label>
                  <Select
                    value={filters.section_id}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        section_id: value,
                        skill_id: "",
                        topic_id: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((s) => (
                        <SelectItem key={String(s.id)} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skill Filter */}
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
                      // Load topics only when skill selected
                      try {
                        if (value) {
                          const topicsResp = await getTopicsPublic({
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
                              const id = asString(obj.id);
                              const name = asString(
                                obj.name ?? obj.title ?? obj.id
                              );
                              return { id, name };
                            });
                          };
                          setTopics(normalize(topicsResp));
                        } else {
                          setTopics([]);
                        }
                      } catch (_) {
                        console.warn(
                          "Failed to load topics for selected skill"
                        );
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

                {/* Topic Filter */}
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

                {/* By Tag Filter */}
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

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date From</Label>
                    <Input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          date_from: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date To</Label>
                    <Input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          date_to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Difficulty Level Filter */}
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
                    onClick={resetFilters}
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
                      setSearchNonce((n) => n + 1);
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
                            {/* Added/ADD button */}
                            {new Set(
                              attachedQuestions.map((a) => Number(a.id))
                            ).has(Number(q.id)) ? (
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
                                  await handleAddQuestion(Number(q.id));
                                  await loadAttached();
                                }}
                              >
                                ADD
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {/* Pagination controls for Add tab */}
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
                    Currently Viewing Daily Practice Section Questions
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {loading
                      ? "Loading..."
                      : `${
                          attachedTotal ?? attachedQuestions.length
                        } questions in this section.`}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadAttached}>
                  Refresh
                </Button>
              </div>
            </div>

            {attachedQuestions.length === 0 && !loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No questions attached to this section yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attachedQuestions
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
                            onClick={() => handleRemoveQuestion(Number(q.id))}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {/* Pagination controls for View tab */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    Page {viewPage} of{" "}
                    {Math.max(
                      1,
                      Math.ceil(attachedQuestions.length / viewPerPage)
                    )}
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
                          p * viewPerPage < attachedQuestions.length ? p + 1 : p
                        )
                      }
                      disabled={
                        viewPage * viewPerPage >= attachedQuestions.length
                      }
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
