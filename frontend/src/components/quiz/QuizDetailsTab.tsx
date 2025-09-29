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

const quizDetailsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  sub_category_id: z.string().min(1, "Sub Category is required"),
  quiz_type: z.string().min(1, "Quiz Type is required"),
  is_paid: z.boolean().default(false),
  price: z.number().min(0).optional(),
  can_redeem: z.boolean().default(false),
  points_required: z.number().min(0).optional(),
  description: z.string().optional(),
  is_private: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type QuizDetailsData = z.infer<typeof quizDetailsSchema>;

interface QuizDetailsTabProps {
  quizData?: any;
  onSave: (data: QuizDetailsData) => void;
  categories: Array<{ id: string; name: string; }>;
  quizTypes: Array<{ id: string; name: string; }>;
}

export default function QuizDetailsTab({ quizData, onSave, categories, quizTypes }: QuizDetailsTabProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<QuizDetailsData>({
    resolver: zodResolver(quizDetailsSchema),
    defaultValues: {
      title: quizData?.title || "",
      sub_category_id: quizData?.sub_category_id || "",
      quiz_type: quizData?.quiz_type || "",
      is_paid: quizData?.is_paid || false,
      price: quizData?.price || 0,
      can_redeem: quizData?.can_redeem || false,
      points_required: quizData?.points_required || 0,
      description: quizData?.description || "",
      is_private: quizData?.is_private || false,
      is_active: quizData?.is_active || true,
    }
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
                      placeholder="Basic Math Quiz" 
                      {...field} 
                    />
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
                name="quiz_type"
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
                      <FormLabel className="text-base font-medium">Free</FormLabel>
                      <FormDescription>
                        Paid (Accessible to only paid users). Free (Anyone can access).
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
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                      placeholder="Enter quiz description..."
                      className="min-h-[120px]"
                      {...field}
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
                      <FormLabel className="text-base font-medium">Visibility - Public</FormLabel>
                      <FormDescription>
                        Private (Only scheduled user groups can access). Public (Anyone can access).
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