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

const quizDetailsSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    sub_category_id: z.string().min(1, "Sub Category is required"),
    quiz_type: z.string().min(1, "Quiz Type is required"),
    is_paid: z.boolean().default(false),
    can_redeem: z.boolean().default(false),
    points_required: z.number().min(0).optional(),
    description: z.string().optional(),
    is_private: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine(
    (d) => !(d.can_redeem && (!d.points_required || d.points_required <= 0)),
    {
      path: ["points_required"],
      message:
        "Points Required to Redeem is required when Can access with Points is enabled",
    }
  );

type QuizDetailsData = z.infer<typeof quizDetailsSchema>;

interface QuizDetailsTabProps {
  quizData?: any;
  onSave: (data: QuizDetailsData) => void;
  categories: Array<{ id: string; name: string }>;
  quizTypes: Array<{ id: string; name: string }>;
}

export default function QuizDetailsTab({
  quizData,
  onSave,
  categories,
  quizTypes,
}: QuizDetailsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<QuizDetailsData>({
    resolver: zodResolver(quizDetailsSchema),
    defaultValues: {
      title: quizData?.title || "",
      sub_category_id: quizData?.sub_category_id || "",
      quiz_type: quizData?.quiz_type || "",
      is_paid: quizData?.is_paid || false,
      can_redeem: quizData?.can_redeem || false,
      points_required: quizData?.points_required || 0,
      description: quizData?.description || "",
      is_private: quizData?.is_private || false,
      is_active: quizData?.is_active || true,
    },
  });

  const isPaid = form.watch("is_paid");
  const canRedeem = form.watch("can_redeem");

  const handleSubmit = async (data: QuizDetailsData) => {
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
        <CardTitle>Quiz Details</CardTitle>
        <CardDescription>
          Configure basic quiz information and access settings
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
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Basic Math Quiz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category and Quiz Type */}
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
                name="quiz_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {quizTypes.map((type) => (
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

            {/* Free/Paid Access */}
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

              {isPaid && (
                <>
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
                              step="1"
                              placeholder="e.g. 100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseInt(e.target.value || "0", 10)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Yes (User should redeem with points to access exam).
                            No (Anyone can access).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </div>

            {/* Description (use same rich editor as exam) */}
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
                                return {
                                  blocks: [
                                    {
                                      type: "paragraph",
                                      data: { text: field.value },
                                    },
                                  ],
                                };
                              }
                            })()
                          : {}
                      }
                      onChange={(data) => field.onChange(JSON.stringify(data))}
                      placeholder="Enter quiz description..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility Settings (same phrasing as exam) */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Visibility - {field.value ? "Private" : "Public"}
                      </FormLabel>
                      <FormDescription>
                        {field.value
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={saving}
                className="bg-success hover:bg-success/90 text-white px-8"
              >
                {saving ? "UPDATING..." : "SAVE & PROCEED"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
