import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiltersPanel } from "@/components/ui/filters-panel";
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Upload,
  Download,
} from "lucide-react";
import UserForm from "@/components/forms/UserForm";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import ImportDialog from "@/components/dialogs/ImportDialog";
import { 
  getUsersApi, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi, 
  type User as ApiUser 
} from "@/lib/utils";
import { toast } from "sonner";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: { search?: string; role?: string; status?: string; per_page?: number } = {
        search: searchTerm || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      };
      const response = await getUsersApi(filters);
      
      // Map API response to UI format
      const mappedUsers = response.data.map((u: ApiUser) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: "/placeholder.svg", // Default avatar
        role: u.role,
        status: u.is_active ? "Active" : "Inactive",
        joinDate: new Date(u.created_at).toISOString().split('T')[0],
        lastActive: new Date(u.updated_at).toISOString().split('T')[0],
        examsCompleted: 0, // Placeholder - needs to come from API
        totalScore: 0, // Placeholder - needs to come from API
        subscriptionPlan: "Basic", // Placeholder - needs to come from API
        phone: u.phone || "",
        group: "Default Group", // Placeholder - needs to come from API
      }));
      
      setUsers(mappedUsers);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm, selectedRole, selectedStatus]);

  // Filter and search logic (now handled by API)
  const filteredUsers = users;

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "role":
        setSelectedRole(value);
        break;
      case "status":
        setSelectedStatus(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  const filters = [
    {
      id: "role",
      label: "Role",
      value: selectedRole,
      options: [
        { value: "all", label: "All Roles" },
        { value: "Student", label: "Student" },
        { value: "Instructor", label: "Instructor" },
        { value: "Admin", label: "Admin" }
      ]
    },
    {
      id: "status", 
      label: "Status",
      value: selectedStatus,
      options: [
        { value: "all", label: "All Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Suspended", label: "Suspended" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-warning text-warning-foreground";
      case "Suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/10 text-destructive";
      case "Instructor":
        return "bg-primary/10 text-primary";
      case "Student":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "bg-accent/10 text-accent";
      case "Faculty":
        return "bg-primary/10 text-primary";
      case "System":
        return "bg-destructive/10 text-destructive";
      case "Basic":
        return "bg-muted/50 text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ImportDialog
            title="Import Users"
            description="Import users from CSV or Excel files"
            acceptedFormats={["csv", "xlsx"]}
            onImport={(data) => console.log("Import users:", data)}
            trigger={
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </Button>
            }
          />
          <UserForm
            onSave={handleSaveUser}
            onCancel={() => {}}
            trigger={
              <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserPlus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-success">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,234</div>
            <p className="text-xs text-muted-foreground">78% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-success">+23% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Award className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,123</div>
            <p className="text-xs text-success">+8% conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <FiltersPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => console.log("Export users")}
            searchPlaceholder="Search users, emails, groups..."
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getRoleColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getPlanColor(user.subscriptionPlan)}
                      >
                        {user.subscriptionPlan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.group}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === "Student" ? (
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-3 w-3" />
                            <span>{user.examsCompleted} exams</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Award className="h-3 w-3" />
                            <span>{user.totalScore} pts</span>
                          </div>
                        </div>
                      ) : user.role === "Instructor" ? (
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-3 w-3" />
                            <span>{user.examsCreated} created</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <UserPlus className="h-3 w-3" />
                            <span>{user.studentsManaged} students</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-3 w-3" />
                            <span>{user.systemAccess} access</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {user.lastActive}
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          {user.status === "Active" ? (
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
  </div>
);

  // Handler functions
  const handleToggleStatus = async (user: any) => {
    try {
      await updateUserApi(user.id, { is_active: user.status !== "Active" });
      toast.success(`User ${user.status === "Active" ? "deactivated" : "activated"} successfully!`);
      await loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUserApi(user.id);
        toast.success("User deleted successfully!");
        await loadUsers();
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete user");
      }
    }
  };

  const handleSaveUser = async (data: any) => {
    try {
      await createUserApi(data);
      toast.success("User created successfully!");
      await loadUsers();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user");
    }
  };
}