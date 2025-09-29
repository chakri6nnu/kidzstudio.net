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
  FolderTree,
  Folder,
  Hash,
  Archive,
} from "lucide-react";

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
  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    {
      id: "sub_AtlMfH6GOOK",
      code: "sub_AtlMfH6GOOK",
      name: "English / Verbal Reasoning",
      category: "UK Grammar School 11+ Exam Preparation",
      type: "Course",
      status: "Active",
      description: "English language and verbal reasoning skills",
      created: "2024-01-15",
      questions: 145,
      exams: 8,
    },
    {
      id: "sub_dPCsEXsNqhp",
      code: "sub_dPCsEXsNqhp", 
      name: "Mathematics / Numerical Reasoning",
      category: "UK Grammar School 11+ Exam Preparation",
      type: "Course",
      status: "Active",
      description: "Mathematical concepts and numerical reasoning",
      created: "2024-01-15",
      questions: 234,
      exams: 12,
    },
    {
      id: "sub_ZHvspItUqJP",
      code: "sub_ZHvspItUqJP",
      name: "Non-Verbal Reasoning (NVR)",
      category: "UK Grammar School 11+ Exam Preparation", 
      type: "Course",
      status: "Active",
      description: "Pattern recognition and spatial reasoning",
      created: "2024-01-14",
      questions: 189,
      exams: 9,
    },
    {
      id: "sub_vpQphqm6j4",
      code: "sub_vpQphqm6j4",
      name: "Creative & Essay Writing",
      category: "UK Grammar School 11+ Exam Preparation",
      type: "Course", 
      status: "Active",
      description: "Creative writing and essay composition skills",
      created: "2024-01-14",
      questions: 67,
      exams: 5,
    }
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  const handleConfirmDelete = () => {
    if (selectedSubCategory) {
      setSubCategories(prev => prev.filter(sc => sc.id !== selectedSubCategory.id));
      setSelectedSubCategory(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const subCategoryData = {
      id: selectedSubCategory?.id || `sub_${Date.now()}`,
      code: formData.get("code") as string || `sub_${Date.now()}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      description: formData.get("description") as string,
      created: selectedSubCategory?.created || new Date().toISOString().split('T')[0],
      questions: selectedSubCategory?.questions || 0,
      exams: selectedSubCategory?.exams || 0,
    };

    if (selectedSubCategory) {
      setSubCategories(prev => prev.map(sc => sc.id === selectedSubCategory.id ? subCategoryData : sc));
    } else {
      setSubCategories(prev => [...prev, subCategoryData]);
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

  const uniqueCategories = [...new Set(subCategories.map(sc => sc.category))];

  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subCategory.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subCategory.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || subCategory.status === statusFilter;
    const matchesCategory = !categoryFilter || subCategory.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns = [
    {
      key: "code" as keyof SubCategory,
      header: "Code",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          {subCategory.code}
        </Badge>
      ),
    },
    {
      key: "name" as keyof SubCategory,
      header: "Name",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <div>
          <div className="font-medium">{subCategory.name}</div>
          {subCategory.description && (
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
          <div className="truncate text-sm">{subCategory.category}</div>
        </div>
      ),
    },
    {
      key: "type" as keyof SubCategory,
      header: "Type",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge variant="outline">{subCategory.type}</Badge>
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
            <span className="font-medium">{subCategory.questions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Exams:</span>
            <span className="font-medium">{subCategory.exams}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof SubCategory,
      header: "Status",
      sortable: true,
      render: (subCategory: SubCategory) => (
        <Badge variant="secondary" className={getStatusColor(subCategory.status)}>
          {subCategory.status}
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
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Sub Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sub Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
            <p className="text-xs text-success">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Categories</CardTitle>
            <Folder className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories.length}</div>
            <p className="text-xs text-muted-foreground">Main categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
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
              { label: "All Statuses", value: "" },
              { label: "Active", value: "Active" },
              { label: "Draft", value: "Draft" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            id: "category",
            label: "Parent Category",
            value: categoryFilter,
            options: [
              { label: "All Categories", value: "" },
              ...uniqueCategories.map(cat => ({ label: cat, value: cat })),
            ],
          },
        ]}
        onFilterChange={(filterId, value) => {
          if (filterId === "status") setStatusFilter(value);
          if (filterId === "category") setCategoryFilter(value);
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setCategoryFilter("");
        }}
        onExport={() => console.log("Export subcategories")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredSubCategories}
        columns={columns}
        actions={actions}
        emptyMessage="No subcategories found. Create your first subcategory to organize content."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedSubCategory ? "Edit Sub Category" : "Create New Sub Category"}
        description={selectedSubCategory ? "Update the subcategory details" : "Add a new subcategory to organize content"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
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
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={selectedSubCategory?.code}
                placeholder="Enter unique code (e.g., sub_abc123)"
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
              <Select name="category" defaultValue={selectedSubCategory?.category || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="UK Grammar School 11+ Exam Preparation">
                    UK Grammar School 11+ Exam Preparation
                  </SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={selectedSubCategory?.type || "Course"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Topic">Topic</SelectItem>
                  <SelectItem value="Module">Module</SelectItem>
                  <SelectItem value="Section">Section</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedSubCategory?.status || "Active"}>
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
              {selectedSubCategory ? "Update Sub Category" : "Create Sub Category"}
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