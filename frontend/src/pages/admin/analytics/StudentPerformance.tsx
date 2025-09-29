import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Search,
  Filter,
  Download,
  User,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  CalendarIcon
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  totalAttempts: number;
  passedExams: number;
  failedExams: number;
  averageScore: number;
  lastActive: string;
  weakAreas: string[];
  strongAreas: string[];
  improvementTrend: "up" | "down" | "stable";
  riskLevel: "low" | "medium" | "high";
}

const mockStudentData: StudentData[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    totalAttempts: 45,
    passedExams: 32,
    failedExams: 13,
    averageScore: 78.5,
    lastActive: "2024-01-20",
    weakAreas: ["Advanced Calculus", "Complex Numbers"],
    strongAreas: ["Basic Arithmetic", "Algebra"],
    improvementTrend: "up",
    riskLevel: "low"
  },
  {
    id: "2", 
    name: "Bob Smith",
    email: "bob.smith@email.com",
    totalAttempts: 23,
    passedExams: 12,
    failedExams: 11,
    averageScore: 58.2,
    lastActive: "2024-01-18",
    weakAreas: ["Geometry", "Trigonometry", "Statistics"],
    strongAreas: ["Number Theory"],
    improvementTrend: "down",
    riskLevel: "high"
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@email.com", 
    totalAttempts: 67,
    passedExams: 48,
    failedExams: 19,
    averageScore: 82.1,
    lastActive: "2024-01-21",
    weakAreas: ["Statistics"],
    strongAreas: ["Algebra", "Geometry", "Basic Arithmetic"],
    improvementTrend: "up",
    riskLevel: "low"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@email.com",
    totalAttempts: 34,
    passedExams: 20,
    failedExams: 14,
    averageScore: 65.7,
    lastActive: "2024-01-19",
    weakAreas: ["Advanced Calculus", "Trigonometry"],
    strongAreas: ["Basic Arithmetic", "Number Theory"],
    improvementTrend: "stable",
    riskLevel: "medium"
  },
  {
    id: "5",
    name: "Emma Brown",
    email: "emma.brown@email.com",
    totalAttempts: 52,
    passedExams: 41,
    failedExams: 11,
    averageScore: 85.3,
    lastActive: "2024-01-21",
    weakAreas: ["Complex Numbers"],
    strongAreas: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
    improvementTrend: "up",
    riskLevel: "low"
  }
];

export default function StudentPerformance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");
  const [selectedTrend, setSelectedTrend] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredStudents = mockStudentData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskLevel === "all" || student.riskLevel === selectedRiskLevel;
    const matchesTrend = selectedTrend === "all" || student.improvementTrend === selectedTrend;
    
    return matchesSearch && matchesRisk && matchesTrend;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <div className="w-4 h-4 bg-muted rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Performance Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analysis of individual student progress and performance
          </p>
        </div>
        
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudentData.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
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
                <p className="text-2xl font-bold">
                  {(mockStudentData.reduce((acc, s) => acc + s.averageScore, 0) / mockStudentData.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockStudentData.filter(s => s.riskLevel === "high").length}
                </p>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockStudentData.filter(s => s.improvementTrend === "up").length}
                </p>
                <p className="text-sm text-muted-foreground">Improving</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTrend} onValueChange={setSelectedTrend}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trends</SelectItem>
                <SelectItem value="up">Improving</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="down">Declining</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Date Range Pickers */}
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
        </CardContent>
      </Card>

      {/* Student Performance Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Student Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 border border-border rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Student Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge className={getRiskColor(student.riskLevel)}>
                        {student.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {getTrendIcon(student.improvementTrend)}
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="lg:col-span-1">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average Score</span>
                        <span className="text-sm font-bold">{student.averageScore}%</span>
                      </div>
                      <Progress value={student.averageScore} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{student.passedExams} passed</span>
                        <span>{student.failedExams} failed</span>
                      </div>
                    </div>
                  </div>

                  {/* Strong Areas */}
                  <div className="lg:col-span-1">
                    <h5 className="text-sm font-medium text-foreground mb-2">Strong Areas</h5>
                    <div className="flex flex-wrap gap-1">
                      {student.strongAreas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-success/10 text-success">
                          {area}
                        </Badge>
                      ))}
                      {student.strongAreas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.strongAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Weak Areas */}
                  <div className="lg:col-span-1">
                    <h5 className="text-sm font-medium text-foreground mb-2">Needs Improvement</h5>
                    <div className="flex flex-wrap gap-1">
                      {student.weakAreas.slice(0, 2).map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-destructive/10 text-destructive">
                          {area}
                        </Badge>
                      ))}
                      {student.weakAreas.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.weakAreas.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last active: {new Date(student.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No students found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}