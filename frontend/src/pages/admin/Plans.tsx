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
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Zap,
  Infinity as InfinityIcon,
  Lock,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Award,
  Check,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPlansApi,
  createPlanApi,
  updatePlanApi,
  deletePlanApi,
  getSubCategoriesApi,
  type Plan as ApiPlan,
  type SubCategory,
} from "@/lib/utils";

type Plan = ApiPlan;

interface ApiResponse {
  data: Plan[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  // Search filters
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDuration, setSearchDuration] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Subcategories state
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  // New form fields state
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [featureRestrictions, setFeatureRestrictions] =
    useState<boolean>(false);

  // Theme
  const { theme } = useTheme();

  // Features options
  const featuresOptions: Option[] = [
    { label: "Practice Sets", value: "practice_sets" },
    { label: "Quizzes", value: "quizzes" },
    { label: "Lessons", value: "lessons" },
    { label: "Videos", value: "videos" },
    { label: "Exams", value: "exams" },
    { label: "Analytics", value: "analytics" },
    { label: "Certificates", value: "certificates" },
    { label: "Progress Tracking", value: "progress_tracking" },
  ];

  // Load subcategories
  const loadSubcategories = async () => {
    try {
      setSubcategoriesLoading(true);
      const response = await getSubCategoriesApi({ status: "active" });
      setSubcategories((response as { data: SubCategory[] }).data || []);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      toast.error(
        "Failed to load subcategories. Some features may be limited."
      );
      setError("Failed to load subcategories");
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Load subcategories on component mount
  useEffect(() => {
    loadSubcategories();
  }, []);

  // Load plans from API
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPlansApi({
          search: searchName || searchCode,
          status: searchStatus || "all",
          sub_category_id: searchCategory
            ? parseInt(searchCategory)
            : undefined,
          per_page: itemsPerPage,
        });
        setPlans((response as ApiResponse).data);
        setMeta((response as ApiResponse).meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load plans");
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [
    searchCode,
    searchName,
    searchDuration,
    searchCategory,
    searchStatus,
    currentPage,
    itemsPerPage,
  ]);

  const handleAdd = () => {
    setSelectedPlan(null);
    setHasDiscount(false);
    setDiscountPercentage(0);
    setFeatureRestrictions(false);
    setSelectedFeatures([]);
    setIsDrawerOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setHasDiscount(plan.has_discount || false);
    setDiscountPercentage(plan.discount_percentage || 0);
    setFeatureRestrictions(plan.feature_restrictions || false);
    setSelectedFeatures(plan.features || []);
    setIsDrawerOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDeleteDrawerOpen(true);
  };

  const handleAddSubmit = async (formData: Partial<Plan>) => {
    try {
      await createPlanApi(formData);
      toast.success("Plan created successfully");
      setIsDrawerOpen(false);
      // Reload plans
      const response = await getPlansApi({
        search: searchName || searchCode,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setPlans((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to create plan");
    }
  };

  const handleEditSubmit = async (formData: Partial<Plan>) => {
    if (!selectedPlan) return;
    try {
      await updatePlanApi(selectedPlan.id, formData);
      toast.success("Plan updated successfully");
      setIsDrawerOpen(false);
      // Reload plans
      const response = await getPlansApi({
        search: searchName || searchCode,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setPlans((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to update plan");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return;
    try {
      await deletePlanApi(selectedPlan.id);
      toast.success("Plan deleted successfully");
      setIsDeleteDrawerOpen(false);
      // Reload plans
      const response = await getPlansApi({
        search: searchName || searchCode,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setPlans((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteConfirm();
  };

  const handleSave = async (formData: FormData) => {
    const planData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      sub_category_id: formData.get("sub_category_id")
        ? parseInt(formData.get("sub_category_id") as string)
        : null,
      duration: parseInt(formData.get("duration") as string) || 1,
      has_discount: hasDiscount,
      discount_percentage: hasDiscount ? discountPercentage : 0,
      feature_restrictions: featureRestrictions,
      features: selectedFeatures,
      is_popular: formData.get("is_popular") === "on",
      is_active: formData.get("is_active") === "on",
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    if (selectedPlan) {
      await handleEditSubmit(planData);
    } else {
      await handleAddSubmit(planData);
    }
  };

  const togglePlanStatus = async (planId: number) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    try {
      await updatePlanApi(planId, { is_active: !plan.is_active });
      toast.success("Plan status updated successfully");
      // Reload plans
      const response = await getPlansApi({
        search: searchName || searchCode,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setPlans((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to update plan status");
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-success text-success-foreground"
      : "bg-muted text-muted-foreground";
  };

  const getPlanIcon = (planName?: string) => {
    if (!planName) return <DollarSign className="h-5 w-5" />;

    switch (planName.toLowerCase()) {
      case "free trial":
        return <Star className="h-5 w-5" />;
      case "basic":
        return <Zap className="h-5 w-5" />;
      case "professional":
        return <Crown className="h-5 w-5" />;
      case "enterprise":
        return <InfinityIcon className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const formatPrice = (price: number, currency: string, billing: string) => {
    if (price === 0) return "Free";
    return `$${price}/${billing === "monthly" ? "mo" : billing}`;
  };

  const formatFeatureValue = (value: unknown) => {
    if (value === true) return <CheckCircle className="h-4 w-4 text-success" />;
    if (value === false)
      return <XCircle className="h-4 w-4 text-muted-foreground" />;
    if (value === "Unlimited" || value === -1)
      return <InfinityIcon className="h-4 w-4 text-accent" />;
    return value;
  };

  // Remove client-side filtering as it's now handled by the API

  // Generate plan codes (in real app, these would come from the API)
  const generatePlanCode = (plan: Plan) => {
    return `plan_${plan.id.toString().padStart(10, "0").slice(-10)}`;
  };

  const columns = [
    {
      key: "code" as keyof Plan,
      header: "CODE",
      sortable: false,
      render: (plan: Plan) => (
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          <Lock className="mr-2 h-3 w-3" />
          {generatePlanCode(plan)}
        </Button>
      ),
    },
    {
      key: "name" as keyof Plan,
      header: "NAME",
      sortable: true,
      render: (plan: Plan) => (
        <div className="font-medium text-gray-900">{plan.name}</div>
      ),
    },
    {
      key: "duration" as keyof Plan,
      header: "DURATION",
      sortable: true,
      render: (plan: Plan) => (
        <div className="text-gray-700">
          {plan.duration || 1} {plan.duration === 1 ? "Month" : "Months"}
        </div>
      ),
    },
    {
      key: "price" as keyof Plan,
      header: "PRICE/MONTH",
      sortable: true,
      render: (plan: Plan) => (
        <div className="font-medium text-gray-900">
          £{(plan.price || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: "category" as keyof Plan,
      header: "CATEGORY",
      sortable: true,
      render: (plan: Plan) => {
        const subcategory = subcategories.find(
          (sub) => sub.id === plan.sub_category_id
        );
        return (
          <div className="text-gray-700">
            {subcategory?.name || "11+ English"}
          </div>
        );
      },
    },
    {
      key: "is_active" as keyof Plan,
      header: "STATUS",
      sortable: true,
      render: (plan: Plan) => (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200 px-2 py-1 rounded-md"
        >
          {plan.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions" as keyof Plan,
      header: "ACTIONS",
      sortable: false,
      render: (plan: Plan) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(plan)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(plan)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (plan: Plan) => console.log("View", plan),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Duplicate",
      icon: <Copy className="h-4 w-4" />,
      onClick: (plan: Plan) => console.log("Duplicate", plan),
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
            Plan Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, manage and monitor subscription plans
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total || 0}</div>
            <p className="text-xs text-success">All plans</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter((plan) => plan.is_active).length}
            </div>
            <p className="text-xs text-success">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Plans</CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter((plan) => plan.is_popular).length}
            </div>
            <p className="text-xs text-success">Featured plans</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Array.from(
                  new Set(plans.map((p) => p.sub_category_id).filter(Boolean))
                ).length
              }
            </div>
            <p className="text-xs text-success">Different categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchName}
            onSearchChange={setSearchName}
            filters={[
              {
                id: "status",
                label: "Status",
                value: searchStatus || "all",
                options: [
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ],
              },
              {
                id: "category",
                label: "Category",
                value: searchCategory || "all",
                options: [
                  { value: "all", label: "All Sub Categories" },
                  ...subcategories.map((subcategory) => ({
                    value: String(subcategory.id),
                    label: subcategory.name,
                  })),
                ],
              },
            ]}
            onFilterChange={(filterId, value) => {
              if (filterId === "status") {
                setSearchStatus(value === "all" ? "" : value);
              } else if (filterId === "category") {
                setSearchCategory(value === "all" ? "" : value);
              }
            }}
            onClearFilters={() => {
              setSearchName("");
              setSearchCode("");
              setSearchDuration("");
              setSearchCategory("");
              setSearchStatus("");
            }}
            onExport={() => console.log("Export plans")}
            searchPlaceholder="Search plans..."
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading plans...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-destructive"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No plans found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {plans.map((plan) => (
                      <TableRow key={plan.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="select-all">
                              {generatePlanCode(plan)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  generatePlanCode(plan)
                                );
                                toast.success("Code copied to clipboard");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{plan.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {plan.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {subcategories.find(
                              (sub) => sub.id === plan.sub_category_id
                            )?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {plan.duration || 1} month
                            {plan.duration !== 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            £{plan.price?.toFixed(2) || "0.00"}
                            {plan.has_discount && plan.discount_percentage && (
                              <div className="text-xs text-muted-foreground">
                                {plan.discount_percentage}% off
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {plan.feature_restrictions ? (
                              <Badge
                                variant="outline"
                                className="bg-warning/10 text-warning"
                              >
                                <Lock className="mr-1 h-3 w-3" />
                                Restricted
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-success/10 text-success"
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Unlimited
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {plan.is_popular && (
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary"
                              >
                                <Star className="mr-1 h-3 w-3" />
                                Popular
                              </Badge>
                            )}
                            <Badge
                              variant="secondary"
                              className={
                                plan.is_active
                                  ? "bg-success text-success-foreground"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {plan.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(plan)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(plan)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page {meta.current_page || currentPage} of{" "}
          {meta.last_page || 1} • Total {meta.total || 0}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Badge variant="outline">{currentPage}</Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= (meta.last_page || 1)}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= (meta.last_page || 1)}
            onClick={() => setCurrentPage(meta.last_page || 1)}
          >
            Last
          </Button>
          <div className="ml-4 flex items-center gap-2 text-sm text-muted-foreground">
            Rows:
            <select
              className="h-8 rounded-md border bg-background px-2"
              value={itemsPerPage}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setItemsPerPage(v);
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[30%]">
          <SheetHeader>
            <SheetTitle>
              {selectedPlan ? "Edit Plan" : "Create New Plan"}
            </SheetTitle>
            <SheetDescription>
              {selectedPlan
                ? "Update the plan details"
                : "Add a new subscription plan"}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSave(formData);
              }}
              className="space-y-4"
            >
              {/* Sub Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="sub_category_id"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Category<span className="ml-1 text-red-400">*</span>
                </Label>
                <Select
                  name="sub_category_id"
                  defaultValue={
                    selectedPlan?.sub_category_id
                      ? String(selectedPlan.sub_category_id)
                      : "none"
                  }
                  disabled={subcategoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        subcategoriesLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : (
                      subcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.id}
                          value={String(subcategory.id)}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Plan Name<span className="ml-1 text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedPlan?.name}
                  placeholder="Enter Name"
                  required
                />
              </div>

              {/* Duration and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Duration (Months)
                    <span className="ml-1 text-red-400">*</span>
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    defaultValue={selectedPlan?.duration || 1}
                    placeholder="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Monthly Price<span className="ml-1 text-red-400">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={selectedPlan?.price}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Discount Toggle */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label
                      htmlFor="has_discount"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Discount - {hasDiscount ? "Yes" : "No"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Provide direct discount to the plan.
                    </p>
                  </div>
                  <Switch
                    id="has_discount"
                    checked={hasDiscount}
                    onCheckedChange={setHasDiscount}
                  />
                </div>
              </div>

              {/* Discount Percentage - Only show when discount is enabled */}
              {hasDiscount && (
                <div className="space-y-2">
                  <Label
                    htmlFor="discount_percentage"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Discount Percentage
                    <span className="ml-1 text-red-400">*</span>
                  </Label>
                  <Input
                    id="discount_percentage"
                    name="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    required={hasDiscount}
                  />
                </div>
              )}

              {/* Feature Restrictions Toggle */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label
                      htmlFor="feature_restrictions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Feature Access -{" "}
                      {featureRestrictions ? "Restricted" : "Unlimited"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Unlimited (Access to all features). Restricted (Access to
                      selected features only).
                    </p>
                  </div>
                  <Switch
                    id="feature_restrictions"
                    checked={featureRestrictions}
                    onCheckedChange={setFeatureRestrictions}
                  />
                </div>
              </div>

              {/* Features Multi-Select - Only show when feature restrictions is enabled */}
              {featureRestrictions && (
                <div className="space-y-2">
                  <Label
                    htmlFor="features"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Features<span className="ml-1 text-red-400">*</span>
                  </Label>
                  <MultiSelect
                    options={featuresOptions}
                    selected={selectedFeatures}
                    onChange={setSelectedFeatures}
                    placeholder="Select features..."
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Short Description (Max. 200 Characters)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedPlan?.description}
                  placeholder="Enter short description"
                  maxLength={200}
                  rows={3}
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label
                  htmlFor="sort_order"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sort Order<span className="ml-1 text-red-400">*</span>
                </Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={selectedPlan?.sort_order || 0}
                  placeholder="0"
                  required
                />
              </div>

              {/* Popular Toggle */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label
                      htmlFor="is_popular"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Popular - {selectedPlan?.is_popular ? "Yes" : "No"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Yes (Shown as Most Popular)
                    </p>
                  </div>
                  <Switch
                    id="is_popular"
                    name="is_popular"
                    defaultChecked={selectedPlan?.is_popular || false}
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label
                      htmlFor="is_active"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Status - {selectedPlan?.is_active ? "Active" : "Inactive"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Active (Shown Everywhere). In-active (Hidden Everywhere).
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    name="is_active"
                    defaultChecked={selectedPlan?.is_active || true}
                  />
                </div>
              </div>
            </form>
          </div>
          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
                const form = e.currentTarget.closest("form");
                if (form) {
                  const formData = new FormData(form);
                  handleSave(formData);
                }
              }}
            >
              {selectedPlan ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Plan"
        description="Are you sure you want to delete this subscription plan?"
        itemName={selectedPlan?.name}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Plan"
        variant="destructive"
      />
    </div>
  );
}
