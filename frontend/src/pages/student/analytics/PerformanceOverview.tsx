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
  Filter,
  Download
} from "lucide-react";

interface StudentAnalyticsData {
  totalExamsTaken: number;
  passedExams: number;
  failedExams: number;
  averageScore: number;
  totalQuizzesTaken: number;
  practiceSessionsCompleted: number;
  timeSpentLearning: number; // in hours
  currentStreak: number;
  topPerformingSubjects: Array<{
    name: string;
    score: number;
    attempts: number;
    trend: "up" | "down" | "stable";
  }>;
  weakAreas: Array<{
    name: string;
    score: number;
    attempts: number;
    improvement: number;
  }>;
  dailyStats: Array<{
    date: string;
    attempts: number;
    passes: number;
    passRate: number;
    timeSpent: number;
  }>;
  weeklyProgress: Array<{
    week: string;
    examsAttempted: number;
    quizzesCompleted: number;
    practiceHours: number;
    averageScore: number;
  }>;
}

const mockStudentData: StudentAnalyticsData = {
  totalExamsTaken: 45,
  passedExams: 32,
  failedExams: 13,
  averageScore: 78.5,
  totalQuizzesTaken: 87,
  practiceSessionsCompleted: 156,
  timeSpentLearning: 124.5,
  currentStreak: 12,
  topPerformingSubjects: [
    { name: "Basic Arithmetic", score: 92.3, attempts: 15, trend: "up" },
    { name: "Algebra", score: 87.6, attempts: 12, trend: "up" },
    { name: "Geometry", score: 81.4, attempts: 10, trend: "stable" },
    { name: "Statistics", score: 76.2, attempts: 8, trend: "down" }
  ],
  weakAreas: [
    { name: "Advanced Calculus", score: 45.7, attempts: 8, improvement: -2.1 },
    { name: "Complex Numbers", score: 52.3, attempts: 6, improvement: 1.5 },
    { name: "Trigonometry", score: 58.9, attempts: 9, improvement: -0.8 },
    { name: "Number Theory", score: 61.2, attempts: 5, improvement: 2.3 }
  ],
  dailyStats: [
    { date: "2024-01-15", attempts: 3, passes: 2, passRate: 66.7, timeSpent: 2.5 },
    { date: "2024-01-16", attempts: 4, passes: 3, passRate: 75.0, timeSpent: 3.2 },
    { date: "2024-01-17", attempts: 2, passes: 1, passRate: 50.0, timeSpent: 1.8 },
    { date: "2024-01-18", attempts: 5, passes: 4, passRate: 80.0, timeSpent: 4.1 },
    { date: "2024-01-19", attempts: 3, passes: 3, passRate: 100.0, timeSpent: 2.7 },
    { date: "2024-01-20", attempts: 4, passes: 3, passRate: 75.0, timeSpent: 3.5 },
    { date: "2024-01-21", attempts: 2, passes: 2, passRate: 100.0, timeSpent: 2.1 }
  ],
  weeklyProgress: [
    { week: "Week 1", examsAttempted: 12, quizzesCompleted: 18, practiceHours: 15.5, averageScore: 72.3 },
    { week: "Week 2", examsAttempted: 14, quizzesCompleted: 22, practiceHours: 18.2, averageScore: 75.1 },
    { week: "Week 3", examsAttempted: 10, quizzesCompleted: 25, practiceHours: 16.8, averageScore: 78.9 },
    { week: "Week 4", examsAttempted: 9, quizzesCompleted: 22, practiceHours: 19.3, averageScore: 81.2 }
  ]
};

export default function PerformanceOverview() {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Performance Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your learning progress and identify areas for improvement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
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

          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudentData.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+3.2% this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudentData.passedExams}</p>
                <p className="text-sm text-muted-foreground">Exams Passed</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+5 this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudentData.timeSpentLearning}h</p>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+12.5h this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudentData.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">Keep it up!</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Subjects */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              My Strongest Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudentData.topPerformingSubjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-success">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.attempts} attempts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-success">{subject.score}%</span>
                      {subject.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                      {subject.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                      {subject.trend === "stable" && <div className="w-4 h-4 bg-muted rounded-full" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudentData.weakAreas.map((area, index) => (
                <div key={index} className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{area.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-destructive">{area.score}%</span>
                      <Badge variant="outline" className={area.improvement > 0 ? "text-success" : "text-destructive"}>
                        {area.improvement > 0 ? "+" : ""}{area.improvement}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{area.attempts} attempts</span>
                    <span>Focus needed</span>
                  </div>
                  <Progress value={area.score} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Performance Trends */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            My Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily Activity</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="grid grid-cols-1">
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Daily Activity Chart</p>
                    <p className="text-sm text-muted-foreground">Last 7 days performance and study time</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {mockStudentData.dailyStats.map((day, index) => (
                  <div key={index} className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                    <p className="text-sm font-bold">{day.attempts}</p>
                    <p className="text-xs text-success">{day.passRate.toFixed(1)}%</p>
                    <p className="text-xs text-orange-500">{day.timeSpent}h</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1">
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Weekly Progress Chart</p>
                    <p className="text-sm text-muted-foreground">Last 4 weeks comparison</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {mockStudentData.weeklyProgress.map((week, index) => (
                  <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{week.week}</p>
                    <p className="text-xl font-bold">{week.examsAttempted}</p>
                    <p className="text-sm text-success">{week.averageScore.toFixed(1)}% avg</p>
                    <p className="text-xs text-orange-500">{week.practiceHours}h practice</p>
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