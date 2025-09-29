import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor, { EditorRef } from "@/components/ui/editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, AlertCircle } from "lucide-react";

const questionSchema = z.object({
  title: z.any().optional(), // EditorJS OutputData for question text
  type: z.enum(["multiple_choice", "true_false", "short_answer", "essay", "fill_blank"]),
  category_id: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1, "Points must be at least 1").max(100, "Points cannot exceed 100"),
  explanation: z.any().optional(), // EditorJS OutputData for explanation
  options: z.array(z.object({
    text: z.string().min(1, "Option text is required"),
    is_correct: z.boolean()
  })).optional(),
  correct_answer: z.any().optional(), // EditorJS OutputData for correct answer
  tags: z.array(z.string()).optional()
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: any;
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string; }>;
}

export default function QuestionForm({ question, onSubmit, onCancel, categories }: QuestionFormProps) {
  const [options, setOptions] = useState(question?.options || []);
  const [tags, setTags] = useState<string[]>(question?.tags || []);
  const [newTag, setNewTag] = useState("");
  const questionEditorRef = useRef<EditorRef>(null);
  const explanationEditorRef = useRef<EditorRef>(null);
  const answerEditorRef = useRef<EditorRef>(null);
  const [questionContent, setQuestionContent] = useState<OutputData | undefined>(question?.title);
  const [explanationContent, setExplanationContent] = useState<OutputData | undefined>(question?.explanation);
  const [answerContent, setAnswerContent] = useState<OutputData | undefined>(question?.correct_answer);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question?.title || "",
      type: question?.type || "multiple_choice",
      category_id: question?.category_id || "",
      difficulty: question?.difficulty || "medium",
      points: question?.points || 1,
      explanation: question?.explanation || "",
      options: question?.options || [],
      correct_answer: question?.correct_answer || "",
      tags: question?.tags || []
    }
  });

  const questionType = form.watch("type");

  const addOption = () => {
    setOptions([...options, { text: "", is_correct: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    if (field === "is_correct" && value) {
      // For multiple choice, only one option can be correct
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    setOptions(updatedOptions);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (data: QuestionFormData) => {
    onSubmit({
      ...data,
      options: questionType === "multiple_choice" ? options : undefined,
      tags
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="true_false">True/False</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                    <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                  </SelectContent>
                </Select>
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
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Points awarded for correct answer (1-100)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <Label htmlFor="question-text">Question Text *</Label>
          <Editor
            ref={questionEditorRef}
            data={questionContent}
            onChange={setQuestionContent}
            placeholder="Enter your question here..."
            className="min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground">
            Use the editor to format your question with rich text, images, and more
          </p>
        </div>

        {/* Options for Multiple Choice */}
        {questionType === "multiple_choice" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Answer Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={option.is_correct ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateOption(index, "is_correct", !option.is_correct)}
                >
                  {option.is_correct ? "Correct" : "Mark Correct"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {options.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No options added yet. Click "Add Option" to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Correct Answer for non-multiple choice */}
        {questionType !== "multiple_choice" && (
          <div className="space-y-4">
            <Label htmlFor="correct-answer">Correct Answer *</Label>
            <Editor
              ref={answerEditorRef}
              data={answerContent}
              onChange={setAnswerContent}
              placeholder="Enter the correct answer..."
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Provide the model answer that students should give
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="space-y-4">
          <Label htmlFor="explanation">Explanation (Optional)</Label>
          <Editor
            ref={explanationEditorRef}
            data={explanationContent}
            onChange={setExplanationContent}
            placeholder="Provide an explanation for the correct answer..."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            This explanation will be shown to students after they answer
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>

        <Separator />

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {question ? "Update Question" : "Create Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}