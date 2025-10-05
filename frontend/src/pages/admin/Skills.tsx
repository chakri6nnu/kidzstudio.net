import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  FileText,
  Eye,
  EyeOff,
  Target,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { skillsApi, sectionsApi } from "@/lib/api";

interface Skill {
  id: number;
  name: string;
  code: string;
  slug: string;
  short_description: string | null;
  section_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  section: {
    id: number;
    name: string;
  };
  questions_count: number;
  exams_count: number;
}

interface Section {
  id: number;
  name: string;
}

export default function Skills() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    section_id: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading skills with params:", {
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        section_id: sectionFilter !== "all" ? Number(sectionFilter) : undefined,
        per_page: perPage,
        page: currentPage,
      });

      const response = await skillsApi.getSkills({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        section_id: sectionFilter !== "all" ? Number(sectionFilter) : undefined,
        per_page: perPage,
        page: currentPage,
      });

      console.log("Skills API response:", response);
      console.log("Skills data array:", response.data);
      console.log("Skills data length:", response.data?.length);
      console.log("Meta:", response.meta);
      setSkills(response.data);
      setMeta(response.meta);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sectionFilter, perPage, currentPage]);

  const loadSections = useCallback(async () => {
    try {
      console.log("Loading sections...");
      const response = await sectionsApi.getSections({
        per_page: 100, // Get all sections
      });
      console.log("Sections API response:", response);
      setSections(response.data);
    } catch (err) {
      console.error("Failed to load sections:", err);
      setSections([]);
    }
  }, []);

  useEffect(() => {
    loadSkills();
    loadSections();
  }, [
    search,
    statusFilter,
    sectionFilter,
    currentPage,
    perPage,
    loadSkills,
    loadSections,
  ]);

  const handleCreate = async () => {
    try {
      setSaving(true);
      if (formData.section_id === 0) {
        toast.error("Please select a section");
        return;
      }

      const response = await skillsApi.createSkill({
        name: formData.name,
        short_description: formData.short_description || undefined,
        section_id: formData.section_id,
        is_active: formData.is_active,
      });

      if (response.data) {
        toast.success("Skill created successfully!");
        setCreateDialogOpen(false);
        setFormData({
          name: "",
          short_description: "",
          section_id: 0,
          is_active: true,
        });
        loadSkills();
      }
    } catch (err: unknown) {
      console.error("Failed to create skill:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create skill";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedSkill) return;

    try {
      setSaving(true);
      if (formData.section_id === 0) {
        toast.error("Please select a section");
        return;
      }

      const response = await skillsApi.updateSkill(selectedSkill.id, {
        name: formData.name,
        short_description: formData.short_description || undefined,
        section_id: formData.section_id,
        is_active: formData.is_active,
      });

      if (response.data) {
        toast.success("Skill updated successfully!");
        setEditDialogOpen(false);
        setSelectedSkill(null);
        setFormData({
          name: "",
          short_description: "",
          section_id: 0,
          is_active: true,
        });
        loadSkills();
      }
    } catch (err: unknown) {
      console.error("Failed to update skill:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update skill";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSkill) return;

    try {
      setSaving(true);
      await skillsApi.deleteSkill(selectedSkill.id);

      toast.success("Skill deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedSkill(null);
      loadSkills();
    } catch (err: unknown) {
      console.error("Failed to delete skill:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete skill";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      short_description: skill.short_description || "",
      section_id: skill.section_id,
      is_active: skill.is_active,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      short_description: "",
      section_id: 0,
      is_active: true,
    });
    setSelectedSkill(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log("Current skills state:", skills);
  console.log("Skills length:", skills.length);
  console.log("Loading state:", loading);

  if (loading && skills.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading skills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center">
            <Target className="mr-3 h-8 w-8" />
            Skills
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage skills and competencies for questions
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={perPage.toString()}
                onValueChange={(value) => setPerPage(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Table */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Skills ({meta.total})</CardTitle>
          <CardDescription>Manage skills and their properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Exams</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      {skill.short_description ? (
                        <Badge variant="outline">
                          {skill.short_description}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {skill.section?.name || "No Section"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={skill.is_active ? "default" : "secondary"}
                      >
                        {skill.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{skill.questions_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{skill.exams_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(skill.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(skill)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(skill)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {skills.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Target className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No skills found</p>
                        <p className="text-sm text-muted-foreground">
                          {search ||
                          statusFilter !== "all" ||
                          sectionFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Create your first skill to get started"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(meta.current_page - 1) * meta.per_page + 1} to{" "}
                {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
                {meta.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={meta.current_page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(meta.last_page, prev + 1))
                  }
                  disabled={meta.current_page === meta.last_page}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Skill Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
            <DialogDescription>
              Add a new skill to organize questions and content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter skill name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    short_description: e.target.value,
                  }))
                }
                placeholder="Enter skill description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-section">Section *</Label>
              <Select
                value={formData.section_id.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    section_id: Number(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Section</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="create-active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="create-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving || !formData.name || formData.section_id === 0}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update the skill information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter skill name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    short_description: e.target.value,
                  }))
                }
                placeholder="Enter skill description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-section">Section *</Label>
              <Select
                value={formData.section_id.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    section_id: Number(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Section</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={saving || !formData.name || formData.section_id === 0}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Update Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Skill Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSkill?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              This skill cannot be deleted if it has associated questions or
              exams.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
