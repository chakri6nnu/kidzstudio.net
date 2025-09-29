import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Editor, { EditorRef } from "@/components/ui/editor";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Globe, Lock, User } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.any().optional(), // EditorJS OutputData
  excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  type: z.enum(["page", "post", "landing"]),
  featured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  seoTitle: z.string().max(60, "SEO title must be less than 60 characters").optional(),
  seoDescription: z.string().max(160, "SEO description must be less than 160 characters").optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  publishDate: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  template: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PageFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PageForm({ initialData, onSubmit, onCancel, isLoading = false }: PageFormProps) {
  const editorRef = useRef<EditorRef>(null);
  const [editorData, setEditorData] = React.useState<OutputData | undefined>(initialData?.content);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: undefined,
      excerpt: "",
      status: "draft",
      type: "page",
      featured: false,
      allowComments: true,
      seoTitle: "",
      seoDescription: "",
      tags: "",
      category: "",
      publishDate: "",
      author: "Current User",
      template: "default",
      ...initialData,
    },
  });

  const watchTitle = form.watch("title");
  const watchStatus = form.watch("status");

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchTitle && !initialData?.slug) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, initialData]);

  const handleSubmit = async (data: FormData) => {
    try {
      if (editorRef.current) {
        const editorContent = await editorRef.current.save();
        onSubmit({ ...data, content: editorContent });
      } else {
        onSubmit({ ...data, content: editorData });
      }
    } catch (error) {
      console.error("Error saving editor content:", error);
      onSubmit(data);
    }
  };

  const handleEditorChange = (data: OutputData) => {
    setEditorData(data);
    form.setValue("content", data);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
      published: { label: "Published", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    };

    const variant = variants[status as keyof typeof variants] || variants.draft;

    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>The main content and details of your page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="page-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL-friendly version of the title (auto-generated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the page content..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short summary that appears in search results and previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <FormLabel>Content</FormLabel>
                  <Editor
                    ref={editorRef}
                    data={editorData}
                    onChange={handleEditorChange}
                    placeholder="Write your page content here..."
                    className="min-h-[300px]"
                  />
                  <FormDescription>
                    The main content of your page using the block-styled editor
                  </FormDescription>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your page for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Custom title for search engines..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use the page title (recommended length: 50-60 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Meta description for search engines..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Appears in search results (recommended length: 150-160 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Publish</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="pt-2">
                        {getStatusBadge(field.value)}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchStatus === "scheduled" && (
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-between items-center space-x-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Page"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Page Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="post">Blog Post</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="full-width">Full Width</SelectItem>
                          <SelectItem value="sidebar">With Sidebar</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Page</FormLabel>
                        <FormDescription>
                          Display this page prominently on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Comments</FormLabel>
                        <FormDescription>
                          Enable comments for this page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Categories and Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
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
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="tutorials">Tutorials</SelectItem>
                          <SelectItem value="announcements">Announcements</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="tag1, tag2, tag3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}