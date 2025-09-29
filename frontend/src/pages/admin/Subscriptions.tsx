import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MoreHorizontal, Plus, Search, Eye } from "lucide-react";
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
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load subscriptions from API
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSubscriptionsApi({
          search: searchTerm,
          status: statusFilter,
          plan_id: planFilter,
          per_page: 10,
        });
        setSubscriptions((response as ApiResponse).data);
        setMeta((response as ApiResponse).meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscriptions");
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [searchTerm, statusFilter, planFilter]);

  // Load plans and users for dropdowns
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [plansResponse, usersResponse] = await Promise.all([
          getPlansApi({ per_page: 100 }),
          getUsersApi({ per_page: 100 }),
        ]);
        setPlans((plansResponse as { data: Plan[] }).data);
        setUsers((usersResponse as { data: User[] }).data);
      } catch (err) {
        console.error("Failed to load lookup data:", err);
      }
    };

    loadLookups();
  }, []);

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  const handleCreateSubscription = async (formData: Partial<Subscription>) => {
    try {
      await createSubscriptionApi(formData);
      toast.success("Subscription created successfully");
      // Reload subscriptions
      const response = await getSubscriptionsApi({
        search: searchTerm,
        status: statusFilter,
        plan_id: planFilter,
        per_page: 10,
      });
      setSubscriptions((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to create subscription");
    }
  };

  const handleUpdateSubscription = async (id: number, formData: Partial<Subscription>) => {
    try {
      await updateSubscriptionApi(id, formData);
      toast.success("Subscription updated successfully");
      // Reload subscriptions
      const response = await getSubscriptionsApi({
        search: searchTerm,
        status: statusFilter,
        plan_id: planFilter,
        per_page: 10,
      });
      setSubscriptions((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to update subscription");
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    try {
      await deleteSubscriptionApi(id);
      toast.success("Subscription deleted successfully");
      // Reload subscriptions
      const response = await getSubscriptionsApi({
        search: searchTerm,
        status: statusFilter,
        plan_id: planFilter,
        per_page: 10,
      });
      setSubscriptions((response as ApiResponse).data);
      setMeta((response as ApiResponse).meta);
    } catch (err) {
      toast.error("Failed to delete subscription");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Subscriptions
          </h1>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          ADD MANUAL SUBSCRIPTION
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subscriptions..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Loading subscriptions...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <div className="rounded-md border-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>PLAN</TableHead>
                    <TableHead>USER</TableHead>
                    <TableHead>START DATE</TableHead>
                    <TableHead>END DATE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          #{subscription.id}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm">{subscription.plan?.name || 'N/A'}</div>
                      </TableCell>
                      <TableCell>{subscription.user?.name || 'N/A'}</TableCell>
                      <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            subscription.status === 'active' 
                              ? "bg-success text-success-foreground"
                              : subscription.status === 'cancelled'
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(subscription)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">ROWS PER PAGE:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">PAGE</span>
              <Button variant="outline" size="sm">1</Button>
              <span className="text-sm text-muted-foreground">OF 1</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Subscription Details</SheetTitle>
            <SheetDescription>
              View subscription information and details
            </SheetDescription>
          </SheetHeader>
          
          {selectedSubscription && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription ID</label>
                <p className="text-sm">{selectedSubscription.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <p className="text-sm">{selectedSubscription.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment User</label>
                <p className="text-sm">{selectedSubscription.user}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription Starts</label>
                <p className="text-sm">{selectedSubscription.starts}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription Ends</label>
                <p className="text-sm">{selectedSubscription.ends}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    {selectedSubscription.status}
                  </Badge>
                  {" "}
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    EDIT
                  </Button>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="text-sm">Online</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Online Payment Details</label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{selectedSubscription.payment}</span>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    View Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}