import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

export default function Analytics() {
  const performanceData = [
    { subject: "JavaScript", avgScore: 85, participants: 234, improvement: "+12%" },
    { subject: "React", avgScore: 78, participants: 189, improvement: "+8%" },
    { subject: "CSS", avgScore: 92, participants: 156, improvement: "+15%" },
    { subject: "Database", avgScore: 76, participants: 145, improvement: "+5%" },
    { subject: "Python", avgScore: 88, participants: 123, improvement: "+18%" },
  ];

  const recentActivity = [
    { user: "Alice Johnson", action: "Completed JavaScript Quiz", score: "95%", time: "2 hours ago" },
    { user: "Bob Smith", action: "Started React Practice Set", score: "-", time: "3 hours ago" },
    { user: "Carol Davis", action: "Submitted Database Exam", score: "87%", time: "4 hours ago" },
    { user: "David Wilson", action: "Completed CSS Practice", score: "92%", time: "5 hours ago" },
    { user: "Eva Brown", action: "Started Python Quiz", score: "-", time: "6 hours ago" },
  ];

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
          <Select defaultValue="30days">
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
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.5%</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1.5% from last month
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
                    <p className="text-muted-foreground">Performance chart visualization</p>
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
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{activity.user}</div>
                          <div className="text-sm text-muted-foreground">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score !== "-" && (
                          <Badge variant="outline" className="mb-1">
                            {activity.score}
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
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
                {performanceData.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
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
                      <div className="font-bold text-lg">{subject.avgScore}%</div>
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
                <CardDescription>Distribution of student scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <PieChart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Score distribution chart</p>
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
                    <p className="text-muted-foreground">Time-based performance chart</p>
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
                  <div className="text-2xl font-bold">45 min</div>
                  <div className="text-sm text-muted-foreground">Avg. Session Time</div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Calendar className="mx-auto h-8 w-8 text-success mb-2" />
                  <div className="text-2xl font-bold">3.2</div>
                  <div className="text-sm text-muted-foreground">Sessions per Week</div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Target className="mx-auto h-8 w-8 text-accent mb-2" />
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-muted-foreground">Return Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>Performance of different content types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Quizzes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">156 active</div>
                    <div className="text-sm text-success">+12% completion</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-success" />
                    <span>Practice Sets</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">89 active</div>
                    <div className="text-sm text-success">+8% engagement</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-accent" />
                    <span>Exams</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">34 scheduled</div>
                    <div className="text-sm text-warning">-2% completion</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Generate Custom Reports</CardTitle>
                <CardDescription>Create detailed reports for specific metrics</CardDescription>
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