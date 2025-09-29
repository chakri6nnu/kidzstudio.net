import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Save, Calendar as CalendarIcon, Clock, Users, Settings, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const quizSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  type: z.enum(["practice", "mock", "live", "assignment"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().min(5, "Minimum 5 minutes").max(480, "Maximum 8 hours"),
  total_marks: z.number().min(1, "Minimum 1 mark"),
  passing_marks: z.number().min(0, "Cannot be negative"),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  instructions: z.string().optional(),
  is_public: z.boolean().default(true),
  show_results_immediately: z.boolean().default(false),
  allow_review: z.boolean().default(true),
  shuffle_questions: z.boolean().default(false),
  negative_marking: z.boolean().default(false),
  negative_marks_per_question: z.number().min(0).default(0),
  max_attempts: z.number().min(1, "Minimum 1 attempt").max(10, "Maximum 10 attempts").default(1),
  question_selection: z.enum(["all", "random"]).default("all"),
  questions_per_quiz: z.number().optional(),
  tags: z.array(z.string()).optional()
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return data.end_date > data.start_date;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
}).refine((data) => {
  return data.passing_marks <= data.total_marks;
}, {
  message: "Passing marks cannot exceed total marks",
  path: ["passing_marks"],
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormProps {
  quiz?: any;
  onSubmit: (data: QuizFormData) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string; }>;
}

export default function QuizForm({ quiz, onSubmit, onCancel, categories }: QuizFormProps) {
  const [tags, setTags] = useState<string[]>(quiz?.tags || []);
  const [newTag, setNewTag] = useState("");

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      category_id: quiz?.category_id || "",
      type: quiz?.type || "practice",
      difficulty: quiz?.difficulty || "medium",
      duration: quiz?.duration || 60,
      total_marks: quiz?.total_marks || 100,
      passing_marks: quiz?.passing_marks || 40,
      start_date: quiz?.start_date ? new Date(quiz.start_date) : undefined,
      end_date: quiz?.end_date ? new Date(quiz.end_date) : undefined,
      instructions: quiz?.instructions || "",
      is_public: quiz?.is_public ?? true,
      show_results_immediately: quiz?.show_results_immediately ?? false,
      allow_review: quiz?.allow_review ?? true,
      shuffle_questions: quiz?.shuffle_questions ?? false,
      negative_marking: quiz?.negative_marking ?? false,
      negative_marks_per_question: quiz?.negative_marks_per_question || 0,
      max_attempts: quiz?.max_attempts || 1,
      question_selection: quiz?.question_selection || "all",
      questions_per_quiz: quiz?.questions_per_quiz,
      tags: quiz?.tags || []
    }
  });

  const watchedType = form.watch("type");
  const watchedNegativeMarking = form.watch("negative_marking");
  const watchedQuestionSelection = form.watch("question_selection");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (data: QuizFormData) => {
    onSubmit({ ...data, tags });
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {quiz ? "Edit Quiz" : "Create New Quiz"}
        </CardTitle>
        <CardDescription>
          {quiz ? "Update quiz configuration and settings" : "Set up a new quiz with questions and rules"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Basic Math Quiz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="practice">Practice Quiz</SelectItem>
                          <SelectItem value="mock">Mock Quiz</SelectItem>
                          <SelectItem value="live">Live Quiz</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="5"
                            max="480"
                            className="pl-10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>5 minutes to 8 hours</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the quiz..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Scoring & Attempts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scoring & Attempts</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="total_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Marks</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passing_marks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Marks</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_attempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attempts</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            className="pl-10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Negative Marking */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="negative_marking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Negative Marking</FormLabel>
                        <FormDescription>
                          Enable negative marking for incorrect answers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchedNegativeMarking && (
                  <FormField
                    control={form.control}
                    name="negative_marks_per_question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negative Marks per Question</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="0.25"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Marks deducted for each incorrect answer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter quiz instructions for students..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These instructions will be shown to students before they start the quiz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quiz Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Quiz</FormLabel>
                        <FormDescription>
                          Make this quiz visible to all students
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_results_immediately"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Results</FormLabel>
                        <FormDescription>
                          Show results immediately after completion
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allow_review"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Review</FormLabel>
                        <FormDescription>
                          Students can review their answers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shuffle_questions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Shuffle Questions</FormLabel>
                        <FormDescription>
                          Randomize question order for each student
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Question Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Selection</h3>
              
              <FormField
                control={form.control}
                name="question_selection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selection Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Questions</SelectItem>
                        <SelectItem value="random">Random Selection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedQuestionSelection === "random" && (
                <FormField
                  control={form.control}
                  name="questions_per_quiz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questions per Quiz</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of questions to select randomly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success/90 text-white">
                <Save className="h-4 w-4 mr-2" />
                {quiz ? "Update Quiz" : "Create Quiz"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}