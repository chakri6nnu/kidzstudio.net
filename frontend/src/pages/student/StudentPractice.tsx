import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calculator, Shapes, BarChart3, PlayCircle, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const practiceCategories = [
  {
    id: "number-arithmetic",
    title: "Number & Arithmetic",
    subtitle: "Mathematics / Numerical Reasoning",
    icon: "N",
    color: "bg-purple-600",
    description: "Master basic arithmetic, place value, and number operations",
    skills: 15,
    totalQuestions: 450,
  },
  {
    id: "algebra-problem-solving", 
    title: "Algebra & Problem-Solving",
    subtitle: "Mathematics / Numerical Reasoning",
    icon: "A",
    color: "bg-purple-600",
    description: "Solve algebraic equations and complex word problems",
    skills: 12,
    totalQuestions: 380,
  },
  {
    id: "geometry-measurement",
    title: "Geometry & Measurement", 
    subtitle: "Mathematics / Numerical Reasoning",
    icon: "G",
    color: "bg-purple-600",
    description: "Understand shapes, angles, area, and measurement",
    skills: 18,
    totalQuestions: 320,
  },
  {
    id: "data-handling",
    title: "Data Handling",
    subtitle: "Mathematics / Numerical Reasoning", 
    icon: "D",
    color: "bg-purple-600",
    description: "Interpret charts, graphs, and statistical data",
    skills: 10,
    totalQuestions: 275,
  },
];

const practiceSkills = [
  {
    id: 1,
    title: "Calculation, place value, operations",
    category: "Number & Arithmetic",
    videos: 0,
    lessons: 0,
    practiceSets: 0,
    skillsCount: 1,
  },
  {
    id: 2, 
    title: "Fractions and decimals",
    category: "Number & Arithmetic", 
    videos: 5,
    lessons: 8,
    practiceSets: 12,
    skillsCount: 1,
  },
  {
    id: 3,
    title: "Percentages and ratios",
    category: "Number & Arithmetic",
    videos: 3,
    lessons: 6,
    practiceSets: 10,
    skillsCount: 1,
  },
];

export default function StudentPractice() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  if (selectedCategory) {
    const category = practiceCategories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedCategory(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Learn & Practice {category?.title}
            </h1>
            <p className="text-muted-foreground">Master the fundamentals step by step</p>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="text-sm">
              {category?.subtitle}
            </Badge>
          </div>
        </div>

        {/* Skills List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Choose Section</h2>
          
          <div className="space-y-4">
            {practiceSkills.map((skill) => (
              <Card key={skill.id} className="border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-lg font-medium text-foreground">
                          {String(skill.id).padStart(2, '0')}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">
                          {skill.title}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 mt-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                            <PlayCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-muted-foreground">
                            {skill.videos > 0 ? `${skill.videos} Videos` : 'No Videos'}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-muted-foreground">
                            {skill.lessons > 0 ? `${skill.lessons} Lessons` : 'No Lessons'}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Calculator className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-muted-foreground">
                            {skill.practiceSets > 0 ? `${skill.practiceSets} Practice Sets` : 'No Practice Sets'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {skill.skillsCount} SKILLS
                      </Badge>
                      {skill.practiceSets > 0 && (
                        <Button className="bg-gradient-primary hover:bg-primary-hover">
                          Start Practice
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learn & Practice Mathematics / Numerical Reasoning</h1>
        <p className="text-muted-foreground">Choose a section to start your practice journey</p>
      </div>

      {/* Category Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Choose Section</h2>
        <Badge variant="outline" className="mb-6">
          UK Grammar School 11+ Exam Preparation Course
        </Badge>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceCategories.map((category) => (
            <Card 
              key={category.id} 
              className="border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-card"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl font-bold text-white">
                    {category.icon}
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.subtitle}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{category.skills} Skills</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calculator className="h-4 w-4" />
                    <span>{category.totalQuestions} Questions</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="mt-4 w-full bg-gradient-primary hover:bg-primary-hover"
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Sections Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0h</p>
                <p className="text-sm text-muted-foreground">Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">-%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}