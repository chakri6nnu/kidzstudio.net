import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, BookOpen, PlayCircle, CheckCircle, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quizCategories = [
  {
    id: "quick-practice",
    title: "Quick Practice Quizzes",
    description: "Short 5-10 question quizzes for daily practice",
    icon: Target,
    color: "bg-primary",
    count: 45,
    averageTime: "5 min",
  },
  {
    id: "subject-mastery",
    title: "Subject Mastery Quizzes", 
    description: "Comprehensive quizzes covering specific subjects",
    icon: BookOpen,
    color: "bg-success",
    count: 28,
    averageTime: "15 min", 
  },
  {
    id: "mock-tests",
    title: "Mock Test Quizzes",
    description: "Full-length practice tests simulating real exams",
    icon: Trophy,
    color: "bg-warning",
    count: 12,
    averageTime: "45 min",
  },
];

const recentQuizzes = [
  {
    id: "math-basics",
    title: "Mathematics Basics",
    subject: "Mathematics / Numerical Reasoning",
    questions: 15,
    timeLimit: 20,
    difficulty: "Beginner", 
    status: "available",
    completedBy: 1247,
    averageScore: 78,
  },
  {
    id: "verbal-reasoning",
    title: "Verbal Reasoning Challenge",
    subject: "English / Verbal Reasoning", 
    questions: 20,
    timeLimit: 25,
    difficulty: "Intermediate",
    status: "available", 
    completedBy: 892,
    averageScore: 65,
  },
  {
    id: "non-verbal",
    title: "Non-Verbal Pattern Recognition",
    subject: "Non-Verbal Reasoning",
    questions: 12,
    timeLimit: 15,
    difficulty: "Advanced",
    status: "available",
    completedBy: 634,
    averageScore: 72,
  },
];

export default function StudentQuizzes() {
  const navigate = useNavigate();
  
  const handleStartQuiz = (quizId: string) => {
    console.log('Starting quiz:', quizId); // Debug log  
    navigate(`/student/quizzes/${quizId}`);
  };

  const handleViewAllQuizzes = () => {
    navigate('/student/quizzes/all');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-success/10 text-success border-success/20';
      case 'intermediate': return 'bg-warning/10 text-warning border-warning/20'; 
      case 'advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quizzes</h1>
        <p className="text-muted-foreground">Practice with interactive quizzes and track your progress</p>
      </div>

      {/* Quiz Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quiz Categories</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={handleViewAllQuizzes}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {quizCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="border-border hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${category.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{category.count} Quizzes</span>
                        <span>~{category.averageTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Available Quizzes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Quizzes</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={handleViewAllQuizzes}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentQuizzes.map((quiz) => (
            <Card key={quiz.id} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {quiz.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(quiz.difficulty)}
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{quiz.subject}</p>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {quiz.questions} Questions
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {quiz.timeLimit} Minutes
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {quiz.completedBy.toLocaleString()} Completed
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {quiz.averageScore}% Avg Score
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Button 
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="bg-gradient-primary hover:bg-primary-hover shadow-primary gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
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
              <div className="p-2 bg-success/10 rounded-lg">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">-%</p>
                <p className="text-sm text-muted-foreground">Best Score</p>
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
                <p className="text-xl font-bold text-foreground">0h</p>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Target className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">85</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Quiz Activity</CardTitle>
          <CardDescription>Your latest quiz attempts and scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quiz attempts yet</p>
            <p className="text-sm text-muted-foreground">Start a quiz to see your progress here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}