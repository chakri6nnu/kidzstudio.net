import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface ListPageStatus {
  id: string;
  pageName: string;
  route: string;
  hasAdd: "working" | "partial" | "not-working";
  hasEdit: "working" | "partial" | "not-working"; 
  hasDelete: "working" | "partial" | "not-working";
  hasFiltersPanel: boolean;
  hasSideDrawer: boolean;
  hasConfirmDialog: boolean;
  hasEditorJs: boolean;
  implementation: "complete" | "partial" | "basic" | "old-system";
  notes: string;
}

export default function ListPagesStatus() {
  const listPages: ListPageStatus[] = [
    {
      id: "1",
      pageName: "Pages",
      route: "/admin/pages",
      hasAdd: "working",
      hasEdit: "working", 
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: true,
      implementation: "complete",
      notes: "Fully updated with new UI/UX system, EditorJS integrated"
    },
    {
      id: "2", 
      pageName: "Users",
      route: "/admin/users",
      hasAdd: "partial",
      hasEdit: "partial",
      hasDelete: "partial",
      hasFiltersPanel: true,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "partial",
      notes: "Has FiltersPanel but uses old UserForm dialog, needs SideDrawer conversion"
    },
    {
      id: "3",
      pageName: "Exams", 
      route: "/admin/exams",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "partial",
      hasFiltersPanel: true,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "partial",
      notes: "Has FiltersPanel, routing-based add/edit, needs SideDrawer for consistency"
    },
    {
      id: "4",
      pageName: "Quizzes",
      route: "/admin/quizzes", 
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "partial",
      hasFiltersPanel: true,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "partial",
      notes: "Has FiltersPanel, routing-based add/edit, needs SideDrawer for consistency"
    },
    {
      id: "5",
      pageName: "Practice Sets",
      route: "/admin/practice-sets",
      hasAdd: "working", 
      hasEdit: "working",
      hasDelete: "partial",
      hasFiltersPanel: true,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "partial",
      notes: "Has FiltersPanel, routing-based add/edit, needs SideDrawer for consistency"
    },
    {
      id: "6",
      pageName: "Questions",
      route: "/admin/questions",
      hasAdd: "working",
      hasEdit: "working", 
      hasDelete: "partial",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: true,
      implementation: "basic",
      notes: "Basic search filters, routing-based add/edit, has EditorJS but needs full UI/UX system"
    },
    {
      id: "7",
      pageName: "Categories",
      route: "/admin/categories",
      hasAdd: "partial",
      hasEdit: "partial",
      hasDelete: "partial", 
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "old-system",
      notes: "Uses old Dialog pattern, needs complete conversion to new UI/UX system"
    },
    {
      id: "8",
      pageName: "Exam Types",
      route: "/admin/exam-types",
      hasAdd: "partial",
      hasEdit: "partial",
      hasDelete: "partial",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "old-system", 
      notes: "Uses old Dialog with form validation, needs conversion to SideDrawer system"
    },
    {
      id: "9", 
      pageName: "Sections",
      route: "/admin/sections",
      hasAdd: "not-working",
      hasEdit: "partial",
      hasDelete: "partial",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Basic implementation with dropdown menus, needs complete UI/UX system implementation"
    },
    {
      id: "10",
      pageName: "Quiz Types",
      route: "/admin/quiz-types",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: false,
      implementation: "complete",
      notes: "✅ UPDATED: Full UI/UX system implemented with color picker, usage validation, and all CRUD operations"
    },
    {
      id: "11",
      pageName: "Question Types",
      route: "/admin/question-types", 
      hasAdd: "not-working",
      hasEdit: "not-working", 
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "12",
      pageName: "Skills",
      route: "/admin/skills",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: false,
      implementation: "complete",
      notes: "✅ UPDATED: Full UI/UX system implemented with skill management, form validation, and all CRUD operations"
    },
    {
      id: "13",
      pageName: "Topics",
      route: "/admin/topics",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: false,
      implementation: "complete",
      notes: "✅ UPDATED: Full UI/UX system implemented with hierarchical topic management, form validation, and all CRUD operations"
    },
    {
      id: "14",
      pageName: "Tags",
      route: "/admin/tags",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: false,
      implementation: "complete",
      notes: "✅ UPDATED: Full UI/UX system implemented with color picker, tag preview, and all CRUD operations"
    },
    {
      id: "15", 
      pageName: "Sub Categories",
      route: "/admin/sub-categories",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "16",
      pageName: "Plans",
      route: "/admin/plans", 
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "17",
      pageName: "User Groups",
      route: "/admin/user-groups",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "18",
      pageName: "Subscriptions",
      route: "/admin/subscriptions",
      hasAdd: "not-working", 
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "19",
      pageName: "Payments",
      route: "/admin/payments",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Read-only implementation - payments are system managed"
    },
    {
      id: "20",
      pageName: "Comprehensions", 
      route: "/admin/comprehensions",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "21",
      pageName: "Lessons",
      route: "/admin/lessons",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Configuration page - needs full implementation for lesson management"
    },
    {
      id: "22",
      pageName: "Videos",
      route: "/admin/videos",
      hasAdd: "not-working",
      hasEdit: "not-working", 
      hasDelete: "not-working",
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Configuration page - needs full implementation for video management"
    },
    {
      id: "23",
      pageName: "Lesson Bank",
      route: "/admin/lesson-bank",
      hasAdd: "not-working",
      hasEdit: "not-working",
      hasDelete: "not-working", 
      hasFiltersPanel: false,
      hasSideDrawer: false,
      hasConfirmDialog: false,
      hasEditorJs: false,
      implementation: "basic",
      notes: "Needs complete implementation - currently just displays data"
    },
    {
      id: "24",
      pageName: "Video Bank",
      route: "/admin/video-bank",
      hasAdd: "working",
      hasEdit: "working",
      hasDelete: "working",
      hasFiltersPanel: true,
      hasSideDrawer: true,
      hasConfirmDialog: true,
      hasEditorJs: false,
      implementation: "complete",
      notes: "✅ UPDATED: Full UI/UX system implemented with video upload, form validation, and all CRUD operations"
    }
  ];

  const getStatusIcon = (status: "working" | "partial" | "not-working") => {
    switch (status) {
      case "working":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "not-working":
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getImplementationColor = (implementation: string) => {
    switch (implementation) {
      case "complete":
        return "bg-success text-success-foreground";
      case "partial": 
        return "bg-warning text-warning-foreground";
      case "basic":
        return "bg-secondary text-secondary-foreground";
      case "old-system":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stats = {
    total: listPages.length,
    complete: listPages.filter(p => p.implementation === "complete").length,
    partial: listPages.filter(p => p.implementation === "partial").length,
    basic: listPages.filter(p => p.implementation === "basic").length,
    oldSystem: listPages.filter(p => p.implementation === "old-system").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Admin List Pages Status
          </h1>
          <p className="text-muted-foreground mt-2">
            Current implementation status of all admin list pages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Admin list pages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complete}</div>
            <p className="text-xs text-success">{((stats.complete / stats.total) * 100).toFixed(0)}% completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partial}</div>
            <p className="text-xs text-warning">Need updates</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Basic</CardTitle>
            <XCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.basic}</div>
            <p className="text-xs text-muted-foreground">Need implementation</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Old System</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.oldSystem}</div>
            <p className="text-xs text-destructive">Need conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Table */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Implementation Status Details</CardTitle>
          <CardDescription>
            Detailed breakdown of each admin list page functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Name</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>UI Components</TableHead>
                  <TableHead>Implementation</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listPages.map((page) => (
                  <TableRow key={page.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{page.pageName}</div>
                        <div className="text-sm text-muted-foreground">
                          {page.route}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Plus className="h-3 w-3" />
                          {getStatusIcon(page.hasAdd)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Edit className="h-3 w-3" />
                          {getStatusIcon(page.hasEdit)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trash2 className="h-3 w-3" />
                          {getStatusIcon(page.hasDelete)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {page.hasFiltersPanel && (
                          <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                            <Filter className="mr-1 h-3 w-3" />
                            Filters
                          </Badge>
                        )}
                        {page.hasSideDrawer && (
                          <Badge variant="outline" className="bg-success/10 text-success text-xs">
                            Drawer
                          </Badge>
                        )}
                        {page.hasConfirmDialog && (
                          <Badge variant="outline" className="bg-warning/10 text-warning text-xs">
                            Confirm
                          </Badge>
                        )}
                        {page.hasEditorJs && (
                          <Badge variant="outline" className="bg-accent/10 text-accent text-xs">
                            EditorJS
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={getImplementationColor(page.implementation)}
                      >
                        {page.implementation.replace("-", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs text-sm text-muted-foreground">
                        {page.notes}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={page.route} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Action Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm">Working - Fully functional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Partial - Needs improvement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Not Working - Needs implementation</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Implementation Status</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-success text-success-foreground">COMPLETE</Badge>
                  <span className="text-sm">New UI/UX system fully implemented</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">PARTIAL</Badge>
                  <span className="text-sm">Some new components, needs updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">BASIC</Badge>
                  <span className="text-sm">Basic functionality, needs full system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-destructive text-destructive-foreground">OLD SYSTEM</Badge>
                  <span className="text-sm">Uses old patterns, needs conversion</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}