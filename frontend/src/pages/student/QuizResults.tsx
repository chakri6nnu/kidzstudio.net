import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2,
  Trophy,
  Target,
  Clock
} from "lucide-react";

interface QuizResult {
  id: string;
  title: string;
  answered: number;
  total: number;
  percentage: number;
  score: number;
  totalMarks: number;
  status: "PASSED" | "FAILED";
  passPercentage: number;
  timeSpent: string;
  questions: Array<{
    id: number;
    question: string;
    options?: string[];
    correctAnswer: number | number[] | string;
    userAnswer?: number | number[] | string;
    timeSpent: number;
    category: string;
    explanation: string;
    status: "correct" | "wrong" | "unanswered";
    type: "MSA" | "MMA" | "TOF" | "SAQ" | "MTF" | "ORD" | "FIB";
  }>;
  leaderboard: Array<{
    rank: number;
    name: string;
    score: number;
    isCurrentUser?: boolean;
  }>;
}

const mockQuizResult: QuizResult = {
  id: "math-basics",
  title: "Mathematics Basics Quiz",
  answered: 8,
  total: 10,
  percentage: 70,
  score: 7,
  totalMarks: 10,
  status: "PASSED",
  passPercentage: 60,
  timeSpent: "12 Min 34 Sec",
  questions: [
    {
      id: 1,
      question: "What is the result of 15 × 8?",
      options: ["120", "130", "110", "140"],
      correctAnswer: 0,
      userAnswer: 0,
      timeSpent: 45,
      category: "Multiplication",
      explanation: "15 × 8 = 120. You can calculate this by multiplying 15 by 8 or by using the distributive property.",
      status: "correct",
      type: "MSA"
    },
    {
      id: 2,
      question: "Which of the following are prime numbers?",
      options: ["15", "21", "17", "19", "25"],
      correctAnswer: [2, 3],
      userAnswer: [2, 3],
      timeSpent: 60,
      category: "Number Theory",
      explanation: "17 and 19 are prime numbers because they can only be divided by 1 and themselves.",
      status: "correct",
      type: "MMA"
    },
    // Add more questions...
    ...Array.from({ length: 8 }, (_, i) => {
      const statuses: ("correct" | "wrong" | "unanswered")[] = ["correct", "wrong", "unanswered"];
      return {
        id: i + 3,
        question: `Sample question ${i + 3}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        userAnswer: Math.random() > 0.5 ? 0 : 1,
        timeSpent: Math.floor(Math.random() * 60) + 30,
        category: "General",
        explanation: `Explanation for question ${i + 3}`,
        status: statuses[Math.floor(Math.random() * 2)] as "correct" | "wrong",
        type: "MSA" as const
      };
    })
  ],
  leaderboard: [
    { rank: 1, name: "Alice Johnson", score: 9 },
    { rank: 2, name: "Bob Smith", score: 8 },
    { rank: 3, name: "Current User", score: 7, isCurrentUser: true },
    { rank: 4, name: "David Brown", score: 6 },
    { rank: 5, name: "Emma Wilson", score: 5 }
  ]
};

export default function QuizResults() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [result] = useState<QuizResult>(mockQuizResult);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const correctAnswers = result.questions.filter(q => q.status === "correct").length;
  const wrongAnswers = result.questions.filter(q => q.status === "wrong").length;
  const unansweredQuestions = result.questions.filter(q => q.status === "unanswered").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/student/progress')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {result.title} Results
            </Button>
          </div>
          
          <Button className="gap-2 bg-success hover:bg-success/90">
            <Download className="h-4 w-4" />
            DOWNLOAD SCORE REPORT
          </Button>
        </div>
      </header>

      {/* Result Summary */}
      <div className="p-6">
        <Card className={`border-2 mb-6 ${
          result.status === "PASSED" 
            ? "border-success bg-success/5" 
            : "border-destructive bg-destructive/5"
        }`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.status === "PASSED" ? "bg-success" : "bg-destructive"
              }`}>
                {result.status === "PASSED" ? (
                  <Trophy className="h-8 w-8 text-white" />
                ) : (
                  <Target className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">
                {result.status === "PASSED" ? "Congratulations!" : "Good Effort!"} 
              </h1>
              <p className="text-muted-foreground">
                You {result.status === "PASSED" ? "passed" : "completed"} the {result.title}
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Score</div>
                <div className="text-3xl font-bold text-primary">{result.percentage}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Correct</div>
                <div className="text-3xl font-bold text-success">{correctAnswers}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Incorrect</div>
                <div className="text-3xl font-bold text-destructive">{wrongAnswers}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Time Taken</div>
                <div className="text-3xl font-bold text-muted-foreground">{result.timeSpent}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Performance Overview */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Questions</span>
                      <span className="font-bold">{result.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Answered</span>
                      <span className="font-bold">{result.answered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Correct</span>
                      <span className="font-bold text-success">{correctAnswers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Incorrect</span>
                      <span className="font-bold text-destructive">{wrongAnswers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Unanswered</span>
                      <span className="font-bold text-muted-foreground">{unansweredQuestions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{result.percentage}%</div>
                      <div className="text-sm text-muted-foreground">Final Score</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Marks Earned</span>
                        <span className="font-bold">{result.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Marks</span>
                        <span className="font-bold">{result.totalMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Percentage</span>
                        <span className="font-bold">{result.passPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Analysis */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-center">Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">{result.timeSpent}</div>
                      <div className="text-sm text-muted-foreground">Total Time Spent</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Avg per Question</span>
                        <span className="font-bold">
                          {Math.round(parseInt(result.timeSpent.split(' ')[0]) * 60 / result.answered)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions/Min</span>
                        <span className="font-bold">
                          {Math.round(result.answered / (parseInt(result.timeSpent.split(' ')[0]) + parseInt(result.timeSpent.split(' ')[2])/60))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Solutions Tab */}
          <TabsContent value="solutions" className="space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Question Navigation */}
              <div className="col-span-3">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-sm">Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {result.questions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => setSelectedQuestion(index)}
                          className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                            selectedQuestion === index
                              ? 'bg-primary text-primary-foreground'
                              : question.status === "correct"
                              ? 'bg-success text-success-foreground'
                              : question.status === "wrong"
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success rounded"></div>
                        <span>Correct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-destructive rounded"></div>
                        <span>Incorrect</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted rounded"></div>
                        <span>Unanswered</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question Detail */}
              <div className="col-span-9">
                {result.questions[selectedQuestion] && (
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Q{selectedQuestion + 1}</Badge>
                          <Badge className={
                            result.questions[selectedQuestion].status === "correct" 
                              ? "bg-success" 
                              : result.questions[selectedQuestion].status === "wrong"
                              ? "bg-destructive"
                              : "bg-muted"
                          }>
                            {result.questions[selectedQuestion].status}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {result.questions[selectedQuestion].category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          {result.questions[selectedQuestion].question}
                        </h3>
                        
                        {result.questions[selectedQuestion].options && (
                          <div className="space-y-2 mb-4">
                            {result.questions[selectedQuestion].options!.map((option, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded border ${
                                  Array.isArray(result.questions[selectedQuestion].correctAnswer)
                                    ? (result.questions[selectedQuestion].correctAnswer as number[]).includes(index)
                                      ? 'border-success bg-success/10'
                                      : Array.isArray(result.questions[selectedQuestion].userAnswer) && 
                                        (result.questions[selectedQuestion].userAnswer as number[]).includes(index) &&
                                        !(result.questions[selectedQuestion].correctAnswer as number[]).includes(index)
                                      ? 'border-destructive bg-destructive/10'
                                      : 'border-border'
                                    : index === result.questions[selectedQuestion].correctAnswer
                                    ? 'border-success bg-success/10'
                                    : index === result.questions[selectedQuestion].userAnswer && 
                                      result.questions[selectedQuestion].userAnswer !== result.questions[selectedQuestion].correctAnswer
                                    ? 'border-destructive bg-destructive/10'
                                    : 'border-border'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                                  <span>{option}</span>
                                  {Array.isArray(result.questions[selectedQuestion].correctAnswer) ? (
                                    (result.questions[selectedQuestion].correctAnswer as number[]).includes(index) && (
                                      <Badge variant="outline" className="ml-auto text-success">Correct</Badge>
                                    )
                                  ) : (
                                    index === result.questions[selectedQuestion].correctAnswer && (
                                      <Badge variant="outline" className="ml-auto text-success">Correct</Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 bg-muted/50 rounded border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Explanation
                        </h4>
                        <p className="text-sm">{result.questions[selectedQuestion].explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>{result.title} Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Rank</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.leaderboard.map((entry) => (
                        <tr key={entry.rank} className={`border-b ${entry.isCurrentUser ? 'bg-primary/5' : ''}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {entry.rank <= 3 && (
                                <Trophy className={`h-4 w-4 ${
                                  entry.rank === 1 ? 'text-yellow-500' :
                                  entry.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                                }`} />
                              )}
                              #{entry.rank}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {entry.name}
                              {entry.isCurrentUser && (
                                <Badge className="bg-primary text-primary-foreground">You</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-bold">{entry.score}/{result.totalMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}