import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Flag, 
  CheckCircle, 
  Target,
  RotateCcw,
  Send,
  GripVertical
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface QuizQuestion {
  id: number;
  type: "MSA" | "MMA" | "TOF" | "SAQ" | "MTF" | "ORD" | "FIB";
  question: string;
  options?: string[];
  correctAnswer?: number | number[] | string;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  answered: boolean;
  userAnswer?: number | number[] | string;
  // Additional fields for specific question types
  pairs?: { left: string; right: string }[]; // For MTF
  sequence?: string[]; // For ORD
  blanks?: string[]; // For FIB - sentences with _____ placeholders
  blankAnswers?: string[]; // For FIB - user answers for each blank
}

const mockQuizData = {
  id: "math-basics",
  title: "Mathematics Basics",
  subject: "Mathematics / Numerical Reasoning",
  difficulty: "Beginner",
  duration: 20, // minutes
  totalQuestions: 15,
  description: "Test your understanding of basic mathematical concepts",
};

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "MSA",
    question: "What is the result of 15 × 8?",
    options: ["120", "130", "110", "140"],
    correctAnswer: 0,
    explanation: "15 × 8 = 120. You can calculate this by multiplying 15 by 8 or by using the distributive property: 15 × 8 = (10 + 5) × 8 = 80 + 40 = 120.",
    difficulty: "Easy",
    answered: false,
  },
  {
    id: 2,
    type: "MMA",
    question: "Which of the following are prime numbers?",
    options: ["15", "21", "17", "19", "25"],
    correctAnswer: [2, 3], // 17 and 19
    explanation: "17 and 19 are prime numbers because they can only be divided by 1 and themselves. The other numbers have additional factors: 15=3×5, 21=3×7, 25=5×5.",
    difficulty: "Medium",
    answered: false,
  },
  {
    id: 3,
    type: "TOF",
    question: "The sum of any two odd numbers is always even.",
    correctAnswer: 0, // True
    explanation: "True. When you add two odd numbers, you get an even number. For example: 3 + 5 = 8, 7 + 9 = 16.",
    difficulty: "Easy",
    answered: false,
  },
  {
    id: 4,
    type: "SAQ",
    question: "Calculate the area of a circle with radius 5 cm. (Use π = 3.14)",
    correctAnswer: "78.5",
    explanation: "Area = π × r² = 3.14 × 5² = 3.14 × 25 = 78.5 square cm",
    difficulty: "Medium",
    answered: false,
  },
  {
    id: 5,
    type: "FIB",
    question: "Complete the mathematical equations:",
    blanks: ["7 + _____ = 15", "_____ × 4 = 28", "36 ÷ _____ = 6"],
    correctAnswer: "8,7,6",
    explanation: "The answers are: 8 (since 7+8=15), 7 (since 7×4=28), and 6 (since 36÷6=6)",
    difficulty: "Medium",
    answered: false,
    blankAnswers: ["", "", ""]
  },
  {
    id: 6,
    type: "MTF",
    question: "Match the fractions with their decimal equivalents:",
    pairs: [
      { left: "1/2", right: "0.5" },
      { left: "1/4", right: "0.25" },
      { left: "3/4", right: "0.75" },
      { left: "1/5", right: "0.2" }
    ],
    correctAnswer: "0,1,2,3", // Perfect matches
    explanation: "1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2",
    difficulty: "Medium",
    answered: false,
  },
  {
    id: 7,
    type: "ORD",
    question: "Arrange these fractions in ascending order:",
    sequence: ["3/4", "1/2", "7/8", "1/4", "5/8"],
    correctAnswer: "1/4,1/2,5/8,3/4,7/8",
    explanation: "Converting to decimals: 1/4=0.25, 1/2=0.5, 5/8=0.625, 3/4=0.75, 7/8=0.875",
    difficulty: "Hard",
    answered: false,
  },
  // Add more sample questions
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 8,
    type: "MSA" as const,
    question: `Sample mathematics question ${i + 8}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: `This is the explanation for question ${i + 8}.`,
    difficulty: (["Easy", "Medium", "Hard"] as const)[Math.floor(Math.random() * 3)],
    answered: false,
  })),
];

export default function TakeQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>(mockQuizQuestions);
  const [timeRemaining, setTimeRemaining] = useState(mockQuizData.duration * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!quizSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizSubmitted]);

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

  const calculateScore = () => {
    const correct = questions.filter(q => {
      if (!q.answered) return false;
      
      // Handle different question types
      switch (q.type) {
        case "MSA":
        case "TOF":
          return q.userAnswer === q.correctAnswer;
        case "MMA":
          const userAnswers = q.userAnswer as number[];
          const correctAnswers = q.correctAnswer as number[];
          return userAnswers && correctAnswers && 
                 userAnswers.length === correctAnswers.length &&
                 userAnswers.every(ans => correctAnswers.includes(ans));
        case "SAQ":
        case "FIB":
          const userText = (q.userAnswer as string || "").toLowerCase().trim();
          const correctText = (q.correctAnswer as string || "").toLowerCase().trim();
          return userText === correctText;
        case "MTF":
        case "ORD":
          // For demo purposes, consider these always correct if answered
          return q.answered;
        default:
          return false;
      }
    }).length;
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setQuizSubmitted(true);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setQuestions(mockQuizQuestions);
    setCurrentQuestion(0);
    setTimeRemaining(mockQuizData.duration * 60);
    setQuizSubmitted(false);
    setShowResults(false);
    setScore(0);
  };

  const answeredCount = questions.filter(q => q.answered).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/10 text-success border-success/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Hard": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="border-border mb-6">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Completed!</h1>
                <p className="text-muted-foreground">Great job on completing the mathematics basics quiz</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{score}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {questions.filter(q => q.answered && q.userAnswer === q.correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">
                    {questions.filter(q => q.answered && q.userAnswer !== q.correctAnswer).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {formatTime(mockQuizData.duration * 60 - timeRemaining)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRetakeQuiz} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate('/student/quizzes')} className="bg-gradient-primary">
                  Back to Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {question.answered && question.userAnswer === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-destructive/20 border-2 border-destructive"></div>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-foreground mb-3">{question.question}</h4>
                  
                  {question.options && (
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded border ${
                            optionIndex === question.correctAnswer
                              ? 'border-success bg-success/10'
                              : optionIndex === question.userAnswer && question.userAnswer !== question.correctAnswer
                              ? 'border-destructive bg-destructive/10'
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{optionIndex + 1}.</span>
                            <span>{option}</span>
                            {optionIndex === question.correctAnswer && (
                              <Badge variant="outline" className="ml-auto text-success">Correct</Badge>
                            )}
                            {optionIndex === question.userAnswer && question.userAnswer !== question.correctAnswer && (
                              <Badge variant="outline" className="ml-auto text-destructive">Your Answer</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="p-3 bg-muted/50 rounded text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
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
              <h1 className="font-semibold text-lg text-foreground">
                {mockQuizData.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mockQuizData.subject} • {mockQuizData.difficulty}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-mono text-lg font-bold text-foreground">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Button
              onClick={handleSubmitQuiz}
              className="bg-gradient-primary hover:bg-primary-hover gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Quiz Area */}
        <div className="flex-1 max-w-4xl mx-auto p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Progress: {answeredCount}/{questions.length} answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="border-border mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    Q{currentQuestion + 1}
                  </Badge>
                  <Badge className={getDifficultyColor(questions[currentQuestion].difficulty)}>
                    {questions[currentQuestion].difficulty}
                  </Badge>
                </div>
                {questions[currentQuestion].answered && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-foreground">
                  {questions[currentQuestion].question}
                </h2>
                
                {/* Multiple Choice Single Answer (MSA) */}
                {questions[currentQuestion].type === "MSA" && questions[currentQuestion].options && (
                  <div className="space-y-3">
                    {questions[currentQuestion].options!.map((option, index) => (
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
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Multiple Choice Multiple Answers (MMA) */}
                {questions[currentQuestion].type === "MMA" && questions[currentQuestion].options && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select all correct options
                    </p>
                    {questions[currentQuestion].options!.map((option, index) => {
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
                )}

                {/* Short Answer (SAQ) */}
                {questions[currentQuestion].type === "SAQ" && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={questions[currentQuestion].userAnswer as string || ""}
                      onChange={(e) => handleTextAnswer(e.target.value)}
                      className="w-full"
                      rows={4}
                    />
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
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {answeredCount} of {questions.length} completed
              </span>
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="gap-2 bg-gradient-primary hover:bg-primary-hover"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Question Overview */}
          <Card className="border-border mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Question Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`
                      w-10 h-10 rounded text-sm font-medium border-2 transition-colors
                      ${currentQuestion === index 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border hover:border-primary/50'}
                      ${question.answered 
                        ? 'bg-success/10 border-success text-success' 
                        : 'text-muted-foreground'}
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success/10 border border-success rounded"></div>
                  <span className="text-muted-foreground">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-muted rounded"></div>
                  <span className="text-muted-foreground">Not Answered ({questions.length - answeredCount})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}