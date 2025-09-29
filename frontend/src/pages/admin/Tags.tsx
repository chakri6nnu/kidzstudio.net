import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  Hash,
  Users,
  TrendingUp,
  Palette,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getTagsApi,
  createTagApi,
  updateTagApi,
  deleteTagApi,
  type Tag as ApiTag,
} from "@/lib/utils";

interface TagItem {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  usageCount: number;
  questions: number;
  courses: number;
  createdAt: string;
  updatedAt: string;
}

export default function Tags() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Load tags from API
  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: {
        search?: string;
        status?: string;
        color?: string;
        per_page?: number;
      } = {
        search: searchTerm || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        color: selectedColor !== "all" ? selectedColor : undefined,
      };
      const response = await getTagsApi(filters);

      // Map API response to UI format
      const mappedTags: TagItem[] = response.data.map((t: ApiTag) => ({
        id: t.id.toString(),
        name: t.name,
        description: t.description || "",
        color: t.color || "#3B82F6",
        isActive: t.is_active,
        usageCount: (t.questions_count || 0) + (t.exams_count || 0),
        questions: t.questions_count || 0,
        courses: t.exams_count || 0,
        createdAt: new Date(t.created_at).toLocaleDateString(),
        updatedAt: new Date(t.updated_at).toLocaleDateString(),
      }));

      setTags(mappedTags);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load tags");
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, [searchTerm, selectedStatus, selectedColor]);

  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined colors for tags
  const tagColors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" },
  ];

  // Filter options
  const filters = [
    {
      key: "color",
      type: "select" as const,
      label: "Color",
      value: selectedColor,
      onChange: (value: string) => setSelectedColor(value),
      options: [
        { value: "all", label: "All Colors" },
        ...tagColors.map((color) => ({
          value: color.value,
          label: color.name,
        })),
      ],
    },
    {
      key: "status",
      type: "select" as const,
      label: "Status",
      value: selectedStatus,
      onChange: (value: string) => setSelectedStatus(value),
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  // CRUD operations
  const handleFilterChange = (filterId: string, value: string) => {
    const filter = filters.find((f) => f.key === filterId);
    if (filter) {
      filter.onChange(value);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedColor("all");
    setSelectedStatus("all");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedTag(null);
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (tag: TagItem) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description,
      color: tag.color,
      isActive: tag.isActive,
    });
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (tag: TagItem) => {
    setSelectedTag(tag);
    setIsDeleteDrawerOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.name || !formData.color) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const tagData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        is_active: formData.isActive,
      };

      await createTagApi(tagData);
      setIsAddDrawerOpen(false);
      resetForm();
      toast.success("Tag created successfully!");
      loadTags(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to create tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedTag || !formData.name || !formData.color) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const tagData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        is_active: formData.isActive,
      };

      await updateTagApi(parseInt(selectedTag.id), tagData);
      setIsEditDrawerOpen(false);
      setSelectedTag(null);
      resetForm();
      toast.success("Tag updated successfully!");
      loadTags(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to update tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTag) return;

    try {
      await deleteTagApi(parseInt(selectedTag.id));
      setIsDeleteDrawerOpen(false);
      setSelectedTag(null);
      toast.success("Tag deleted successfully!");
      loadTags(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete tag");
    }
  };

  // Table columns
  const columns = [
    {
      key: "name" as keyof TagItem,
      header: "Tag",
      sortable: true,
      render: (tag: TagItem) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: tag.color }}
          />
          <div>
            <div className="font-semibold">{tag.name}</div>
            <div className="text-sm text-muted-foreground">
              {tag.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "color" as keyof TagItem,
      header: "Color",
      render: (tag: TagItem) => (
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: tag.color }}
          />
          <Badge
            variant="outline"
            style={{ color: tag.color, borderColor: tag.color }}
          >
            {tag.color}
          </Badge>
        </div>
      ),
    },
    {
      key: "usageCount" as keyof TagItem,
      header: "Usage",
      sortable: true,
      render: (tag: TagItem) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <Hash className="mr-1 h-3 w-3" />
            {(tag.usageCount || 0).toLocaleString()} total
          </div>
          <div className="flex items-center text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3" />
            {tag.questions} questions
          </div>
        </div>
      ),
    },
    {
      key: "courses" as keyof TagItem,
      header: "Courses",
      sortable: true,
      render: (tag: TagItem) => (
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          {tag.courses}
        </div>
      ),
    },
    {
      key: "isActive" as keyof TagItem,
      header: "Status",
      render: (tag: TagItem) => (
        <Badge
          variant="secondary"
          className={
            tag.isActive
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          }
        >
          {tag.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt" as keyof TagItem,
      header: "Created",
      sortable: true,
      render: (tag: TagItem) => tag.createdAt,
    },
  ];

  // Table actions
  const actions = [
    {
      label: "View Usage",
      icon: <Eye className="h-4 w-4" />,
      onClick: (tag: TagItem) => {
        toast.success(`Viewing usage for: ${tag.name}`);
      },
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Tags Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize content with tags and labels for better categorization
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
            <p className="text-xs text-success">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.filter((t) => t.isActive).length}
            </div>
            <p className="text-xs text-success">Ready for use</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Hash className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags
                .reduce((sum, t) => sum + (t.usageCount || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-success">Across all content</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags.reduce((sum, t) => sum + t.courses, 0)}
            </div>
            <p className="text-xs text-success">Using these tags</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => toast.success("Export started")}
            searchPlaceholder="Search tags, descriptions..."
          />
        </CardHeader>

        <CardContent>
          <DataTable
            data={tags}
            columns={columns}
            actions={actions}
            emptyMessage="No tags found"
            onAdd={handleAdd}
            loading={loading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Add Tag Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Add New Tag"
        description="Create a new tag for organizing and categorizing content"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Tag Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter tag name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter tag description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="color" className="text-sm font-medium">
                Tag Color *
              </Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-12 h-10 rounded border-0 p-0 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Preset Colors
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {tagColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: color.value,
                          }))
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color.value
                            ? "border-gray-800 scale-110"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Tag will be available for use in content and courses
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            {/* Tag Preview */}
            <div className="rounded-lg border p-3">
              <Label className="text-sm font-medium block mb-2">Preview</Label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: formData.color }}
                />
                <Badge
                  variant="secondary"
                  style={{ color: formData.color, borderColor: formData.color }}
                >
                  {formData.name || "Tag Name"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? "Creating..." : "Create Tag"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Edit Tag Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Tag"
        description="Update tag information and settings"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Tag Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter tag name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter tag description"
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="edit-color" className="text-sm font-medium">
                Tag Color *
              </Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-12 h-10 rounded border-0 p-0 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Preset Colors
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {tagColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: color.value,
                          }))
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color.value
                            ? "border-gray-800 scale-110"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Active</Label>
                <div className="text-sm text-muted-foreground">
                  Tag will be available for use in content and courses
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            {/* Tag Preview */}
            <div className="rounded-lg border p-3">
              <Label className="text-sm font-medium block mb-2">Preview</Label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: formData.color }}
                />
                <Badge
                  variant="secondary"
                  style={{ color: formData.color, borderColor: formData.color }}
                >
                  {formData.name || "Tag Name"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDrawerOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover"
            >
              {isSubmitting ? "Updating..." : "Update Tag"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Tag"
        description={`Are you sure you want to delete "${selectedTag?.name}"? This action cannot be undone and will remove the tag from all content and courses where it's currently used.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Tag"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
