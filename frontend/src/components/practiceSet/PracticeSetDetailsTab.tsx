import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const practiceSetDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  sub_category_id: z.string().min(1, "Sub Category is required"),
  skill_id: z.string().min(1, "Skill is required"),
  is_paid: z.boolean().default(false),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type PracticeSetDetailsData = z.infer<typeof practiceSetDetailsSchema>;

interface PracticeSetDetailsTabProps {
  practiceSetData?: any;
  onSave: (data: PracticeSetDetailsData) => void;
  categories: Array<{ id: string; name: string }>;
  skills: Array<{ id: string; name: string }>;
}

export default function PracticeSetDetailsTab({
  practiceSetData,
  onSave,
  categories,
  skills,
}: PracticeSetDetailsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<PracticeSetDetailsData>({
    resolver: zodResolver(practiceSetDetailsSchema),
    defaultValues: {
      title: practiceSetData?.title || "",
      sub_category_id: practiceSetData?.sub_category_id || "",
      skill_id: practiceSetData?.skill_id || "",
      is_paid: practiceSetData?.is_paid || false,
      price: practiceSetData?.price || 0,
      description: practiceSetData?.description || "",
      is_active: practiceSetData?.is_active || true,
    },
  });

  const isPaid = form.watch("is_paid");

  const handleSubmit = async (data: PracticeSetDetailsData) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Set Details</CardTitle>
        <CardDescription>
          Configure basic practice set information and access settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter practice set title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category and Skill */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sub_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                name="skill_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Free/Paid Access */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Free
                      </FormLabel>
                      <FormDescription>
                        Paid (Accessible to only paid users). Free (Anyone can
                        access).
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isPaid && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {/* Rich Text Editor Toolbar */}
                      <div className="flex items-center space-x-1 p-2 border rounded-t-md bg-muted/30">
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm font-bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm italic"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm underline"
                        >
                          U
                        </button>
                        <div className="w-px h-4 bg-border mx-1"></div>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          •
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          1.
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          ⚓
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          🖼️
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          📊
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-muted rounded text-sm"
                        >
                          📹
                        </button>
                      </div>
                      <Textarea
                        placeholder="Enter practice set description..."
                        className="min-h-[120px] rounded-t-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">{`Status - ${
                      field.value ? "Published" : "Draft"
                    }`}</FormLabel>
                    <FormDescription>
                      Published (Shown Everywhere). Draft (Not Shown).
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

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="bg-success hover:bg-success/90 text-white px-8"
              >
                {saving ? "SAVING..." : "SAVE & PROCEED"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
