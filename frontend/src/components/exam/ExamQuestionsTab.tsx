import { useState } from "react";
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
import { Filter, Plus } from "lucide-react";
import { useEffect } from "react";
import {
  getQuestionsApi,
  attachSectionQuestions,
  removeSectionQuestion,
} from "@/lib/utils";
import { toast } from "sonner";

interface ExamQuestionsTabProps {
  examId?: string;
  examData?: any;
  onSave?: (data: any) => Promise<void>;
}

export default function ExamQuestionsTab({
  examId,
  examData,
  onSave,
}: ExamQuestionsTabProps) {
  const [filters, setFilters] = useState({
    code: "",
    type: "",
    section: "",
    skill: "",
    topic: "",
    byTag: "",
    difficulty: [] as string[],
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getQuestionsApi(filters);
      setQuestions(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.code,
    filters.type,
    filters.section,
    filters.skill,
    filters.topic,
    filters.byTag,
    JSON.stringify(filters.difficulty),
  ]);

  const questionTypes = [
    { id: "mcsa", label: "Multiple Choice Single Answer" },
    { id: "mcma", label: "Multiple Choice Multiple Answers" },
    { id: "tf", label: "True or False" },
    { id: "sa", label: "Short Answer" },
    { id: "mtf", label: "Match the Following" },
    { id: "os", label: "Ordering/Sequence" },
    { id: "fitb", label: "Fill in the Blanks" },
  ];

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
    const first = examData?.sections?.[0];
    if (!first) return null;
    // sections may have id as string
    return Number(first.id || first.section_id || 0) || null;
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
    } catch (e: any) {
      toast.error(e?.message || "Failed to add question");
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    if (!examId) return;
    const sectionId = getActiveSectionId();
    if (!sectionId) return;
    try {
      await removeSectionQuestion(Number(examId), sectionId, questionId);
      toast.success("Question removed from section");
    } catch (e: any) {
      toast.error(e?.message || "Failed to remove question");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Questions</CardTitle>
          <CardDescription>
            Select and filter questions for this exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              {/* Code Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Code</Label>
                <Input
                  placeholder="Enter Code"
                  value={filters.code}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, code: e.target.value }))
                  }
                />
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
                    <div key={type.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <Label
                        htmlFor={type.id}
                        className="text-sm text-yellow-500 cursor-pointer font-normal"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Section Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Section</Label>
                <Input
                  placeholder="Enter Section"
                  value={filters.section}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, section: e.target.value }))
                  }
                />
              </div>

              {/* Skill Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Skill</Label>
                <Input
                  placeholder="Enter Skill"
                  value={filters.skill}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, skill: e.target.value }))
                  }
                />
              </div>

              {/* Topic Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Topic</Label>
                <Input
                  placeholder="Enter Topic"
                  value={filters.topic}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, topic: e.target.value }))
                  }
                />
              </div>

              {/* By Tag Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">By Tag</Label>
                <Select
                  value={filters.byTag}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, byTag: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Level Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
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
            </div>

            {/* Questions Display Panel */}
            <div className="lg:col-span-3 space-y-4">
              {/* Current Selection Info */}
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800 dark:text-green-400">
                    Currently Viewing Questions
                  </h4>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-green-600 dark:text-green-400 p-0 h-auto hover:no-underline"
                      onClick={load}
                    >
                      Refresh
                    </Button>
                    <span className="text-green-600 dark:text-green-400">
                      |
                    </span>
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
                    : `${questions.length} items found for the selected criteria.`}
                </p>
              </div>

              {/* No Questions Message */}
              {error ? (
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
                    adjusting your filters or add new questions.
                  </p>
                  <Button className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Questions
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <Card key={q.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="text-xs text-muted-foreground">
                              {q.code}
                            </div>
                            <div className="font-medium">
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
                              <span>
                                Topic:{" "}
                                <span className="text-foreground">
                                  {q.topic?.name || "-"}
                                </span>
                              </span>
                              <span>
                                Skill:{" "}
                                <span className="text-foreground">
                                  {q.skill?.name || "-"}
                                </span>
                              </span>
                            </div>
                          </div>
                          <Button
                            className="shrink-0"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddQuestion(Number(q.id))}
                          >
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
