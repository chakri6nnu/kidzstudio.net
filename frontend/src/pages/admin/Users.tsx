import { useState } from "react";
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

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/avatars/alice.jpg",
      role: "Student",
      status: "Active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-28",
      examsCompleted: 12,
      totalScore: 945,
      subscriptionPlan: "Premium",
      phone: "+1 (555) 123-4567",
      group: "Engineering Batch 2024",
    },
    {
      id: 2,
      name: "Dr. Robert Smith",
      email: "robert@example.com",
      avatar: "/avatars/robert.jpg",
      role: "Instructor",
      status: "Active",
      joinDate: "2023-08-10",
      lastActive: "2024-01-28",
      examsCreated: 35,
      studentsManaged: 150,
      subscriptionPlan: "Faculty",
      phone: "+1 (555) 987-6543",
      group: "Computer Science Faculty",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "/avatars/emma.jpg",
      role: "Student",
      status: "Suspended",
      joinDate: "2024-01-20",
      lastActive: "2024-01-25",
      examsCompleted: 3,
      totalScore: 180,
      subscriptionPlan: "Basic",
      phone: "+1 (555) 456-7890",
      group: "Mathematics Group A",
    },
    {
      id: 4,
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/avatars/michael.jpg",
      role: "Admin",
      status: "Active",
      joinDate: "2023-05-01",
      lastActive: "2024-01-28",
      systemAccess: "Full",
      permissions: "All",
      subscriptionPlan: "System",
      phone: "+1 (555) 321-0987",
      group: "System Administrators",
    },
    {
      id: 5,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/avatars/sarah.jpg",
      role: "Student",
      status: "Inactive",
      joinDate: "2023-12-05",
      lastActive: "2024-01-10",
      examsCompleted: 8,
      totalScore: 620,
      subscriptionPlan: "Premium",
      phone: "+1 (555) 654-3210",
      group: "Physics Advanced",
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
            onSave={(data) => console.log("Save user:", data)}
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
                            <DropdownMenuItem>
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
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
      </CardContent>
    </Card>
  </div>
);
}