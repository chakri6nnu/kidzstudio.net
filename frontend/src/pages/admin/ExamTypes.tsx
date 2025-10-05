import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Plus, Edit, Trash, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  getExamTypesFullApi,
  createExamTypeApi,
  updateExamTypeApi,
  deleteExamTypeApi,
  type ExamType as ApiExamType,
} from "@/lib/utils";

const examTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  image_url: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ExamTypeFormData = z.infer<typeof examTypeSchema>;

export default function ExamTypes() {
  const [examTypes, setExamTypes] = useState<ApiExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExamType, setEditingExamType] = useState<ApiExamType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load exam types from API
  const loadExamTypes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getExamTypesFullApi({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        per_page: 50,
      });
      setExamTypes(response.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load exam types");
      toast.error("Failed to load exam types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamTypes();
  }, [searchTerm, statusFilter]);

  const form = useForm<ExamTypeFormData>({
    resolver: zodResolver(examTypeSchema),
    defaultValues: {
      name: "",
      color: "#3B82F6",
      image_url: "",
      description: "",
      is_active: true,
    }
  });

  const filteredExamTypes = examTypes.filter(examType => {
    const matchesSearch = examType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         examType.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || examType.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: ExamTypeFormData) => {
    if (editingExamType) {
      setExamTypes(prev => prev.map(et => 
        et.id === editingExamType.id 
          ? { ...et, name: data.name, color: data.color, status: data.is_active ? "Active" : "Inactive" }
          : et
      ));
      toast.success("Exam type updated successfully!");
    } else {
      const newExamType = {
        id: Date.now().toString(),
        code: `etp_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        color: data.color,
        status: data.is_active ? "Active" : "Inactive"
      };
      setExamTypes(prev => [...prev, newExamType]);
      toast.success("Exam type created successfully!");
    }
    
    setIsDialogOpen(false);
    setEditingExamType(null);
    form.reset();
  };

  const handleEdit = (examType: any) => {
    setEditingExamType(examType);
    form.reset({
      name: examType.name,
      color: examType.color,
      image_url: "",
      description: "",
      is_active: examType.status === "Active",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExamTypes(prev => prev.filter(et => et.id !== id));
    toast.success("Exam type deleted successfully!");
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage different types of exams and their configurations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-success hover:bg-success/90 text-white"
              onClick={() => { setEditingExamType(null); form.reset(); }}
            >
              NEW EXAM TYPE
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingExamType ? "Edit Exam Type" : "New Exam Type"}
              </DialogTitle>
              <DialogDescription>
                {editingExamType ? "Update exam type details" : "Create a new exam type"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter exam type name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="color" 
                            className="w-12 h-10 rounded border-0 p-0"
                            {...field} 
                          />
                          <Input 
                            placeholder="#3B82F6" 
                            className="flex-1"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter description (optional)" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Active (Shown Everywhere). In-active (Hidden Everywhere).
                        </div>
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

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                    Create
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              placeholder="Search by Name"
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter(""); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CODE</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExamTypes.map((examType) => (
                <TableRow key={examType.id}>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      style={{ backgroundColor: examType.color, color: 'white', border: 'none' }}
                    >
                      {examType.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{examType.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(examType.status)}>
                      {examType.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(examType)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(examType.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">ROWS PER PAGE:</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>PAGE</span>
          <div className="bg-gray-200 px-2 py-1 rounded text-gray-800">1</div>
          <span>OF 1</span>
        </div>
      </div>
    </div>
  );
}