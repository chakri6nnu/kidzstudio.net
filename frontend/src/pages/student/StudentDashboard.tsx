import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, BookOpen, Target, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export default function StudentDashboard() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  const scheduleData = {
    "September 2025": [
      { date: 27, type: "exam", status: "scheduled" },
      { date: 28, type: "exam", status: "scheduled" },
      { date: 29, type: "practice", status: "available" },
      { date: 30, type: "practice", status: "available" },
    ],
    "October 2025": [
      { date: 1, type: "exam", status: "scheduled" },
      { date: 2, type: "exam", status: "scheduled" },
      { date: 3, type: "exam", status: "scheduled" },
      { date: 4, type: "exam", status: "scheduled" },
      { date: 5, type: "exam", status: "scheduled" },
      { date: 6, type: "practice", status: "available" },
      { date: 7, type: "practice", status: "available" },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Continue your 11+ preparation journey.</p>
      </div>

      {/* Syllabus Update Confirmation */}
      <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-success" />
        <span className="text-success font-medium">
          Syllabus updated to Mathematics / Numerical Reasoning
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Practice Section */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Continue Practice</h2>
            
            <Card className="border-border bg-gradient-card">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {/* Illustration placeholder */}
                    <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground" />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-success/20 rounded-full"></div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Practice Sessions Found
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start your first practice session to begin your 11+ preparation
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
                >
                  START PRACTICE
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground">Practice Sessions</p>
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
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground">Completed Exams</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">-</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test Schedules */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Schedules</h2>
          
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">September 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center mb-2">
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar grid for September */}
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  const hasEvent = scheduleData["September 2025"].find(event => event.date === day);
                  return (
                    <div
                      key={day}
                      className={`
                        h-8 w-8 flex items-center justify-center text-xs rounded-md cursor-pointer transition-colors
                        ${hasEvent?.type === 'exam' ? 'bg-primary text-primary-foreground' : ''}
                        ${hasEvent?.type === 'practice' ? 'bg-success text-success-foreground' : ''}
                        ${!hasEvent ? 'hover:bg-muted text-muted-foreground' : ''}
                        ${[27, 28].includes(day) ? 'bg-primary text-primary-foreground' : ''}
                        ${[29, 30].includes(day) ? 'bg-success text-success-foreground' : ''}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">October 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center mb-2">
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Calendar grid for October */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const hasEvent = scheduleData["October 2025"].find(event => event.date === day);
                  return (
                    <div
                      key={day}
                      className={`
                        h-8 w-8 flex items-center justify-center text-xs rounded-md cursor-pointer transition-colors
                        ${hasEvent?.type === 'exam' ? 'bg-primary text-primary-foreground' : ''}
                        ${hasEvent?.type === 'practice' ? 'bg-success text-success-foreground' : ''}
                        ${!hasEvent ? 'hover:bg-muted text-muted-foreground' : ''}
                        ${[1, 2, 3, 4, 5].includes(day) ? 'bg-primary text-primary-foreground' : ''}
                        ${[6, 7].includes(day) ? 'bg-success text-success-foreground' : ''}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-muted-foreground">Scheduled Exams</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-muted-foreground">Practice Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practice sessions and exam attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity found</p>
            <p className="text-sm text-muted-foreground">Start practicing to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}