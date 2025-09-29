import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const examDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  sub_category_id: z.string().min(1, "Sub Category is required"),
  exam_type: z.string().min(1, "Exam Type is required"),
  is_paid: z.boolean().default(false),
  price: z.number().min(0).optional(),
  can_redeem: z.boolean().default(false),
  points_required: z.number().min(0).optional(),
  description: z.string().optional(),
  is_private: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type ExamDetailsData = z.infer<typeof examDetailsSchema>;

interface ExamDetailsTabProps {
  examData?: any;
  onSave: (data: ExamDetailsData) => void;
  categories: Array<{ id: string; name: string; }>;
  examTypes: Array<{ id: string; name: string; }>;
}

export default function ExamDetailsTab({ examData, onSave, categories, examTypes }: ExamDetailsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<ExamDetailsData>({
    resolver: zodResolver(examDetailsSchema),
    defaultValues: {
      title: examData?.title || "",
      sub_category_id: examData?.sub_category_id || "",
      exam_type: examData?.exam_type || "",
      is_paid: examData?.is_paid || false,
      price: examData?.price || 0,
      can_redeem: examData?.can_redeem || false,
      points_required: examData?.points_required || 0,
      description: examData?.description || "",
      is_private: examData?.is_private || false,
      is_active: examData?.is_active || true,
    }
  });

  const isPaid = form.watch("is_paid");
  const canRedeem = form.watch("can_redeem");

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
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
                    <FormLabel>Sub Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mathematics / Numerical Reasoning (UK Grammar School 11+ Exam Preparation)" />
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
                name="exam_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Daily Challenge Question" />
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
                      <FormLabel className="text-base font-medium">Paid</FormLabel>
                      <FormDescription>
                        Paid (Accessible to only paid users). Free (Anyone can access).
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
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Points Access */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="can_redeem"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">Can access with Points (No)</FormLabel>
                      <FormDescription>
                        Yes (User should redeem with points to access exam). No (Anyone can access).
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
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                    <Textarea
                      placeholder="Enter exam description..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Rich text editor functionality can be added here
                  </FormDescription>
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
                      <FormLabel className="text-base font-medium">Visibility - Private</FormLabel>
                      <FormDescription>
                        Private (Only scheduled user groups can access). Public (Anyone can access).
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
                      <FormLabel className="text-base font-medium">Status - Published</FormLabel>
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