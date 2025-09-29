import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3, 
  Globe,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: 'internal' | 'external' | 'category';
  parent: string | null;
  order: number;
  icon: string;
  visible: boolean;
  status: string;
  target: string;
  created?: string;
  children?: MenuItem[];
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Home,
    BookOpen,
    Users,
    Settings,
    BarChart3,
    Globe,
    Menu
  };
  return icons[iconName] || Home;
};

// Mock menu data from CMS
const menuItems: MenuItem[] = [
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
    created: "Sep 15, 2025"
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
    children: [
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
        created: "Sep 16, 2025"
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
        created: "Sep 16, 2025"
      }
    ]
  },
  {
    id: "menu_005",
    title: "Pricing",
    url: "/pricing", 
    type: "internal",
    parent: null,
    order: 3,
    icon: "BarChart3",
    visible: true,
    status: "Active",
    target: "_self",
    created: "Sep 17, 2025"
  },
  {
    id: "menu_006",
    title: "About",
    url: "/about",
    type: "internal",
    parent: null,
    order: 4,
    icon: "Users",
    visible: true,
    status: "Active",
    target: "_self",
    created: "Sep 17, 2025"
  },
  {
    id: "menu_007",
    title: "Contact",
    url: "/contact",
    type: "internal",
    parent: null,
    order: 5,
    icon: "Settings",
    visible: true,
    status: "Active",
    target: "_self",
    created: "Sep 18, 2025"
  }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Filter visible and active menu items
  const visibleMenuItems = menuItems.filter(item => item.visible && item.status === "Active");
  
  // Build hierarchical menu structure
  const buildMenuHierarchy = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // First pass: create a map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build hierarchy
    items.forEach(item => {
      if (item.parent) {
        const parent = itemMap.get(item.parent);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(itemMap.get(item.id)!);
        }
      } else {
        rootItems.push(itemMap.get(item.id)!);
      }
    });

    return rootItems.sort((a, b) => a.order - b.order);
  };

  const menuHierarchy = buildMenuHierarchy(visibleMenuItems);

  const isActive = (url: string) => location.pathname === url;

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    const IconComponent = getIcon(item.icon);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren && !isMobile) {
      return (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuTrigger className="flex items-center">
            <IconComponent className="mr-2 h-4 w-4" />
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4">
              {item.children?.map((child) => (
                <li key={child.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={child.url}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(child.url) ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <div className="flex items-center text-sm font-medium leading-none">
                        {React.createElement(getIcon(child.icon), { className: "mr-2 h-4 w-4" })}
                        {child.title}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.id}>
        <NavigationMenuLink asChild>
          <Link
            to={item.url}
            target={item.target}
            className={cn(
              "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
              isActive(item.url) ? "bg-accent text-accent-foreground" : "",
              isMobile ? "w-full justify-start" : ""
            )}
          >
            <IconComponent className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const IconComponent = getIcon(item.icon);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-2">
        <Link
          to={item.url}
          target={item.target}
          className={cn(
            "flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            isActive(item.url) ? "bg-accent text-accent-foreground" : ""
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <IconComponent className="mr-3 h-5 w-5" />
          {item.title}
        </Link>
        {hasChildren && (
          <div className="pl-6 space-y-1">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                to={child.url}
                target={child.target}
                className={cn(
                  "flex items-center py-2 px-4 rounded-lg text-sm transition-colors hover:bg-accent/50 hover:text-accent-foreground",
                  isActive(child.url) ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {React.createElement(getIcon(child.icon), { className: "mr-3 h-4 w-4" })}
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            QwikTest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {menuHierarchy.map((item) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/student/dashboard">Student Portal</Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:bg-primary-hover">
            <Link to="/admin">Admin Dashboard</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <div className="bg-gradient-primary p-2 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  QwikTest
                </SheetTitle>
                <SheetDescription>
                  Navigate through our educational platform
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {menuHierarchy.map((item) => renderMobileMenuItem(item))}
                <div className="border-t pt-4 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/student/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Users className="mr-3 h-5 w-5" />
                      Student Portal
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-primary">
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}