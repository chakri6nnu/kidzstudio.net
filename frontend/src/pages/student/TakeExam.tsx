import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Flag, 
  CheckCircle, 
  Circle,
  Maximize2,
  AlertTriangle,
  FileText,
  GripVertical
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: number;
  type: "MSA" | "MMA" | "TOF" | "SAQ" | "MTF" | "ORD" | "FIB";
  question: string;
  options?: string[];
  correctAnswer?: number | number[] | string;
  category: string;
  answered: boolean;
  flagged: boolean;
  userAnswer?: number | number[] | string;
  // Additional fields for specific question types
  pairs?: { left: string; right: string }[]; // For MTF
  sequence?: string[]; // For ORD
  blanks?: string[]; // For FIB - sentences with _____ placeholders
  blankAnswers?: string[]; // For FIB - user answers for each blank
}

const mockExamData = {
  id: "arithmetic-test",
  title: "#1 Addition, subtraction, multiplication, division / Number & Arithmetic",
  subject: "Mathematics / Numerical Reasoning",
  duration: 20, // minutes
  totalQuestions: 20,
  totalMarks: 20,
};

const mockQuestions: Question[] = [
  {
    id: 1,
    type: "MSA",
    question: "What is 247 + 186?",
    options: ["433", "423", "443", "423"],
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
  },
  {
    id: 2,
    type: "SAQ", 
    question: "Calculate: 892 - 347",
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
  },
  {
    id: 3,
    type: "TOF",
    question: "15 × 4 = 60",
    category: "CALCULATION, PLACE VALUE, OPERATIONS", 
    answered: false,
    flagged: false,
  },
  {
    id: 4,
    type: "MMA",
    question: "Which of the following are prime numbers?",
    options: ["2", "4", "7", "9", "11"],
    category: "NUMBER THEORY",
    answered: false,
    flagged: false,
  },
  {
    id: 5,
    type: "MTF",
    question: "Match the mathematical operations with their results:",
    pairs: [
      { left: "5 + 3", right: "8" },
      { left: "9 - 4", right: "5" },
      { left: "3 × 2", right: "6" },
      { left: "12 ÷ 3", right: "4" }
    ],
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
  },
  {
    id: 6,
    type: "ORD",
    question: "Arrange these numbers in ascending order:",
    sequence: ["15", "3", "28", "7", "21"],
    category: "NUMBER ORDERING",
    answered: false,
    flagged: false,
  },
  {
    id: 7,
    type: "FIB",
    question: "Complete the mathematical equations:",
    blanks: ["5 + _____ = 12", "_____ × 3 = 21", "16 ÷ _____ = 4"],
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
    blankAnswers: ["", "", ""]
  },
  // Add more sample questions
  {
    id: 8,
    type: "MSA",
    question: "What is 35 × 12?",
    options: ["320", "420", "350", "450"],
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
  },
  {
    id: 9,
    type: "TOF",
    question: "The square root of 64 is 8",
    category: "SQUARE ROOTS",
    answered: false,
    flagged: false,
  },
  {
    id: 10,
    type: "SAQ",
    question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
    category: "GEOMETRY",
    answered: false,
    flagged: false,
  },
  // Add more questions to reach 20...
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 11,
    type: "MSA" as const,
    question: `Sample arithmetic question ${i + 11}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    category: "CALCULATION, PLACE VALUE, OPERATIONS",
    answered: false,
    flagged: false,
  })),
];

export default function TakeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [timeRemaining, setTimeRemaining] = useState(mockExamData.duration * 60); // seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: number | number[] | string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questions[currentQuestion].id 
        ? { ...q, answered: true, userAnswer: answer }
        : q
    ));
  };

  const handleTextAnswer = (answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questions[currentQuestion].id 
        ? { ...q, answered: answer.trim() !== "", userAnswer: answer }
        : q
    ));
  };

  const handleMultipleAnswer = (optionIndex: number) => {
    const currentAnswers = questions[currentQuestion].userAnswer as number[] || [];
    const newAnswers = currentAnswers.includes(optionIndex)
      ? currentAnswers.filter(i => i !== optionIndex)
      : [...currentAnswers, optionIndex];
    
    setQuestions(prev => prev.map(q => 
      q.id === questions[currentQuestion].id 
        ? { ...q, answered: newAnswers.length > 0, userAnswer: newAnswers }
        : q
    ));
  };

  const handleBlankAnswer = (blankIndex: number, answer: string) => {
    const currentQ = questions[currentQuestion];
    const newBlankAnswers = [...(currentQ.blankAnswers || [])];
    newBlankAnswers[blankIndex] = answer;
    
    setQuestions(prev => prev.map(q => 
      q.id === currentQ.id 
        ? { 
            ...q, 
            answered: newBlankAnswers.some(a => a.trim() !== ""), 
            userAnswer: newBlankAnswers.join(","),
            blankAnswers: newBlankAnswers
          }
        : q
    ));
  };

  const handleFlagQuestion = () => {
    setQuestions(prev => prev.map(q => 
      q.id === questions[currentQuestion].id 
        ? { ...q, flagged: !q.flagged }
        : q
    ));
  };

  const handleClearAnswer = () => {
    const currentQ = questions[currentQuestion];
    setQuestions(prev => prev.map(q => 
      q.id === currentQ.id 
        ? { 
            ...q, 
            answered: false, 
            userAnswer: undefined,
            blankAnswers: currentQ.type === "FIB" ? currentQ.blanks?.map(() => "") : undefined
          }
        : q
    ));
  };

  const handleMarkForReview = () => {
    setQuestions(prev => prev.map(q => 
      q.id === questions[currentQuestion].id 
        ? { ...q, flagged: true, answered: q.answered || false, userAnswer: q.userAnswer }
        : q
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishExam = () => {
    // In a real app, submit answers to backend
    console.log("Exam finished", { answers: questions });
    navigate('/student/exams');
  };

  const getQuestionStatus = (question: Question) => {
    if (question.answered && question.flagged) return "answered-flagged";
    if (question.answered) return "answered";
    if (question.flagged) return "flagged";
    return "not-visited";
  };

  const answeredCount = questions.filter(q => q.answered).length;
  const flaggedCount = questions.filter(q => q.flagged).length;
  const notAnsweredCount = questions.length - answeredCount;

  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isFullscreen && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/student/exams')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Exams
              </Button>
            )}
            <div>
              <h1 className="font-semibold text-lg text-foreground">
                {mockExamData.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mockExamData.subject}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              <span className={`font-mono text-lg font-bold ${
                timeRemaining <= 300 ? 'text-destructive' : 'text-foreground'
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => setShowFinishDialog(true)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <Flag className="h-4 w-4 mr-2" />
              Finish Test
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          {/* Question Header */}
          <div className="bg-muted/30 px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary text-primary-foreground">
                  Main
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Q{currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {questions[currentQuestion].category}
                </span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Question Content */}
          <div className="flex-1 p-6 overflow-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-medium text-foreground mb-6">
                      {questions[currentQuestion].question}
                    </p>
                    
                    {/* Multiple Choice Single Answer (MSA) */}
                    {questions[currentQuestion].type === "MSA" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose one from below options
                        </p>
                        
                        {questions[currentQuestion].options?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                              questions[currentQuestion].userAnswer === index
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                questions[currentQuestion].userAnswer === index
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground'
                              }`}>
                                <span className="text-sm font-bold text-background">
                                  {index + 1}
                                </span>
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multiple Choice Multiple Answers (MMA) */}
                    {questions[currentQuestion].type === "MMA" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose all correct options
                        </p>
                        
                        {questions[currentQuestion].options?.map((option, index) => {
                          const userAnswers = questions[currentQuestion].userAnswer as number[] || [];
                          const isSelected = userAnswers.includes(index);
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleMultipleAnswer(index)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox checked={isSelected} />
                                <span>{option}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* True or False (TOF) */}
                    {questions[currentQuestion].type === "TOF" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Select True or False
                        </p>
                        
                        <div className="space-y-3">
                          {["True", "False"].map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                                questions[currentQuestion].userAnswer === index
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  questions[currentQuestion].userAnswer === index
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-muted-foreground'
                                }`}>
                                  {questions[currentQuestion].userAnswer === index && (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </div>
                                <span className="font-medium">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short Answer (SAQ) */}
                    {questions[currentQuestion].type === "SAQ" && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Type your answer in the below text box
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium">A</span>
                            <Textarea
                              placeholder="Type your answer"
                              value={questions[currentQuestion].userAnswer as string || ""}
                              onChange={(e) => handleTextAnswer(e.target.value)}
                              className="flex-1"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Match the Following (MTF) */}
                    {questions[currentQuestion].type === "MTF" && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Match the items from left column to right column
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground mb-3">Column A</h4>
                            {questions[currentQuestion].pairs?.map((pair, index) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg border">
                                <span className="text-sm">{pair.left}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground mb-3">Column B</h4>
                            {questions[currentQuestion].pairs?.map((pair, index) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg border">
                                <span className="text-sm">{pair.right}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-warning/10 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            This is a demonstration. In a full implementation, you would drag and drop or select matches.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ordering/Sequence (ORD) */}
                    {questions[currentQuestion].type === "ORD" && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop to arrange in correct order
                        </p>
                        
                        <div className="space-y-3">
                          {questions[currentQuestion].sequence?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border cursor-move"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-4 bg-warning/10 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            This is a demonstration. In a full implementation, you would be able to drag and drop to reorder.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Fill in the Blanks (FIB) */}
                    {questions[currentQuestion].type === "FIB" && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Fill in the blanks with appropriate answers
                        </p>
                        
                        <div className="space-y-4">
                          {questions[currentQuestion].blanks?.map((blank, index) => {
                            const parts = blank.split("_____");
                            return (
                              <div key={index} className="flex items-center gap-2 flex-wrap">
                                <span>{parts[0]}</span>
                                <Input
                                  placeholder="Answer"
                                  value={questions[currentQuestion].blankAnswers?.[index] || ""}
                                  onChange={(e) => handleBlankAnswer(index, e.target.value)}
                                  className="w-24 inline-block"
                                />
                                <span>{parts[1]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigation */}
          <div className="bg-card border-t border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearAnswer}
                  disabled={!questions[currentQuestion].answered}
                >
                  Clear Answer
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleMarkForReview}
                  className="gap-2"
                >
                  <Flag className="h-4 w-4" />
                  Mark for Review
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={() => {
                    if (currentQuestion === questions.length - 1) {
                      setShowFinishDialog(true);
                    } else {
                      handleNextQuestion();
                    }
                  }}
                  className="gap-2 bg-gradient-primary hover:bg-primary-hover"
                >
                  {currentQuestion === questions.length - 1 ? (
                    <>
                      <Flag className="h-4 w-4" />
                      Finish Test
                    </>
                  ) : (
                    <>
                      Save & Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation Sidebar */}
        <div className="w-80 bg-card border-l border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground mb-4">Question Navigation</h3>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-success/10 rounded">
                <div className="text-xl font-bold text-success">{answeredCount}</div>
                <div className="text-xs text-muted-foreground">Answered</div>
              </div>
              <div className="text-center p-2 bg-destructive/10 rounded">
                <div className="text-xl font-bold text-destructive">{notAnsweredCount}</div>
                <div className="text-xs text-muted-foreground">Not Answered</div>
              </div>
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="text-xl font-bold text-primary">{flaggedCount}</div>
                <div className="text-xs text-muted-foreground">Marked for Review</div>
              </div>
              <div className="text-center p-2 bg-warning/10 rounded">
                <div className="text-xl font-bold text-warning">{questions.length - answeredCount - flaggedCount}</div>
                <div className="text-xs text-muted-foreground">Not Visited</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 overflow-auto max-h-[calc(100vh-300px)]">
            <div className="grid grid-cols-6 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    w-10 h-10 rounded text-sm font-medium border-2 transition-colors
                    ${currentQuestion === index 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-border hover:border-primary/50'}
                    ${getQuestionStatus(question) === 'answered' 
                      ? 'bg-success text-success-foreground' : ''}
                    ${getQuestionStatus(question) === 'answered-flagged' 
                      ? 'bg-warning text-warning-foreground' : ''}
                    ${getQuestionStatus(question) === 'flagged' 
                      ? 'bg-primary/10 text-primary' : ''}
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success rounded"></div>
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/20 border border-destructive rounded"></div>
                <span className="text-muted-foreground">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/20 border border-primary rounded"></div>
                <span className="text-muted-foreground">Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-warning rounded"></div>
                <span className="text-muted-foreground">Answered & Marked for Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finish Dialog */}
      {showFinishDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Confirm Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to submit your exam? You have answered {answeredCount} out of {questions.length} questions.
              </p>
              
              <div className="bg-muted/50 p-3 rounded">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span className="font-medium">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Not Answered:</span>
                    <span className="font-medium">{notAnsweredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowFinishDialog(false)}
                >
                  Continue Exam
                </Button>
                <Button
                  onClick={handleFinishExam}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Submit Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}