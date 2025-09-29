import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Grid3X3,
  Hash,
  Archive,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getSectionsApi,
  createSectionApi,
  updateSectionApi,
  deleteSectionApi,
  type Section as ApiSection,
} from "@/lib/utils";
import { toast } from "sonner";

interface Section {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  isActive: boolean;
  questions: number;
  createdAt: string;
}

export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Load sections from API
  const loadSections = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: { search?: string; status?: string; type?: string; per_page?: number } = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      };
      const response = await getSectionsApi(filters);
      
      // Map API response to UI format
      const mappedSections: Section[] = response.data.map((s: ApiSection) => ({
        id: s.id,
        name: s.name,
        code: s.name.substring(0, 2).toUpperCase(), // Generate code from name
        description: s.description || "",
        category: s.type,
        isActive: s.is_active,
        questions: s.questions_count || 0,
        createdAt: new Date(s.created_at).toLocaleDateString(),
      }));
      
      setSections(mappedSections);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load sections");
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, [searchTerm, statusFilter, typeFilter]);

  const handleAdd = () => {
    setSelectedSection(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setIsDrawerOpen(true);
  };

  const handleDelete = (section: Section) => {
    setSelectedSection(section);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSection) {
      try {
        await deleteSectionApi(selectedSection.id);
        setSections(prev => prev.filter(s => s.id !== selectedSection.id));
        setSelectedSection(null);
        toast.success("Section deleted successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete section");
      }
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const sectionData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        is_active: formData.get("isActive") === "on",
        sort_order: parseInt(formData.get("sortOrder") as string) || 0,
      };

      if (selectedSection) {
        await updateSectionApi(selectedSection.id, sectionData);
        toast.success("Section updated successfully!");
      } else {
        await createSectionApi(sectionData);
        toast.success("Section created successfully!");
      }
      
      setIsDrawerOpen(false);
      setSelectedSection(null);
      loadSections(); // Refresh the list
    } catch (err: any) {
      toast.error(err?.message || "Failed to save section");
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const section = sections.find(s => s.id === id);
      if (section) {
        await updateSectionApi(id, { is_active: !section.isActive });
        setSections(prev => prev.map(s => 
          s.id === id ? { ...s, isActive: !s.isActive } : s
        ));
        toast.success("Section status updated successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update section status");
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-success text-success-foreground" 
      : "bg-muted text-muted-foreground";
  };

  const uniqueCategories = [...new Set(sections.map(s => s.category))];

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
                         (statusFilter === "active" && section.isActive) ||
                         (statusFilter === "inactive" && !section.isActive);
    const matchesCategory = !categoryFilter || section.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns = [
    {
      key: "name" as keyof Section,
      header: "Section",
      sortable: true,
      render: (section: Section) => (
        <div>
          <div className="font-medium">{section.name}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {section.code}
          </Badge>
        </div>
      ),
    },
    {
      key: "description" as keyof Section,
      header: "Description",
      render: (section: Section) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {section.description}
          </p>
        </div>
      ),
    },
    {
      key: "category" as keyof Section,
      header: "Category",
      sortable: true,
      render: (section: Section) => (
        <Badge variant="secondary">{section.category}</Badge>
      ),
    },
    {
      key: "questions" as keyof Section,
      header: "Questions",
      sortable: true,
      render: (section: Section) => (
        <div className="font-medium">{(section.questions || 0).toLocaleString()}</div>
      ),
    },
    {
      key: "isActive" as keyof Section,
      header: "Status",
      sortable: true,
      render: (section: Section) => (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={getStatusColor(section.isActive)}>
            {section.isActive ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={section.isActive}
            onCheckedChange={() => handleToggleStatus(section.id)}
          />
        </div>
      ),
    },
    {
      key: "createdAt" as keyof Section,
      header: "Created",
      sortable: true,
      render: (section: Section) => section.createdAt,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (section: Section) => console.log("View", section),
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

  const activeCount = sections.filter(s => s.isActive).length;
  const inactiveCount = sections.filter(s => !s.isActive).length;
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Sections
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize content into logical sections for better structure
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Grid3X3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
            <p className="text-xs text-success">Content organization</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sections</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-success">Currently available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Sections</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCount}</div>
            <p className="text-xs text-muted-foreground">Not available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Hash className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalQuestions || 0).toLocaleString()}</div>
            <p className="text-xs text-success">Across all sections</p>
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
              { label: "Multiple Choice", value: "multiple_choice" },
              { label: "Essay", value: "essay" },
              { label: "Fill Blank", value: "fill_blank" },
              { label: "True/False", value: "true_false" },
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
        onExport={() => console.log("Export sections")}
      />

      {/* Data Table */}
      <DataTable
        data={sections}
        columns={columns}
        actions={actions}
        emptyMessage="No sections found. Create your first section to organize content."
        onAdd={handleAdd}
        loading={loading}
        error={error}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedSection ? "Edit Section" : "Create New Section"}
        description={selectedSection ? "Update the section details" : "Add a new section to organize content"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Section Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedSection?.name}
                placeholder="Enter section name"
                required
              />
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={selectedSection?.code}
                placeholder="Enter section code (e.g., QA, VA)"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedSection?.description}
                placeholder="Describe this section"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={selectedSection?.category || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Reasoning">Reasoning</SelectItem>
                  <SelectItem value="General Studies">General Studies</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                name="isActive"
                defaultChecked={selectedSection?.isActive ?? true}
              />
              <Label htmlFor="isActive">Active (Available for use)</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {selectedSection ? "Update Section" : "Create Section"}
            </Button>
          </div>
        </form>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Section"
        description="Are you sure you want to delete this section? All associated questions will be affected."
        itemName={selectedSection?.name}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Section"
        variant="destructive"
      />
    </div>
  );
}