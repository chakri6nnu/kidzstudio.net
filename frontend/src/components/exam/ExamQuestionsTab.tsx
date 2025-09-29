import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiltersPanel } from "@/components/ui/filters-panel";
import { Filter, Search, RotateCcw, Eye, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { SideDrawer } from "@/components/ui/side-drawer";

interface Question {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  attachment: string | null;
}

interface Section {
  id: string;
  name: string;
  questionCount: number;
}

interface ExamQuestionsTabProps {
  examId?: string;
  examData?: any;
  onSave?: (data: any) => Promise<void>;
}

const mockSections: Section[] = [
  { id: "1", name: "Mathematics", questionCount: 15 },
  { id: "2", name: "English", questionCount: 12 },
  { id: "3", name: "Science", questionCount: 18 }
];

const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "What is 2 + 2?",
    type: "Multiple Choice",
    difficulty: "Easy",
    marks: 5,
    attachment: null
  },
  {
    id: "q2", 
    text: "Explain photosynthesis",
    type: "Essay",
    difficulty: "Medium",
    marks: 10,
    attachment: null
  },
  {
    id: "q3",
    text: "Calculate the derivative of x²",
    type: "Short Answer",
    difficulty: "Hard", 
    marks: 15,
    attachment: null
  }
];

export default function ExamQuestionsTab({ examId, examData, onSave }: ExamQuestionsTabProps) {
  const [sections] = useState<Section[]>(mockSections);
  const [currentSection, setCurrentSection] = useState<Section | null>(sections[0]);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [availableQuestions] = useState<Question[]>(mockQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "addAll">("add");

  const filters = [
    {
      id: "type",
      label: "Type",
      value: filterType,
      options: [
        { value: "all", label: "All Types" },
        { value: "Multiple Choice", label: "Multiple Choice" },
        { value: "Essay", label: "Essay" },
        { value: "Short Answer", label: "Short Answer" }
      ]
    },
    {
      id: "difficulty", 
      label: "Difficulty",
      value: filterDifficulty,
      options: [
        { value: "all", label: "All Difficulties" },
        { value: "Easy", label: "Easy" },
        { value: "Medium", label: "Medium" },
        { value: "Hard", label: "Hard" }
      ]
    }
  ];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || question.type === filterType;
    const matchesDifficulty = filterDifficulty === "all" || question.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleFilterChange = (filterId: string, value: string) => {
    switch (filterId) {
      case "type":
        setFilterType(value);
        break;
      case "difficulty":
        setFilterDifficulty(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterDifficulty("all");
  };

  const handleAddQuestions = () => {
    setDrawerMode("add");
    setIsDrawerOpen(true);
  };

  const handleAddAllQuestions = () => {
    setDrawerMode("addAll");
    setIsDrawerOpen(true);
  };

  const handleQuestionSelect = (questionId: string, checked: boolean) => {
    setSelectedQuestions(prev => 
      checked 
        ? [...prev, questionId]
        : prev.filter(id => id !== questionId)
    );
  };

  const handleAddSelectedQuestions = () => {
    if (drawerMode === "add" && selectedQuestions.length > 0) {
      toast.success(`Added ${selectedQuestions.length} questions to the exam`);
      setSelectedQuestions([]);
    } else if (drawerMode === "addAll") {
      toast.success(`Added all ${availableQuestions.length} questions to the exam`);
    }
    setIsDrawerOpen(false);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success("Question removed from exam");
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
            <p className="text-xs text-muted-foreground">Across all sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.reduce((sum, q) => sum + q.marks, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total exam marks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
            <p className="text-xs text-muted-foreground">Exam sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableQuestions.length}</div>
            <p className="text-xs text-muted-foreground">Questions to add</p>
          </CardContent>
        </Card>
      </div>

      {/* Sections Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Sections</CardTitle>
          <CardDescription>
            Manage questions by section. Click on a section to view and edit its questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={`flex items-center justify-between p-3 bg-background rounded border cursor-pointer hover:bg-muted/50 ${
                  currentSection?.id === section.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setCurrentSection(section)}
              >
                <div>
                  <div className="font-medium">{section.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {section.questionCount} questions
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSection(section);
                      handleAddQuestions();
                    }}
                  >
                    Add Questions
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Section Questions */}
      {currentSection && (
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-success">
                Currently Viewing {currentSection.name} Questions
              </h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddQuestions}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Questions
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-success/10 text-success border-success hover:bg-success hover:text-white"
                  onClick={handleAddAllQuestions}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add All Questions
                </Button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="mb-4">
              <FiltersPanel
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                searchPlaceholder="Search questions..."
              />
            </div>
            
            <div className="text-sm text-muted-foreground mb-4">
              {filteredQuestions.length} questions found for the selected criteria.
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {question.type}
                        </Badge>
                        <div className="font-medium">{question.text}</div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Difficulty: <span className="text-foreground">{question.difficulty}</span></span>
                          <span>Marks: <span className="text-foreground">{question.marks} XP</span></span>
                          <span>Attachment: <span className="text-foreground">{question.attachment || "No Attachment"}</span></span>
                        </div>
                      </div>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        REMOVE
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No questions found matching the current criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Questions Drawer */}
      <SideDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        title={drawerMode === "add" ? "Add Questions" : "Add All Questions"}
        description={drawerMode === "add" 
          ? "Select questions to add to this exam section" 
          : "Add all available questions to this exam section"
        }
      >
        <div className="space-y-4">
          {drawerMode === "addAll" && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This will add all {availableQuestions.length} available questions to the exam section.
              </p>
            </div>
          )}
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableQuestions.map((question) => (
              <Card key={question.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {drawerMode === "add" && (
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={(checked) => 
                          handleQuestionSelect(question.id, checked as boolean)
                        }
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {question.type}
                      </Badge>
                      <div className="font-medium text-sm">{question.text}</div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Difficulty: <span className="text-foreground">{question.difficulty}</span></span>
                        <span>Marks: <span className="text-foreground">{question.marks} XP</span></span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <Button onClick={handleAddSelectedQuestions} className="w-full">
              {drawerMode === "add" 
                ? `Add Selected Questions (${selectedQuestions.length})` 
                : `Add All Questions (${availableQuestions.length})`
              }
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsDrawerOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}