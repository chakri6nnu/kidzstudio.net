import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FolderOpen,
  Monitor,
  Lightbulb,
  HelpCircle,
  FileText,
  Play,
  DollarSign,
  Users,
  Archive,
  BookOpen,
  Settings,
  ChevronRight,
  BarChart3,
  FileSpreadsheet,
  Upload,
  Package,
  CreditCard,
  UserCheck,
  Folder,
  Tag,
  List,
  Zap,
  Globe,
  Mail,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationItems = [
  { title: "Home Dashboard", url: "/admin", icon: Home },
  { title: "File Manager", url: "/admin/file-manager", icon: FolderOpen },
];

const engageItems = [
  {
    title: "Manage Tests",
    icon: Monitor,
    items: [
      { title: "Quizzes", url: "/admin/quizzes" },
      { title: "Exams", url: "/admin/exams" },
      { title: "Quiz Types", url: "/admin/quiz-types" },
      { title: "Exam Types", url: "/admin/exam-types" },
    ],
  },
  {
    title: "Manage Learning",
    icon: Lightbulb,
    items: [
      { title: "Practice Sets", url: "/admin/practice-sets" },
      { title: "Lessons", url: "/admin/lessons" },
      { title: "Videos", url: "/admin/videos" },
    ],
  },
];

const libraryItems = [
  {
    title: "Question Bank",
    icon: HelpCircle,
    items: [
      { title: "Questions", url: "/admin/questions" },
      { title: "Import Questions", url: "/admin/import-questions" },
      { title: "Comprehensions", url: "/admin/comprehensions" },
      { title: "Question Types", url: "/admin/question-types" },
    ],
  },
  { title: "Lesson Bank", url: "/admin/lesson-bank", icon: FileText },
  { title: "Video Bank", url: "/admin/video-bank", icon: Play },
];

const configurationItems = [
  {
    title: "CMS",
    icon: FileText,
    items: [
      { title: "Pages", url: "/admin/pages" },
      { title: "Menu Builder", url: "/admin/menu-builder" },
    ],
  },
  {
    title: "Monetization",
    icon: DollarSign,
    items: [
      { title: "Plans", url: "/admin/plans" },
      { title: "Subscriptions", url: "/admin/subscriptions" },
      { title: "Payments", url: "/admin/payments" },
    ],
  },
  {
    title: "Manage Users",
    icon: Users,
    items: [
      { title: "Users", url: "/admin/users" },
      { title: "User Groups", url: "/admin/user-groups" },
      { title: "Import Users", url: "/admin/import-users" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Overview", url: "/admin/analytics/overview" },
      {
        title: "Student Performance",
        url: "/admin/analytics/student-performance",
      },
      { title: "Subject Analytics", url: "/admin/analytics/subject-analytics" },
      { title: "Reports", url: "/admin/reports" },
    ],
  },
  {
    title: "Manage Categories",
    icon: Archive,
    items: [
      { title: "Categories", url: "/admin/categories" },
      { title: "Sub Categories", url: "/admin/sub-categories" },
      { title: "Tags", url: "/admin/tags" },
    ],
  },
  {
    title: "Manage Subjects",
    icon: BookOpen,
    items: [
      { title: "Sections", url: "/admin/sections" },
      { title: "Skills", url: "/admin/skills" },
      { title: "Topics", url: "/admin/topics" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "General Settings", url: "/admin/general-settings" },
      { title: "Sections", url: "/admin/sections" },
      { title: "Skills", url: "/admin/skills" },
      { title: "Localization Settings", url: "/admin/localization-settings" },
      { title: "Home Page Settings", url: "/admin/home-settings" },
      { title: "Email Settings", url: "/admin/email-settings" },
      { title: "Payment Settings", url: "/admin/payment-settings" },
      { title: "Billing & Tax Settings", url: "/admin/billing-tax-settings" },
      { title: "Theme Settings", url: "/admin/theme-settings" },
      { title: "Maintenance Settings", url: "/admin/maintenance-settings" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary"
      : "hover:bg-sidebar-accent/50";

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => {
      const isCurrentlyOpen = prev[groupTitle];
      // Close all groups first
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);

      // If the clicked group was closed, open it; if it was open, keep it closed
      return {
        ...allClosed,
        [groupTitle]: !isCurrentlyOpen,
      };
    });
  };

  const GroupItem = ({
    item,
    groupTitle,
  }: {
    item: any;
    groupTitle: string;
  }) => {
    const isExpanded = expandedGroups[groupTitle];
    const hasActiveChild = item.items?.some((child: any) =>
      isActive(child.url)
    );

    return (
      <SidebarMenuItem>
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleGroup(groupTitle)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={`w-full justify-between ${
                hasActiveChild
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {!collapsed && <span>{item.title}</span>}
              </div>
              {!collapsed && (
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent>
              <div className="ml-6 mt-2 space-y-1">
                {item.items?.map((subItem: any) => (
                  <SidebarMenuButton key={subItem.title} asChild>
                    <NavLink to={subItem.url} className={getNavCls}>
                      <span className="text-sm">{subItem.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                ))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <div className="bg-gradient-primary rounded-lg p-2">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-sidebar-primary">
                  QwikTest
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Exam Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Engage Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-accent uppercase text-xs font-semibold">
              Engage
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {engageItems.map((item) => (
                <GroupItem
                  key={item.title}
                  item={item}
                  groupTitle={item.title}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-accent uppercase text-xs font-semibold">
              Library
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) =>
                item.items ? (
                  <GroupItem
                    key={item.title}
                    item={item}
                    groupTitle={item.title}
                  />
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-accent uppercase text-xs font-semibold">
              Configuration
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <GroupItem
                  key={item.title}
                  item={item}
                  groupTitle={item.title}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
