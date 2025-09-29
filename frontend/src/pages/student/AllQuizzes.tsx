import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  Target, 
  Trophy, 
  Users,
  PlayCircle,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const allQuizzes = [
  {
    id: "math-basics",
    title: "Mathematics Basics",
    subject: "Mathematics / Numerical Reasoning",
    category: "Subject Mastery",
    difficulty: "Beginner", 
    questions: 15,
    timeLimit: 20,
    averageScore: 78,
    completedBy: 1247,
    description: "Test your understanding of basic mathematical concepts",
  },
  {
    id: "verbal-reasoning",
    title: "Verbal Reasoning Challenge",
    subject: "English / Verbal Reasoning", 
    category: "Subject Mastery",
    difficulty: "Intermediate",
    questions: 20,
    timeLimit: 25,
    averageScore: 65,
    completedBy: 892,
    description: "Advanced verbal comprehension and reasoning skills",
  },
  {
    id: "non-verbal",
    title: "Non-Verbal Pattern Recognition",
    subject: "Non-Verbal Reasoning",
    category: "Subject Mastery",
    difficulty: "Advanced",
    questions: 12,
    timeLimit: 15,
    averageScore: 72,
    completedBy: 634,
    description: "Master spatial reasoning and pattern recognition",
  },
  {
    id: "quick-math",
    title: "Quick Math Practice",
    subject: "Mathematics / Numerical Reasoning",
    category: "Quick Practice",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 10,
    averageScore: 85,
    completedBy: 2156,
    description: "Fast-paced arithmetic for speed building",
  },
  {
    id: "vocabulary-builder",
    title: "Vocabulary Builder Quiz",
    subject: "English / Verbal Reasoning",
    category: "Quick Practice", 
    difficulty: "Intermediate",
    questions: 8,
    timeLimit: 8,
    averageScore: 74,
    completedBy: 1543,
    description: "Expand your vocabulary with challenging words",
  },
  {
    id: "algebra-fundamentals",
    title: "Algebra Fundamentals",
    subject: "Mathematics / Numerical Reasoning",
    category: "Subject Mastery",
    difficulty: "Intermediate",
    questions: 18,
    timeLimit: 25,
    averageScore: 68,
    completedBy: 987,
    description: "Core algebraic concepts and problem solving",
  },
  {
    id: "grammar-essentials",
    title: "Grammar Essentials",
    subject: "English / Verbal Reasoning",
    category: "Subject Mastery",
    difficulty: "Beginner", 
    questions: 12,
    timeLimit: 15,
    averageScore: 81,
    completedBy: 1876,
    description: "Essential grammar rules and usage",
  },
  {
    id: "mock-test-1",
    title: "11+ Mock Test Series #1",
    subject: "Mixed Subjects",
    category: "Mock Tests",
    difficulty: "Advanced",
    questions: 40,
    timeLimit: 60,
    averageScore: 59,
    completedBy: 445,
    description: "Comprehensive practice test covering all subjects",
  },
  {
    id: "geometry-shapes",
    title: "Geometry & Shapes",
    subject: "Mathematics / Numerical Reasoning",
    category: "Subject Mastery",
    difficulty: "Intermediate",
    questions: 14,
    timeLimit: 20,
    averageScore: 73,
    completedBy: 1122,
    description: "Understanding shapes, angles, and spatial relationships",
  },
  {
    id: "creative-writing-basics",
    title: "Creative Writing Basics",
    subject: "Creative & Essay Writing",
    category: "Subject Mastery",
    difficulty: "Beginner",
    questions: 6,
    timeLimit: 30,
    averageScore: 76,
    completedBy: 678,
    description: "Fundamentals of creative and descriptive writing",
  },
];

export default function AllQuizzes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const subjects = Array.from(new Set(allQuizzes.map(quiz => quiz.subject)));
  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const categories = Array.from(new Set(allQuizzes.map(quiz => quiz.category)));

  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || quiz.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesCategory;
  });

  const handleStartQuiz = (quizId: string) => {
    navigate(`/student/quizzes/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success border-success/20";
      case "Intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "Advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Quick Practice": return "bg-primary/10 text-primary border-primary/20";
      case "Subject Mastery": return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "Mock Tests": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/student/quizzes')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Quizzes</h1>
          <p className="text-muted-foreground">Browse and filter all available quizzes</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Advanced</span>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(quiz.category)}>
                      {quiz.category}
                    </Badge>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">{quiz.averageScore}%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{quiz.subject}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {quiz.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Target className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <div className="font-medium text-foreground">{quiz.questions}</div>
                    <div className="text-muted-foreground">Questions</div>
                  </div>
                  
                  <div className="text-center">
                    <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <div className="font-medium text-foreground">{quiz.timeLimit} min</div>
                    <div className="text-muted-foreground">Duration</div>
                  </div>
                  
                  <div className="text-center">
                    <Users className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <div className="font-medium text-foreground">{quiz.completedBy.toLocaleString()}</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full bg-gradient-primary hover:bg-primary-hover shadow-primary gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quizzes Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find quizzes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}