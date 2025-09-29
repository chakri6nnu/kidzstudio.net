import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Calendar, Users, ArrowRight, PlayCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const examCategories = [
  {
    id: "speed-tests",
    title: "10-Minute Speed Tests",
    description: "Quick practice tests to improve your speed and accuracy",
    image: "📝",
    count: 25,
  },
  {
    id: "creative-writing",
    title: "Creative Writing Showcases", 
    description: "Express your creativity with guided writing exercises",
    image: "✍️",
    count: 15,
  },
  {
    id: "daily-challenge",
    title: "Daily Challenge Questions",
    description: "New challenging questions every day",
    image: "🎯", 
    count: 50,
  },
  {
    id: "memory-vocabulary",
    title: "Memory & Vocabulary Tests",
    description: "Strengthen your memory and expand your vocabulary", 
    image: "🧠",
    count: 30,
  },
];

const liveExams = [
  {
    id: "arithmetic-test",
    title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
    subject: "Mathematics / Numerical Reasoning",
    status: "EXAM AVAILABLE BETWEEN",
    startDate: "Sat, Sep 27th, 2025, 12:00 AM",
    endDate: "Wed, Nov 26th, 2025, 12:10 AM", 
    timezone: "UTC",
    duration: 20,
    questions: 20,
    marks: 20,
    badge: "Daily Challenge Question",
    isLive: true,
  },
  {
    id: "verbal-reasoning",
    title: "#2 Verbal comprehension and reasoning / English & Literacy", 
    subject: "English / Verbal Reasoning",
    status: "UPCOMING",
    startDate: "Mon, Oct 1st, 2025, 09:00 AM",
    endDate: "Mon, Oct 1st, 2025, 10:30 AM",
    timezone: "UTC", 
    duration: 30,
    questions: 25,
    marks: 25,
    badge: "Mock Exam",
    isLive: false,
  },
];

export default function StudentExams() {
  const navigate = useNavigate();
  
  const handleStartExam = (examId: string) => {
    console.log('Starting exam:', examId); // Debug log
    navigate(`/student/exams/${examId}`);
  };

  const handleViewAllExams = () => {
    navigate('/student/exams/all');
  };

  const handleViewAllCategories = () => {
    navigate('/student/exams/all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exams</h1>
        <p className="text-muted-foreground">Test your knowledge with timed examinations</p>
      </div>

      {/* Browse Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Browse</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={handleViewAllCategories}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {examCategories.map((category) => (
            <Card key={category.id} className="border-border hover:border-primary/50 transition-all cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{category.image}</div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {category.count} Tests Available
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Exams Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Live Exams</h2>
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={handleViewAllExams}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {liveExams.map((exam) => (
            <Card key={exam.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={exam.isLive ? "default" : "secondary"}
                        className={exam.isLive ? "bg-warning text-warning-foreground" : ""}
                      >
                        {exam.status}
                      </Badge>
                      {exam.badge && (
                        <Badge variant="outline" className="text-primary border-primary">
                          • {exam.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-1">
                      {exam.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.subject}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{exam.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{exam.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle className="h-4 w-4" />
                          <span>Timezone - {exam.timezone}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xl font-bold text-primary">{exam.questions}</p>
                          <p className="text-xs text-muted-foreground">Questions</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">{exam.duration}</p>
                          <p className="text-xs text-muted-foreground">Minutes</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-primary">{exam.marks}</p>
                          <p className="text-xs text-muted-foreground">Marks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {exam.isLive ? (
                      <Button 
                        onClick={() => handleStartExam(exam.id)}
                        className="bg-gradient-primary hover:bg-primary-hover shadow-primary"
                      >
                        START EXAM
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Exam Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Available</p>
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
                <Users className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">-</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}