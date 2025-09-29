import { useState } from "react";
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
  Hash
} from "lucide-react";

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
  const [userGroups, setUserGroups] = useState<UserGroup[]>([
    {
      id: "ugu_WdeSQKVGwhs",
      code: "ugu_WdeSQKVGwhs", 
      name: "KIDS",
      description: "Children's learning group for ages 6-12",
      visibility: "Private",
      status: "Active",
      members: 24,
      created: "Sep 15, 2025",
      lastActivity: "2 hours ago"
    },
    {
      id: "ugu_TeenGroup123",
      code: "ugu_TeenGroup123",
      name: "TEENAGERS", 
      description: "Advanced learning group for teens",
      visibility: "Public",
      status: "Active",
      members: 18,
      created: "Aug 22, 2025",
      lastActivity: "1 day ago"
    },
    {
      id: "ugu_AdultLearners",
      code: "ugu_AdultLearners",
      name: "ADULTS",
      description: "Professional development group",
      visibility: "Private", 
      status: "Inactive",
      members: 45,
      created: "Jul 10, 2025",
      lastActivity: "1 week ago"
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

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

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      setUserGroups(userGroups.filter(g => g.id !== selectedGroup.id));
      setIsDeleteDrawerOpen(false);
      setSelectedGroup(null);
    }
  };

  const handleSave = (groupData: Partial<UserGroup>) => {
    if (selectedGroup) {
      // Edit existing
      setUserGroups(userGroups.map(g => 
        g.id === selectedGroup.id ? { ...g, ...groupData } : g
      ));
    } else {
      // Add new
      const newGroup: UserGroup = {
        id: `ugu_${Math.random().toString(36).substr(2, 9)}`,
        code: `ugu_${Math.random().toString(36).substr(2, 9)}`,
        name: groupData.name || "",
        description: groupData.description || "",
        visibility: groupData.visibility || "Private",
        status: groupData.status || "Active", 
        members: 0,
        created: new Date().toLocaleDateString(),
        lastActivity: "Just now"
      };
      setUserGroups([...userGroups, newGroup]);
    }
    setIsDrawerOpen(false);
    setSelectedGroup(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    return visibility === 'Private' 
      ? 'bg-destructive text-destructive-foreground'
      : 'bg-primary text-primary-foreground';
  };

  const filteredUserGroups = userGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || group.status.toLowerCase() === statusFilter;
    const matchesVisibility = visibilityFilter === "all" || group.visibility.toLowerCase() === visibilityFilter;
    
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const columns = [
    {
      key: 'code' as keyof UserGroup,
      header: 'Code',
      sortable: true,
      render: (group: UserGroup) => (
        <Badge variant="outline" className="bg-primary text-primary-foreground">
          {group.code}
        </Badge>
      )
    },
    {
      key: 'name' as keyof UserGroup,
      header: 'Name',
      sortable: true,
      render: (group: UserGroup) => (
        <div>
          <div className="font-medium">{group.name}</div>
          <div className="text-sm text-muted-foreground">{group.description}</div>
        </div>
      )
    },
    {
      key: 'visibility' as keyof UserGroup,
      header: 'Visibility',
      sortable: true,
      render: (group: UserGroup) => (
        <Badge variant="outline" className={getVisibilityColor(group.visibility)}>
          {group.visibility}
        </Badge>
      )
    },
    {
      key: 'members' as keyof UserGroup,
      header: 'Members',
      sortable: true,
      render: (group: UserGroup) => (
        <div className="flex items-center">
          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
          {group.members}
        </div>
      )
    },
    {
      key: 'status' as keyof UserGroup,
      header: 'Status',
      sortable: true,
      render: (group: UserGroup) => (
        <Badge variant="outline" className={getStatusColor(group.status)}>
          {group.status}
        </Badge>
      )
    },
    {
      key: 'lastActivity' as keyof UserGroup,
      header: 'Last Activity',
      sortable: true,
      render: (group: UserGroup) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Activity className="mr-1 h-4 w-4" />
          {group.lastActivity}
        </div>
      )
    }
  ];

  const filters = [
    { 
      key: 'search', 
      type: 'search' as const, 
      label: 'Search',
      placeholder: 'Search user groups...', 
      value: searchTerm, 
      onChange: setSearchTerm 
    },
    { 
      key: 'status', 
      type: 'select' as const, 
      label: 'Status',
      placeholder: 'All Status', 
      value: statusFilter, 
      onChange: setStatusFilter,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    { 
      key: 'visibility', 
      type: 'select' as const, 
      label: 'Visibility',
      placeholder: 'All Visibility', 
      value: visibilityFilter, 
      onChange: setVisibilityFilter,
      options: [
        { label: 'All Visibility', value: 'all' },
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public' }
      ]
    }
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleEdit(group),
      variant: "default" as const
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleEdit(group),
      variant: "default" as const
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (group: UserGroup) => handleDelete(group),
      variant: "destructive" as const
    }
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
        <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-hover">
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
              {userGroups.filter(g => g.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Groups</CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userGroups.filter(g => g.visibility === 'Private').length}
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
      <FiltersPanel filters={filters} onClearFilters={() => {
        setSearchTerm("");
        setStatusFilter("all");
        setVisibilityFilter("all");
      }} />

      {/* Data Table */}
      <DataTable
        data={filteredUserGroups}
        columns={columns}
        actions={actions}
      />

      {/* Side Drawer for Add/Edit */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedGroup ? "Edit User Group" : "Add New User Group"}
        description={selectedGroup ? "Update user group details" : "Create a new user group"}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="groupName">User Group Name <span className="text-destructive">*</span></Label>
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
              <Switch id="active" defaultChecked={selectedGroup?.status === 'Active'} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="private">Private Group</Label>
                <p className="text-sm text-muted-foreground">
                  Private Group (Only admin can add users). Public Group (Anyone can join).
                </p>
              </div>
              <Switch id="private" defaultChecked={selectedGroup?.visibility === 'Private'} />
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
              onClick={() => handleSave({
                name: (document.getElementById('groupName') as HTMLInputElement)?.value,
                description: (document.getElementById('description') as HTMLTextAreaElement)?.value,
                status: (document.getElementById('active') as HTMLInputElement)?.checked ? 'Active' : 'Inactive',
                visibility: (document.getElementById('private') as HTMLInputElement)?.checked ? 'Private' : 'Public'
              })}
            >
              {selectedGroup ? 'Update Group' : 'Create Group'}
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