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
  FileText, 
  Calendar, 
  Users, 
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const allExams = [
  {
    id: "arithmetic-test",
    title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
    subject: "Mathematics / Numerical Reasoning",
    category: "Daily Challenge",
    difficulty: "Easy",
    duration: 20,
    questions: 20,
    marks: 20,
    isLive: true,
    startDate: "Sat, Sep 27th, 2025, 12:00 AM",
    endDate: "Wed, Nov 26th, 2025, 12:10 AM",
    completedBy: 1247,
  },
  {
    id: "verbal-reasoning-1",
    title: "#2 Verbal comprehension and reasoning / English & Literacy",
    subject: "English / Verbal Reasoning", 
    category: "Mock Exam",
    difficulty: "Medium",
    duration: 30,
    questions: 25,
    marks: 25,
    isLive: false,
    startDate: "Mon, Oct 1st, 2025, 09:00 AM",
    endDate: "Mon, Oct 1st, 2025, 10:30 AM",
    completedBy: 892,
  },
  {
    id: "speed-test-1",
    title: "10-Minute Mathematics Speed Test #1",
    subject: "Mathematics / Numerical Reasoning",
    category: "Speed Test", 
    difficulty: "Easy",
    duration: 10,
    questions: 15,
    marks: 15,
    isLive: true,
    startDate: "Available Now",
    endDate: "No End Date",
    completedBy: 2156,
  },
  {
    id: "creative-writing-1",
    title: "Creative Writing Showcase - Narrative Writing",
    subject: "Creative & Essay Writing",
    category: "Writing Test",
    difficulty: "Medium", 
    duration: 45,
    questions: 3,
    marks: 30,
    isLive: true,
    startDate: "Available Now",
    endDate: "No End Date",
    completedBy: 743,
  },
  {
    id: "nvr-test-1",
    title: "Non-Verbal Reasoning Pattern Recognition",
    subject: "Non-Verbal Reasoning (NVR)",
    category: "Practice Test",
    difficulty: "Hard",
    duration: 25,
    questions: 20,
    marks: 20,
    isLive: true,
    startDate: "Available Now", 
    endDate: "No End Date",
    completedBy: 634,
  },
  {
    id: "memory-vocab-1",
    title: "Memory & Vocabulary Enhancement Test",
    subject: "Memory & Vocabulary Tests",
    category: "Skill Test",
    difficulty: "Medium",
    duration: 20,
    questions: 30,
    marks: 30,
    isLive: false,
    startDate: "Coming Soon",
    endDate: "TBD", 
    completedBy: 0,
  },
];

export default function AllExams() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const subjects = Array.from(new Set(allExams.map(exam => exam.subject)));
  const difficulties = ["Easy", "Medium", "Hard"];
  const categories = Array.from(new Set(allExams.map(exam => exam.category)));

  const filteredExams = allExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || exam.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || exam.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "all" || exam.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesCategory;
  });

  const handleStartExam = (examId: string) => {
    navigate(`/student/exams/${examId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/10 text-success border-success/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Hard": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Daily Challenge": return "bg-primary/10 text-primary border-primary/20";
      case "Mock Exam": return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "Speed Test": return "bg-warning/10 text-warning border-warning/20";
      case "Writing Test": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Practice Test": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Skill Test": return "bg-green-100 text-green-800 border-green-200";
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
          onClick={() => navigate('/student/exams')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exams
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Exams</h1>
          <p className="text-muted-foreground">Browse and filter all available examinations</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Exams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search exams..."
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
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
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
          Showing {filteredExams.length} of {allExams.length} exams
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-success" />
          <span>Available</span>
          <div className="w-4 h-4 border-2 border-muted-foreground rounded-full"></div>
          <span>Coming Soon</span>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getCategoryColor(exam.category)}>
                      {exam.category}
                    </Badge>
                    <Badge className={getDifficultyColor(exam.difficulty)}>
                      {exam.difficulty}
                    </Badge>
                    {exam.isLive && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Available Now
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {exam.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">{exam.subject}</p>
                  
                  <div className="grid md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exam.duration} min</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exam.questions} questions</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exam.marks} marks</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exam.completedBy.toLocaleString()} taken</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exam.startDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  {exam.isLive ? (
                    <Button 
                      onClick={() => handleStartExam(exam.id)}
                      className="bg-gradient-primary hover:bg-primary-hover shadow-primary gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Start Exam
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

      {filteredExams.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exams Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find exams.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}