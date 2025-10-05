import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditorJs } from "@/components/ui/editor-js";
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
import { Badge } from "@/components/ui/badge";

const examDetailsSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    sub_category_id: z.string().min(1, "Sub Category is required"),
    exam_type_id: z.string().min(1, "Exam Type is required"),
    is_paid: z.boolean().default(false),
    can_redeem: z.boolean().default(false),
    points_required: z.number().min(0).optional(),
    description: z.string().optional(),
    is_private: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // If can_redeem is true, points_required must be provided and greater than 0
      if (
        data.can_redeem &&
        (!data.points_required || data.points_required <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Points Required to Redeem is required when Can access with Points is enabled",
      path: ["points_required"],
    }
  );

type ExamDetailsData = z.infer<typeof examDetailsSchema>;

interface ExamDetailsTabProps {
  examData?: any;
  onSave: (data: ExamDetailsData) => void;
  categories: Array<{ id: string; name: string }>;
  examTypes: Array<{ id: string; name: string }>;
}

export default function ExamDetailsTab({
  examData,
  onSave,
  categories,
  examTypes,
}: ExamDetailsTabProps) {
  const [saving, setSaving] = useState(false);

  // Debug logging
  console.log("ExamDetailsTab - Categories:", categories);
  console.log("ExamDetailsTab - Exam Types:", examTypes);
  console.log("ExamDetailsTab - Exam Data:", examData);

  const form = useForm<ExamDetailsData>({
    resolver: zodResolver(examDetailsSchema),
    defaultValues: {
      title: examData?.title || "",
      sub_category_id: examData?.sub_category_id || "",
      exam_type_id: examData?.exam_type_id || "",
      is_paid: examData?.is_paid || false,
      can_redeem: examData?.can_redeem || false,
      points_required: examData?.points_required || 0,
      description: examData?.description || "",
      is_private: examData?.is_private || false,
      is_active: examData?.is_active || true,
    },
  });

  const isPaid = form.watch("is_paid");
  const canRedeem = form.watch("can_redeem");
  const isPrivate = form.watch("is_private");
  const isActive = form.watch("is_active");

  const handleSubmit = async (data: ExamDetailsData) => {
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
        <CardTitle>Exam Details</CardTitle>
        <CardDescription>
          Configure basic exam information and access settings
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
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="#1 Addition, subtraction, multiplication, division / Number & Arithmetic"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category and Exam Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sub_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Sub Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub category..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exam_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Exam Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Paid Access */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        {isPaid ? "Paid" : "Free"}
                      </FormLabel>
                      <FormDescription>
                        {isPaid
                          ? "Paid (Accessible to only paid users)."
                          : "Free (Anyone can access)."}
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

            {/* Points Access - Only show when paid */}
            {isPaid && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="can_redeem"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          Can access with Points (No)
                        </FormLabel>
                        <FormDescription>
                          Yes (User should redeem with points to access exam).
                          No (Anyone can access).
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

                {canRedeem && (
                  <FormField
                    control={form.control}
                    name="points_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Points Required to Redeem{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <EditorJs
                      data={
                        field.value
                          ? (() => {
                              try {
                                return JSON.parse(field.value);
                              } catch {
                                // If it's not JSON, convert plain text to Editor.js format
                                return {
                                  blocks: [
                                    {
                                      type: "paragraph",
                                      data: {
                                        text: field.value,
                                      },
                                    },
                                  ],
                                };
                              }
                            })()
                          : {}
                      }
                      onChange={(data) => field.onChange(JSON.stringify(data))}
                      placeholder="Enter exam description..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility Settings */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Visibility - {isPrivate ? "Private" : "Public"}
                      </FormLabel>
                      <FormDescription>
                        {isPrivate
                          ? "Private (Only scheduled user groups can access). Public (Anyone can access)."
                          : "Public (Anyone can access). Private (Only scheduled user groups can access)."}
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
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Status - {isActive ? "Published" : "Draft"}
                      </FormLabel>
                      <FormDescription>
                        {isActive
                          ? "Published (Shown Everywhere). Draft (Not Shown)."
                          : "Draft (Not Shown). Published (Shown Everywhere)."}
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

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="bg-success hover:bg-success/90 text-white px-8"
              >
                {saving ? "UPDATING..." : "UPDATE DETAILS"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
