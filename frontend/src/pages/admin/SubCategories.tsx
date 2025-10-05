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
  FolderTree,
  Folder,
  Hash,
  Archive,
} from "lucide-react";
import {
  getSubCategoriesApi,
  createSubCategoryApi,
  updateSubCategoryApi,
  deleteSubCategoryApi,
  getCategoriesApi,
  type SubCategory as ApiSubCategory,
  type Category as ApiCategory,
} from "@/lib/utils";
import { toast } from "sonner";

interface SubCategory {
  id: string;
  code: string;
  name: string;
  category: string;
  type: string;
  status: string;
  description?: string;
  created: string;
  questions: number;
  exams: number;
}

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Load sub-categories and categories from API
  const loadSubCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: {
        search?: string;
        status?: string;
        category_id?: string;
        per_page?: number;
      } = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        category_id: categoryFilter !== "all" ? categoryFilter : undefined,
      };
      const response = await getSubCategoriesApi(filters);

      // Map API response to UI format
      const mappedSubCategories: SubCategory[] = response.data.map(
        (sc: ApiSubCategory) => ({
          id: sc.id.toString(),
          code: `SUB${sc.id.toString().padStart(4, "0")}`,
          name: sc.name || "Unnamed Sub-Category",
          category: sc.category?.name || "Unknown Category",
          type: sc.category?.type || "Unknown",
          status: sc.is_active === true ? "Active" : "Inactive",
          description: sc.description || "",
          created: new Date(sc.created_at).toLocaleDateString(),
          questions: sc.questions_count || 0,
          exams: sc.exams_count || 0,
        })
      );

      setSubCategories(mappedSubCategories);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load sub-categories");
      toast.error("Failed to load sub-categories");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategoriesApi({});
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      toast.error("Failed to load categories. Some features may be limited.");
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    loadSubCategories();
    loadCategories();
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleAdd = () => {
    setSelectedSubCategory(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDrawerOpen(true);
  };

  const handleDelete = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSubCategory) {
      try {
        await deleteSubCategoryApi(parseInt(selectedSubCategory.id));
        setSubCategories((prev) =>
          prev.filter((sc) => sc.id !== selectedSubCategory.id)
        );
        setSelectedSubCategory(null);
        toast.success("Sub-category deleted successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete sub-category");
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const subCategoryData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category_id: parseInt(formData.get("category") as string),
        is_active: formData.get("status") === "Active",
      };

      if (selectedSubCategory) {
        await updateSubCategoryApi(
          parseInt(selectedSubCategory.id),
          subCategoryData
        );
        toast.success("Sub-category updated successfully!");
      } else {
        await createSubCategoryApi(subCategoryData);
        toast.success("Sub-category created successfully!");
      }

      setIsDrawerOpen(false);
      setSelectedSubCategory(null);
      loadSubCategories(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to save sub-category");
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-muted text-muted-foreground";

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

  const uniqueCategories = categories.map((cat) => ({
    label: cat.name,
    value: cat.id.toString(),
  }));

  const columns = [
    {
      key: "code" as keyof SubCategory,
      header: "Code",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge
          variant="secondary"
          className="bg-primary text-primary-foreground"
        >
          {subCategory?.code || "N/A"}
        </Badge>
      ),
    },
    {
      key: "name" as keyof SubCategory,
      header: "Name",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <div>
          <div className="font-medium">{subCategory?.name || "Unnamed"}</div>
          {subCategory?.description && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {subCategory.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "category" as keyof SubCategory,
      header: "Category",
      render: (subCategory: SubCategory) => (
        <div className="max-w-xs">
          <div className="truncate text-sm">
            {subCategory?.category || "Unknown"}
          </div>
        </div>
      ),
    },
    {
      key: "type" as keyof SubCategory,
      header: "Type",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge variant="outline">{subCategory?.type || "Unknown"}</Badge>
      ),
    },
    {
      key: "questions" as keyof SubCategory,
      header: "Content",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span>Questions:</span>
            <span className="font-medium">{subCategory?.questions || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Exams:</span>
            <span className="font-medium">{subCategory?.exams || 0}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof SubCategory,
      header: "Status",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge
          variant="secondary"
          className={getStatusColor(subCategory?.status)}
        >
          {subCategory?.status || "Unknown"}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (subCategory: SubCategory) => console.log("View", subCategory),
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
            Sub Categories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage subcategories and organize content hierarchically
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Sub Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sub Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
            <p className="text-xs text-success">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parent Categories
            </CardTitle>
            <Folder className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories.length}</div>
            <p className="text-xs text-muted-foreground">Main categories</p>
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
              {subCategories.reduce((sum, sc) => sum + sc.questions, 0)}
            </div>
            <p className="text-xs text-success">In subcategories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <Archive className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subCategories.reduce((sum, sc) => sum + sc.exams, 0)}
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
            id: "category",
            label: "Parent Category",
            value: categoryFilter,
            options: [
              { label: "All Categories", value: "all" },
              ...uniqueCategories,
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
          if (filterId === "category") setCategoryFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setCategoryFilter("all");
        }}
        onExport={() => console.log("Export subcategories")}
      />

      {/* Data Table */}
      <DataTable
        data={subCategories}
        columns={columns}
        actions={actions}
        emptyMessage="No subcategories found. Create your first subcategory to organize content."
        onAdd={handleAdd}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={
          selectedSubCategory ? "Edit Sub Category" : "Create New Sub Category"
        }
        description={
          selectedSubCategory
            ? "Update the subcategory details"
            : "Add a new subcategory to organize content"
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
              <Label htmlFor="name">Sub Category Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedSubCategory?.name}
                placeholder="Enter subcategory name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedSubCategory?.description}
                placeholder="Enter subcategory description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Parent Category</Label>
              <Select
                name="category"
                defaultValue={selectedSubCategory?.category || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={selectedSubCategory?.status || "Active"}
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
              {selectedSubCategory
                ? "Update Sub Category"
                : "Create Sub Category"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Sub Category"
        description="Are you sure you want to delete this subcategory? All associated content will be affected."
        itemName={selectedSubCategory?.name}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Sub Category"
        variant="destructive"
      />
    </div>
  );
}
