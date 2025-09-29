import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";  
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const practiceSetSettingsSchema = z.object({
  allow_reward_points: z.boolean().default(true),
  show_reward_popup: z.boolean().default(true),
  points_mode: z.enum(["auto", "manual"]).default("auto"),
});

type PracticeSetSettingsData = z.infer<typeof practiceSetSettingsSchema>;

interface PracticeSetSettingsTabProps {
  practiceSetData?: any;
  onSave: (data: PracticeSetSettingsData) => void;
}

export default function PracticeSetSettingsTab({ practiceSetData, onSave }: PracticeSetSettingsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<PracticeSetSettingsData>({
    resolver: zodResolver(practiceSetSettingsSchema),
    defaultValues: {
      allow_reward_points: practiceSetData?.allow_reward_points ?? true,
      show_reward_popup: practiceSetData?.show_reward_popup ?? true,
      points_mode: practiceSetData?.points_mode ?? "auto",
    }
  });

  const handleSubmit = async (data: PracticeSetSettingsData) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const ToggleButton = ({ isActive, children, onClick }: { isActive: boolean; children: React.ReactNode; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {children}
    </button>
  );

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-primary cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Set Settings</CardTitle>
        <CardDescription>
          Configure practice set behavior and reward system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Allow Reward Points */}
                <FormField
                  control={form.control}
                  name="allow_reward_points"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-semibold text-gray-800">Allow Reward Points</FormLabel>
                          <InfoTooltip content="Enable students to earn reward points for completing practice sets." />
                        </div>
                        <div className="flex border rounded-md overflow-hidden">
                          <ToggleButton 
                            isActive={field.value} 
                            onClick={() => field.onChange(true)}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton 
                            isActive={!field.value} 
                            onClick={() => field.onChange(false)}
                          >
                            No
                          </ToggleButton>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Points Mode */}
                <FormField
                  control={form.control}
                  name="points_mode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-semibold text-gray-800">Points Mode</FormLabel>
                          <InfoTooltip content="Auto: System calculates points automatically. Manual: Set custom points for each question." />
                        </div>
                        <div className="flex border rounded-md overflow-hidden">
                          <ToggleButton 
                            isActive={field.value === "auto"} 
                            onClick={() => field.onChange("auto")}
                          >
                            Auto
                          </ToggleButton>
                          <ToggleButton 
                            isActive={field.value === "manual"} 
                            onClick={() => field.onChange("manual")}
                          >
                            Manual
                          </ToggleButton>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Show Reward Popup */}
                <FormField
                  control={form.control}
                  name="show_reward_popup"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-semibold text-gray-800">Show Reward Popup</FormLabel>
                          <InfoTooltip content="Display a congratulations popup when students earn reward points." />
                        </div>
                        <div className="flex border rounded-md overflow-hidden">
                          <ToggleButton 
                            isActive={field.value} 
                            onClick={() => field.onChange(true)}
                          >
                            Yes
                          </ToggleButton>
                          <ToggleButton 
                            isActive={!field.value} 
                            onClick={() => field.onChange(false)}
                          >
                            No
                          </ToggleButton>
                        </div>
                      </div>
                    </FormItem>
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
  );
}