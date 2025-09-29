import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OutputData } from "@editorjs/editorjs";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SideDrawer } from "@/components/ui/side-drawer";
import { ConfirmDrawer } from "@/components/ui/confirm-drawer";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { DataTable } from "@/components/ui/data-table";
import { PageForm } from "@/components/forms/PageForm";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  type: "page" | "post" | "landing";
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured?: boolean;
  content?: OutputData;
}

const mockPages: Page[] = [
  {
    id: "1",
    title: "Home Page",
    slug: "home",
    status: "published",
    type: "page",
    author: "John Doe",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    title: "About Us",
    slug: "about-us",
    status: "published",
    type: "page",
    author: "Jane Smith",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    views: 890,
  },
  {
    id: "3",
    title: "Contact",
    slug: "contact",
    status: "draft",
    type: "page",
    author: "John Doe",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    views: 0,
  },
  {
    id: "4",
    title: "Privacy Policy",
    slug: "privacy-policy",
    status: "published",
    type: "page",
    author: "Legal Team",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
    views: 456,
  },
  {
    id: "5",
    title: "Terms of Service",
    slug: "terms-of-service",
    status: "scheduled",
    type: "page",
    author: "Legal Team",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
    views: 0,
  },
];

export default function Pages() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    const matchesType = typeFilter === "all" || page.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handlers
  const handleAdd = () => {
    setIsAddDrawerOpen(true);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setIsEditDrawerOpen(true);
  };

  const handleDelete = (page: Page) => {
    setPageToDelete(page);
    setIsDeleteDrawerOpen(true);
  };

  const handleView = (page: Page) => {
    window.open(`/preview/${page.slug}`, '_blank');
  };

  const handleAddSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newPage: Page = {
        id: Date.now().toString(),
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        type: data.type,
        author: data.author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        featured: data.featured,
      };
      setPages([...pages, newPage]);
      setIsAddDrawerOpen(false);
      toast.success("Page created successfully!");
    } catch (error) {
      toast.error("Failed to create page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingPage) return;
    
    setIsSubmitting(true);
    try {
      const updatedPages = pages.map(page =>
        page.id === editingPage.id
          ? { 
              ...page, 
              ...data,
              updatedAt: new Date().toISOString() 
            }
          : page
      );
      setPages(updatedPages);
      setIsEditDrawerOpen(false);
      setEditingPage(null);
      toast.success("Page updated successfully!");
    } catch (error) {
      toast.error("Failed to update page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      setPages(pages.filter(page => page.id !== pageToDelete.id));
      toast.success("Page deleted successfully!");
      setPageToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  // Badge helpers
  const getStatusBadge = (status: Page["status"]) => {
    const variants = {
      published: "default",
      draft: "secondary",
      scheduled: "outline",
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: Page["type"]) => {
    const colors = {
      page: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      post: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      landing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };

    return (
      <Badge className={colors[type]} variant="outline">
        {type}
      </Badge>
    );
  };

  // Table configuration
  const columns = [
    {
      key: "title",
      header: "Page",
      sortable: true,
      render: (value: string, item: Page) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">{item.title}</div>
              {item.featured && (
                <Badge variant="outline" className="text-xs">Featured</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">/{item.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (value: string) => getTypeBadge(value as Page["type"]),
    },
    {
      key: "status",
      header: "Status", 
      sortable: true,
      render: (value: string) => getStatusBadge(value as Page["status"]),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {value.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: handleView,
    },
    {
      label: "Edit",
      icon: <Edit2 className="mr-2 h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive" as const,
    },
  ];

  const filterOptions = [
    {
      key: "search",
      label: "Search",
      type: "search" as const,
      placeholder: "Search pages...",
      value: searchTerm,
      onChange: setSearchTerm,
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
        { value: "scheduled", label: "Scheduled" },
      ],
    },
    {
      key: "type",
      label: "Type", 
      type: "select" as const,
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: "all", label: "All Types" },
        { value: "page", label: "Page" },
        { value: "post", label: "Post" },
        { value: "landing", label: "Landing" },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages and content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.filter(p => p.status === "published").length}
            </div>
            <p className="text-xs text-muted-foreground">Live pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.filter(p => p.status === "draft").length}
            </div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.reduce((sum, page) => sum + page.views, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FiltersPanel
        filters={filterOptions}
        onClearFilters={handleClearFilters}
      />

      {/* Data Table */}
      <DataTable
        data={filteredPages}
        columns={columns}
        actions={actions}
        onAdd={handleAdd}
        addLabel="Add Page"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        emptyMessage="No pages found"
        renderGridItem={(page, actions) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeBadge(page.type)}
                  {page.featured && (
                    <Badge variant="outline" className="text-xs">Featured</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => action.onClick(page)}
                      className={action.variant === "destructive" ? "text-destructive hover:text-destructive" : ""}
                    >
                      {action.icon}
                    </Button>
                  ))}
                </div>
              </div>
              <CardTitle className="text-lg">{page.title}</CardTitle>
              <CardDescription>/{page.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(page.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author:</span>
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {page.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{page.author}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Views:</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{page.views}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span className="text-sm">{new Date(page.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Add Page Drawer */}
      <SideDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        title="Add New Page"
        description="Create a new page for your website"
      >
        <PageForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddDrawerOpen(false)}
          isLoading={isSubmitting}
        />
      </SideDrawer>

      {/* Edit Page Drawer */}
      <SideDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        title="Edit Page"
        description="Update page content and settings"
      >
        {editingPage && (
          <PageForm
            initialData={editingPage}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditDrawerOpen(false);
              setEditingPage(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </SideDrawer>

      {/* Delete Confirmation Drawer */}
      <ConfirmDrawer
        open={isDeleteDrawerOpen}
        onOpenChange={setIsDeleteDrawerOpen}
        title="Delete Page"
        description="Are you sure you want to delete this page?"
        itemName={pageToDelete?.title}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Page"
        variant="destructive"
      />
    </div>
  );
}