import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const examSettingsSchema = z.object({
  auto_duration: z.boolean().default(true),
  auto_grading: z.boolean().default(true),
  negative_marking: z.boolean().default(false),
  overall_pass_percentage: z.number().min(0).max(100).default(60),
  enable_section_cutoff: z.boolean().default(false),
  shuffle_questions: z.boolean().default(true),
  restrict_attempts: z.boolean().default(true),
  disable_section_navigation: z.boolean().default(true),
  disable_finish_button: z.boolean().default(true),
  enable_question_list_view: z.boolean().default(true),
  hide_solutions: z.boolean().default(true),
  show_leaderboard: z.boolean().default(true),
});

type ExamSettingsData = z.infer<typeof examSettingsSchema>;

interface ExamSettingsTabProps {
  examData?: any;
  onSave: (data: ExamSettingsData) => void;
}

export default function ExamSettingsTab({ examData, onSave }: ExamSettingsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<ExamSettingsData>({
    resolver: zodResolver(examSettingsSchema),
    defaultValues: {
      auto_duration: examData?.auto_duration ?? true,
      auto_grading: examData?.auto_grading ?? true,
      negative_marking: examData?.negative_marking ?? false,
      overall_pass_percentage: examData?.overall_pass_percentage || 60,
      enable_section_cutoff: examData?.enable_section_cutoff ?? false,
      shuffle_questions: examData?.shuffle_questions ?? true,
      restrict_attempts: examData?.restrict_attempts ?? true,
      disable_section_navigation: examData?.disable_section_navigation ?? true,
      disable_finish_button: examData?.disable_finish_button ?? true,
      enable_question_list_view: examData?.enable_question_list_view ?? true,
      hide_solutions: examData?.hide_solutions ?? true,
      show_leaderboard: examData?.show_leaderboard ?? true,
    }
  });

  const handleSubmit = async (data: ExamSettingsData) => {
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
    hasInfo = true 
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
        {description && (
          <FormDescription>{description}</FormDescription>
        )}
      </div>
      <FormControl>
        <Switch
          checked={value}
          onCheckedChange={onChange}
        />
      </FormControl>
    </FormItem>
  );

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Exam Settings</CardTitle>
          <CardDescription>
            Configure exam behavior, grading, and navigation settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Left Column Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="auto_duration"
                    render={({ field }) => (
                      <SettingItem
                        label="Auto Duration"
                        description="Automatically calculate exam duration based on questions"
                        tooltipContent="When enabled, the system automatically calculates the total exam duration based on the number of questions and their complexity. When disabled, you can manually set a specific duration for the exam."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="auto_grading"
                    render={({ field }) => (
                      <SettingItem
                        label="Auto Grading"
                        description="Automatically grade exam responses"
                        tooltipContent="When enabled, the system automatically grades answers for multiple choice, true/false, and other objective questions. Manual grading may still be required for essay questions or subjective responses."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="negative_marking"
                    render={({ field }) => (
                      <SettingItem
                        label="Negative Marking"
                        description="Deduct marks for incorrect answers"
                        tooltipContent="When enabled, students lose points for incorrect answers. This discourages random guessing and promotes careful consideration of answers. You can configure the penalty percentage in advanced settings."
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
                            <FormLabel className="text-base font-medium">Overall Pass Percentage</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>Set the minimum percentage score required for a student to pass the exam. Students scoring below this threshold will be marked as failed.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormDescription>
                            Minimum percentage required to pass the exam
                          </FormDescription>
                        </div>
                        <div className="w-20">
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="text-center"
                            />
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
                        tooltipContent="When enabled, students must achieve a minimum score in each exam section individually, in addition to the overall pass percentage. This ensures competency across all topics."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* Right Column Settings */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shuffle_questions"
                    render={({ field }) => (
                      <SettingItem
                        label="Shuffle Questions"
                        description="Randomize question order for each student"
                        tooltipContent="When enabled, questions appear in a different random order for each student. This helps prevent cheating and ensures fair assessment by reducing the ability to share answers based on question sequence."
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
                        description="Limit number of exam attempts per student"
                        tooltipContent="When enabled, students can only take the exam a limited number of times. You can configure the maximum number of attempts in advanced settings. Useful for formal assessments."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disable_section_navigation"
                    render={({ field }) => (
                      <SettingItem
                        label="Disable Section Navigation"
                        description="Prevent jumping between sections"
                        tooltipContent="When enabled, students must complete questions in order and cannot jump between different exam sections. This is useful for timed sections or when question dependencies exist."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disable_finish_button"
                    render={({ field }) => (
                      <SettingItem
                        label="Disable Finish Button"
                        description="Hide early finish option"
                        tooltipContent="When enabled, students cannot submit the exam before the allocated time expires. This ensures all students have equal time and prevents rushed submissions."
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
                        tooltipContent="When enabled, students can see a sidebar with all questions, their status (answered/unanswered), and navigate directly to specific questions. Helpful for reviewing answers."
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
                        tooltipContent="When enabled, students won't see the correct answers or explanations after completing the exam. Useful for assessments where you don't want to reveal answers immediately."
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
                        description="Display ranking after exam completion"
                        tooltipContent="When enabled, students can see their rank compared to other participants after completing the exam. This gamifies the experience and can motivate performance."
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