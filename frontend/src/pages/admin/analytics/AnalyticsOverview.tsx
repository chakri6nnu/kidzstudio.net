import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  TrendingUp,
  TrendingDown, 
  Users,
  Target,
  Clock,
  Award,
  BookOpen,
  BarChart3,
  PieChart,
  CalendarIcon,
  Filter
} from "lucide-react";

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  totalAttempts: number;
  averagePassRate: number;
  topPerformingCategories: Array<{
    name: string;
    passRate: number;
    attempts: number;
    trend: "up" | "down" | "stable";
  }>;
  weakAreas: Array<{
    name: string;
    passRate: number;
    attempts: number;
    improvement: number;
  }>;
  dailyStats: Array<{
    date: string;
    attempts: number;
    passes: number;
    passRate: number;
  }>;
  weeklyStats: Array<{
    week: string;
    attempts: number;
    passes: number;
    passRate: number;
  }>;
}

const mockAnalyticsData: AnalyticsData = {
  totalStudents: 1247,
  activeStudents: 892,
  totalAttempts: 15634,
  averagePassRate: 68.5,
  topPerformingCategories: [
    { name: "Basic Arithmetic", passRate: 85.2, attempts: 2341, trend: "up" },
    { name: "Algebra Fundamentals", passRate: 78.9, attempts: 1876, trend: "up" },
    { name: "Geometry", passRate: 72.4, attempts: 1654, trend: "stable" },
    { name: "Number Theory", passRate: 69.1, attempts: 1234, trend: "down" }
  ],
  weakAreas: [
    { name: "Advanced Calculus", passRate: 42.3, attempts: 567, improvement: -2.1 },
    { name: "Complex Numbers", passRate: 48.7, attempts: 678, improvement: 1.2 },
    { name: "Trigonometry", passRate: 51.9, attempts: 789, improvement: -0.8 },
    { name: "Statistics", passRate: 55.2, attempts: 654, improvement: 2.3 }
  ],
  dailyStats: [
    { date: "2024-01-15", attempts: 145, passes: 98, passRate: 67.6 },
    { date: "2024-01-16", attempts: 167, passes: 121, passRate: 72.5 },
    { date: "2024-01-17", attempts: 134, passes: 89, passRate: 66.4 },
    { date: "2024-01-18", attempts: 156, passes: 112, passRate: 71.8 },
    { date: "2024-01-19", attempts: 178, passes: 126, passRate: 70.8 },
    { date: "2024-01-20", attempts: 145, passes: 102, passRate: 70.3 },
    { date: "2024-01-21", attempts: 123, passes: 85, passRate: 69.1 }
  ],
  weeklyStats: [
    { week: "Week 1", attempts: 1234, passes: 856, passRate: 69.4 },
    { week: "Week 2", attempts: 1456, passes: 1012, passRate: 69.5 },
    { week: "Week 3", attempts: 1345, passes: 942, passRate: 70.0 },
    { week: "Week 4", attempts: 1567, passes: 1098, passRate: 70.1 }
  ]
};

export default function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into student performance and learning analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Pickers */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-32 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-32 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAnalyticsData.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+12% this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAnalyticsData.averagePassRate}%</p>
                <p className="text-sm text-muted-foreground">Average Pass Rate</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+3.2% vs last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAnalyticsData.totalAttempts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+8.7% this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAnalyticsData.activeStudents}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive">-2.1% this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Categories */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.topPerformingCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-success">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.attempts} attempts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-success">{category.passRate}%</span>
                      {category.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                      {category.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                      {category.trend === "stable" && <div className="w-4 h-4 bg-muted rounded-full" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas Needing Improvement */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Areas Needing Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalyticsData.weakAreas.map((area, index) => (
                <div key={index} className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{area.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-destructive">{area.passRate}%</span>
                      <Badge variant="outline" className={area.improvement > 0 ? "text-success" : "text-destructive"}>
                        {area.improvement > 0 ? "+" : ""}{area.improvement}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{area.attempts} attempts</span>
                    <span>Needs immediate attention</span>
                  </div>
                  <Progress value={area.passRate} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analytics */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="grid grid-cols-1">
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Daily Performance Chart</p>
                    <p className="text-sm text-muted-foreground">Last 7 days attempts and pass rates</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {mockAnalyticsData.dailyStats.map((day, index) => (
                  <div key={index} className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                    <p className="text-sm font-bold">{day.attempts}</p>
                    <p className="text-xs text-success">{day.passRate.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1">
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Weekly Performance Chart</p>
                    <p className="text-sm text-muted-foreground">Last 4 weeks comparison</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {mockAnalyticsData.weeklyStats.map((week, index) => (
                  <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{week.week}</p>
                    <p className="text-xl font-bold">{week.attempts}</p>
                    <p className="text-sm text-success">{week.passRate.toFixed(1)}% pass rate</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}