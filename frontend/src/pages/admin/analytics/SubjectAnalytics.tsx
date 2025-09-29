import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Clock,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

interface SubjectData {
  name: string;
  category: string;
  subCategory: string;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  timeSpent: number; // in minutes
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  sections: Array<{
    name: string;
    score: number;
    attempts: number;
  }>;
  skills: Array<{
    name: string;
    proficiency: number;
    students: number;
  }>;
  topics: Array<{
    name: string;
    passRate: number;
    attempts: number;
    trend: "up" | "down" | "stable";
  }>;
  weeklyTrend: Array<{
    week: string;
    attempts: number;
    passRate: number;
  }>;
}

const mockSubjectData: SubjectData[] = [
  {
    name: "Basic Arithmetic",
    category: "Mathematics",
    subCategory: "Numerical Reasoning",
    totalQuestions: 450,
    totalAttempts: 2341,
    averageScore: 78.5,
    passRate: 85.2,
    timeSpent: 1250,
    difficulty: "Easy",
    tags: ["Addition", "Subtraction", "Multiplication", "Division"],
    sections: [
      { name: "Addition & Subtraction", score: 82.1, attempts: 856 },
      { name: "Multiplication & Division", score: 75.3, attempts: 743 },
      { name: "Mixed Operations", score: 79.8, attempts: 742 }
    ],
    skills: [
      { name: "Mental Math", proficiency: 78, students: 234 },
      { name: "Problem Solving", proficiency: 72, students: 189 },
      { name: "Speed Calculation", proficiency: 69, students: 156 }
    ],
    topics: [
      { name: "Single-digit Operations", passRate: 89.2, attempts: 567, trend: "up" },
      { name: "Multi-digit Operations", passRate: 76.8, attempts: 432, trend: "stable" },
      { name: "Word Problems", passRate: 68.4, attempts: 298, trend: "down" }
    ],
    weeklyTrend: [
      { week: "Week 1", attempts: 567, passRate: 84.2 },
      { week: "Week 2", attempts: 623, passRate: 85.1 },
      { week: "Week 3", attempts: 589, passRate: 85.8 },
      { week: "Week 4", attempts: 562, passRate: 85.2 }
    ]
  },
  {
    name: "Algebra Fundamentals",
    category: "Mathematics", 
    subCategory: "Algebraic Reasoning",
    totalQuestions: 380,
    totalAttempts: 1876,
    averageScore: 68.9,
    passRate: 72.4,
    timeSpent: 1890,
    difficulty: "Medium",
    tags: ["Variables", "Equations", "Expressions", "Inequalities"],
    sections: [
      { name: "Linear Equations", score: 74.2, attempts: 645 },
      { name: "Quadratic Equations", score: 61.8, attempts: 523 },
      { name: "Algebraic Expressions", score: 71.5, attempts: 708 }
    ],
    skills: [
      { name: "Equation Solving", proficiency: 71, students: 201 },
      { name: "Factoring", proficiency: 58, students: 167 },
      { name: "Graphing", proficiency: 64, students: 143 }
    ],
    topics: [
      { name: "Basic Variables", passRate: 81.3, attempts: 445, trend: "up" },
      { name: "Linear Systems", passRate: 67.9, attempts: 378, trend: "stable" },
      { name: "Quadratic Formula", passRate: 52.1, attempts: 234, trend: "down" }
    ],
    weeklyTrend: [
      { week: "Week 1", attempts: 456, passRate: 71.2 },
      { week: "Week 2", attempts: 478, passRate: 72.8 },
      { week: "Week 3", attempts: 465, passRate: 72.1 },
      { week: "Week 4", attempts: 477, passRate: 72.4 }
    ]
  },
  {
    name: "Geometry",
    category: "Mathematics",
    subCategory: "Spatial Reasoning", 
    totalQuestions: 320,
    totalAttempts: 1654,
    averageScore: 65.2,
    passRate: 69.1,
    timeSpent: 2100,
    difficulty: "Medium",
    tags: ["Shapes", "Angles", "Area", "Volume", "Proofs"],
    sections: [
      { name: "Basic Shapes", score: 73.8, attempts: 567 },
      { name: "Angle Calculations", score: 58.9, attempts: 498 },
      { name: "Area & Perimeter", score: 62.7, attempts: 589 }
    ],
    skills: [
      { name: "Spatial Visualization", proficiency: 62, students: 178 },
      { name: "Measurement", proficiency: 70, students: 156 },
      { name: "Logical Reasoning", proficiency: 55, students: 134 }
    ],
    topics: [
      { name: "Triangle Properties", passRate: 76.4, attempts: 389, trend: "up" },
      { name: "Circle Geometry", passRate: 64.2, attempts: 267, trend: "stable" },
      { name: "3D Shapes", passRate: 48.7, attempts: 198, trend: "down" }
    ],
    weeklyTrend: [
      { week: "Week 1", attempts: 398, passRate: 68.4 },
      { week: "Week 2", attempts: 423, passRate: 69.2 },
      { week: "Week 3", attempts: 416, passRate: 69.8 },
      { week: "Week 4", attempts: 417, passRate: 69.1 }
    ]
  }
];

export default function SubjectAnalytics() {
  const [selectedSubject, setSelectedSubject] = useState(mockSubjectData[0].name);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const currentSubject = mockSubjectData.find(s => s.name === selectedSubject) || mockSubjectData[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject-wise Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into performance across categories, sections, skills and topics
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
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjectData.map((subject) => (
                <SelectItem key={subject.name} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subject Overview */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {currentSubject.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{currentSubject.category}</Badge>
                <Badge variant="outline">{currentSubject.subCategory}</Badge>
                <Badge className={
                  currentSubject.difficulty === "Easy" ? "bg-success" :
                  currentSubject.difficulty === "Medium" ? "bg-warning" : "bg-destructive"
                }>
                  {currentSubject.difficulty}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{currentSubject.passRate}%</p>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{currentSubject.totalAttempts.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Attempts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{currentSubject.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{Math.round(currentSubject.timeSpent / 60)}h</p>
              <p className="text-sm text-muted-foreground">Time Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{currentSubject.totalQuestions}</p>
              <p className="text-sm text-muted-foreground">Total Questions</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {currentSubject.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Sections Analysis */}
        <TabsContent value="sections" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Section-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSubject.sections.map((section, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{section.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{section.score}%</span>
                        <Badge variant="outline">{section.attempts} attempts</Badge>
                      </div>
                    </div>
                    <Progress value={section.score} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {section.score >= 80 ? "Excellent performance" : 
                       section.score >= 70 ? "Good performance" : 
                       section.score >= 60 ? "Needs improvement" : "Requires attention"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Analysis */}
        <TabsContent value="skills" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Skills Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSubject.skills.map((skill, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{skill.name}</h4>
                        <p className="text-sm text-muted-foreground">{skill.students} students assessed</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{skill.proficiency}%</span>
                        <p className="text-xs text-muted-foreground">Proficiency</p>
                      </div>
                    </div>
                    <Progress value={skill.proficiency} className="h-2" />
                    <div className="flex items-center gap-2 mt-2">
                      {skill.proficiency >= 75 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : skill.proficiency >= 60 ? (
                        <Target className="h-4 w-4 text-warning" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {skill.proficiency >= 75 ? "Strong skill" : 
                         skill.proficiency >= 60 ? "Developing skill" : "Needs focus"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Topics Analysis */}
        <TabsContent value="topics" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Topic-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSubject.topics.map((topic, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium text-foreground">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground">{topic.attempts} attempts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{topic.passRate}%</span>
                        {topic.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                        {topic.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                        {topic.trend === "stable" && <div className="w-4 h-4 bg-muted rounded-full" />}
                      </div>
                    </div>
                    <Progress value={topic.passRate} className="h-2" />
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>
                        {topic.trend === "up" ? "Improving" : 
                         topic.trend === "down" ? "Declining" : "Stable"}
                      </span>
                      <span>
                        {topic.passRate >= 80 ? "Excellent" : 
                         topic.passRate >= 70 ? "Good" : 
                         topic.passRate >= 60 ? "Fair" : "Poor"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Analysis */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Attempts Trend</h4>
                  <div className="space-y-3">
                    {currentSubject.weeklyTrend.map((week, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <span className="text-sm font-medium">{week.week}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(week.attempts / Math.max(...currentSubject.weeklyTrend.map(w => w.attempts))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{week.attempts}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-4">Pass Rate Trend</h4>
                  <div className="space-y-3">
                    {currentSubject.weeklyTrend.map((week, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <span className="text-sm font-medium">{week.week}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="h-full bg-success rounded-full"
                              style={{ width: `${week.passRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{week.passRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Trend Analysis Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Average Weekly Attempts:</span>
                    <span className="ml-2 font-bold">
                      {Math.round(currentSubject.weeklyTrend.reduce((acc, w) => acc + w.attempts, 0) / currentSubject.weeklyTrend.length)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average Pass Rate:</span>
                    <span className="ml-2 font-bold">
                      {(currentSubject.weeklyTrend.reduce((acc, w) => acc + w.passRate, 0) / currentSubject.weeklyTrend.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}