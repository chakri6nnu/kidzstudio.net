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
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
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
} from "lucide-react";
import { toast } from "sonner";
import {
  getPlansApi,
  createPlanApi,
  updatePlanApi,
  deletePlanApi,
  type Plan as ApiPlan,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load plans from API
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPlansApi({
          search: searchTerm,
          status: statusFilter,
          type: typeFilter,
          price_min: priceRange.min ? Number(priceRange.min) : undefined,
          price_max: priceRange.max ? Number(priceRange.max) : undefined,
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
    searchTerm,
    statusFilter,
    typeFilter,
    priceRange,
    currentPage,
    itemsPerPage,
  ]);

  const handleAdd = () => {
    setSelectedPlan(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
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
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
        price_min: priceRange.min ? Number(priceRange.min) : undefined,
        price_max: priceRange.max ? Number(priceRange.max) : undefined,
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
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
        price_min: priceRange.min ? Number(priceRange.min) : undefined,
        price_max: priceRange.max ? Number(priceRange.max) : undefined,
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
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
        price_min: priceRange.min ? Number(priceRange.min) : undefined,
        price_max: priceRange.max ? Number(priceRange.max) : undefined,
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
      currency: formData.get("currency") as string,
      billing_cycle: formData.get("billing") as
        | "monthly"
        | "yearly"
        | "lifetime",
      type: formData.get("type") as "free" | "premium" | "enterprise",
      is_active: formData.get("status") === "active",
      features: formData.get("features")
        ? JSON.parse(formData.get("features") as string)
        : [],
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      trial_days: parseInt(formData.get("trial_days") as string) || 0,
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
        search: searchTerm,
        status: statusFilter,
        type: typeFilter,
        price_min: priceRange.min ? Number(priceRange.min) : undefined,
        price_max: priceRange.max ? Number(priceRange.max) : undefined,
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

  const columns = [
    {
      key: "name" as keyof Plan,
      header: "Plan",
      sortable: true,
      render: (plan: Plan) => (
        <div className="flex items-center space-x-2">
          {getPlanIcon(plan.name)}
          <div>
            <div className="font-medium">{plan.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatPrice(plan.price, plan.currency, plan.billing_cycle)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "description" as keyof Plan,
      header: "Description",
      render: (plan: Plan) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.description}
          </p>
        </div>
      ),
    },
    {
      key: "subscriptions_count" as keyof Plan,
      header: "Subscribers",
      sortable: true,
      render: (plan: Plan) => (
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          {plan.subscriptions_count}
        </div>
      ),
    },
    {
      key: "is_active" as keyof Plan,
      header: "Status",
      sortable: true,
      render: (plan: Plan) => (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={getStatusColor(plan.is_active)}>
            {plan.is_active ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={plan.is_active}
            onCheckedChange={() => togglePlanStatus(plan.id)}
          />
        </div>
      ),
    },
    {
      key: "created_at" as keyof Plan,
      header: "Created",
      sortable: true,
      render: (plan: Plan) => new Date(plan.created_at).toLocaleDateString(),
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
            Subscription Plans
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage pricing plans and subscription features
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
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
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-success">All subscription tiers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.reduce((sum, plan) => sum + plan.subscriptions_count, 0)}
            </div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {plans
                .reduce(
                  (sum, plan) =>
                    sum + (plan.price || 0) * (plan.subscriptions_count || 0),
                  0
                )
                .toLocaleString()}
            </div>
            <p className="text-xs text-success">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.6%</div>
            <p className="text-xs text-success">+2.1% from last month</p>
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
              { label: "Inactive", value: "Inactive" },
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
        onExport={() => console.log("Export plans")}
      />

      {/* Data Table */}
      <DataTable
        data={plans}
        columns={columns}
        actions={actions}
        emptyMessage="No plans found. Create your first subscription plan."
        onAdd={handleAdd}
      />

      {/* Add/Edit Drawer */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedPlan ? "Edit Plan" : "Create New Plan"}
        description={
          selectedPlan
            ? "Update the plan details"
            : "Add a new subscription plan"
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
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedPlan?.name}
                placeholder="Enter plan name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedPlan?.description}
                placeholder="Enter plan description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
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
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  name="currency"
                  defaultValue={selectedPlan?.currency || "USD"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billing">Billing</Label>
                <Select
                  name="billing"
                  defaultValue={selectedPlan?.billing_cycle || "monthly"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue={selectedPlan?.type || "free"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={selectedPlan?.is_active ? "active" : "inactive"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Features</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={selectedPlan?.sort_order || 0}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="trial_days">Trial Days</Label>
                  <Input
                    id="trial_days"
                    name="trial_days"
                    type="number"
                    defaultValue={selectedPlan?.trial_days || 0}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (JSON)</Label>
                <Textarea
                  id="features"
                  name="features"
                  defaultValue={
                    selectedPlan?.features
                      ? JSON.stringify(selectedPlan.features)
                      : "[]"
                  }
                  placeholder='["Feature 1", "Feature 2"]'
                  rows={3}
                />
              </div>
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
              {selectedPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </SideDrawer>

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
