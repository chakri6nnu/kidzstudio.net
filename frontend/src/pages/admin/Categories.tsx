import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Folder,
  FolderPlus,
  ChevronRight,
  Hash,
  Archive,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description: string;
  subcategories: number;
  questions: number;
  exams: number;
  color: string;
  status: string;
  created: string;
  parent: string | null;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.categories.getAll();

      // Map API response to UI format
      const mappedCategories: Category[] = response.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        subcategories: c.sub_categories_count || 0,
        questions: c.questions_count || 0,
        exams: c.exams_count || 0,
        color: c.color || "#3B82F6",
        status: c.is_active ? "Active" : "Inactive",
        created: new Date(c.created_at).toLocaleDateString(),
        parent: null, // Categories don't have parents in this structure
      }));

      setCategories(mappedCategories);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [searchTerm, statusFilter, typeFilter]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      try {
        await api.categories.delete(selectedCategory.id.toString());
        setCategories((prev) =>
          prev.filter((c) => c.id !== selectedCategory.id)
        );
        setSelectedCategory(null);
        toast.success("Category deleted successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete category");
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const categoryData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        color: formData.get("color") as string,
        is_active: formData.get("status") === "Active",
      };

      if (selectedCategory) {
        await api.categories.update(
          selectedCategory.id.toString(),
          categoryData
        );
        toast.success("Category updated successfully!");
      } else {
        await api.categories.create(categoryData);
        toast.success("Category created successfully!");
      }

      setIsDrawerOpen(false);
      setSelectedCategory(null);
      loadCategories(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to save category");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Draft":
        return "bg-warning text-warning-foreground";
      case "Inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const parentCategories = categories.filter((cat) => !cat.parent);
  const childCategories = categories.filter((cat) => cat.parent);

  const columns = [
    {
      key: "name" as keyof Category,
      header: "Category",
      sortable: true,
      render: (category: Category) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div className="flex items-center space-x-2">
            {category.parent && (
              <>
                <span className="text-muted-foreground text-sm">
                  {category.parent}
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </>
            )}
            <div>
              <div className="font-semibold">{category.name}</div>
              {category.parent && (
                <div className="text-xs text-muted-foreground">Subcategory</div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "description" as keyof Category,
      header: "Description",
      render: (category: Category) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>
      ),
    },
    {
      key: "questions" as keyof Category,
      header: "Content",
      sortable: true,
      render: (category: Category) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Questions:</span>
            <span className="font-medium">{category.questions}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Exams:</span>
            <span className="font-medium">{category.exams}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Subcategories:</span>
            <span className="font-medium">{category.subcategories}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof Category,
      header: "Status",
      sortable: true,
      render: (category: Category) => (
        <Badge variant="secondary" className={getStatusColor(category.status)}>
          {category.status}
        </Badge>
      ),
    },
    {
      key: "created" as keyof Category,
      header: "Created",
      sortable: true,
      render: (category: Category) => category.created,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (category: Category) => console.log("View", category),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Add Subcategory",
      icon: <FolderPlus className="h-4 w-4" />,
      onClick: (category: Category) => console.log("Add subcategory", category),
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
            Category Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize content with hierarchical categories and subcategories
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Folder className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentCategories.length}</div>
            <p className="text-xs text-success">Main categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <FolderPlus className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childCategories.length}</div>
            <p className="text-xs text-muted-foreground">Child categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <Hash className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.questions, 0)}
            </div>
            <p className="text-xs text-success">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <Archive className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.exams, 0)}
            </div>
            <p className="text-xs text-success">Organized content</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FiltersPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            id: "status",
            label: "Status",
            value: statusFilter,
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
          {
            id: "type",
            label: "Type",
            value: typeFilter,
            options: [
              { label: "All Types", value: "all" },
              { label: "Academic", value: "academic" },
              { label: "General", value: "general" },
              { label: "Skill", value: "skill" },
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
          if (filterId === "type") setTypeFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setTypeFilter("all");
        }}
        onExport={() => console.log("Export categories")}
      />

      {/* Data Table */}
      <DataTable
        data={categories}
        columns={columns}
        actions={actions}
        emptyMessage="No categories found. Create your first category to organize content."
        onAdd={handleAdd}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedCategory ? "Edit Category" : "Create New Category"}
        description={
          selectedCategory
            ? "Update the category details"
            : "Add a new category to organize your content"
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSave(formData);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedCategory?.name}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedCategory?.description}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Category Type</Label>
              <Select
                name="type"
                defaultValue={selectedCategory?.type || "academic"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="skill">Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="color"
                defaultValue={selectedCategory?.color || "#3B82F6"}
                className="h-10"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={selectedCategory?.status || "Active"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Category"
        description="Are you sure you want to delete this category? All subcategories and associated content will also be affected."
        itemName={selectedCategory?.name}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Category"
        variant="destructive"
      />
    </div>
  );
}
