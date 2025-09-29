import { useState } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Trophy, 
  FileText, 
  BarChart3,
  Calendar,
  Settings,
  ArrowLeft
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const studentMenuItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Progress",
    url: "/student/progress",
    icon: BarChart3,
  },
  {
    title: "Analytics",
    url: "/student/analytics/performance-overview",
    icon: BarChart3,
  },
  {
    title: "Learn & Practice",
    url: "/student/practice",
    icon: Target,
  },
  {
    title: "Exams",
    url: "/student/exams",
    icon: FileText,
  },
  {
    title: "Quizzes",
    url: "/student/quizzes",
    icon: BookOpen,
  },
];

export function StudentSidebar() {
  const navigate = useNavigate();

  const handleBackToAdmin = () => {
    navigate('/');
  };

  return (
    <Sidebar className="w-60" collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-sidebar-foreground">11+ Prep</h2>
              <p className="text-xs text-sidebar-accent-foreground">Student Portal</p>
            </div>
          </div>
          
          {/* Current Syllabus */}
          <div className="mt-4 p-3 bg-sidebar-accent rounded-lg">
            <p className="text-xs text-sidebar-accent-foreground mb-1">Mathematics / Numerical Reasoning</p>
            <button className="text-xs text-primary hover:underline">Change Syllabus</button>
          </div>
        </div>

        {/* Back to Admin */}
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToAdmin}
            className="w-full justify-start gap-2 text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Button>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-accent-foreground">
            Student Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}