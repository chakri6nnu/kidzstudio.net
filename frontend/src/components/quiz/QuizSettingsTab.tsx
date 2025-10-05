import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const quizSettingsSchema = z
  .object({
    auto_duration: z.boolean().default(true),
    duration_minutes: z.number().min(1).optional(),
    auto_grading: z.boolean().default(true),
    marks_per_correct: z.number().min(0).optional(),
    negative_marking: z.boolean().default(false),
    overall_pass_percentage: z.number().min(0).max(100).default(60),
    enable_section_cutoff: z.boolean().default(false),
    shuffle_questions: z.boolean().default(false),
    restrict_attempts: z.boolean().default(false),
    attempts_count: z.number().min(1).optional(),
    disable_finish_button: z.boolean().default(false),
    enable_question_list_view: z.boolean().default(true),
    hide_solutions: z.boolean().default(false),
    show_leaderboard: z.boolean().default(true),
  })
  .refine(
    (d) => d.auto_duration || (!!d.duration_minutes && d.duration_minutes > 0),
    {
      path: ["duration_minutes"],
      message: "Duration (Minutes) is required when Duration Mode is Manual",
    }
  )
  .refine(
    (d) => d.auto_grading || (!!d.marks_per_correct && d.marks_per_correct > 0),
    {
      path: ["marks_per_correct"],
      message:
        "Marks for Correct Answer is required when Marks/Points Mode is Manual",
    }
  )
  .refine(
    (d) => !d.restrict_attempts || (!!d.attempts_count && d.attempts_count > 0),
    {
      path: ["attempts_count"],
      message:
        "Number of Attempts is required when Restrict Attempts is enabled",
    }
  );

type QuizSettingsData = z.infer<typeof quizSettingsSchema>;

interface QuizSettingsTabProps {
  quizData?: any;
  onSave: (data: QuizSettingsData) => void;
}

export default function QuizSettingsTab({
  quizData,
  onSave,
}: QuizSettingsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<QuizSettingsData>({
    resolver: zodResolver(quizSettingsSchema),
    defaultValues: {
      auto_duration: quizData?.auto_duration ?? true,
      duration_minutes: quizData?.duration_minutes ?? undefined,
      auto_grading: quizData?.auto_grading ?? true,
      marks_per_correct: quizData?.marks_per_correct ?? undefined,
      negative_marking: quizData?.negative_marking ?? false,
      overall_pass_percentage: quizData?.overall_pass_percentage ?? 60,
      enable_section_cutoff: quizData?.enable_section_cutoff ?? false,
      shuffle_questions: quizData?.shuffle_questions ?? false,
      restrict_attempts: quizData?.restrict_attempts ?? false,
      attempts_count: quizData?.attempts_count ?? undefined,
      disable_finish_button: quizData?.disable_finish_button ?? false,
      enable_question_list_view: quizData?.enable_question_list_view ?? true,
      hide_solutions: quizData?.hide_solutions ?? false,
      show_leaderboard: quizData?.show_leaderboard ?? true,
    },
  });

  const handleSubmit = async (data: QuizSettingsData) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const SettingItem = ({
    label,
    description,
    tooltipContent,
    value,
    onChange,
    hasInfo = true,
  }: {
    label: string;
    description?: string;
    tooltipContent?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    hasInfo?: boolean;
  }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-medium">{label}</FormLabel>
          {hasInfo && tooltipContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {description && <FormDescription>{description}</FormDescription>}
      </div>
      <FormControl>
        <Switch checked={value} onCheckedChange={onChange} />
      </FormControl>
    </FormItem>
  );

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>
            Configure quiz behavior and student experience settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="auto_duration"
                    render={({ field }) => (
                      <SettingItem
                        label="Duration Mode"
                        description="Automatically calculate quiz duration based on questions"
                        tooltipContent="When enabled, the system automatically calculates the total quiz duration based on the number of questions and their complexity."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Duration (Minutes) - required if manual */}
                  {!form.watch("auto_duration") && (
                    <FormField
                      control={form.control}
                      name="duration_minutes"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 rounded-lg border p-4">
                          <FormLabel>Duration (Minutes) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Enter Duration (in Minutes)"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value || "0"))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="auto_grading"
                    render={({ field }) => (
                      <SettingItem
                        label="Marks/Points Mode"
                        description="Automatically grade quiz responses"
                        tooltipContent="When enabled, the system automatically grades answers for multiple choice, true/false, and other objective questions."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Marks for Correct Answer - required if manual */}
                  {!form.watch("auto_grading") && (
                    <FormField
                      control={form.control}
                      name="marks_per_correct"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 rounded-lg border p-4">
                          <FormLabel>Marks for Correct Answer *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="1.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseFloat(e.target.value || "0")
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="negative_marking"
                    render={({ field }) => (
                      <SettingItem
                        label="Negative Marking"
                        description="Deduct marks for incorrect answers"
                        tooltipContent="When enabled, students lose points for incorrect answers. This discourages random guessing and promotes careful consideration."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Overall Pass Percentage */}
                  <FormField
                    control={form.control}
                    name="overall_pass_percentage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-base font-medium">
                              Pass Percentage*
                            </FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>
                                  Set the minimum percentage score required for
                                  a student to pass the quiz.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormDescription>
                            Enter required percentage to pass (e.g., 60%)
                          </FormDescription>
                        </div>
                        <div className="w-24">
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value || "0")
                                  )
                                }
                                className="pr-10 text-right"
                                placeholder="60"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enable_section_cutoff"
                    render={({ field }) => (
                      <SettingItem
                        label="Enable Section Cutoff"
                        description="Set minimum percentage for each section"
                        tooltipContent="When enabled, students must achieve a minimum score in each quiz section individually."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shuffle_questions"
                    render={({ field }) => (
                      <SettingItem
                        label="Shuffle Questions"
                        description="Randomize question order for each student"
                        tooltipContent="When enabled, questions appear in a different random order for each student to prevent cheating."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restrict_attempts"
                    render={({ field }) => (
                      <SettingItem
                        label="Restrict Attempts"
                        description="Limit number of quiz attempts per student"
                        tooltipContent="When enabled, students can only take the quiz a limited number of times."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* Number of Attempts - required if restricted */}
                  {form.watch("restrict_attempts") && (
                    <FormField
                      control={form.control}
                      name="attempts_count"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 rounded-lg border p-4">
                          <FormLabel>Number of Attempts *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Enter Number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value || "0"))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="disable_finish_button"
                    render={({ field }) => (
                      <SettingItem
                        label="Disable Finish Button"
                        description="Hide early finish option"
                        tooltipContent="When enabled, students cannot submit the quiz before the allocated time expires."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enable_question_list_view"
                    render={({ field }) => (
                      <SettingItem
                        label="Enable Question List View"
                        description="Show question navigation panel"
                        tooltipContent="When enabled, students can see a sidebar with all questions and navigate directly to specific questions."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hide_solutions"
                    render={({ field }) => (
                      <SettingItem
                        label="Hide Solutions"
                        description="Don't show correct answers after completion"
                        tooltipContent="When enabled, students won't see the correct answers or explanations after completing the quiz."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="show_leaderboard"
                    render={({ field }) => (
                      <SettingItem
                        label="Show Leaderboard"
                        description="Display ranking after quiz completion"
                        tooltipContent="When enabled, students can see their rank compared to other participants after completing the quiz."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-success hover:bg-success/90 text-white px-8"
                >
                  {saving ? "UPDATING..." : "UPDATE"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
