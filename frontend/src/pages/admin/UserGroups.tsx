import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Shield,
  Calendar,
  Activity,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Table as TableIcon,
  Type,
  Hash,
} from "lucide-react";
import {
  getUserGroupsApi,
  createUserGroupApi,
  updateUserGroupApi,
  deleteUserGroupApi,
  type UserGroup as ApiUserGroup,
} from "@/lib/utils";
import { toast } from "sonner";

interface UserGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  visibility: string;
  status: string;
  members: number;
  created: string;
  lastActivity: string;
}

export default function UserGroups() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<any>({});

  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Load user groups from API
  const loadUserGroups = async () => {
    try {
      setLoading(true);
      setError("");
      const filters: {
        search?: string;
        status?: string;
        type?: string;
        per_page?: number;
      } = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: visibilityFilter !== "all" ? visibilityFilter : undefined,
      };
      const response = await getUserGroupsApi(filters);

      // Map API response to UI format
      const mappedGroups: UserGroup[] = response.data.map(
        (g: ApiUserGroup) => ({
          id: g.id.toString(),
          code: `UG${g.id.toString().padStart(4, "0")}`,
          name: g.name || "Unnamed Group",
          description: g.description || "",
          visibility: g.type === "academic" ? "Private" : "Public",
          status: g.is_active === true ? "Active" : "Inactive",
          members: g.users_count || 0,
          created: new Date(g.created_at).toLocaleDateString(),
          lastActivity: new Date(g.updated_at).toLocaleDateString(),
        })
      );

      setUserGroups(mappedGroups);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err?.message || "Failed to load user groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserGroups();
  }, [searchTerm, statusFilter, visibilityFilter]);

  const handleAdd = () => {
    setSelectedGroup(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsDrawerOpen(true);
  };

  const handleDelete = (group: UserGroup) => {
    setSelectedGroup(group);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedGroup) {
      try {
        await deleteUserGroupApi(Number(selectedGroup.id));
        toast.success("User group deleted successfully!");
        setIsDeleteDrawerOpen(false);
        setSelectedGroup(null);
        await loadUserGroups();
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete user group");
      }
    }
  };

  const handleSave = async (groupData: Partial<UserGroup>) => {
    try {
      const payload = {
        name: groupData.name || "",
        description: groupData.description || "",
        type: groupData.visibility === "Private" ? "academic" : "student",
        is_active: groupData.status === "Active",
      };

      if (selectedGroup) {
        await updateUserGroupApi(Number(selectedGroup.id), payload);
        toast.success("User group updated successfully!");
      } else {
        await createUserGroupApi(payload);
        toast.success("User group created successfully!");
      }

      setIsDrawerOpen(false);
      setSelectedGroup(null);
      await loadUserGroups();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save user group");
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-muted text-muted-foreground";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getVisibilityColor = (visibility: string | undefined) => {
    if (!visibility) return "bg-muted text-muted-foreground";

    return visibility === "Private"
      ? "bg-destructive text-destructive-foreground"
      : "bg-primary text-primary-foreground";
  };

  // Filter and search logic (now handled by API)
  const filteredUserGroups = userGroups;

  const columns = [
    {
      key: "code" as keyof UserGroup,
      header: "Code",
      sortable: true,
      render: (group: UserGroup) => (
        <Badge variant="outline" className="bg-primary text-primary-foreground">
          {group?.code || "N/A"}
        </Badge>
      ),
    },
    {
      key: "name" as keyof UserGroup,
      header: "Name",
      sortable: true,
      render: (group: UserGroup) => (
        <div>
          <div className="font-medium">{group?.name || "Unnamed Group"}</div>
          <div className="text-sm text-muted-foreground">
            {group?.description || "No description"}
          </div>
        </div>
      ),
    },
    {
      key: "visibility" as keyof UserGroup,
      header: "Visibility",
      sortable: true,
      render: (group: UserGroup) => (
        <Badge
          variant="outline"
          className={getVisibilityColor(group?.visibility)}
        >
          {group?.visibility || "Unknown"}
        </Badge>
      ),
    },
    {
      key: "members" as keyof UserGroup,
      header: "Members",
      sortable: true,
      render: (group: UserGroup) => (
        <div className="flex items-center">
          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
          {group?.members || 0}
        </div>
      ),
    },
    {
      key: "status" as keyof UserGroup,
      header: "Status",
      sortable: true,
      render: (group: UserGroup) => (
        <Badge variant="outline" className={getStatusColor(group?.status)}>
          {group?.status || "Unknown"}
        </Badge>
      ),
    },
    {
      key: "lastActivity" as keyof UserGroup,
      header: "Last Activity",
      sortable: true,
      render: (group: UserGroup) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Activity className="mr-1 h-4 w-4" />
          {group?.lastActivity || "Never"}
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "search",
      type: "search" as const,
      label: "Search",
      placeholder: "Search user groups...",
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      key: "status",
      type: "select" as const,
      label: "Status",
      placeholder: "All Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      key: "visibility",
      type: "select" as const,
      label: "Visibility",
      placeholder: "All Visibility",
      value: visibilityFilter,
      onChange: setVisibilityFilter,
      options: [
        { label: "All Visibility", value: "all" },
        { label: "Private", value: "private" },
        { label: "Public", value: "public" },
      ],
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleEdit(group),
      variant: "default" as const,
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleEdit(group),
      variant: "default" as const,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleDelete(group),
      variant: "destructive" as const,
    },
  ];

  const ToolbarButton = ({ icon: Icon, ...props }: any) => (
    <Button variant="ghost" size="sm" {...props}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  const RichTextToolbar = () => (
    <div className="flex items-center space-x-1 p-2 border-b">
      <ToolbarButton icon={Bold} />
      <ToolbarButton icon={Italic} />
      <ToolbarButton icon={Underline} />
      <ToolbarButton icon={Type} />
      <ToolbarButton icon={Hash} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={List} />
      <ToolbarButton icon={ListOrdered} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={AlignLeft} />
      <ToolbarButton icon={AlignCenter} />
      <ToolbarButton icon={AlignRight} />
      <div className="w-px h-6 bg-border mx-2" />
      <ToolbarButton icon={Link} />
      <ToolbarButton icon={Image} />
      <ToolbarButton icon={TableIcon} />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            User Groups
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user groups and permissions
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          NEW USER GROUP
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userGroups.length}</div>
            <p className="text-xs text-muted-foreground">User groups</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userGroups.filter((g) => g.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Private Groups
            </CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userGroups.filter((g) => g.visibility === "Private").length}
            </div>
            <p className="text-xs text-muted-foreground">Restricted access</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userGroups.reduce((sum, g) => sum + g.members, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All group members</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FiltersPanel
        filters={filters}
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setVisibilityFilter("all");
        }}
      />

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading user groups...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">{error}</div>
        </div>
      ) : (
        <DataTable
          data={filteredUserGroups}
          columns={columns}
          actions={actions}
        />
      )}

      {/* Side Drawer for Add/Edit */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedGroup ? "Edit User Group" : "Add New User Group"}
        description={
          selectedGroup
            ? "Update user group details"
            : "Create a new user group"
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="groupName">
              User Group Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="groupName"
              defaultValue={selectedGroup?.name || ""}
              placeholder="Enter group name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="border rounded-md">
              <RichTextToolbar />
              <Textarea
                id="description"
                placeholder="Enter description..."
                defaultValue={selectedGroup?.description || ""}
                className="min-h-32 border-0 resize-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Active (Shown Everywhere). In-active (Hidden Everywhere).
                </p>
              </div>
              <Switch
                id="active"
                defaultChecked={selectedGroup?.status === "Active"}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="private">Private Group</Label>
                <p className="text-sm text-muted-foreground">
                  Private Group (Only admin can add users). Public Group (Anyone
                  can join).
                </p>
              </div>
              <Switch
                id="private"
                defaultChecked={selectedGroup?.visibility === "Private"}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:bg-primary-hover"
              onClick={() =>
                handleSave({
                  name: (
                    document.getElementById("groupName") as HTMLInputElement
                  )?.value,
                  description: (
                    document.getElementById(
                      "description"
                    ) as HTMLTextAreaElement
                  )?.value,
                  status: (
                    document.getElementById("active") as HTMLInputElement
                  )?.checked
                    ? "Active"
                    : "Inactive",
                  visibility: (
                    document.getElementById("private") as HTMLInputElement
                  )?.checked
                    ? "Private"
                    : "Public",
                })
              }
            >
              {selectedGroup ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete User Group"
        description="Are you sure you want to delete this user group? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDrawerOpen(false)}
        itemName={selectedGroup?.name}
      />
    </div>
  );
}
