import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Infinity,
} from "lucide-react";

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing: string;
  status: string;
  subscribers: number;
  features: {
    exams: number | string;
    questions: number | string;
    users: number | string;
    storage: string;
    support: string;
    analytics: boolean;
    customBranding: boolean;
    api: boolean;
  };
  limits: {
    maxExams: number;
    maxUsers: number;
    maxQuestions: number;
  };
  created: string;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Basic",
      description: "Essential features for individual learners",
      price: 9.99,
      currency: "USD",
      billing: "monthly",
      status: "Active",
      subscribers: 245,
      features: {
        exams: 10,
        questions: 500,
        users: 1,
        storage: "1GB",
        support: "Basic",
        analytics: false,
        customBranding: false,
        api: false,
      },
      limits: {
        maxExams: 10,
        maxUsers: 1,
        maxQuestions: 500,
      },
      created: "2024-01-15",
    },
    {
      id: 2,
      name: "Professional",
      description: "Advanced features for small teams",
      price: 29.99,
      currency: "USD",
      billing: "monthly",
      status: "Active",
      subscribers: 89,
      features: {
        exams: 50,
        questions: 2000,
        users: 10,
        storage: "10GB",
        support: "Priority",
        analytics: true,
        customBranding: false,
        api: true,
      },
      limits: {
        maxExams: 50,
        maxUsers: 10,
        maxQuestions: 2000,
      },
      created: "2024-01-15",
    },
    {
      id: 3,
      name: "Enterprise",
      description: "Full-featured solution for organizations",
      price: 99.99,
      currency: "USD",
      billing: "monthly",
      status: "Active",
      subscribers: 34,
      features: {
        exams: "Unlimited",
        questions: "Unlimited",
        users: "Unlimited",
        storage: "100GB",
        support: "24/7 Premium",
        analytics: true,
        customBranding: true,
        api: true,
      },
      limits: {
        maxExams: -1,
        maxUsers: -1,
        maxQuestions: -1,
      },
      created: "2024-01-15",
    },
    {
      id: 4,
      name: "Free Trial",
      description: "Try all features for 14 days",
      price: 0,
      currency: "USD",
      billing: "trial",
      status: "Active",
      subscribers: 456,
      features: {
        exams: 5,
        questions: 100,
        users: 1,
        storage: "500MB",
        support: "Community",
        analytics: false,
        customBranding: false,
        api: false,
      },
      limits: {
        maxExams: 5,
        maxUsers: 1,
        maxQuestions: 100,
      },
      created: "2024-01-15",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const handleConfirmDelete = () => {
    if (selectedPlan) {
      setPlans(prev => prev.filter(p => p.id !== selectedPlan.id));
      setSelectedPlan(null);
    }
  };

  const handleSave = (formData: FormData) => {
    const planData = {
      id: selectedPlan?.id || Date.now(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string) || 0,
      currency: formData.get("currency") as string,
      billing: formData.get("billing") as string,
      status: formData.get("status") as string,
      subscribers: selectedPlan?.subscribers || 0,
      features: {
        exams: formData.get("exams") as string,
        questions: formData.get("questions") as string,
        users: formData.get("users") as string,
        storage: formData.get("storage") as string,
        support: formData.get("support") as string,
        analytics: formData.get("analytics") === "on",
        customBranding: formData.get("customBranding") === "on",
        api: formData.get("api") === "on",
      },
      limits: {
        maxExams: parseInt(formData.get("maxExams") as string) || 0,
        maxUsers: parseInt(formData.get("maxUsers") as string) || 0,
        maxQuestions: parseInt(formData.get("maxQuestions") as string) || 0,
      },
      created: selectedPlan?.created || new Date().toISOString().split('T')[0],
    };

    if (selectedPlan) {
      setPlans(prev => prev.map(p => p.id === selectedPlan.id ? planData : p));
    } else {
      setPlans(prev => [...prev, planData]);
    }
    setIsDrawerOpen(false);
  };

  const togglePlanStatus = (planId: number) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === "Active" ? "Inactive" : "Active" }
        : plan
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
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
        return <Infinity className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const formatPrice = (price: number, currency: string, billing: string) => {
    if (price === 0) return "Free";
    return `$${price}/${billing === "monthly" ? "mo" : billing}`;
  };

  const formatFeatureValue = (value: any) => {
    if (value === true) return <CheckCircle className="h-4 w-4 text-success" />;
    if (value === false) return <XCircle className="h-4 w-4 text-muted-foreground" />;
    if (value === "Unlimited" || value === -1) return <Infinity className="h-4 w-4 text-accent" />;
    return value;
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <div className="text-sm text-muted-foreground">{formatPrice(plan.price, plan.currency, plan.billing)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "description" as keyof Plan,
      header: "Description",
      render: (plan: Plan) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
        </div>
      ),
    },
    {
      key: "subscribers" as keyof Plan,
      header: "Subscribers",
      sortable: true,
      render: (plan: Plan) => (
        <div className="flex items-center">
          <Users className="mr-1 h-3 w-3" />
          {plan.subscribers}
        </div>
      ),
    },
    {
      key: "status" as keyof Plan,
      header: "Status",
      sortable: true,
      render: (plan: Plan) => (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={getStatusColor(plan.status)}>
            {plan.status}
          </Badge>
          <Switch
            checked={plan.status === "Active"}
            onCheckedChange={() => togglePlanStatus(plan.id)}
          />
        </div>
      ),
    },
    {
      key: "created" as keyof Plan,
      header: "Created",
      sortable: true,
      render: (plan: Plan) => plan.created,
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
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
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
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-success">All subscription tiers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.reduce((sum, plan) => sum + plan.subscribers, 0)}
            </div>
            <p className="text-xs text-success">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${plans.reduce((sum, plan) => sum + ((plan.price || 0) * (plan.subscribers || 0)), 0).toLocaleString()}
            </div>
            <p className="text-xs text-success">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
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
        }}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
        }}
        onExport={() => console.log("Export plans")}
      />

      {/* Data Table */}
      <DataTable
        data={filteredPlans}
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
        description={selectedPlan ? "Update the plan details" : "Add a new subscription plan"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSave(formData);
        }} className="space-y-6">
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
                <Select name="currency" defaultValue={selectedPlan?.currency || "USD"}>
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
                <Select name="billing" defaultValue={selectedPlan?.billing || "monthly"}>
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

            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedPlan?.status || "Active"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Features</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exams">Max Exams</Label>
                  <Input
                    id="exams"
                    name="exams"
                    defaultValue={selectedPlan?.features.exams}
                    placeholder="e.g. 10 or Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="questions">Max Questions</Label>
                  <Input
                    id="questions"
                    name="questions"
                    defaultValue={selectedPlan?.features.questions}
                    placeholder="e.g. 500 or Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="users">Max Users</Label>
                  <Input
                    id="users"
                    name="users"
                    defaultValue={selectedPlan?.features.users}
                    placeholder="e.g. 1 or Unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    name="storage"
                    defaultValue={selectedPlan?.features.storage}
                    placeholder="e.g. 1GB"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="support">Support Level</Label>
                <Select name="support" defaultValue={selectedPlan?.features.support || "Basic"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Priority">Priority</SelectItem>
                    <SelectItem value="24/7 Premium">24/7 Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analytics"
                    name="analytics"
                    defaultChecked={selectedPlan?.features.analytics}
                  />
                  <Label htmlFor="analytics">Analytics & Reporting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customBranding"
                    name="customBranding"
                    defaultChecked={selectedPlan?.features.customBranding}
                  />
                  <Label htmlFor="customBranding">Custom Branding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="api"
                    name="api"
                    defaultChecked={selectedPlan?.features.api}
                  />
                  <Label htmlFor="api">API Access</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
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