import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Calendar,
  BarChart3,
  Users,
  Award
} from "lucide-react";

const subjectProgress = [
  {
    subject: "Mathematics / Numerical Reasoning",
    completed: 0,
    total: 55,
    progress: 0,
    averageScore: 0,
    timeSpent: 0,
    color: "bg-primary",
  },
  {
    subject: "English / Verbal Reasoning", 
    completed: 0,
    total: 42,
    progress: 0,
    averageScore: 0,
    timeSpent: 0,
    color: "bg-success",
  },
  {
    subject: "Non-Verbal Reasoning (NVR)",
    completed: 0, 
    total: 38,
    progress: 0,
    averageScore: 0,
    timeSpent: 0,
    color: "bg-warning",
  },
  {
    subject: "Creative & Essay Writing",
    completed: 0,
    total: 25,
    progress: 0,
    averageScore: 0,
    timeSpent: 0,
    color: "bg-destructive",
  },
];

const achievements = [
  {
    title: "First Steps", 
    description: "Complete your first practice session",
    icon: Target,
    earned: false,
    rarity: "Common",
  },
  {
    title: "Speed Demon",
    description: "Complete 5 speed tests in a row",
    icon: Clock,
    earned: false,
    rarity: "Uncommon",
  },
  {
    title: "Perfect Score",
    description: "Get 100% on any quiz or exam",
    icon: Trophy,
    earned: false,
    rarity: "Rare",
  },
  {
    title: "Streak Master",
    description: "Maintain a 7-day practice streak",
    icon: Award,
    earned: false,
    rarity: "Epic",
  },
];

const weeklyActivity = [
  { day: "Mon", practice: 0, exams: 0 },
  { day: "Tue", practice: 0, exams: 0 },
  { day: "Wed", practice: 0, exams: 0 },
  { day: "Thu", practice: 0, exams: 0 },
  { day: "Fri", practice: 0, exams: 0 },
  { day: "Sat", practice: 0, exams: 0 },
  { day: "Sun", practice: 0, exams: 0 },
];

export default function StudentProgress() {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-muted text-muted-foreground';
      case 'uncommon': return 'bg-success/10 text-success';
      case 'rare': return 'bg-primary/10 text-primary';
      case 'epic': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">0%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Trophy className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">-%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Clock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">0h</p>
                <p className="text-sm text-muted-foreground">Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>Your progress across all 11+ exam subjects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                  <h4 className="font-medium text-foreground">{subject.subject}</h4>
                </div>
                <Badge variant="outline">
                  {subject.completed} / {subject.total} completed
                </Badge>
              </div>
              
              <Progress value={subject.progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>{subject.averageScore}% avg score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{subject.timeSpent}h studied</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{subject.progress}% complete</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your practice and exam activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-muted-foreground font-medium">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-2 bg-primary/20 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(day.practice * 10, 4)}px` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {day.practice} practice
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-2 bg-success/20 rounded-full">
                        <div 
                          className="h-full bg-success rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(day.exams * 10, 4)}px` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {day.exams} exams
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Unlock badges as you progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-muted/30 border-muted/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(achievement.rarity)}`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Track your improvement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No performance data yet</p>
            <p className="text-sm text-muted-foreground">
              Complete some practice sessions to see your trends
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}