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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { FiltersPanel } from "@/components/ui/filters-panel";
import {
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  Check,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  Lock,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSubscriptionsApi,
  createSubscriptionApi,
  updateSubscriptionApi,
  deleteSubscriptionApi,
  getPlansApi,
  getUsersApi,
  type Subscription as ApiSubscription,
  type Plan,
  type User,
} from "@/lib/utils";

type Subscription = ApiSubscription;

interface ApiResponse {
  data: Subscription[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Search filters for each column
  const [searchCode, setSearchCode] = useState("");
  const [searchPlan, setSearchPlan] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchStarts, setSearchStarts] = useState("");
  const [searchEnds, setSearchEnds] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "inactive" | "cancelled" | "expired"
  >("active");

  // Load subscriptions from API
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSubscriptionsApi({
          // Disabled search to avoid backend database column issues
          // search: searchCode || searchPlan || searchPayment,
          status: searchStatus || "all",
          per_page: itemsPerPage,
        });
        setSubscriptions((response as ApiResponse).data);
        setMeta((response as ApiResponse).meta);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subscriptions"
        );
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [
    // Removed search fields since we're doing client-side filtering
    currentPage,
    itemsPerPage,
    searchStatus,
  ]);

  // Load plans and users for dropdowns
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [plansResponse, usersResponse] = await Promise.all([
          getPlansApi({ per_page: 100 }),
          getUsersApi({ per_page: 100 }),
        ]);
        setPlans((plansResponse as { data: Plan[] }).data || []);
        setUsers((usersResponse as { data: User[] }).data || []);
      } catch (err) {
        console.error("Failed to load lookup data:", err);
        toast.error("Failed to load users and plans data");
      }
    };

    loadLookups();
  }, []);

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  const handleDeleteSubscription = async (id: number) => {
    try {
      await deleteSubscriptionApi(id);
      toast.success("Subscription deleted successfully");
      // Reload subscriptions
      const response = await getSubscriptionsApi({
        // Disabled search to avoid backend database column issues
        // search: searchCode || searchPlan || searchPayment,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setSubscriptions((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to delete subscription");
    }
  };

  const handleCreateSubscription = async (formData: FormData) => {
    // Validate required fields
    if (!selectedUserId || !selectedPlanId) {
      toast.error("Please select both user and plan");
      return;
    }

    const subscriptionData = {
      user_id: parseInt(selectedUserId),
      plan_id: parseInt(selectedPlanId),
      status: selectedStatus,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    try {
      const response = await createSubscriptionApi(subscriptionData);
      toast.success("Subscription created successfully");
      setIsDrawerOpen(false);
      // Reset form
      setSelectedUserId("");
      setSelectedPlanId("");
      setSelectedStatus("active");
      // Reload subscriptions
      const reloadResponse = await getSubscriptionsApi({
        // Disabled search to avoid backend database column issues
        // search: searchCode || searchPlan || searchPayment,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setSubscriptions((reloadResponse as ApiResponse).data);
      setMeta((reloadResponse as ApiResponse).meta);
    } catch (err) {
      console.error("Create subscription error:", err);

      let errorMessage = "Failed to create subscription";
      if (err && typeof err === "object" && "errors" in err) {
        const errors = (err as { errors: Record<string, string[]> }).errors;
        errorMessage = `Validation failed: ${Object.entries(errors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("; ")}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setSelectedUserId(subscription.user_id.toString());
    setSelectedPlanId(subscription.plan_id.toString());
    setSelectedStatus(subscription.status);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleUpdateSubscription = async (formData: FormData) => {
    if (!selectedSubscription) return;

    const subscriptionData = {
      user_id: parseInt(selectedUserId),
      plan_id: parseInt(selectedPlanId),
      status: selectedStatus,
    };

    try {
      await updateSubscriptionApi(selectedSubscription.id, subscriptionData);
      toast.success("Subscription updated successfully");
      setIsDrawerOpen(false);
      setIsEditMode(false);
      setSelectedSubscription(null);
      // Reset form
      setSelectedUserId("");
      setSelectedPlanId("");
      setSelectedStatus("active");
      // Reload subscriptions
      const response = await getSubscriptionsApi({
        // Disabled search to avoid backend database column issues
        // search: searchCode || searchPlan || searchPayment,
        status: searchStatus || "all",
        per_page: itemsPerPage,
      });
      setSubscriptions((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to update subscription");
    }
  };

  // Generate subscription codes
  const generateSubscriptionCode = (subscription: Subscription) => {
    return `subscription_${subscription.id
      .toString()
      .padStart(10, "0")
      .slice(-10)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      case "expired":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  // Client-side filtering for all search fields
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    // Code search
    if (searchCode) {
      const code = generateSubscriptionCode(subscription).toLowerCase();
      if (!code.includes(searchCode.toLowerCase())) return false;
    }

    // Plan search
    if (searchPlan) {
      const planName = subscription.plan?.name?.toLowerCase() || "";
      if (!planName.includes(searchPlan.toLowerCase())) return false;
    }

    // User search
    if (searchUser) {
      const user = subscription.user;
      if (!user) return false;
      const searchTerm = searchUser.toLowerCase();
      const userName = user.name?.toLowerCase() || "";
      const userEmail = user.email?.toLowerCase() || "";
      if (!userName.includes(searchTerm) && !userEmail.includes(searchTerm))
        return false;
    }

    // Payment method search
    if (searchPayment) {
      const paymentMethod = subscription.payment_method?.toLowerCase() || "";
      if (!paymentMethod.includes(searchPayment.toLowerCase())) return false;
    }

    // Start date search
    if (searchStarts) {
      const startDate = new Date(subscription.start_date).toLocaleDateString();
      if (!startDate.includes(searchStarts)) return false;
    }

    // End date search
    if (searchEnds) {
      if (!subscription.end_date) return false;
      const endDate = new Date(subscription.end_date).toLocaleDateString();
      if (!endDate.includes(searchEnds)) return false;
    }

    // Status search
    if (searchStatus && searchStatus !== "all") {
      if (subscription.status !== searchStatus) return false;
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Subscriptions
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user subscriptions and billing
          </p>
        </div>
        <Button
          className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD MANUAL SUBSCRIPTION
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscriptions
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total || 0}</div>
            <p className="text-xs text-success">All subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter((sub) => sub.status === "active").length}
            </div>
            <p className="text-xs text-success">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter((sub) => sub.status === "cancelled").length}
            </div>
            <p className="text-xs text-success">Cancelled subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plans</CardTitle>
            <Award className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Array.from(
                  new Set(subscriptions.map((s) => s.plan?.id).filter(Boolean))
                ).length
              }
            </div>
            <p className="text-xs text-success">Different plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchCode}
            onSearchChange={setSearchCode}
            filters={[
              {
                id: "status",
                label: "Status",
                value: searchStatus || "all",
                options: [
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "expired", label: "Expired" },
                ],
              },
            ]}
            onFilterChange={(filterId, value) => {
              if (filterId === "status") {
                setSearchStatus(value === "all" ? "" : value);
              }
            }}
            onClearFilters={() => {
              setSearchCode("");
              setSearchPlan("");
              setSearchUser("");
              setSearchStarts("");
              setSearchEnds("");
              setSearchPayment("");
              setSearchStatus("");
            }}
            onExport={() => console.log("Export subscriptions")}
            searchPlaceholder="Search subscriptions..."
          />
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="space-y-2">
                      <div>CODE</div>
                      <Input
                        placeholder="Search Code"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>PLAN</div>
                      <Input
                        placeholder="Search Plan"
                        value={searchPlan}
                        onChange={(e) => setSearchPlan(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>USER</div>
                      <Input
                        placeholder="Search User"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>STARTS</div>
                      <Input
                        placeholder="Search Starts"
                        value={searchStarts}
                        onChange={(e) => setSearchStarts(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>ENDS</div>
                      <Input
                        placeholder="Search Ends"
                        value={searchEnds}
                        onChange={(e) => setSearchEnds(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>PAYMENT</div>
                      <Input
                        placeholder="Search Payment"
                        value={searchPayment}
                        onChange={(e) => setSearchPayment(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <div>STATUS</div>
                      <Input
                        placeholder="Search Status"
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading subscriptions...</span>
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
                ) : filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow
                        key={subscription.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="select-all">
                              {generateSubscriptionCode(subscription)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  generateSubscriptionCode(subscription)
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
                            <div className="font-semibold">
                              {subscription.plan?.name || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {subscription.plan?.description || ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {subscription.user?.name ||
                              subscription.user?.email ||
                              "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(
                              subscription.start_date
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {subscription.end_date
                              ? new Date(
                                  subscription.end_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {subscription.payment_method || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(subscription.status)}
                          >
                            {subscription.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(subscription)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditSubscription(subscription)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleDeleteSubscription(subscription.id)
                                }
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

      {/* Subscription Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-[600px]">
          <div className="overflow-y-auto h-screen px-2">
            <div className="bg-gray-100 py-4 lg:py-4 rounded">
              <div className="container px-6 mx-auto flex ltr:flex-row rtl:flex-row-reverse">
                <div>
                  <h4 className="text-base font-semibold leading-tight text-gray-800">
                    Subscription Details
                  </h4>
                </div>
              </div>
            </div>

            {selectedSubscription && (
              <div className="mt-6 w-11/12 mx-auto xl:w-full xl:mx-0">
                <div>
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subscription ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {generateSubscriptionCode(selectedSubscription)}
                      </dd>
                    </div>

                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Plan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSubscription.plan?.name || "N/A"}
                      </dd>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Payment User
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSubscription.user?.name || "N/A"}
                      </dd>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subscription Starts
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {new Date(
                          selectedSubscription.start_date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </dd>
                    </div>

                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Subscription Ends
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSubscription.end_date
                          ? new Date(
                              selectedSubscription.end_date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </dd>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">
                        {selectedSubscription.status}{" "}
                        <span className="ml-2 text-xs text-blue-500 cursor-pointer underline">
                          Edit
                        </span>
                      </dd>
                    </div>

                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Payment Method
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedSubscription.payment_method || "Online"}
                      </dd>
                    </div>

                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Online Payment Details
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul
                          role="list"
                          className="border border-gray-200 rounded-md divide-y divide-gray-200"
                        >
                          <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="flex-shrink-0 h-4 w-6 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                ></path>
                              </svg>
                              <span className="ml-2 flex-1 w-0 truncate">
                                {selectedSubscription.payment_method ||
                                  "payment_IPEaqV67ZvHM3fc0"}
                              </span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a
                                href={`http://localhost:8000/download-invoice/${
                                  selectedSubscription.payment_method ||
                                  "payment_IPEaqV67ZvHM3fc0"
                                }`}
                                target="_blank"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View Invoice
                              </a>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Create Subscription Sheet */}
      <Sheet
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) {
            // Reset form when drawer closes
            setIsEditMode(false);
            setSelectedSubscription(null);
            setSelectedUserId("");
            setSelectedPlanId("");
            setSelectedStatus("active");
          }
        }}
      >
        <SheetContent className="w-[30%]">
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? "Edit Subscription" : "New Subscription"}
            </SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Update subscription details"
                : "Create a new subscription for a user"}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                if (isEditMode) {
                  handleUpdateSubscription(formData);
                } else {
                  handleCreateSubscription(formData);
                }
              }}
              className="space-y-4"
            >
              {/* User Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="user_id"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  User<span className="ml-1 text-red-400">*</span>
                </Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose User" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 ? (
                      <SelectItem value="loading" disabled>
                        Loading users...
                      </SelectItem>
                    ) : (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name || user.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="plan_id"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Plan<span className="ml-1 text-red-400">*</span>
                </Label>
                <Select
                  value={selectedPlanId}
                  onValueChange={setSelectedPlanId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.length === 0 ? (
                      <SelectItem value="loading" disabled>
                        Loading plans...
                      </SelectItem>
                    ) : (
                      plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Status<span className="ml-1 text-red-400">*</span>
                </Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(
                      value as "active" | "inactive" | "cancelled" | "expired"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
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
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
