import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Programming",
      description: "Software development and programming languages",
      subcategories: 12,
      questions: 456,
      exams: 23,
      color: "#3B82F6",
      status: "Active",
      created: "2024-01-15",
      parent: null,
    },
    {
      id: 2,
      name: "JavaScript",
      description: "JavaScript programming language and frameworks",
      subcategories: 8,
      questions: 234,
      exams: 15,
      color: "#F59E0B",
      status: "Active",
      created: "2024-01-15",
      parent: "Programming",
    },
    {
      id: 3,
      name: "Mathematics",
      description: "Mathematical concepts and problem solving",
      subcategories: 15,
      questions: 678,
      exams: 34,
      color: "#10B981",
      status: "Active",
      created: "2024-01-14",
      parent: null,
    },
    {
      id: 4,
      name: "Algebra",
      description: "Algebraic equations and concepts",
      subcategories: 6,
      questions: 189,
      exams: 12,
      color: "#059669",
      status: "Active",
      created: "2024-01-14",
      parent: "Mathematics",
    },
    {
      id: 5,
      name: "Science",
      description: "Natural sciences and scientific methods",
      subcategories: 18,
      questions: 523,
      exams: 28,
      color: "#8B5CF6",
      status: "Active",
      created: "2024-01-13",
      parent: null,
    },
    {
      id: 6,
      name: "Physics",
      description: "Physical laws and phenomena",
      subcategories: 9,
      questions: 267,
      exams: 16,
      color: "#7C3AED",
      status: "Draft",
      created: "2024-01-13",
      parent: "Science",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [parentFilter, setParentFilter] = useState("");

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

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
      setSelectedCategory(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const categoryData = {
      id: selectedCategory?.id || Date.now(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      color: formData.get("color") as string,
      status: formData.get("status") as string,
      parent: formData.get("parent") as string || null,
      subcategories: selectedCategory?.subcategories || 0,
      questions: selectedCategory?.questions || 0,
      exams: selectedCategory?.exams || 0,
      created: selectedCategory?.created || new Date().toISOString().split('T')[0],
    };

    if (selectedCategory) {
      setCategories(prev => prev.map(c => c.id === selectedCategory.id ? categoryData : c));
    } else {
      setCategories(prev => [...prev, categoryData]);
    }
    setIsDrawerOpen(false);
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

  const parentCategories = categories.filter(cat => !cat.parent);
  const childCategories = categories.filter(cat => cat.parent);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || category.status === statusFilter;
    const matchesParent = !parentFilter || 
                         (parentFilter === "main" && !category.parent) ||
                         (parentFilter === "sub" && category.parent) ||
                         category.parent === parentFilter;
    return matchesSearch && matchesStatus && matchesParent;
  });

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
                <span className="text-muted-foreground text-sm">{category.parent}</span>
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
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
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
              { label: "All Statuses", value: "" },
              { label: "Active", value: "Active" },
              { label: "Draft", value: "Draft" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            id: "parent",
            label: "Type",
            value: parentFilter,
            options: [
              { label: "All Types", value: "" },
              { label: "Main Categories", value: "main" },
              { label: "Subcategories", value: "sub" },
              ...parentCategories.map(cat => ({ label: cat.name, value: cat.name })),
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
          if (filterId === "parent") setParentFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setParentFilter("");
        }}
        onExport={() => console.log("Export categories")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredCategories}
        columns={columns}
        actions={actions}
        emptyMessage="No categories found. Create your first category to organize content."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedCategory ? "Edit Category" : "Create New Category"}
        description={selectedCategory ? "Update the category details" : "Add a new category to organize your content"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
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
              <Label htmlFor="parent">Parent Category (Optional)</Label>
              <Select name="parent" defaultValue={selectedCategory?.parent || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Parent (Main Category)</SelectItem>
                  {parentCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
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
              <Select name="status" defaultValue={selectedCategory?.status || "Active"}>
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
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
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