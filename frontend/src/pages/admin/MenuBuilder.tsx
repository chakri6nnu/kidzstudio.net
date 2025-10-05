import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/ui/data-table";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Menu,
  Link,
  Home,
  Settings,
  Users,
  ChevronRight,
  GripVertical,
  Globe,
  Shield,
  BookOpen,
  BarChart3,
  Navigation,
} from "lucide-react";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: "internal" | "external" | "category";
  parent: string | null;
  order: number;
  icon: string;
  visible: boolean;
  status: string;
  target: string;
  created: string;
  children?: MenuItem[];
}

export default function MenuBuilder() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "menu_001",
      title: "Home",
      url: "/",
      type: "internal",
      parent: null,
      order: 1,
      icon: "Home",
      visible: true,
      status: "Active",
      target: "_self",
      created: "Sep 15, 2025",
    },
    {
      id: "menu_002",
      title: "Courses",
      url: "/courses",
      type: "category",
      parent: null,
      order: 2,
      icon: "BookOpen",
      visible: true,
      status: "Active",
      target: "_self",
      created: "Sep 16, 2025",
    },
    {
      id: "menu_003",
      title: "Mathematics",
      url: "/courses/math",
      type: "internal",
      parent: "menu_002",
      order: 1,
      icon: "BarChart3",
      visible: true,
      status: "Active",
      target: "_self",
      created: "Sep 16, 2025",
    },
    {
      id: "menu_004",
      title: "Science",
      url: "/courses/science",
      type: "internal",
      parent: "menu_002",
      order: 2,
      icon: "Globe",
      visible: true,
      status: "Active",
      target: "_self",
      created: "Sep 16, 2025",
    },
    {
      id: "menu_005",
      title: "About Us",
      url: "/about",
      type: "internal",
      parent: null,
      order: 3,
      icon: "Users",
      visible: true,
      status: "Active",
      target: "_self",
      created: "Sep 17, 2025",
    },
    {
      id: "menu_006",
      title: "External Resource",
      url: "https://example.com",
      type: "external",
      parent: null,
      order: 4,
      icon: "Link",
      visible: false,
      status: "Draft",
      target: "_blank",
      created: "Sep 18, 2025",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAdd = () => {
    setSelectedItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDrawerOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setMenuItems(menuItems.filter((item) => item.id !== selectedItem.id));
      setIsDeleteDrawerOpen(false);
      setSelectedItem(null);
    }
  };

  const handleSave = (itemData: Partial<MenuItem>) => {
    if (selectedItem) {
      // Edit existing
      setMenuItems(
        menuItems.map((item) =>
          item.id === selectedItem.id ? { ...item, ...itemData } : item
        )
      );
    } else {
      // Add new
      const newItem: MenuItem = {
        id: `menu_${Date.now()}`,
        title: itemData.title || "",
        url: itemData.url || "",
        type: itemData.type || "internal",
        parent: itemData.parent || null,
        order: menuItems.length + 1,
        icon: itemData.icon || "Home",
        visible: itemData.visible ?? true,
        status: itemData.status || "Active",
        target: itemData.target || "_self",
        created: new Date().toLocaleDateString(),
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success text-success-foreground";
      case "draft":
        return "bg-warning text-warning-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internal":
        return "bg-primary text-primary-foreground";
      case "external":
        return "bg-accent text-accent-foreground";
      case "category":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Home,
      BookOpen,
      BarChart3,
      Globe,
      Users,
      Link,
      Settings,
      Shield,
      Navigation,
    };
    return icons[iconName] || Home;
  };

  const buildMenuHierarchy = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // First pass: create map of all items
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build hierarchy
    items.forEach((item) => {
      const menuItem = itemMap.get(item.id)!;
      if (item.parent && itemMap.has(item.parent)) {
        const parent = itemMap.get(item.parent)!;
        if (!parent.children) parent.children = [];
        parent.children.push(menuItem);
      } else {
        rootItems.push(menuItem);
      }
    });

    return rootItems.sort((a, b) => a.order - b.order);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    {
      key: "title" as keyof MenuItem,
      header: "Menu Item",
      sortable: true,
      render: (item: MenuItem) => {
        const IconComponent = getIcon(item.icon);
        return (
          <div className="flex items-center">
            <GripVertical className="mr-2 h-4 w-4 text-muted-foreground" />
            <IconComponent className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.url}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "type" as keyof MenuItem,
      header: "Type",
      sortable: true,
      render: (item: MenuItem) => (
        <Badge variant="outline" className={getTypeColor(item.type)}>
          {(item.type || "").charAt(0).toUpperCase() +
            (item.type || "").slice(1)}
        </Badge>
      ),
    },
    {
      key: "parent" as keyof MenuItem,
      header: "Parent",
      sortable: true,
      render: (item: MenuItem) => {
        if (!item.parent)
          return <span className="text-muted-foreground">Root</span>;
        const parentItem = menuItems.find((m) => m.id === item.parent);
        return parentItem ? (
          <div className="flex items-center">
            <ChevronRight className="mr-1 h-3 w-3 text-muted-foreground" />
            {parentItem.title}
          </div>
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        );
      },
    },
    {
      key: "visible" as keyof MenuItem,
      header: "Visibility",
      sortable: true,
      render: (item: MenuItem) => (
        <Badge
          variant="outline"
          className={
            item.visible
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          }
        >
          {item.visible ? "Visible" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "status" as keyof MenuItem,
      header: "Status",
      sortable: true,
      render: (item: MenuItem) => (
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "order" as keyof MenuItem,
      header: "Order",
      sortable: true,
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: MenuItem) => handleEdit(item),
      variant: "default" as const,
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: MenuItem) => handleEdit(item),
      variant: "default" as const,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: MenuItem) => handleDelete(item),
      variant: "destructive" as const,
    },
  ];

  const filters = [
    {
      key: "search",
      type: "search" as const,
      label: "Search",
      placeholder: "Search menu items...",
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      key: "type",
      type: "select" as const,
      label: "Type",
      placeholder: "All Types",
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: "All Types", value: "all" },
        { label: "Internal", value: "internal" },
        { label: "External", value: "external" },
        { label: "Category", value: "category" },
      ],
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
        { label: "Draft", value: "draft" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const parentOptions = menuItems
    .filter((item) => item.type === "category" && item.id !== selectedItem?.id)
    .map((item) => ({ label: item.title, value: item.id }));

  const menuHierarchy = buildMenuHierarchy(menuItems);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Menu Builder
          </h1>
          <p className="text-muted-foreground mt-2">
            Build and manage website navigation menus
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-primary hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD MENU ITEM
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Menu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">Menu items</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visible Items</CardTitle>
            <Eye className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter((item) => item.visible).length}
            </div>
            <p className="text-xs text-muted-foreground">Publicly visible</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter((item) => item.type === "category").length}
            </div>
            <p className="text-xs text-muted-foreground">Parent categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              External Links
            </CardTitle>
            <Link className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter((item) => item.type === "external").length}
            </div>
            <p className="text-xs text-muted-foreground">External resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Preview */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="mr-2 h-5 w-5 text-primary" />
            Menu Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {menuHierarchy.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* @ts-ignore */}
                    {React.createElement(getIcon(item.icon), {
                      className: "mr-2 h-4 w-4",
                    })}
                    <span className="font-medium">{item.title}</span>
                    <Badge
                      variant="outline"
                      className={`ml-2 ${getTypeColor(item.type)}`}
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!item.visible && (
                      <Badge
                        variant="outline"
                        className="bg-muted text-muted-foreground text-xs"
                      >
                        Hidden
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                {item.children && item.children.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center">
                          <ChevronRight className="mr-1 h-3 w-3 text-muted-foreground" />
                          {/* @ts-ignore */}
                          {React.createElement(getIcon(child.icon), {
                            className: "mr-2 h-3 w-3",
                          })}
                          <span className="text-sm">{child.title}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!child.visible && (
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground text-xs"
                            >
                              Hidden
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(
                              child.status
                            )}`}
                          >
                            {child.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <FiltersPanel
        filters={filters}
        onClearFilters={() => {
          setSearchTerm("");
          setTypeFilter("all");
          setStatusFilter("all");
        }}
      />

      {/* Data Table */}
      <DataTable data={filteredItems} columns={columns} actions={actions} />

      {/* Side Drawer for Add/Edit */}
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedItem ? "Edit Menu Item" : "Add New Menu Item"}
        description={
          selectedItem ? "Update menu item details" : "Create a new menu item"
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              defaultValue={selectedItem?.title || ""}
              placeholder="Menu item title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="url"
              defaultValue={selectedItem?.url || ""}
              placeholder="/path or https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue={selectedItem?.type || "internal"}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Link</SelectItem>
                  <SelectItem value="external">External Link</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Select defaultValue={selectedItem?.target || "_self"}>
                <SelectTrigger id="target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Same Window</SelectItem>
                  <SelectItem value="_blank">New Window</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Menu</Label>
              <Select defaultValue={selectedItem?.parent || "none"}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Select parent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root)</SelectItem>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select defaultValue={selectedItem?.icon || "Home"}>
                <SelectTrigger id="icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="BookOpen">Book</SelectItem>
                  <SelectItem value="Users">Users</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                  <SelectItem value="BarChart3">Chart</SelectItem>
                  <SelectItem value="Globe">Globe</SelectItem>
                  <SelectItem value="Link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="visible">Visible</Label>
                <p className="text-sm text-muted-foreground">
                  Show this item in the navigation menu
                </p>
              </div>
              <Switch
                id="visible"
                defaultChecked={selectedItem?.visible ?? true}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status">Status</Label>
                <p className="text-sm text-muted-foreground">
                  Active items are published and accessible
                </p>
              </div>
              <Select defaultValue={selectedItem?.status || "Active"}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                  title: (document.getElementById("title") as HTMLInputElement)
                    ?.value,
                  url: (document.getElementById("url") as HTMLInputElement)
                    ?.value,
                  type: (document.getElementById("type") as HTMLSelectElement)
                    ?.value as "internal" | "external" | "category",
                  target: (
                    document.getElementById("target") as HTMLSelectElement
                  )?.value,
                  parent:
                    (document.getElementById("parent") as HTMLSelectElement)
                      ?.value === "none"
                      ? null
                      : (document.getElementById("parent") as HTMLSelectElement)
                          ?.value || null,
                  icon: (document.getElementById("icon") as HTMLSelectElement)
                    ?.value,
                  visible: (
                    document.getElementById("visible") as HTMLInputElement
                  )?.checked,
                  status:
                    document
                      .querySelector("[data-radix-select-trigger]")
                      ?.getAttribute("data-state") === "open"
                      ? "Active"
                      : selectedItem?.status || "Active",
                })
              }
            >
              {selectedItem ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </div>
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDrawerOpen(false)}
        itemName={selectedItem?.title}
      />
    </div>
  );
}
