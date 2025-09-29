import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Target,
  BookOpen,
  Play,
  Award,
  BarChart3,
  User,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Exams",
      value: "87",
      change: "+5%",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Completion Rate",
      value: "92%",
      change: "+8%",
      icon: Trophy,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+15%",
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const recentExams = [
    {
      name: "JavaScript Fundamentals",
      category: "Programming",
      participants: 124,
      status: "Active",
      date: "2024-01-15",
    },
    {
      name: "Mathematics Grade 10",
      category: "Mathematics",
      participants: 89,
      status: "Completed",
      date: "2024-01-14",
    },
    {
      name: "English Literature",
      category: "Language",
      participants: 67,
      status: "Draft",
      date: "2024-01-13",
    },
    {
      name: "Science Quiz Series",
      category: "Science",
      participants: 156,
      status: "Active",
      date: "2024-01-12",
    },
  ];

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Set up a new examination",
      icon: FileText,
      href: "/admin/exams",
      color: "bg-gradient-primary",
    },
    {
      title: "Add Questions",
      description: "Build question bank",
      icon: Target,
      href: "/admin/questions",
      color: "bg-gradient-success",
    },
    {
      title: "Manage Users",
      description: "User administration",
      icon: Users,
      href: "/admin/users",
      color: "bg-primary",
    },
    {
      title: "View Reports",
      description: "Analytics & insights",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-accent",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your exams today.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Exam
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                asChild
              >
                <a href={action.href}>
                  <div className={`p-2 rounded-lg mr-4 ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-accent" />
              Recent Exams
            </CardTitle>
            <CardDescription>
              Latest examination activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExams.map((exam) => (
              <div
                key={exam.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{exam.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exam.category} • {exam.participants} participants
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    exam.status === "Active"
                      ? "default"
                      : exam.status === "Completed"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    exam.status === "Active"
                      ? "bg-success text-success-foreground"
                      : ""
                  }
                >
                  {exam.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-warning" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system activities and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "John Smith", action: "completed", exam: "JavaScript Fundamentals", time: "2 hours ago", score: "95%" },
              { user: "Sarah Johnson", action: "started", exam: "Mathematics Grade 10", time: "4 hours ago", score: null },
              { user: "Mike Wilson", action: "submitted", exam: "English Literature", time: "6 hours ago", score: "87%" },
              { user: "Emma Davis", action: "completed", exam: "Science Quiz Series", time: "8 hours ago", score: "92%" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="bg-accent/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.exam}</span>
                    {activity.score && (
                      <Badge variant="outline" className="ml-2">
                        {activity.score}
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}