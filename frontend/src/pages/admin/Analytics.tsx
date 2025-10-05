import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  BookOpen,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface AnalyticsData {
  overview: {
    totalAssessments: number;
    activeUsers: number;
    averageScore: number;
    completionRate: number;
    assessmentsChange: number;
    usersChange: number;
    scoreChange: number;
    completionChange: number;
  };
  performance: {
    subject: string;
    avgScore: number;
    participants: number;
    improvement: string;
  }[];
  recentActivity: {
    user: string;
    action: string;
    score: string;
    time: string;
  }[];
  engagement: {
    avgSessionTime: number;
    sessionsPerWeek: number;
    returnRate: number;
  };
  content: {
    type: string;
    active: number;
    change: number;
    changeType: "positive" | "negative";
  }[];
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.dashboard.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics data"
      );
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      // This would integrate with your export functionality
      toast.success("Report exported successfully");
    } catch (err) {
      toast.error("Failed to export report");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchAnalyticsData}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and performance analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            className="bg-gradient-primary hover:bg-primary-hover"
            onClick={handleExportReport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assessments
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.totalAssessments.toLocaleString()}
            </div>
            <p
              className={`text-xs flex items-center ${
                analyticsData.overview.assessmentsChange >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.overview.assessmentsChange >= 0 ? "+" : ""}
              {analyticsData.overview.assessmentsChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.activeUsers.toLocaleString()}
            </div>
            <p
              className={`text-xs flex items-center ${
                analyticsData.overview.usersChange >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.overview.usersChange >= 0 ? "+" : ""}
              {analyticsData.overview.usersChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.averageScore.toFixed(1)}%
            </div>
            <p
              className={`text-xs flex items-center ${
                analyticsData.overview.scoreChange >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.overview.scoreChange >= 0 ? "+" : ""}
              {analyticsData.overview.scoreChange}% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.completionRate.toFixed(1)}%
            </div>
            <p
              className={`text-xs flex items-center ${
                analyticsData.overview.completionChange >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.overview.completionChange >= 0 ? "+" : ""}
              {analyticsData.overview.completionChange}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Average scores over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <LineChart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Performance chart visualization
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Connect to Supabase for real-time data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-accent" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest user activities and completions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.user}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.action}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score !== "-" && (
                          <Badge variant="outline" className="mb-1">
                            {activity.score}
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-success" />
                Subject Performance Analysis
              </CardTitle>
              <CardDescription>
                Performance breakdown by subject area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{subject.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {subject.participants} participants
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {subject.avgScore}%
                      </div>
                      <Badge variant="outline" className="text-success">
                        {subject.improvement}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                  Distribution of student scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <PieChart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Score distribution chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Time-based Performance</CardTitle>
                <CardDescription>Performance over time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Time-based performance chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Detailed engagement analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Clock className="mx-auto h-8 w-8 text-primary mb-2" />
                  <div className="text-2xl font-bold">
                    {analyticsData.engagement.avgSessionTime} min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Session Time
                  </div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Calendar className="mx-auto h-8 w-8 text-success mb-2" />
                  <div className="text-2xl font-bold">
                    {analyticsData.engagement.sessionsPerWeek}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sessions per Week
                  </div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Target className="mx-auto h-8 w-8 text-accent mb-2" />
                  <div className="text-2xl font-bold">
                    {analyticsData.engagement.returnRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Return Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Performance of different content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.content.map((content, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3">
                      {content.type === "Quizzes" && (
                        <Target className="h-5 w-5 text-primary" />
                      )}
                      {content.type === "Practice Sets" && (
                        <BookOpen className="h-5 w-5 text-success" />
                      )}
                      {content.type === "Exams" && (
                        <Award className="h-5 w-5 text-accent" />
                      )}
                      <span>{content.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {content.active} active
                      </div>
                      <div
                        className={`text-sm ${
                          content.changeType === "positive"
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {content.change >= 0 ? "+" : ""}
                        {content.change}%{" "}
                        {content.type === "Exams" ? "completion" : "engagement"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Generate Custom Reports</CardTitle>
                <CardDescription>
                  Create detailed reports for specific metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Performance Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>User Activity Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span>Content Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    <span>Assessment Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span>Progress Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Target className="h-6 w-6 mb-2" />
                    <span>Custom Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
